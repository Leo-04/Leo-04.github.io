function New(){
	
}
function Open(){
	
}
function Save(){
	
}
function Menu(){
	if (menu.style.display == "none" || menu.style.display == ""){
		menu.style.display = "block";
	} else {
		menu.style.display = "none";
		resize.style.display = "none";
	}
}
function Resize(){
	if (resize.style.display == "none" || resize.style.display == ""){
		resize.style.display = "block";
	} else {
		resize.style.display = "none";
	}
}
function Undo(){
	
}
function Redo(){
	
}
function DoResize(){
	
}

function C1(){
	selected_color = c1.style.backgroundColor;
	c1.style.border = "10px solid red";
	c2.style.border = "0px solid black";
	c3.style.border = "0px solid black";
}
function C2(){
	c1.style.border = "0px solid black";
	c2.style.border = "10px solid red";
	c3.style.border = "0px solid black";
	selected_color = c1.style.backgroundColor;
}
function C3(){
	c1.style.border = "0px solid black";
	c2.style.border = "0px solid black";
	c3.style.border = "10px solid red";
	selected_color = c1.style.backgroundColor;
}
function ColorPicker(e){
	
}
function Export(){
	
}

var c1, c2, c3, canvas, menu, grid, major_grid, grid_color, major_color, bg_color, resize;
var ctx;
var selected_color;
var width=8;
var height=8;
var pixels=[]
for (var i=0; i<64; i++){
	pixels.push("#FFFFFFFF");
}

window.onload = function(){
	canvas = document.getElementById("canvas");
	menu = document.getElementById("Menu");
	resize = document.getElementById("Resize");
	c1 = document.getElementById("c1");
	c2 = document.getElementById("c2");
	c3 = document.getElementById("c3");
	c3 = document.getElementById("c3");
	grid = document.getElementById("grid");
	major_grid = document.getElementById("major");
	grid_color = document.getElementById("grid_color");
	major_color = document.getElementById("major_color");
	bg_color = document.getElementById("bg_color");
	ctx = canvas.getContext("2d");
	C1()
	
	setInterval(Draw, 100);
	
	console.log(typeof(c3.style.backgroundColor));
}
window.onresize = function(){
	ctx.canvas.width = canvas.clientWidth;
    ctx.canvas.height = canvas.clientHeight;
}

function Press(){
	
}
function Drag(){
	
}
function Release(){
	
}


function Draw(){
	var grid_size=parseInt(major.value);
	
	if (!grid.checked){
		grid_size = 0;
	}
	var pixel_size = Math.floor(Math.min(
		canvas.clientWidth/(grid_size+width),
		canvas.clientHeight/(grid_size+height)
	));
	var start_x = Math.floor((canvas.clientWidth-(pixel_size*width))/2);
	var start_y = Math.floor((canvas.clientHeight-(pixel_size*height))/2);
	
	ctx.fillStyle = bg_color.style.backgroundColor;
	ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	for (var x=0; x<width; x++){
		for (var y=0; y<height; y++){
			ctx.fillStyle = grid_color.style.backgroundColor;
			ctx.fillRect(start_x + pixel_size*x, start_y + pixel_size*y, pixel_size, pixel_size);
			ctx.fillStyle = pixels[y*width + x];
			ctx.fillRect(start_x + pixel_size*x + grid_size, start_y + pixel_size*y + grid_size, pixel_size - grid_size, pixel_size - grid_size);
		}
	}
	ctx.fill();
}


function Download(){
	var link = document.createElement('a');
	link.download = "image.png";
	link.href = canvas.toDataURL()
	link.click();
}