from django.db import models
# from django.utils import timezone


class ClassificationResult(models.Model):
    image = models.ImageField(upload_to='uploads/')
    predictions = models.JSONField()
    instructions = models.JSONField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Add this line

    def __str__(self):
        return f"Classification {self.id} - {self.created_at}"