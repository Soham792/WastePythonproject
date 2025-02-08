from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from inference_sdk import InferenceHTTPClient
import google.generativeai as genai
from django.utils import timezone
from datetime import datetime
import tempfile
import os
# import dotenv

# dotenv.load_dotenv()

CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="5GVDg6S1EmX7ka0TYgZy"
)

genai.configure(api_key="AIzaSyAdEzbYvBSSNg-fejFfHT3Ivz3qUAsw0UE")
model = genai.GenerativeModel('gemini-pro')

def get_waste_instructions(waste_type):
    prompt = f"""Provide a concise analysis for {waste_type} waste:
    1. Recyclable (Yes/No)
    2. Compostable (Yes/No)
    3. Decomposition Time
    4. Proper disposal methods
    5. Reuse ideas
    Format as JSON with keys: recyclable, compostable, decomposition_time, disposal_methods (array), reuse_ideas (array)"""
    
    try:
        response = model.generate_content(prompt)
        return eval(response.text.replace('```json', '').replace('```', '').strip())
    except Exception as e:
        return {
            "recyclable": "Unknown",
            "compostable": "Unknown",
            "decomposition_time": "N/A",
            "disposal_methods": [],
            "reuse_ideas": []
        }

@csrf_exempt
def classify_waste(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            for chunk in image_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name

        try:
            result = CLIENT.infer(temp_path, model_id="garbage-classification-3/2")
            primary_class = max(result['predictions'], key=lambda x: x['confidence'])['class']
            
            # Get Gemini instructions
            instructions = get_waste_instructions(primary_class)
            
            classification = ClassificationResult(
                image=image_file,
                predictions=result,
                instructions=instructions,
                created_at=timezone.now()# Add this line
            )
            classification.save()
            
            os.unlink(temp_path)
            return JsonResponse({'predictions': result['predictions'], 'instructions': instructions})
        except Exception as e:
            os.unlink(temp_path)
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import ClassificationResult
from django.utils.timezone import localtime


@csrf_exempt
def get_history(request):
    results = ClassificationResult.objects.all().order_by('-created_at')
    history = [{
        'id': result.id,
        'image_url': result.image.url,
        'predictions': result.predictions['predictions'],
        'date': localtime(result.created_at).strftime("%d-%m-%Y"),
        'time': localtime(result.created_at).strftime("%I:%M %p")  # Format as 12-hour with AM/PM
    } for result in results]
    return JsonResponse(history, safe=False)

@csrf_exempt
def delete_history_item(request, item_id):
    try:
        item = ClassificationResult.objects.get(id=item_id)
        item.delete()
        return JsonResponse({'status': 'success'})
    except ClassificationResult.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Item not found'}, status=404)