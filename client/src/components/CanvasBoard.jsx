import React, { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';

const CanvasBoard = () => {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const ctx = canvas.getContext('2d');

    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;

    setContext(ctx);

    socketRef.current = io('http://localhost:3001');

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    console.log('StartDrawing method');

    const { offsetX, offsetY } = nativeEvent;

    setIsDrawing(true);

    context.beginPath();
    context.moveTo(offsetX, offsetY);
  }

  const stopDrawing = () => {
    console.log('Stop Drawing Method');

    if (!isDrawing)
      return

    context.closePath();
    setIsDrawing(false);
  }

  const draw = ({ nativeEvent }) => {
    console.log('draw method');

    if (!isDrawing)
      return

    const { offsetX, offsetY } = nativeEvent;

    context.lineTo(offsetX, offsetY);
    context.stroke();
  }

  return (
    <canvas
      ref={canvasRef}
      className="block cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
    />
  );
}

export default CanvasBoard;
