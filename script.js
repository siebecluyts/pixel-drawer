// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const tintSlider = document.getElementById('tint');
const downloadButton = document.getElementById('download');
const clearCanvasButton = document.getElementById('clearCanvas');
const eraserButton = document.getElementById('eraser');
const imageUpload = document.getElementById('imageUpload');


// Initialize canvas size and pixel data
canvas.width = 300;
canvas.height = 300;
const pixelData = new Map(); // Stores pixel coordinates and color

// Set pixel size and canvas grid
function updateCanvas() {
    pixelSize = parseInt(sizePicker.value);
    canvas.width = canvas.width; // Clear canvas
    canvas.height = canvas.height;
    drawGrid();
}

// Draw grid on canvas
function drawGrid() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += pixelSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += pixelSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

// Draw a pixel on the canvas
function drawPixel(x, y, color) {
    if (usingEraser) {
        ctx.clearRect(x, y, pixelSize, pixelSize);
        pixelData.delete(`${x},${y}`); // Remove pixel from data
    } else {
        ctx.fillStyle = adjustColorTint(color, tintAmount);
        ctx.fillRect(x, y, pixelSize, pixelSize);
        pixelData.set(`${x},${y}`, color); // Store pixel color
    }
}

// Adjust color tint based on the tint slider
function adjustColorTint(color, tint) {
    let [r, g, b] = hexToRgb(color);
    r = Math.min(255, r + tint * 2.55);
    g = Math.min(255, g + tint * 2.55);
    b = Math.min(255, b + tint * 2.55);
    return `rgb(${r},${g},${b})`;
}

// Convert hex color to RGB
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return [r, g, b];
}

// Event listener for drawing on canvas
canvas.addEventListener('mousedown', function(event) {
    drawing = true;
    drawPixelAtEvent(event);
});

canvas.addEventListener('mouseup', function() {
    drawing = false;
});

canvas.addEventListener('mousemove', function(event) {
    if (drawing) {
        drawPixelAtEvent(event);
    }
});

function drawPixelAtEvent(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize) * pixelSize;
    const y = Math.floor((event.clientY - rect.top) / pixelSize) * pixelSize;
    drawPixel(x, y, currentColor);
}

// Update color and size
colorPicker.addEventListener('input', function() {
    currentColor = colorPicker.value;
    usingEraser = false; // Disable eraser when changing color
});

sizePicker.addEventListener('input', function() {
    updateCanvas();
});

tintSlider.addEventListener('input', function() {
    tintAmount = parseInt(tintSlider.value);
});

// Download the canvas content as an image
downloadButton.addEventListener('click', function() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    pixelData.forEach((color, key) => {
        const [x, y] = key.split(',').map(Number);
        tempCtx.fillStyle = color;
        tempCtx.fillRect(x, y, pixelSize, pixelSize);
    });

    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'pixel-art.png';
    link.click();
});

// Clear the canvas
clearCanvasButton.addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pixelData.clear();
    drawGrid();
});

// Eraser functionality
eraserButton.addEventListener('click', function() {
    usingEraser = !usingEraser;
    if (usingEraser) {
        eraserButton.style.backgroundColor = '#d32f2f';
    } else {
        eraserButton.style.backgroundColor = '#f44336';
    }
});

// Initialize canvas with default settings
updateCanvas();
