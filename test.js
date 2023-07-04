// Map properties
const TILE_SIZE = 32; // Size of each tile in pixels
const mapWidth = 20; // Number of tiles in the map's width
const mapHeight = 20; // Number of tiles in the map's height

// Initialize map data

// Constants for the size of the canvases
const actualMapCanvasSize = 200; // Adjust this value to your desired actual map canvas size
const editingCanvasSize = 400; // Adjust this value to your desired editing canvas size
let mapData = Array(actualMapCanvasSize * actualMapCanvasSize).fill("red");

// Create the actual map canvas element
const actualMapCanvas = document.createElement("canvas");
actualMapCanvas.width = actualMapCanvasSize;
actualMapCanvas.height = actualMapCanvasSize;
const actualMapCtx = actualMapCanvas.getContext("2d");

// Create the editing canvas element
const editingCanvas = document.createElement("canvas");
editingCanvas.width = editingCanvasSize;
editingCanvas.height = editingCanvasSize;
const editingCtx = editingCanvas.getContext("2d");

// Add the canvases to the DOM
document.body.appendChild(actualMapCanvas);
document.body.appendChild(editingCanvas);
numCells=5;
numTiles=20;
// Call the drawMap function to initially draw the actual map
drawMap();
// Function to handle a click on the actual map
function handleMapClick(event) {
  // Calculate the clicked cell position
  const rect = actualMapCanvas.getBoundingClientRect();
  const scaleX = actualMapCanvas.width / actualMapCanvasSize;
  const scaleY = actualMapCanvas.height / actualMapCanvasSize;
  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;
  const cellSize = actualMapCanvasSize / numCells; // Adjust numCells based on your actual map configuration
  const cellX = Math.floor(clickX / cellSize);
  const cellY = Math.floor(clickY / cellSize);

  // Update the editing canvas based on the selected portion
  updateEditingCanvas(cellX, cellY);
}
function getTileColor(tileX, tileY){
    return mapData[tileY][tileX];
}
// Function to update the editing canvas based on the selected portion
function updateEditingCanvas(cellX, cellY) {
  // Clear the editing canvas
  editingCtx.clearRect(0, 0, editingCanvas.width, editingCanvas.height);

  // Calculate the size of each tile in the editing canvas
  const tileSize = editingCanvasSize / numTiles; // Adjust numTiles based on the number of tiles you want to display

  // Draw the selected portion on the editing canvas
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      const tileX = cellX * numTiles + i;
      const tileY = cellY * numTiles + j;
      const tileColor = getTileColor(tileX, tileY); // Implement your own logic to get the tile color based on the tile coordinates

      editingCtx.fillStyle = tileColor;
      editingCtx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }

  // Handle further tile editing on the editing canvas
  // ...
}
function editMap(event){
    rect=editingCanvas.getBoundingClientRect();
    const mouseX=event.clientX-rect.left;
    const mouseY=event.clientY-rect.top;
    
    const tileX=Math.floor(mouseX/TILE_SIZE);
    const tileY=Math.floor(mouseY/TILE_SIZE);
   mapData[tileY][tileX]="white";
}

editingCanvas.addEventListener("click",editMap);

// Add a click event listener to the actual map canvas
actualMapCanvas.addEventListener("click", handleMapClick);

// Function to draw the actual map based on the map data
function drawMap() {
  // Clear the actual map canvas
  actualMapCtx.clearRect(0, 0, actualMapCanvas.width, actualMapCanvas.height);

  // Loop through the map data and draw the tiles
  mapData.forEach((tileIndex, index) => {
    const tileX = index % mapWidth;
    const tileY = Math.floor(index / mapWidth);

    console.log(mapData[tileY][tileX]);
   
    actualMapCtx.fillStyle=mapData[tileY][tileX];


    actualMapCtx.fillRect(tileX*TILE_SIZE,tileY*TILE_SIZE,TILE_SIZE,TILE_SIZE);
    // // Implement your own logic to get the sprite image based on the tile index
    // const spriteImage = getSpriteImage(tileIndex);

    // // Draw the sprite image on the actual map canvas
    // actualMapCtx.drawImage(
    //   spriteImage,
    //   tileX * tileSize,
    //   tileY * tileSize,
    //   tileSize,
    //   tileSize
    // );
  });
}

