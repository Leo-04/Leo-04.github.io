// ================================== Imports ==================================
/*
*
* Basic logging function
*
*

uses from "index.html":
    logger

*/

// ================================== Functions ==================================

function printf(str){
    console.log(str);
    var node = document.createElement("div");
    node.appendChild(document.createTextNode(str));
    logger.appendChild(node);
}