import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';

const CanvasBoard = () => {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [colour, setColour] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5)
  const socketRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const ctx = canvas.getContext('2d');

    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = lineWidth;

    setContext(ctx);

    const serverUrl = import.meta.VITE_SERVER_URL || "http://localhost:3001";
    socketRef.current = io(serverUrl);

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
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = colour;
      setContext(ctx);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = colour;
      context.lineWidth = lineWidth;
    }
  }, [colour, lineWidth, context]);

  const drawFromServer = (data, ctx) => {
    if (!ctx)
      return;

    // Store original locla settings
    const originalColor = ctx.strokeStyle;
    const originalWidth = ctx.lineWidth;

    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.strokeStyle = data.colour;
    ctx.lineWidth = data.lineWidth;
    ctx.stroke();

    // Restore local settings
    ctx.strokeStyle = originalColor;
    ctx.lineWidth = originalWidth;
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
        y2: offsetY,
        colour: colour,
        lineWidth: lineWidth
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
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

      <div className="absolute top-5 left-5 z-50 flex items-center gap-4 p-3 bg-white rounded-xl shadow-lg border border-gray-200">

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Colour</span>
          <input
            type="color"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            className="w-8 h-8 cursor-pointer rounded border border-gray-300 p-0.5"
          />
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        <div className="flex flex-col items-center w-24">
          <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">
            Size: {lineWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        <button
          onClick={clearBoard}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors"
        >
          Clear Board
        </button>
      </div>
    </div>
  );
}

export default CanvasBoard;
