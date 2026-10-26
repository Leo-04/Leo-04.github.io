// ================================== Imports ==================================
/*
*
* Handels all seekbar functonailty
*
* 

uses from "index.html":
    seeker
    current_time
    duration

uses from "controls.js":
    GetCurrentAudio()

uses from "media.js":
    UpdateMediaPosition() 
*/

// ================================== Functions ==================================

/*
* Formats time in seconds
*
* Parameters:
*   seconds: Number
*       The time in seconds
* 
* Returns:
*   A time formated in "HH:MM:SS"
*/
function FTime(seconds){
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = Math.trunc(seconds - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return hours+':'+minutes+':'+seconds;
}

/*
* Updates the seekbar's time.
*
* Updates the seekbar's value
*  and the current time to selected track's time
* 
* If no track is selected time is set to 0
*/
function UpdateSeekbarTime(){
    let t, d;
    
    let audio = GetCurrentAudio();

    if (audio === null){
        t = 0;
        d = 0;
    } else {
        t = audio.currentTime;
        d = audio.duration
    }
    let percentage = t / d;

    seeker.value = seeker.max * percentage;
    current_time.innerHTML = FTime(t);
    duration.innerHTML = FTime(d);
    seeker.style.setProperty('--range-percentage', percentage*100 + '%');

    UpdateMediaPosition();
}

/*
* Seeks the seekbar to a given percentage of the track
*
* Parameters:
*   percentage: Number[0..1]
*       The percentage to go to
*/
function SeekTo(percentage){
    let audio = GetCurrentAudio();
    if (audio == null) return;

    let time = percentage * audio.duration;
    audio.currentTime = time;

    UpdateSeekbarTime();
}