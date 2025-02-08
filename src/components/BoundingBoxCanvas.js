import React, { useEffect, useRef } from 'react';

const BoundingBoxCanvas = ({ boxes }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    // Set canvas size to match container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new boxes
    boxes.forEach(box => {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        box.x - box.width/2,
        box.y - box.height/2,
        box.width,
        box.height
      );
      
      // Draw class label
      ctx.fillStyle = '#FF0000';
      ctx.font = '14px Arial';
      ctx.fillText(box.class, box.x - box.width/2 + 5, box.y - box.height/2 + 15);
    });
  }, [boxes]);

  return (
    <div className="canvas-container" ref={containerRef}>
      <canvas ref={canvasRef} className="bounding-canvas" />
    </div>
  );
};

export default BoundingBoxCanvas;