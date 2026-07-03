//Grabs HTML elements 
const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

//Global variables with default value
let prevMouseX, prevMouseY, snapshot, 
isDrawing = false;
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";


window.addEventListener("load", () => {
    //Setting canvas width
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDraw = (e) => { //Turns on Drawing mode
    isDrawing = true;
    prevMouseX = e.offsetX; //passing mouseX position as PrevMouseX value
    prevMouseY = e.offsetY; //passing mouseY positon as PrewMouseY value
    ctx.beginPath(); //Create new path for drawing 
    ctx.lineWidth = brushWidth; //Passes brushsize in line width 
    ctx.strokeStyle = selectedColor; //Passing selected color as stroke style 
    ctx.fillStyle = selectedColor; // passing selected color as fillStyle
    //Copying canvas data & passing as snapshot value - this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawRect = (e) => {
    //if fillColor isnt checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        //Creates circle according to the mouse pointer
        return ctx.strokeRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
    }
    ctx.fillRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
}

const drawCircle = (e) => {
    ctx.beginPath(); //Create new path to draw circle 
    //Gets radius of circle according to mouse pointer 
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //Creates circle according to mouse pointer 
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else to draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); //Create new path to draw triangle 
    ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to mouse pointer 
    ctx.lineTo(e.offsetX, e.offsetY); //Creating first line according to mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //Creating bottom of triangle
    ctx.closePath(); //closing path of triangle in order for third line to draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border

}

const drawing = (e) => {
    if(!isDrawing) return; //If isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); //adds copied canvas data to canvas


    if(selectedTool == "brush" || selectedTool === "eraser") {
        //if selected tool is eraser then set strokeStyle to white
        // to paint white color on existing canvas content set stroke colour to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //Creates line according to mouse pointer
        ctx.stroke(); //Drawing/filling line with cursor
    } else if(selectedTool === "rectangle"){ //Calls rectangle 
        drawRect(e);
    } else if(selectedTool === "circle"){ //Calls circle
        drawCircle(e);
    } else {
        drawTriangle(e); //If it’s not a brush, eraser, rectangle or circle, it draws a triangle
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        //Removes active class from previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //Passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color"); //Passing selected btn background colour as selectedColor value
    });
});

clearCanvas.addEventListener("click", ()=> {
    ctx.clearRect(0, 0, canvas.width, canvas.height) //Clears whole canvas
});

saveImg.addEventListener("click", ()=> {
    const link = document.createElement("a"); //Creates <a> element
    link.download = `${Date.now}.jpg`;
    link.href = canvas.toDataURL();
    link.click(); //Click link to download image
});

canvas.addEventListener("mousedown", startDraw); //start drawing - Runs when you press the mouse button down
canvas.addEventListener("mousemove", drawing); //Actually draw - Runs every time the mouse moves over the canvas
canvas.addEventListener("mouseup", () => isDrawing = false); //Stops Drawing