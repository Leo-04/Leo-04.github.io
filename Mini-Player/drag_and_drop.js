// ================================== Imports ==================================
/*
*
* This files handles Drag and drop stuff within the track list
*
*

uses from "index.html":
    tracks

uses from "controls.js":
    shuffled

uses from "track_list.js"
    audio_objects
*/

// ================================== Exports ==================================

const SCROLL_AREA = 50;
const SCROLL_SPEED = 10;
var dragged_item = null;
var scroll_stop = true;

// ================================== Functions ==================================

/*
* Helper function to scroll
*
* Prameters:
*   step: Number
*       The amount to scroll
*/
function do_scroll(step) {
    var scrollY = tracks.scrollTop;
    tracks.scrollTop = scrollY + step;
    if (!scroll_stop) {
        setTimeout(function () { do_scroll(step) }, 5);
    }
}

function drag_start(event){
    let dragged = event.target.closest(".drag");
    if (!dragged) return;

    dragged_item = dragged.parentElement;
    dragged_item.style.opacity = "0.5";

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", dragged_item.innerHTML);
}

function drag_move(y_cord){
    scroll_stop = true;
    if (y_cord < SCROLL_AREA) {
        do_scroll(-SCROLL_SPEED);
        scroll_stop = false;
    }
    if (y_cord > tracks.clientHeight - SCROLL_AREA) {
        do_scroll(SCROLL_SPEED);
        scroll_stop = false;
    }

    let dropped_element = getDragAfterElement(y_cord);
    if (dropped_element == null) {
        tracks.insertBefore(dragged_item, add_frame);
    } else {
        tracks.insertBefore(dragged_item, dropped_element);
    }
}

function drag_end(){
    if (dragged_item) {
        dragged_item.style.opacity = '1';
    }
    dragged_item = null;

    if (!shuffled){
        let new_order = Array.from(
            tracks.children
        ).filter(
            (child) => !isNaN(child.id)
        ).map(
            (child) => Number.parseInt(child.id)
        );

        let new_list = [];
        while (new_order.length){
            let index = new_order.shift();
            new_list.push(audio_objects[index]);
        }
        
        let new_selected = selected_id;
        for (var i = 0; i < audio_objects.length; i++){
            audio_objects[i] = new_list[i];
            if (tracks.children[i].id == selected_id){
                new_selected = i;
            }
            tracks.children[i].id = i;
        }
        selected_id = new_selected;
    }
}

tracks.addEventListener("dragstart", drag_start);
tracks.addEventListener("touchstart", drag_start);

tracks.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    drag_move(event.clientY);
});
tracks.addEventListener("touchmove", (event) => {
    event.preventDefault();
    drag_move(event.touches[0].clientY);
});

tracks.addEventListener("drop", (event) => {event.preventDefault();});

tracks.addEventListener("dragend", drag_end);
tracks.addEventListener('touchend', drag_end);

// Helper function to determine where item should be inserted
function getDragAfterElement(y) {
    return Array.from(
        tracks.querySelectorAll('.item')
    ).reduce((closest, child) => {
        let box = child.getBoundingClientRect();
        let offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}