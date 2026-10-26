// ================================== Imports ==================================
/*
*
* Handels the navigator.mediaSession
*
*

uses from "logger.js"
    printf()

uses from "controls.js":
    GetCurrentAudio()
    GetCurrentTrack()
    PlayTrack()
    PauseTrack()
    StopTrack()
    NextTrack()
    PrevTrack()

uses from "seekbar.js":
    UpdateSeekbarTime()
*/

// ================================== Exports ==================================

var media_hooked = false;

// ================================== Functions ==================================

/*
* Updates the `mediaSession`s meta-data attribute.
*/
function UpdateMedia(){
    if (!("mediaSession" in navigator) || !media_hooked){
        printf("Cannot set Media");
        return;
    }
    try{
        let track = GetCurrentTrack();
        var data = (selected_id === null)? {}: {
            title: track.title,
            artist: track.artist,
            album: track.album,
            artwork: track.image? [
                {
                    src: track.uri,
                    sizes: track.image.width + "x" + track.image.height,
                    type: track.image_format,
                },
            ]: [],
        }

        navigator.mediaSession.metadata = new MediaMetadata(data);
    } catch (err){ printf(`Error: ${err}`); }
}

/*
* Attempts to hook the `mediaSession`
*/
async function HookMedia(){
    if (media_hooked) { return; }
    if (!("mediaSession" in navigator)){
        printf("navigator.mediaSession not available");
        return;
    }

    navigator.mediaSession.setActionHandler("play", PlayTrack);
    navigator.mediaSession.setActionHandler("pause", PauseTrack);
    navigator.mediaSession.setActionHandler("stop", StopTrack);
    navigator.mediaSession.setActionHandler("seekto", (details) => {
        let audio = GetCurrentAudio();
        if (audio === null) { return; }

        if (details.seekTime !== undefined) {
            audio.currentTime = details.seekTime;
        }
        
        UpdateSeekbarTime();
    });
    navigator.mediaSession.setActionHandler("previoustrack", PrevTrack);
    navigator.mediaSession.setActionHandler("nexttrack", NextTrack);

    // Fuck apple
    if (/iPhone|iPad|Mac/.test(navigator.userAgent)){
        // Re-purpose seek buttons for now
        navigator.mediaSession.setActionHandler("seekbackward", PrevTrack);
        navigator.mediaSession.setActionHandler("seekforward", NextTrack);
    } else {
        navigator.mediaSession.setActionHandler("seekbackward", () => {
            let audio = GetCurrentAudio();
            if (audio === null) { return; }
            audio.currentTime -= 5;
        });
        navigator.mediaSession.setActionHandler("seekforward", () => {
            let audio = GetCurrentAudio();
            if (audio === null) { return; }
            audio.currentTime += 5;
        });
    }

    media_hooked = true;
    printf("Hooked Media");
}

/*
* Update the media's seekbar
*/
function UpdateMediaPosition(){
    if (media_hooked){
        let audio = GetCurrentAudio();

        navigator.mediaSession.setPositionState({
            duration: (audio === null)? 0: audio.duration,
            playbackRate: (audio === null)? 0: audio.playbackRate,
            position: (audio === null)? 0: audio.currentTime
        });
    }
}