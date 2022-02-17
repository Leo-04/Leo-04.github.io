//This is the text and check button
class TreeViewCheck{
	constructor(root, name, Class = "TreeView"){
		this.root = CreateUI("li", root, {Class: Class+"Item"})
		this.checkbox = CreateUI("input", this.root, {Class: Class+"CheckBox"})
		this.checkbox.type= "checkbox"
		var text = document.createTextNode(name);
		this.root.appendChild(text);
		this.name = name
	}
	remove(){
		this.root.remove()
		this.checkbox.remove()
	}
	get value(){
		return this.checkbox.checked
	}
}

class TreeViewItem{
	constructor(root, name, options, Class = "TreeView"){
		//Create HTML nodes
		this.root = CreateUI("li", root, {Class: Class+"Item"})
		this.span = CreateUI("span", this.root, {Class: Class+"Caret"})
		this.content = CreateUI("ul", this.root, {Class: Class+"Nested"})
		
		//Set HTML content
		this.span.innerHTML = name
		this.Class = Class
		
		
		this.name = name
		this.options = {}
		
		this.setOptions(options)
		
		//Drop down event handdler
		this.span.addEventListener("click", this.onclick.bind(this));
	}
	//Toggle the dropdown list
	onclick(){
		this.span.parentElement.querySelector("."+this.Class+"Nested").classList.toggle(this.Class+"Active");
		this.span.classList.toggle(this.Class+"Caret-down");
	}
	//Set the options
	setOptions(options){
		//Remove all of the old options
		for (const [item, __] of Object.entries(this.options)){
			if (!(item in options)){
				this.options[item].remove()
			}
		}
		//Add new ones
		for (const header of options){
			if (this.options[header] == undefined){
				this.options[header] = new TreeViewCheck(this.content, header, this.Class)
			}
		}
	}
	
	//Returns the names of the selected options
	getOptions(){
		var li=[]//Return list
		for (const [item, __] of Object.entries(this.options)){
			if (this.options[item].value)
				li.push(this.options[item].name)
		}
		return li
	}
	//Remove all options and droppdown nodes
	remove(){
		for (const [item, __] of Object.entries(this.options)){
			this.options[item].remove()
		}
		this.content.remove()
		this.span.remove()
		this.root.remove()
	}
}

class TreeView{
	constructor(root){
		this.root = CreateUI("ul", root, {Class: "TreeView"})
		this.headers = {}
	}
	//Set all dropdown headers
	setHeaders(headers){
		for (const [header, __] of Object.entries(this.headers)){
			this.headers[header].remove()
		}
		this.headers = {}
		for (const header of headers){
			this.newHeader(header[0], header[1])
		}
	}
	//Adds a new dropdown header
	newHeader(name, options){
		this.headers[name] = new TreeViewItem(this.root, name, options)
	}
	//Gets list of all seleted values within dropdown headers
	getHeaders(){
		var li = []//Return list
		for (const [header, value] of Object.entries(this.headers)){
			li.push(value.getOptions())
		}
		return li
	}
}