const exportBtn = document.getElementById('exportBtn');
const exportOptions = document.getElementById('exportOptions');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportImageBtn = document.getElementById('exportImageBtn');


exportBtn.addEventListener('click', showExportOptions);

function showExportOptions() {
  exportOptions.style.display = 'block';
}
function hideExportOptions() {
    exportOptions.style.display = 'none';
  }
exportJsonBtn.addEventListener('click', exportMapAsJson);
exportImageBtn.addEventListener('click', exportMapAsImage);

function exportMapAsImage() {
    // Create a new canvas element
    const canvas = document.createElement('canvas');
  const det=JSON.parse(sessionStorage.getItem("details"));
  let mapWidth=det.width;
  let mapHeight=det.height;
  // TILE_SIZE=32;
    // Set the canvas dimensions based on your map size
    const canvasWidth = mapWidth * TILE_SIZE;
    const canvasHeight = mapHeight * TILE_SIZE;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    // Get the canvas context for drawing
    const ctx = canvas.getContext('2d');
  
    // Loop through each tile in the map and draw it onto the canvas
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
          const xPos = x * TILE_SIZE;
          const yPos = y * TILE_SIZE;
          
          // Set the fill style to the tile color
          //ctx.fillStyle = tileColor;
          
          // Draw a rectangle for the tile
          if(sprites && tilemap[y][x]!=null){
  
              ctx.drawImage(sprites[tilemap[y][x]],xPos, yPos, TILE_SIZE, TILE_SIZE);
          }
      }
    }
  
    // Generate a data URL for the canvas as an image
    const dataURL = canvas.toDataURL();
  
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'map.png'; // Set the desired filename for the exported image
  
    // Programmatically click the link to initiate the download
    link.click();
    hideExportOptions();
}

function exportMapAsJson(){
    const tilemapData=JSON.stringify(tilemap);
    const blob=new Blob([tilemapData],{type:"application/json"});
    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");
    link.href=url;
    link.download="tilemap.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
   // localStorage.setItem("tilemapData",tilemapData);
    console.log("saved");
    hideExportOptions();
}