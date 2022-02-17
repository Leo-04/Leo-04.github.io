class ListView{
	/*
	This class is an editable TreeView without the tree part
	It has headings which can be expanded, renamed, added and removed
	Its data can either be text (string), number (float) or booleans
	It can be sorted using 'asc', 'sort_values' and 'sort_by'
	*/
	
	//Types
	static BOOLEAN(s){
		return [s, ListView.BOOLEAN]
	}
	static NUMBER(s){
		return [s, ListView.NUMBER]
	}
	static STRING(s){
		return [s, ListView.STRING]
	}
	
    constructor(headers, root, Class = "ListView"){
		this.table = CreateUI("table", root, {Class: Class+"Table"})
		
		//Items
        this.items = []
        this.Class = Class
        
		//Sorting
		this.sort_values = null
		this.sort_by=0
		this.asc=true
		
		//Table headings
		this.headings = []
        this.UI_headings = CreateUI("tr", this.table, {width: "100%", Class: Class+"TableRow"})
		
		this.addHeadings(headers)
    }
	addHeadings(headers){
		var i = this.headings.length;
        for (const [item_text, type] of headers){
			//Create HTML nodes
			let td = CreateUI("td", this.UI_headings, {Class: this.Class+"Header"})
            let item = CreateUI("div", td, {Class: this.Class+"HeaderResizer"});
            item.innerHTML = "&#9654;"+item_text
			
			//Click callback
			item.onclick = ((fn, index) => {
				return ()=>{return fn(index);}
			})(this.onHeadingClicked.bind(this), i)
			
			//Add heading
            this.headings.push([item, type, item_text, td])
			
			//Add items if heading was just added
			//Otherwise old values would not have
			//A value for new headings
			for (const item of this.items){
				if (type==ListView.STRING){
					item[1].push(ListViewItem("", item[0], this.Class))
				}else if (type==ListView.NUMBER){
					item[1].push(ListViewItem(0, item[0], this.Class))
				}else{
					item[1].push(ListViewItem(false, item[0], this.Class))
				}
			}
			i++;
        }
	}
	swapHeadings(i1, i2){
		//Validate indexs
		if (i1<0){
			i1 = this.headings.length+i1
		}
		if (i2<0){
			i1 = this.headings.length+i1
		}
		if (i1>=this.headings.length||i2>=this.headings.length||i1<0||i2<0){
			throw "Out of bounds"
		}
		
		//Swap headings
		[this.headings[i1], this.headings[i2]] = [this.headings[i2], this.headings[i1]]
		
		//Swap click callback
		this.headings[i1][0].onclick = ((fn, index) => {
			return ()=>{return fn(index);}
		})(this.onHeadingClicked.bind(this), i1)
		this.headings[i2][0].onclick = ((fn, index) => {
			return ()=>{return fn(index);}
		})(this.onHeadingClicked.bind(this), i2)
		
		//Swap items
		for (var i = 0; i < this.items.length; i++){
			[this.items[i][1][i1], this.items[i][1][i2]] = [this.items[i][1][i2], this.items[i][1][i1]]
		}
		
		//Reorder headings
		for (const item of this.headings) {
		  this.UI_headings.appendChild(item[3]);
		}
		
		//Reorder values
		for (const item of this.items) {
			for (const value of item[1]) {
				item[0].appendChild(value.node);
			}
		}
	}
	
	sort(){
		//Validate index
		if (this.sort_by<0){
			this.sort_by = this.headings.length+this.sort_by
		}
		if (this.sort_by>=this.headings.length||this.sort_by<0){
			throw "Out of bounds"
		}
		//var type = this.headings[this.sort_by][1]
		
		//Sort items
		this.items = this.items.sort((v1, v2)=>{
			if (this.asc){
				return v2[1][this.sort_by].compare(v1[1][this.sort_by])
			} else {
				return v1[1][this.sort_by].compare(v2[1][this.sort_by])
			}
		})
		
		//Remove old items
		for (const item of this.items){
			try{this.table.removeChild(item[0])}catch{}
		}
		//Add new items
		for (const item of this.items){
			if (this.sort_values)
				for (var i = 0; i < this.sort_values.length; i++){
					//Make sure they match 'sort_values'
					var ctn=true;
					if (this.sort_values[i]){
						
						var j, value=item[1][i].value;
						if (this.sort_values[i].length==0){
							ctn = false;
						}else
							for (j = 0; j < this.sort_values[i].length; j++) {
								if (this.sort_values[i][j] === value) {
									ctn=false;
									break;
								}
							}
						if (ctn) break;
					}
				}
				if (ctn) continue;
					
			this.table.appendChild(item[0])
		}
	}
	add(values){
		//Create HTML node
		var root = CreateUI("tr", this.table, {width: "100%", Class: this.Class+"TableRow"})
		var items = []
		for (const value of values){
			items.push(ListViewItem(value, root, this.Class)) //Create values
		}
		this.items.push([root, items])
	}
	remove(index){
		//Removes a header
		for (var item of this.items){
			item[1][index].remove()
			item[1].splice(index, 1)
		}
		this.headings[index][0].remove()
		this.headings[index][3].remove()
	}
	removeData(index){
		//Removes data
		for (var item of this.items[index][1]){
			item.remove()
		}
		this.items[index][0].remove()
		this.items.splice(index, 1)
	}
	
	getAllVariants(){
		//Get all vairents of header's values
		var li=[]//return list
		
		for (var i = 0; i < this.headings.length; i++){
			var items = []
			if (this.headings[i][1] == ListView.BOOLEAN){
				items = [true, false]//booleans allways only have true / false
			} else {
				for (const value of this.items){
					items.push(value[1][i].value)
				}
			}
			li.push([this.headings[i][2], items])//push headings text and their values
		}
		return li;
	}
	
	onHeadingClicked(index){
		//Call back
		
		//Replaces all dropdown arrows with left faceing arrows
		//Except for the one we click on
		for (let i = 0; i < this.headings.length; i++){
			if (i != index)
				this.headings[i][0].innerHTML = this.headings[i][0].innerHTML.replaceAt(0, String.fromCharCode(9654))
		}
		//Get state of heading
		let chr = this.headings[index][0].innerHTML.charCodeAt(0)
		
		//CHange state
		if (chr == 9654){ //left
			this.headings[index][0].innerHTML = this.headings[index][0].innerHTML.replaceAt(0, String.fromCharCode(9660))
		} else if (chr == 9650){ //up
			this.headings[index][0].innerHTML = this.headings[index][0].innerHTML.replaceAt(0, String.fromCharCode(9660))
		} else if (chr == 9660){ //down
			this.headings[index][0].innerHTML = this.headings[index][0].innerHTML.replaceAt(0, String.fromCharCode(9650))
		}
		
		//Get new State
		chr = this.headings[index][0].innerHTML.charCodeAt(0)
		
		//Sort values
		this.asc = (chr != 9650)
		this.sort_by = index
		this.sort()
	}
	
	dump(){
		//Dumps content of values and headers
		var dump = [[], []]
		var type = ""
		
		//Get headers
		for (const header of this.headings){
			if (header[1]==ListView.STRING)
				type = "string";
			else if (header[1]==ListView.NUMBER)
				type = "number";
			else if (header[1]==ListView.BOOLEAN)
				type = "boolean";
			
			dump[0].push({type: type, name: header[2]})
		}
		
		//Get Data
		for (const item of this.items){
			var items = []
			for (const value of item[1])
				items.push(value.value)
			dump[1].push(items)
		}
		return dump
	}
	addData(dump){
		//Opposite of dump
		var type;
		for (const headers of dump[0]){
			if (headers.type=="string")
				type = ListView.STRING;
			else if (headers.type=="number")
				type = ListView.NUMBER;
			else if (headers.type=="boolean")
				type = ListView.BOOLEAN;
			this.addHeadings([[headers.name, type]])
		}
		for (const item of dump[1])
			this.add(item)
	}
}

/*
* the ...Item classes cannot be subclassed
* because all but one function do diffrent
* things, therefore it makes more sense
* just to make them seprate classes
*/


class BooleanItem{
	constructor(root, Class = "ListView"){
		this.node = CreateUI("td", root, {Class: Class+"Item"})
		this.checkbox = CreateUI("input", this.node, {Class: Class+"Boolean"})
		this.checkbox.type = "checkbox"
	}

    get checked(){
        return this.checkbox.checked
    }

    set checked(value){
        this.checkbox.checked = value
    }
    get value(){
        return this.checked
    }
	compare(value){
		return this.checked - value.checked
	}
	remove(){
		this.checkbox.remove()
		this.node.remove()
	}
}
class StringItem{
	constructor(root, Class = "ListView"){
		this.node = CreateUI("td", root, {Class: Class+"Item"})
		this.inputbox = CreateUI("input", this.node, {Class: Class+"String"})
		this.inputbox.type = "text"
	}

    get text(){
        return this.inputbox.value
    }

    set text(value){
        this.inputbox.value = value
    }

    get value(){
        return this.text
    }
	compare(value){
		if(this.text < value.text) { return -1; }
		if(this.text > value.text) { return 1; }
		return 0;
	}
	remove(){
		this.inputbox.remove()
		this.node.remove()
	}
}
class NumberItem{
	constructor(root, Class = "ListView"){
		this.node = CreateUI("td", root, {Class: Class+"Item"})
		this.inputbox = CreateUI("input", this.node, {Class: Class+"Number"})
		this.inputbox.type = "number"
	}

    get value(){
        return parseFloat(this.inputbox.value)
    }

    set value(value){
        this.inputbox.value = value.toString()
    }
	compare(value){
		return this.value - value.value
	}
	remove(){
		this.inputbox.remove()
		this.node.remove()
	}
}

//Create a item from a JS value
function ListViewItem(value, root, Class){
	var item = null;
	if (typeof value == "string"){
		item = new StringItem(root, Class)
		item.text = value
	} else if (typeof value == "number"){
		item = new NumberItem(root, Class)
		item.value = value
	} else {
		item = new BooleanItem(root, Class)
		item.checked = value
	}
	return item
}