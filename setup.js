const TILE_SIZE=32;
let TILEMAP_WIDTH=20;
let TILEMAP_HEIGHT=15;

let tilemap=[];

let selectedTile=null;
let selectedImg=null;

let sprites=null;
const spriteWidth = 32; // Adjust the sprite width as needed
const spriteHeight = 32; // Adjust the sprite height as needed
let rows=1;
let columns=30;
let isDragging=false;

const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const spriteCanvas = document.getElementById("selectionCanvas");

const openDialogButton = document.getElementById('open-dialog-button');
const dialog = document.getElementById('dialog');
const dialogWidthInput = document.getElementById('dialog-width-input');
const dialogHeightInput = document.getElementById('dialog-height-input');
const dialogApplyButton = document.getElementById('dialog-apply-button');
const overlay = document.getElementById('overlay');
const spritesheetInput=document.getElementById("spritesheetInput");

const loadButton=document.getElementById("loadButton");

canvas.addEventListener("click", handleMouseClick);
canvas.addEventListener("mousedown", onMouseDragStart);
canvas.addEventListener("mousemove", onMouseDrag);
canvas.addEventListener("mouseup", onMouseDragStop);
spriteCanvas.addEventListener("click", handleMouseClickOnSelectionCanvas);
spritesheetInput.addEventListener("change",handleSpritesheet);

loadButton.addEventListener("click",handleLoadButtonClick);
let details=sessionStorage.getItem("details");
if(!details){
    openDialog();
}
else{
    let d=JSON.parse(details);
    console.log(d.width);
    TILEMAP_HEIGHT=d.height;
    TILEMAP_WIDTH=d.width;
}
// let spriteSheetdetails=sessionStorage.getItem("Spritesheet");
// if(spriteSheetdetails)
// {
//     let det=JSON.parse(spriteSheetdetails);
//    console.log(det.name);
//    const myFile = new File( det.name,{
//     lastModified: new Date(),
// });

// // Now let's create a DataTransfer to get a FileList
// const dataTransfer = new DataTransfer();
// dataTransfer.items.add(myFile);
// fileInput.files = dataTransfer.files;
//    spritesheetInput.value=det.name;
//    spritesheetInput.click();
//   // console.log(det.target.files[0]);
//     //   handleSpritesheet(det);
// }



initializeTilemap();
redrawTileMap();

function onMouseDragStart(event){
isDragging=true;
//handleMouseClick(event);
}

function onMouseDragStop(){
    isDragging=false;
}
let lastY;
let lastX;
function onMouseDrag(event){
    if(!isDragging)return;
    rect=canvas.getBoundingClientRect();
    const mouseX=event.clientX-rect.left;
    const mouseY=event.clientY-rect.top;
    
    const tileX=Math.floor(mouseX/TILE_SIZE);
    const tileY=Math.floor(mouseY/TILE_SIZE);
    
    if(tileX===lastX&&tileY===lastY)
    return;
    lastX=tileX;
    lastY=tileY;
    if(selectedImg){
        tilemap[tileY][tileX]=selectedImg.index; 
    }

   // handleTileSelection(tileX,tileY);
    redrawTileMap();
  
}

function handleMouseClick(event){
    
    rect=canvas.getBoundingClientRect();
    const mouseX=event.clientX-rect.left;
    const mouseY=event.clientY-rect.top;
    
    const tileX=Math.floor(mouseX/TILE_SIZE);
    const tileY=Math.floor(mouseY/TILE_SIZE);
    
    if(selectedImg){
        tilemap[tileY][tileX]=selectedImg.index; 
    }

    handleTileSelection(tileX,tileY);
    redrawTileMap();
}

function handleMouseClickOnSelectionCanvas(event){
   if(!sprites)return;
    rect=spriteCanvas.getBoundingClientRect();
    const mouseX=event.clientX-rect.left;
    const mouseY=event.clientY-rect.top;

    const tileX=Math.floor(mouseX/TILE_SIZE);
    const tileY=Math.floor(mouseY/TILE_SIZE);
    // if(selectedImg){
    //     tilemap[tileY][tileX]=selectedImg.index; 
    // }

    handleImageSelection(tileX,tileY);
    drawSprites();
}

function handleTileSelection(tileX,tileY){
    if(selectedTile&& selectedTile.x===tileX&& selectedTile.y===tileY){
        selectedTile=null;
    }
    else{
        selectedTile={x:tileX,y:tileY};
    }
}

function handleImageSelection(tileX,tileY){
    if(selectedImg&& selectedImg.x===tileX&& selectedImg.y===tileY){
        selectedImg=null;
    }
    else{
       // console.log(tileX+","+tileY+","+rows+","+columns+","+((columns*tileX)+tileY));
        selectedImg={x:tileX,y:tileY,index:(columns*tileY)+tileX};
    }
}


function handleLoadButtonClick(){
    //const savedTilemapData=localStorage.getItem("tilemapData");
    const input=document.createElement("input");
    input.type="file";

    input.addEventListener("change",handleFileSelect);
    input.click();

    function handleFileSelect(event){
        const file=event.target.files[0];
        if(file){
            const reader=new FileReader();

            reader.onload=function(event){
                const jsonData=sessionStorage.getItem("details");
                const data=JSON.parse(jsonData);
                tilemap=data;
                console.log("TileMap loaded");
                redrawTileMap();
            }
            reader.readAsText(file);
        }
    }



    // if(savedTilemapData){
    //     tilemap=JSON.parse(savedTilemapData);
    //     console.log("TileMap loaded");
    //     redrawTileMap();
    // }else{
    //     console.log("No saved tilemapData");
    // }
}

function redrawTileMap(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#ccc";

    for (let y = 0; y < TILEMAP_HEIGHT; y++) {

        for (let x = 0; x < TILEMAP_WIDTH; x++) {

            const tileX=x*TILE_SIZE;
            const tileY=y*TILE_SIZE;

            ctx.fillStyle = "blue";
            if (tilemap[y][x] === 1) {
                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }

            if(sprites && tilemap[y][x]!=null){
                console.log(tilemap[y][x]);
                ctx.drawImage(sprites[tilemap[y][x]],tileX, tileY, TILE_SIZE, TILE_SIZE);
            }

            ctx.beginPath();
            ctx.moveTo(tileX,tileY);
            ctx.lineTo(tileX+TILE_SIZE,tileY);
            // ctx.lineTo(tileX+TILE_SIZE,tileY*TILE_SIZE);
            ctx.stroke();
            
            ctx.moveTo(tileX,tileY);
            ctx.lineTo(tileX,tileY+TILE_SIZE);
          //  ctx.closePath();
            ctx.stroke();
            
            if(selectedTile && selectedTile.x===x&&selectedTile.y===y){
                ctx.strokeStyle="red";
                ctx.lineWidth=2;
                ctx.strokeRect(tileX,tileY,TILE_SIZE,TILE_SIZE);
                ctx.lineWidth=1;
                ctx.strokeStyle="#ccc";
            }
        }
    }
}

// Initialize the tilemap
function initializeTilemap() {
    canvas.height=TILEMAP_HEIGHT*TILE_SIZE;
    canvas.width=TILEMAP_WIDTH*TILE_SIZE;
tilemap=[];
for (let y = 0; y <  TILEMAP_HEIGHT; y++) {
tilemap[y]=[];

for(let x=0;x<TILEMAP_WIDTH;x++){
  tilemap[y][x]=null;
}
}
}


function handleSpritesheet(event){
    console.log(spritesheetInput.files[0]);
    const file=event.target.files[0];
    if(file){
        
        const reader=new FileReader();
        reader.onload=function(){
           // console.log(reader.result);
            const image=new Image();
            image.src=reader.result;
            image.onload=function(){
                const _sprites=cutSprites(image);
                sprites=_sprites;
                drawSprites();
                console.log(file);
               sessionStorage.setItem("Spritesheet",JSON.stringify({name:spritesheetInput.files[0].name}));
            };
            };
            reader.src=reader.result;
          
            reader.readAsDataURL(file);
        }
}

// Function to cut the spritesheet into individual sprites
function cutSprites(spritesheet) {
   
  
    // Create a temporary canvas to draw each sprite
   
    const sprites = [];
  
    // Calculate the number of rows and columns in the spritesheet
     rows = Math.floor(spritesheet.height / spriteHeight);
     columns = Math.floor(spritesheet.width / spriteWidth);
  
    // Iterate through the spritesheet and cut each sprite
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
      
        // Clear the temporary canvas
      
        tempCanvas.width=TILE_SIZE;
        tempCanvas.height=TILE_SIZE;
        // Draw the sprite onto the temporary canvas
        tempCtx.drawImage(
          spritesheet,
          x * spriteWidth,
          y * spriteHeight,
          spriteWidth,
          spriteHeight,
          0,
          0,
          spriteWidth,
          spriteHeight
        );
  
        // Create a new Image object and set its source to the data URL of the sprite
        // const sprite = new Image();
        // sprite.src = tempCanvas.toDataURL();
  
        // Add the sprite to the sprites array
        sprites.push(tempCanvas);
      }
    }
  
    return sprites;
  }




// Function to draw the sprites to the sprite selection canvas
function drawSprites() {
  
    const spriteCtx = spriteCanvas.getContext("2d");
    spriteCanvas.width = spriteWidth * columns; // Adjust the width based on your spritesheet
    spriteCanvas.height = spriteHeight * rows; // Adjust the height based on your spritesheet

  spriteCtx.clearRect(0,0,canvas.width,canvas.height);
  const numSpritesPerRow=(spriteCanvas.width/TILE_SIZE);
 // const numRows=Math.ceil(sprites.length/numSpritesPerRow);

  sprites.forEach((sprite,index)=>{
      const col=index%numSpritesPerRow;
      const row=Math.floor(index/numSpritesPerRow);
      spriteCtx.drawImage(sprite,col*TILE_SIZE,row*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      //console.log(sprite);
  });
    spriteCtx.strokeStyle="#ccc";

    for (let y = 0; y < spriteCanvas.height; y++) {

        for (let x = 0; x < spriteCanvas.width; x++) {
            
            const tileX=x*TILE_SIZE;
            const tileY=y*TILE_SIZE;
            spriteCtx.beginPath();
            spriteCtx.moveTo(tileX,tileY);
            spriteCtx.lineTo(tileX+TILE_SIZE,tileY);
            // ctx.lineTo(tileX+TILE_SIZE,tileY*TILE_SIZE);
            spriteCtx.stroke();
            
            spriteCtx.moveTo(tileX,tileY);
            spriteCtx.lineTo(tileX,tileY+TILE_SIZE);
          //  ctx.closePath();
          spriteCtx.stroke();
            
            if(selectedImg && selectedImg.x===x&&selectedImg.y===y){
                spriteCtx.strokeStyle="red";
                spriteCtx.lineWidth=2;
                spriteCtx.strokeRect(tileX,tileY,TILE_SIZE,TILE_SIZE);
                spriteCtx.lineWidth=1;
                spriteCtx.strokeStyle="#ccc";
            }
        }
    }
}



openDialogButton.addEventListener('click', openDialog);
dialogApplyButton.addEventListener('click', applySizeChange);

function openDialog() 
{
  dialog.style.display = 'block';
  overlay.style.display = 'block';
}

function applySizeChange() {
  const newWidth = parseInt(dialogWidthInput.value);
  const newHeight = parseInt(dialogHeightInput.value);

  if (newWidth >= 1 && newHeight >= 1) {
    updateTilemapSize(newWidth, newHeight);
    sessionStorage.setItem("details",JSON.stringify({width:newWidth,height:newHeight}));
    closeDialog();
  } else {
    alert('Invalid size. Width and height must be greater than or equal to 1.');
  }
}

function closeDialog() {
  dialog.style.display = 'none';
  overlay.style.display = 'none';
}

function updateTilemapSize(width, height) {
  TILEMAP_HEIGHT=height;
  TILEMAP_WIDTH=width;
  initializeTilemap();
  redrawTileMap();
  console.log('Tilemap size updated:', width, height);
}