/* Creates HTML UI components
* 
* It also sets common attributes
* and add it automaticly to a root node
*/
function CreateUI(type, root=document.body, args={}){
	let UI = document.createElement(type);
	
	for (let [key, value] of Object.entries(args)) {
		key = key.toLowerCase()
		if (key == "class"){
			UI.classList.add(value);
		} else if (key == "classes"){
			for (const v of value){
				UI.classList.add(v);
			}
		} else if (key == "id"){
			UI.id = value
		} else if (key == "onclick"){
			UI.onclick = value
		} else if (key == "value"){
			UI.value = value
		} else if (key == "html"){
			UI.innerHTML = value
		} else {
			UI.style[key] = value
		}
	}
	if (root)
		root.appendChild(UI)
	
	return UI
}

//Unused
//Mabey in future us this to change color scheme
function ColorUI(cls, fg=null, bg=null){
	for (const elm of document.getElementsByClassName(cls)){
		if (fg) elm.style.color = fg;
		if (bg) elm.style.backgroundColor = bg;
	}
}