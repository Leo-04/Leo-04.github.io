class Tab{
	/*
	* Basic Class to store a Tab for a notebook
	* 	contains a tab & a content pannel
	*/
    constructor(tab_content, content, onTabClicked, title, class_button, class_content){
        this.click = onTabClicked
		
		//Button Creation
        this.button = CreateUI("button", tab_content, {
			Class: class_button,
			onclick: this.onTabClick.bind(this)
		});
		
        this.button.innerHTML = title
        
		//Content Pannel Creation
        this.content = CreateUI("div", content, {
			display: "none",
			Class: class_content
		});
    }
	
	//Getter and Setter for title
	set title(title){
		this.button.innerHTML = title
	}
	get title(){
		return this.button.innerHTML
	}
	
	//Event Callback
    onTabClick(){
        this.click(this)
    }
}

class NoteBook{
	/*
	* Notebook of Tabs
	* 	pass 2 IDs of 'div' so it can insert Tabs onto them
	*/
    constructor(id_tabs, id_content, class_button = "NoteBookButton", class_content = "NoteBookContents"){
        this.tab_content = document.getElementById(id_tabs)
        this.content = document.getElementById(id_content)
		
        this.class_button = class_button
        this.class_content = class_content
        this.tabs = []
        
        this.selectTab = this.selectTab.bind(this)
    }
	
	//Adds tab and return it
    add(title){
        let tab = new Tab(this.tab_content, this.content, this.selectTab, title, this.class_button, this.class_content)
        this.tabs.push(tab)
        return tab
    }
	
	//Remove tab and return it
    remove(tab){
		var index = this.tabs.indexOf(tab)
		var tab = this.tabs[index]
        this.tabs.splice(index, 1);
		
		tab.button.remove()
		tab.content.remove()
		
		return tab
    }
    
	//Event callback
    selectTab(seleted_tab){
        
		//Reset CSS classes
        for (const tab of this.tabs){
            tab.content.style.display = "none"
			if (tab.button.classList.contains(this.class_button+"Selected"))
				tab.button.classList.remove(this.class_button+"Selected");
			if (!tab.button.classList.contains(this.class_button))
				tab.button.classList.add(this.class_button);
        }
		//Show tabs content
        seleted_tab.content.style.display = "block";
		
		//Change tabs button CSS
		if (seleted_tab.button.classList.contains(this.class_button))
			seleted_tab.button.classList.remove(this.class_button);
		if (!seleted_tab.button.classList.contains(this.class_button+"Selected"))
			seleted_tab.button.classList.add(this.class_button+"Selected");
    }
	select(index){
		this.selectTab(this.tabs[index])
	}
	selected(){
		for (var i=0;i<this.tabs.length;i++)
			if (this.tabs[i].content.style.display == "block")
				return i;
		return null;
				
	}
	
	//Return content pannel
	getPannel(index){
		return this.tabs[index].content
	}
}