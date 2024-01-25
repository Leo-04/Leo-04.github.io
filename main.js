function New(){
	
}
function Open(){
	
}
function Save(){
	
}
function Menu(){
	console.log(menu.style.display)
	if (menu.style.display == "none" || menu.style.display == ""){
		menu.style.display = "block";
	} else {
		menu.style.display = "none";
	}
}
function Undo(){
	
}
function Redo(){
	
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
function Resize(){
	
}
function Export(){
	
}

var c1, c2, c3, canvas, menu, grid, major_grid, grid_color, major_color, bg_color;
var selected_color;

window.onload = function(){
	canvas = document.getElementById("canvas");
	menu = document.getElementById("Menu");
	c1 = document.getElementById("c1");
	c2 = document.getElementById("c2");
	c3 = document.getElementById("c3");
	c3 = document.getElementById("c3");
	grid = document.getElementById("grid");
	major_grid = document.getElementById("major");
	grid_color = document.getElementById("grid_color");
	major_color = document.getElementById("major_color");
	bg_color = document.getElementById("bg_color");
	C1()
}