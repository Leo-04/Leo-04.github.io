// ================================== Imports ==================================
/*
*
* This files handles loading audio files and metadata of those audio files
*
* 

uses from "logger.js"
    printf()

*/

// ================================== Functions ==================================

/*
* Load a array of audio files from disk
* It will attempt to load the metadata of the audio objects
* 
* Parameters:
*   files: Array[]
*       Array of file objects to load
* 
* Returns promise:
*   A array of loaded audio objects
*/
async function LoadFilesFromDisk(files){
    let array = [];
    for (var file of files) {
        let audio = await LoadFileFromDisk(file);
        array.push({
            audio: audio,

            title: file.name.slice(0, file.name.lastIndexOf(".")),
            track: 0,
            album: "",
            artist: "",

            image: "",
            image_format: "",

            file: file, // For loading metadata, not needed for application
        });
    }
    printf(`Total loaded: ${array.length}`);

    await Promise.all(array.map(async (object) => {
        // For each object, map metadata if there is any
        return await ReadMetaData(object);
    }));

    array.sort((a, b) => {
        // Sort by track number.
        return a.track - b.track;
    });

    return array;
}

/*
* Helper function to load a file.
*
* Parameters:
*   file: File Object
*       The file to load
* 
* Returns promise:
*   The loaded audio file
*   Otherwise an error
*/
const LoadFileFromDisk = (file) => new Promise((resolve, reject) => {
    const audio = new Audio(URL.createObjectURL(file));

    audio.addEventListener("loadedmetadata", () => {
        printf(`Loaded: ${file.name}, Duration: ${audio.duration}s`);
        resolve(audio);
    }, { once: true });

    audio.addEventListener("error", (e) => {
        printf(`Loaded: ${file.name}, Error: ${e.target.error}`);
        reject(e);
    }, { once: true });

    audio.load();
});

/*
* Reads the metadata of a object
*
* Reads the `.file` attribute of an object to read metadata
* If none is found, the object is unchanged
* Otherwise loads the metadata
* 
* Parameters:
*   object: Object
*       The object
* 
* Returns promise:
*   The object that was edited
*/
const ReadMetaData = (object) => new Promise((resolve) => {
    if (typeof jsmediatags === 'undefined'){
        resolve(object);
        return;
    }
    
    jsmediatags.read(object.file, {
        onSuccess: function(tag) {
            object.title = tag.tags.title || object.title;
            object.track = tag.tags.track || 0;
            object.artist = tag.tags.artist || "";
            object.album = tag.tags.album || "";
            let picture = tag.tags.picture || null;
            if (picture) {
                let data = "";
                for (var chr of picture.data){
                    data += String.fromCharCode(chr);
                }

                let base64 = btoa(data);
                let uri = `data:${picture.format};base64,${base64}`;
                object.uri = uri;
                object.image_format = picture.format;
                object.image = new Image();
                object.image.src = object.uri;
            } else {
                object.image = "";
            }
            resolve(object);
        },
        onError: function() {
            resolve(object);
        }
    });
});
