import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import BoundingBoxCanvas from '../components/BoundingBoxCanvas';

const VideoPage = () => {
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const videoRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {'video/*': ['.mp4', '.mov', '.avi']},
    maxSize: 50 * 1024 * 1024,
    onDrop: files => processVideo(files[0])
  });

  const processVideo = async (file) => {
    if (!file) return;

    // Create preview URL safely
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Process first frame
    try {
      const frameBlob = await extractVideoFrame(file);
      await classifyFrame(frameBlob);
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const classifyFrame = async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'frame.jpg');

    try {
      const response = await axios.post('http://localhost:8000/api/classify/', formData);
      setResults(response.data);
      setBoxes(response.data.predictions.map(pred => ({
        x: pred.x,
        y: pred.y,
        width: pred.width,
        height: pred.height,
        class: pred.class
      })));
    } catch (error) {
      console.error('Classification error:', error);
    }
  };

  const extractVideoFrame = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        video.currentTime = 0.1;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(blob => {
          resolve(blob);
          URL.revokeObjectURL(video.src);
        }, 'image/jpeg');
      };

      video.onerror = reject;

      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="page">
      <div className="upload-section" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop video here, or click to select</p>
        <p>Supports: MP4, MOV, AVI (max 50MB)</p>
      </div>
      
      {preview && (
        <div className="preview-container">
          <div className="video-wrapper">
            <video ref={videoRef} src={preview} controls />
            <BoundingBoxCanvas boxes={boxes} />
          </div>
          
          <div className="results">
            <h3>Classification Results:</h3>
            {results?.predictions?.map((prediction, index) => (
              <div key={index} className="prediction">
                {prediction.class} ({Math.round(prediction.confidence * 100)}%)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;