//========================================== File ==========================================//

function MenuFileNew(notebook, data=[[],[]]){
	//Opens a new file in 'notebook' with the data
	
	//Ask for file name
	var filename = prompt("File Name:")
	if (filename==null) return;
	
	//Validate the filename is availble
	var filename_ok;
	if (filename == ""){
		filename = "New File"
		filename_ok = filename
		var i = 1
		while (fileHas(filename_ok)){
			filename_ok = filename+" ("+i+")" 
			i++;
		}
		filename = filename_ok
		
		console.log(filename_ok, filename)
	} else {
		if (fileHas(filename)){
			alert("A file is already named that")
			return
		}
	}
	
	//Add new tab
	var tab = notebook.add(filename)
	tab.lv = new ListView([], tab.content)
	notebook.selectTab(tab)
	
	//Load data and save file
	tab.lv.addData(data)
	fileSave(filename, data)
}
function MenuFileOnOpen(){
	//Opens the dialoge window
	
	//Populate with the file list
	var files_select = document.getElementById("files")
	files_select.innerHTML = '';
	for (const value of fileList()){
		CreateUI("option", files_select, {
			html: value, value: value
		});
	}
	
	//Show dialoge
	openDialoge.style.display = "block"
}
function MenuFileOpen(notebook){
	//Opens a selected file
	
	var filename = document.getElementById("files").value
	var tab = notebook.add(filename)
	tab.lv = new ListView([], tab.content)
	tab.lv.addData(fileLoad(filename))
	notebook.selectTab(tab)
}
function MenuFileSave(notebook){
	//Saves current file
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	var tab = notebook.tabs[index]
	var filename = tab.title
	fileSave(filename, tab.lv.dump()) // Saves file
	alert("File Saved") // Tell user
}
function MenuFileSaveAs(notebook){
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	//Make a new file with data of current file
	MenuFileNew(notebook, notebook.tabs[index].lv.dump())
}
function MenuFileDownload(notebook){
	//DOwnloads the json save file onto the local PC
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	var tab = notebook.tabs[index]
	var filename = tab.title
	
	//Make an <a> and click on it
	var element = document.createElement('a');
	element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(JSON.stringify(tab.lv.dump())));
	element.setAttribute('download', filename+".json");
	element.click()
	element.remove()
}
function MenuFileUpload(notebook){
	document.getElementById("fileUpload").click();
}
function MenuFileUploadDone(notebook){
	//Calls when the upload <input type="file"> is changed
	
	var file_upload = document.getElementById("fileUpload")
	
	//Reader class
	const reader = new FileReader()
	reader.addEventListener('load', () => {
		//get data
		var json = JSON.parse(reader.result)
		
		//Get filename without ext
		var filename = file_upload.files[0].name.substring(0, file_upload.files[0].name.lastIndexOf("."));
		
		//Cant have 2 files with same name
		if (fileHas(filename)){
			if (confirm("This file ("+filename+") all ready exsits, press OK to rename, cancel to overide on next save")){
				MenuFileNew(notebook, json)
			}else{
				var tab = notebook.add(filename)
				tab.lv = new ListView([], tab.content)
				tab.lv.addData(json)
				notebook.selectTab(tab)
			}
		}else{
			var tab = notebook.add(filename)
			tab.lv = new ListView([], tab.content)
			tab.lv.addData(json)
			notebook.selectTab(tab)
			fileSave(filename, json)
		}
	})
	reader.readAsText(file_upload.files[0])
	
}
function MenuFileRemove(notebook){
	//Removes file from 'openDiaolge' window
	var filename = document.getElementById("files").value
	if (confirm("This file ("+filename+") will be delete forever")){
		fileDel(filename)
		MenuFileOnOpen()
	}
}

function MenuFileClose(notebook){
	//Close a file
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	if (!confirm("Close file?"))return; // confirmation
	
	var tab = notebook.tabs[index]
	var filename = tab.title
	var data = tab.lv.dump()
	
	//If its modified, ask to save
	if (JSON.stringify(data) != JSON.stringify(fileLoad(filename))){
		if (confirm("Save file?")){
			fileSave(filename, data)
		}
	}
	notebook.remove(tab)
}

//========================================== Header ==========================================//

function MenuHeaderAdd(notebook){
	//Adds a header to the ListView
	
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	//Ask for name and type
	var name = prompt("Name:")
	if (name){
		var type = prompt("Type:\n1: string\n2: number\n3: boolean")
		if (type){
			type = type.toLowerCase()
			if (type == "1" || type == "string"){
				notebook.tabs[index].lv.addHeadings([ListView.STRING(name)])
			}else if (type == "2" || type == "number"){
				notebook.tabs[index].lv.addHeadings([ListView.NUMBER(name)])
			}else if (type == "3" || type == "boolean"){
				notebook.tabs[index].lv.addHeadings([ListView.BOOLEAN(name)])
			}
		}
	}
}
function MenuHeaderRemove(notebook){
	//Removes header
	var tab_index = notebook.selected()
	if (tab_index === null){return alert("No File is seleted")}
	
	//Ask for index
	var name = prompt("Index:")
	if (!name)
		return
	
	//Validate index
	var index = parseInt(name)
	if (index == NaN){
		alert(name+" is not a number")
		return
	}
	notebook.tabs[tab_index].lv.remove(index)
}
function MenuHeaderSwap(notebook){
	//Swaps 2 header around
	
	var index = notebook.selected(), value;
	if (index === null){
		alert("No File is seleted")
		return
	}
	var lv = notebook.tabs[index].lv
	var i1=null, i2=null, name, header;
	
	//Ask for index 1
	name = prompt("Index of tab 1:")
	if (!name)
		return
	//Validate index
	i1 = parseInt(name)
	if (i1 == NaN){
		alert(name+" is not a number")
		return
	}
	//Ask for index 2
	name = prompt("Index of tab 2:")
	if (!name)
		return
	//Validate index
	i2 = parseInt(name)
	if (i2 == NaN){
		alert(name+" is not a number")
		return
	}
	
	//Call ListView's function
	lv.swapHeadings(i1, i2)
}
function MenuHeaderRename(notebook){
	var index = notebook.selected(), value;
	if (index === null){
		alert("No File is seleted")
		return
	}
	
	//Get index
	var tab_index_str = prompt("Tab index:")
	if (!tab_index_str) return;
	
	//Validate
	var tab_index = parseInt(tab_index_str)
	if (tab_index == NaN){
		alert(tab_index_str+" is not a number")
		return
	}
	
	//Ask for new name
	var new_name = prompt("New name:")
	if (!new_name) return;
	
	nb.tabs[index].lv.headings[tab_index_str][0].innerHTML = "&#9654;"+new_name //Changes the headers text
	nb.tabs[index].lv.headings[tab_index_str][2] = new_name //Changes the internal text
}

//========================================== Data ==========================================//


function MenuDataAddBlanks(notebook){
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	//Ask for the number of blanks
	var number_of_values = prompt("Number Of Blank Values:")
	
	if (number_of_values==null)return;
	
	//Validate
	if (number_of_values=="")number_of_values="1"
	var value = parseInt(number_of_values)
	if (value==NaN)
		return alert(number_of_values+" is not a number")
	
	//Find the defult values for the headers
	var values = []
	for (const header of notebook.tabs[index].lv.headings){
		if (header[1] == ListView.STRING)
			values.push("")
		else if (header[1] == ListView.NUMBER)
			values.push(0)
		else if (header[1] == ListView.BOOLEAN)
			values.push(false)
	}
	
	//Add them
	for (var i = 0; i < value; i++)
		notebook.tabs[index].lv.add(values)
	
}
function MenuDataAdd(notebook){
	var index = notebook.selected()
	if (index === null){return alert("No File is seleted")}
	
	//Varibles
	var headers = notebook.tabs[index].lv.headings
	var value, value2, values = [];
	
	var i=0, header; // Loop varibles
	while (i<headers.length){
		header = headers[i]
		
		//Ask for value for header
		value = prompt(header[2])
		if (value == null)return;
		
		//Validate value
		if (header[1] == ListView.STRING){
			values.push(value)
		}else if (header[1] == ListView.NUMBER){
			if (value=="")value="0"
			value2 = parseFloat(value)
			if (value == NaN){
				alert(value+" is not a number")
				continue
			}
			values.push(value2)
		}else if (header[1] == ListView.BOOLEAN){
			if (["y", "yes", "true", "t", "1", "correct", "on"].includes(value.toLowerCase()))
				values.push(true)
			else if (["n", "no", "false", "f", "0", "incorrect", "off", ""].includes(value.toLowerCase()))
				values.push(false)
			else{
				alert(value+" is not a boolean")
				continue
			}
		}
		i++;
	}
	notebook.tabs[index].lv.add(values) // Add them
}

function MenuDataRemove(notebook){
	var index = notebook.selected(), value;
	if (index === null){
		alert("No File is seleted")
		return
	}
	
	var lv = notebook.tabs[index].lv
	var value, name, header;
	
	//Ask for index
	name = prompt("Index of Row")
	if (!name)
		return
	//Validate
	value = parseInt(name)
	if (value == NaN){
		alert(name+" is not a number")
		return
	}
	
	lv.removeData(value)
}