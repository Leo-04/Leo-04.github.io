//Make default value 
if (localStorage.getItem('checklist_saves')==null){
	localStorage.setItem('checklist_saves', "{}")
}

//Self explanatory functions

function fileLoad(filename){
	var json = JSON.parse(localStorage.getItem('checklist_saves'))
	return json[filename]
}
function fileSave(filename, data){
	var json = JSON.parse(localStorage.getItem('checklist_saves'))
	json[filename] = data
	localStorage.setItem('checklist_saves', JSON.stringify(json))
}
function fileDel(filename){
	var json = JSON.parse(localStorage.getItem('checklist_saves'))
	delete json[filename]
	localStorage.setItem('checklist_saves', JSON.stringify(json))
}
function fileHas(name){
	var json = JSON.parse(localStorage.getItem('checklist_saves'))
	return name in json
}
function fileList(name){
	var json = JSON.parse(localStorage.getItem('checklist_saves'))
	return Object.keys(json)
}