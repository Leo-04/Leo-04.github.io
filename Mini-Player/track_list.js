// ================================== Imports ==================================
/*
*
* This files handles:
*   - loading event
*   - Adding tracks to `audio_objects`
*   - Removing tracks from `audio_objects`
*   - Updating track UI on adding and removing
*
* 

uses from "index.html":
    intro
    tracks

uses from "logger.js"
    printf()

uses from "controls.js"
    PlayNextTrack

uses from "seekber.js"
    UpdateSeekbarTime

uses from "media.js":
    HookMedia()
*/

// ================================== Exports ==================================

const ITEM = `
    <!--<div class="item">-->
        <div class="drag" draggable="true">
            <svg height="50px" width="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 10H19M14 19L12 21L10 19M14 5L12 3L10 5M5 14H19" stroke="var(--FG)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <img class="album-art" height="50px" width="50px" src="{{IMAGE}}" onclick="LoadTrack(this.parentElement.id);"></img>
        <div class="text" onclick="LoadTrack(this.parentElement.id);">
            {{TITLE}}
            <!--
            <div class="title">{{TITLE}}</div>
            <div class="album"><span style="margin-left: 10px;"></span>{{ALBUM}}</div>
            <div class="artist">{{ARTIST}}<span style="margin-left: 10px;"></span></div>
            -->
        </div>
        <div class="delete" onclick="RemoveTrack(this.parentElement.id);">
            <svg width="80%" height="80%" fill="#FF0000" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path></g></svg>
        </div>
    <!--</div>-->
`;

var audio_objects = [];

// ================================== Functions ==================================

/*
* Handle on load event
*/
async function LoadFiles(event) {
    HookMedia(event);
    intro.style.display = "none";

    let files = Array.from(event.target.files);
    if (files.length === 0) { return; }
    AddMusicObjectsToUI(await LoadFilesFromDisk(files));
    event.target.value = "";
}
/*
* Adds an array of music objects to the list
*
* Parameters:
*   array: Array[Object]
*       The array of music objects
*/
function AddMusicObjectsToUI(array){
    let start_item = document.querySelectorAll(".item").length;

    for (let i = 0; i < array.length; i++){
        audio_objects.push(array[i]);

        array[i].audio.addEventListener("ended", PlayNextTrack);
        array[i].audio.addEventListener("timeupdate", UpdateSeekbarTime);

        let item_id = start_item + i;
        var div = document.createElement('div');
        div.className = "item";
        div.id = item_id;
        div.innerHTML = ITEM.replace(
            "{{IMAGE}}", array[i].uri
        ).replace(
            "{{TITLE}}", array[i].title
        ).replace(
            "{{ALBUM}}", array[i].album
        ).replace(
            "{{ARTIST}}", array[i].artist
        );
        tracks.insertBefore(div, add_frame);
    }

    LoadTrack(start_item);
}

/*
* Removes a object based on it's index in `audio_objects`
*
* Parameters:
*   index: Integer
*       The object of the track
* 
* Returns:
*   True if the audio was paused
*   False otherwise
*/
function RemoveTrackFromUI(index){
    index = Number(index);

    // Tag the one we are removing
    let removed = document.getElementById(index);
    removed.id = "removed";

    // Re-order IDs
    for (var id_number = index + 1; id_number < audio_objects.length; id_number++){
        document.getElementById(id_number).id = (id_number - 1);
    }

    // Remove it
    removed.remove();

    // Remove object
    let object = audio_objects.splice(index, 1)[0];

    // Make sure to stop playing it
    let paused = object.audio.paused;
    object.audio.pause();

    return paused;
}