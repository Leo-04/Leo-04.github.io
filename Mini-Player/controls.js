// ================================== Imports ==================================
/*
*
* This files handles the controls of the audio
*
*

uses from "index.html":
    loop
    play_pause
    shuffle
    tracks

uses from "logger.js"
    printf()

uses from "seekbar.js"
    UpdateSeekbarTime()

uses from "track_list.js"
    audio_objects
    RemoveTrackFromUI()

uses from "media.js"
    media_hooked
    HookMedia()
    UpdateMedia()
*/

// ================================== Exports ==================================


const PLAY = `<svg height="100%" width="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 17.259V6.74104C7 5.96925 7.83721 5.48837 8.50387 5.87726L18.2596 11.5681C18.5904 11.761 18.5904 12.2389 18.2596 12.4319L8.50387 18.1227C7.83721 18.5116 7 18.0308 7 17.259Z" stroke="var(--FG)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
const PAUSE = `<svg height="100%" width="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 9V15M14 9V15M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="var(--FG)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
const LOOP_ALL = `<svg height="60%" width="60%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="var(--FG)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="var(--FG)" d="M464,210.511V264A112.127,112.127,0,0,1,352,376H78.627l44.686-44.687-22.626-22.626L56,353.373l-4.415,4.414L18.019,391.354,92.041,474.63l23.918-21.26L75.63,408H352c79.4,0,144-64.6,144-144V178.511Z" class="ci-primary"></path> <path fill="var(--FG)" d="M48,256A112.127,112.127,0,0,1,160,144H433.373l-44.686,44.687,22.626,22.626L456,166.627l4.117-4.116,33.864-33.865L419.959,45.37,396.041,66.63,436.37,112H160C80.6,112,16,176.6,16,256v85.787l32-32Z" class="ci-primary"></path> </g></svg>`;
const LOOP_ONE = `<svg height="60%" width="60%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="var(--FG)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fill="var(--ci-primary-color, var(--FG))" points="208 312 208 344 320 344 320 312 280 312 280 176 248 176 248 200 216 200 216 232 248 232 248 312 208 312" class="ci-primary"></polygon> <path fill="var(--ci-primary-color, var(--FG))" d="M464,210.511V264A112.127,112.127,0,0,1,352,376H78.627l44.686-44.687-22.626-22.626L56,353.373l-4.415,4.414L18.019,391.354,92.041,474.63l23.918-21.26L75.63,408H352c79.4,0,144-64.6,144-144V178.511Z" class="ci-primary"></path> <path fill="var(--ci-primary-color, var(--FG))" d="M48,256A112.127,112.127,0,0,1,160,144H433.373l-44.686,44.687,22.626,22.626L456,166.627l4.117-4.116,33.864-33.865L419.959,45.37,396.041,66.63,436.37,112H160C80.6,112,16,176.6,16,256v85.787l32-32Z" class="ci-primary"></path> </g></svg>`;
const LOOP_ONCE= `<svg height="60%" width="60%" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="var(--FG)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fill="var(--FG)" points="171.313 348.686 148.687 371.314 272 494.627 395.313 371.314 372.687 348.686 288 433.373 288 96 72 96 72 128 256 128 256 433.373 171.313 348.686" class="ci-primary"></polygon> </g></svg>`;
const SHUFFLE = `<svg height="60%" width="60%" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:var(--FG);} </style> <g> <path class="st0" d="M418.972,324.766c-2.839-2.106-6.642-2.359-9.748-0.637c-3.081,1.733-4.862,5.102-4.549,8.629l2.624,30.327 c-14.369-2.214-27.151-5.861-38.752-10.662c-19.448-8.088-35.958-19.484-51.219-33.685c-10.157-9.459-19.689-20.171-28.859-31.796 c-7.702-9.785-15.116-20.266-22.457-31.074c11.697-17.149,23.66-33.336,36.538-47.513c9.748-10.783,20.026-20.422,31.097-28.678 c12.66-9.424,26.356-17.065,42.026-22.697c9.652-3.454,20.122-6.114,31.627-7.871l-2.624,30.134 c-0.313,3.527,1.468,6.896,4.549,8.629c3.106,1.722,6.908,1.469,9.748-0.637l89.418-66.432c2.263-1.708,3.611-4.38,3.611-7.22 c0-2.841-1.348-5.512-3.611-7.209L418.972,39.93c-2.839-2.106-6.642-2.358-9.748-0.625c-3.081,1.72-4.862,5.102-4.549,8.617 l2.96,34.057c-23.42,2.624-44.841,8.112-64.216,16.116c-27.848,11.468-51.291,27.811-71.197,46.284 c-13.286,12.336-25.079,25.61-35.862,39.221c-3.322,4.212-6.523,8.449-9.676,12.697c-3.152-4.248-6.354-8.496-9.675-12.708 c-10.76-13.611-22.53-26.91-35.791-39.258c-19.881-18.508-43.326-34.876-71.149-46.369C82.269,86.421,50.304,79.922,14.152,79.946 H0v66.564h14.152c25.056,0.012,45.684,3.864,63.591,10.289c15.669,5.644,29.34,13.311,42.001,22.758 c11.048,8.256,21.301,17.907,31.074,28.703c12.852,14.201,24.766,30.399,36.465,47.561c-7.342,10.795-14.78,21.265-22.505,31.036 c-9.171,11.626-18.726,22.325-28.884,31.772c-15.283,14.177-31.794,25.549-51.266,33.624c-19.497,8.028-42.145,12.925-70.475,12.95 H0v66.551h14.152c31.964,0.024,60.679-5.042,86.12-14.225c22.288-7.992,41.977-19.111,59.306-32.06 c15.164-11.324,28.546-24.046,40.604-37.392c9.532-10.566,18.245-21.529,26.429-32.589c8.16,11.071,16.848,22.048,26.38,32.614 c12.058,13.37,25.417,26.102,40.581,37.451c17.304,12.974,36.97,24.106,59.234,32.133c16.849,6.089,35.117,10.337,54.806,12.552 l-2.937,33.841c-0.313,3.515,1.468,6.896,4.549,8.617c3.106,1.734,6.908,1.48,9.748-0.626l89.418-66.443 c2.263-1.697,3.611-4.367,3.611-7.208c0-2.84-1.348-5.524-3.611-7.222L418.972,324.766z"></path> </g> </g></svg>`;
const ORDERED = `<svg height="50%" width="50%" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:var(--FG);} </style> <g> <path class="st0" d="M40.252,14.489C18.019,14.489,0,32.507,0,54.741c0,22.233,18.019,40.252,40.252,40.252 c22.225,0,40.252-18.019,40.252-40.252C80.504,32.507,62.477,14.489,40.252,14.489z"></path> <rect x="148.122" y="14.489" class="st0" width="363.878" height="80.504"></rect> <path class="st0" d="M40.252,215.748C18.019,215.748,0,233.767,0,256c0,22.233,18.019,40.252,40.252,40.252 c22.225,0,40.252-18.019,40.252-40.252C80.504,233.767,62.477,215.748,40.252,215.748z"></path> <rect x="148.122" y="215.748" class="st0" width="363.878" height="80.504"></rect> <path class="st0" d="M40.252,417.007C18.019,417.007,0,435.026,0,457.259c0,22.232,18.019,40.252,40.252,40.252 c22.225,0,40.252-18.019,40.252-40.252C80.504,435.026,62.477,417.007,40.252,417.007z"></path> <rect x="148.122" y="417.007" class="st0" width="363.878" height="80.504"></rect> </g> </g></svg>`;

var selected_id = null;
var shuffled = false;
var loop_type = LOOP_ALL; // replace with `loop.innerHTML`?

loop.innerHTML = LOOP_ALL;
play_pause.innerHTML = PLAY;
shuffle.innerHTML = SHUFFLE;


// ================================== Functions ==================================

/*
* Gets the current audio track from `audio_objects`
*
* Returns:
*   The current audio track
*   null Otherwise
*/
function GetCurrentTrack(){
    if (selected_id === null) return null;
    return audio_objects[selected_id];
}

/*
* Gets the current audio track object from `audio_objects`
*
* Returns:
*   The current audio track
*   null Otherwise
*/
function GetCurrentAudio(){
    if (selected_id === null) return null;
    return audio_objects[selected_id].audio;
}

/*
* Loads a track by index
*
* Parameters:
*   track_id: Integer
*       The track index to load
*/
function LoadTrack(track_id){
    if (selected_id !== null){
        StopTrack();
    }

    selected_id = track_id;
    if (selected_id !== null){
        PlayTrack();

        document.getElementById(selected_id).classList.add('selected');
    }
    UpdateMedia();
    UpdateSeekbarTime();
}

/*
* Plays the current track
*/
function PlayTrack(){
    var audio = GetCurrentAudio();
    if (audio === null) return;

    audio.play();
    play_pause.innerHTML = PAUSE;

    if (media_hooked) navigator.mediaSession.playbackState = 'playing';
}

/*
* Pauses the current track
*/
function PauseTrack(){
    var audio = GetCurrentAudio();
    if (audio === null) return;
    
    play_pause.innerHTML = PLAY;
    audio.pause();

    if (media_hooked) navigator.mediaSession.playbackState = 'paused';
}

/*
* Shuffles the track list
*/
function Shuffle(){
    shuffled = !shuffled;

    shuffle.innerHTML = shuffled? ORDERED: SHUFFLE;
    
    if (shuffled){
        for (var i = audio_objects.length; i >= 0; i--) {
            child = tracks.children[Math.random() * i | 0];
            tracks.insertBefore(child, add_frame);
        }

        if (selected_id !== null){
            let currently_playing = document.getElementById(selected_id);
            tracks.insertBefore(currently_playing, tracks.children[0]);
        }
    } else {
        for (var i = 0; i < audio_objects.length; i++) {
            child = document.getElementById(i);
            tracks.insertBefore(child, add_frame);
        }
    }
}

/*
* Goes back a track
*/
function PrevTrack(){
    let audio = GetCurrentAudio();
    if (audio === null) return;
    
    if (audio.currentTime >= 4){
        audio.currentTime = 0;
        return;
    }

    let track_order = Array.from(
        tracks.children
    ).filter(
        (child) => !isNaN(child.id)
    ).map(
        (child) => Number.parseInt(child.id)
    );
    
    let prev_index = track_order.indexOf(Number(selected_id)) - 1;

    if (prev_index < 0){
        prev_index = track_order.length - 1;
    }

    LoadTrack(track_order[prev_index]);
}

/*
* Call back for play and pause
*/
async function PlayPause(){
    await HookMedia();
    UpdateMedia();

    var audio = GetCurrentAudio();
    if (audio !== null && audio.paused) PlayTrack();
    else PauseTrack();
}

/*
* Call back for when audio ends
*/
function PlayNextTrack(){
    if (selected_id === null) return;

    let track_order = Array.from(
        tracks.children
    ).filter(
        (child) => !isNaN(child.id)
    ).map(
        (child) => Number.parseInt(child.id)
    );
    let next_index = track_order.indexOf(selected_id) + 1;

    if (loop_type == LOOP_ONE) next_index -= 1;
    else if (next_index >= track_order.length){
        if (loop_type === LOOP_ONCE){
            next_index = 0;
            LoadTrack(track_order[next_index]);
            PauseTrack();
            return;
        }
        
        next_index = 0;
    }

    LoadTrack(track_order[next_index]);
}

/*
* Goes to the next track
*/
function NextTrack(){
    if (selected_id === null) return;

    let track_order = Array.from(
        tracks.children
    ).filter(
        (child) => !isNaN(child.id)
    ).map(
        (child) => Number.parseInt(child.id)
    );
    let next_index = track_order.indexOf(Number(selected_id)) + 1;

    if (next_index >= track_order.length){
        next_index = 0;
    }
    
    LoadTrack(track_order[next_index]);
}

/*
* Changes loop type
*/
function LoopTrack(){
    loop_type = {
        [LOOP_ALL]: LOOP_ONE,
        [LOOP_ONE]: LOOP_ONCE,
        [LOOP_ONCE]: LOOP_ALL,
    }[loop_type]
    loop.innerHTML = loop_type;
}

/*
* Stops the current track
*/
function StopTrack(){
    var audio = GetCurrentAudio();
    if (audio === null) return;

    PauseTrack();
    audio.currentTime = 0;
    UpdateSeekbarTime();

    document.getElementById(selected_id).classList.remove('selected');
}

/*
* Removes a track by index
*
* Parameters:
*   index: Integer
*       The track index to be removed
*/
function RemoveTrack(index){
    index = Number(index);

    let paused = RemoveTrackFromUI(index);

    if (selected_id == index && audio_objects.length){
        LoadTrack(selected_id);
        if (paused){
            PauseTrack();
        }
    } else if (selected_id > index){
        selected_id -= 1;
    } else if (audio_objects.length == 0){
        selected_id = null;
    }

    UpdateMedia();
}