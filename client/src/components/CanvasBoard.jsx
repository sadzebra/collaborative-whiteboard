import React, { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';

const CanvasBoard = () => {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const socketRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

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

    socketRef.current.on("drawing", (data) => {
      drawFromServer(data, ctx);
    });

    socketRef.current.on("clear", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const handleResize = () => {
      console.log("Handle rezie");

      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.putImageData(imageData, 0, 0);

      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      setContext(ctx);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const drawFromServer = (data, ctx) => {
    if (!ctx)
      return;

    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke();
  }

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    lastPosRef.current = { x: offsetX, y: offsetY };

    setIsDrawing(true);

    context.beginPath();
    context.moveTo(offsetX, offsetY);
  }

  const stopDrawing = () => {
    if (!isDrawing)
      return

    context.closePath();
    setIsDrawing(false);
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing)
      return

    const { offsetX, offsetY } = nativeEvent;

    context.lineTo(offsetX, offsetY);
    context.stroke();

    if (lastPosRef.current) {
      socketRef.current.emit('drawing', {
        x1: lastPosRef.current.x,
        y1: lastPosRef.current.y,
        x2: offsetX,
        y2: offsetY
      });
    }

    lastPosRef.current = { x: offsetX, y: offsetY };
  }

  const clearBoard = () => {
    if (socketRef.current) {
      socketRef.current.emit("clear");
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <button
        onClick={clearBoard}
        className="absolute top-5 left-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg z-10 transition-colors"
      >
        Clear Board
      </button>
    </div>
  );
}

export default CanvasBoard;
