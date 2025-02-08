import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './ImagePage.css';
import WasteInstructions from '../components/WasteInstructions';

const ImagePage = () => {
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  

  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': ['.jpg', '.jpeg', '.png']},
    maxSize: 5 * 1024 * 1024,
    onDrop: files => processFile(files[0])
  });

  const processFile = async (file) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:8000/api/classify/', formData);
      setResults(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="image-page">
      <div className="upload-section" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop image here, or click to select</p>
        <p>Supports: JPG, PNG (max 5MB)</p>
      </div>
      
      {preview && (
        <div className="results-container">
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
          
          <div className="classification-results">
            <h3>Classification Results:</h3>
            {results?.predictions?.map((prediction, index) => (
              <div key={index} className="result-item">
                <span className="class-name">{prediction.class}</span>
                <span className="confidence">{Math.round(prediction.confidence * 100)}%</span>
              </div>
            ))}
            {results?.instructions && (
              <WasteInstructions instructions={results.instructions} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePage;