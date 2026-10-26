// ================================== Imports ==================================
/*
*
* This files handles creating a data url from the source
*
*

uses from "index.html":
    data_url
    message
*/

// ================================== Exports ==================================

var inital_url = null;

// ================================== Functions ==================================

window.addEventListener("load", async () => {
    if (IsDataUrl()){
        data_url.innerHTML = "Click here to go back to the online version";
        data_url.href = inital_url;

        message.innerHTML += "Save this page in bookmarks to access it offline.";
    } else {
        data_url.href = await CreateDataURL();
        data_url.innerHTML = "Copy this URL for it (clicking will not work)";

        message.innerHTML += "Offline URL generated."
    }
});

/*
* Checks if this is a data url
*
* Returns:
*   True if it is a data url
*   False otherwise
*/
function IsDataUrl(){
    return window.location.href.startsWith("data:");
}

/*
* Loads all scripts and stylesheets locally
* Also creates a script with a `inital_url` varible set
*/
async function MakeWebsiteStatic(){
    for (var link of document.querySelectorAll("link")){
        if (!link.href || !link.rel || link.rel != "stylesheet"){ continue; }
        
        var style = document.createElement("style");

        let code = await (await fetch(link.href)).text();
        style.innerHTML = code;

        link.parentElement.insertBefore(style, link);
        link.remove();
    }

    for (var script of document.querySelectorAll("script")){
        if (!script.src){ continue; }

        let code = await (await fetch(script.src)).text();
        script.innerHTML = code;
        script.removeAttribute("src");
    }
    
    var script = document.createElement("script");
    script.innerHTML = `inital_url = "${window.location.href}";`

    document.body.appendChild(script);
}

/*
* Makes the website static then creates a data URL
*/
async function CreateDataURL(){
    await MakeWebsiteStatic();

    return `data:text/html;base64,${btoa(document.documentElement.outerHTML)}`;
}