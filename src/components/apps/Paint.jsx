import React, { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
  '#FF8040', '#804000', '#FF80C0', '#80FF80', '#80C0FF', '#8080FF', '#FF80FF', '#C08040',
];

const TOOLS = [
  { id: 'pencil', label: '✏️', cursor: 'crosshair' },
  { id: 'brush', label: '🖌️', cursor: 'crosshair' },
  { id: 'eraser', label: '🧽', cursor: 'crosshair' },
  { id: 'fill', label: '🪣', cursor: 'crosshair' },
  { id: 'line', label: '📏', cursor: 'crosshair' },
  { id: 'rect', label: '⬜', cursor: 'crosshair' },
  { id: 'circle', label: '⭕', cursor: 'crosshair' },
  { id: 'text', label: '🔤', cursor: 'text' },
];

export default function Paint() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const lastPos = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawLine = (ctx, from, to, strokeColor, size) => {
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const floodFill = (ctx, x, y, fillColor) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const targetColor = getPixelColor(data, x, y, ctx.canvas.width);
    const fill = hexToRgb(fillColor);
    if (targetColor[0] === fill[0] && targetColor[1] === fill[1] && targetColor[2] === fill[2]) return;

    const stack = [[x, y]];
    const visited = new Set();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      if (cx < 0 || cx >= ctx.canvas.width || cy < 0 || cy >= ctx.canvas.height) continue;

      const currentColor = getPixelColor(data, cx, cy, ctx.canvas.width);
      if (currentColor[0] !== targetColor[0] || currentColor[1] !== targetColor[1] || currentColor[2] !== targetColor[2]) continue;

      visited.add(key);
      const idx = (cy * ctx.canvas.width + cx) * 4;
      data[idx] = fill[0]; data[idx + 1] = fill[1]; data[idx + 2] = fill[2]; data[idx + 3] = 255;

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data, x, y, width) => {
    const idx = (y * width + x) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const handleMouseDown = (e) => {
    const pos = getPos(e);
    setIsDrawing(true);
    lastPos.current = pos;
    setStartPos(pos);

    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'fill') {
      floodFill(ctx, Math.round(pos.x), Math.round(pos.y), e.button === 2 ? bgColor : color);
      setIsDrawing(false);
    } else if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      const drawColor = tool === 'eraser' ? '#FFFFFF' : color;
      const size = tool === 'brush' ? brushSize * 3 : tool === 'eraser' ? brushSize * 4 : brushSize;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = drawColor;
      ctx.fill();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      const drawColor = tool === 'eraser' ? '#FFFFFF' : color;
      const size = tool === 'brush' ? brushSize * 3 : tool === 'eraser' ? brushSize * 4 : brushSize;
      drawLine(ctx, lastPos.current, pos, drawColor, size);
      lastPos.current = pos;
    } else if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      // Draw preview on overlay
      const overlay = overlayRef.current;
      const octx = overlay.getContext('2d');
      octx.clearRect(0, 0, overlay.width, overlay.height);
      octx.strokeStyle = color;
      octx.lineWidth = brushSize;

      if (tool === 'line') {
        octx.beginPath();
        octx.moveTo(startPos.x, startPos.y);
        octx.lineTo(pos.x, pos.y);
        octx.stroke();
      } else if (tool === 'rect') {
        octx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = (startPos.x + pos.x) / 2;
        const cy = (startPos.y + pos.y) / 2;
        octx.beginPath();
        octx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        octx.stroke();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'line' || tool === 'rect' || tool === 'circle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        const cx = (startPos.x + pos.x) / 2;
        const cy = (startPos.y + pos.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Clear overlay
      const overlay = overlayRef.current;
      overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
    }

    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Menu bar */}
      <div className="xp-menubar">
        <div className="xp-menubar-item group relative">
          File
          <div className="hidden group-hover:block absolute top-full left-0 xp-context-menu z-50">
            <div className="xp-context-menu-item" onClick={clearCanvas}>New</div>
          </div>
        </div>
        <span className="xp-menubar-item">Edit</span>
        <span className="xp-menubar-item">View</span>
        <div className="xp-menubar-item group relative">
          Image
          <div className="hidden group-hover:block absolute top-full left-0 xp-context-menu z-50">
            <div className="xp-context-menu-item" onClick={clearCanvas}>Clear Image</div>
          </div>
        </div>
        <span className="xp-menubar-item">Colors</span>
        <span className="xp-menubar-item">Help</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool panel */}
        <div className="w-[58px] bg-[#ECE9D8] border-r border-gray-300 p-1">
          <div className="grid grid-cols-2 gap-0.5">
            {TOOLS.map(t => (
              <button
                key={t.id}
                className={`w-6 h-6 flex items-center justify-center text-xs border rounded-sm ${tool === t.id ? 'bg-blue-200 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-[9px] text-gray-600">Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto bg-gray-300 p-1">
          <div className="relative inline-block" style={{ width: canvasSize.width, height: canvasSize.height }}>
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute top-0 left-0 border border-gray-400"
              style={{ cursor: 'crosshair', imageRendering: 'pixelated' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDrawing(false)}
              onContextMenu={(e) => e.preventDefault()}
            />
            <canvas
              ref={overlayRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute top-0 left-0 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Color palette */}
      <div className="bg-[#ECE9D8] border-t border-gray-300 p-1 flex items-center gap-2">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-0 w-5 h-5 border-2 border-gray-400 rounded-sm" style={{ background: color }} title="Foreground color" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-2 border-gray-400 rounded-sm" style={{ background: bgColor }} title="Background color" />
        </div>
        <div className="flex flex-wrap gap-0.5">
          {COLORS.map(c => (
            <div
              key={c}
              className="w-4 h-4 border border-gray-400 cursor-pointer hover:border-black"
              style={{ background: c }}
              onClick={() => setColor(c)}
              onContextMenu={(e) => { e.preventDefault(); setBgColor(c); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
