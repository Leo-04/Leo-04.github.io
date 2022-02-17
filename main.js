//Globals
var nb = null, lv = null;
var menu_bar = null, tree = null;
var openDialoge;

//Handy Function
String.prototype.replaceAt = function(index, replacement) {
	//Replaces a character within a string with a replacement
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function CreateMenuButton(master, text, onclick){
	//Creates a button for the menu bar
	var button = CreateUI("button", master, {Class: "button", onclick: onclick})
	button.innerHTML = text
}

//Called by <body onload="onload()">
function onload(){
	//Loads UI onto screen using JS
	
	//Containers
    nb = new NoteBook("NoteBookButtons", "NoteBookContents")
	tree = new TreeView(document.getElementById("SideBar"))
    menu_bar = new NoteBook("TopBarButtons", "TopBarContents")
	openDialoge = document.getElementById("openDialoge")
	
    //Menu bar contents
	
	menu_bar.add("File")
	CreateMenuButton(menu_bar.getPannel(0), "New", () => MenuFileNew(nb))
	CreateMenuButton(menu_bar.getPannel(0), "Open", MenuFileOnOpen)
	CreateMenuButton(menu_bar.getPannel(0), "Save", () => MenuFileSave(nb))
	CreateMenuButton(menu_bar.getPannel(0), "Save As", () => MenuFileSaveAs(nb))
	CreateMenuButton(menu_bar.getPannel(0), "Download", () => MenuFileDownload(nb))
	CreateMenuButton(menu_bar.getPannel(0), "Upload", () => MenuFileUpload(nb))
	CreateMenuButton(menu_bar.getPannel(0), "Close", () => MenuFileClose(nb))
	
	menu_bar.add("Headings")
	CreateMenuButton(menu_bar.getPannel(1), "Add", () => MenuHeaderAdd(nb))
	CreateMenuButton(menu_bar.getPannel(1), "Swap", () => MenuHeaderSwap(nb))
	CreateMenuButton(menu_bar.getPannel(1), "Remove", () => MenuHeaderRemove(nb))
	CreateMenuButton(menu_bar.getPannel(1), "Rename", () => MenuHeaderRename(nb))
	
	
	menu_bar.add("Data")
	CreateMenuButton(menu_bar.getPannel(2), "Add", () => MenuDataAdd(nb))
	CreateMenuButton(menu_bar.getPannel(2), "Add Blanks", () => MenuDataAddBlanks(nb))
	CreateMenuButton(menu_bar.getPannel(2), "Remove", () => MenuDataRemove(nb))
	
	menu_bar.select(0) // Select 'File'
	
}