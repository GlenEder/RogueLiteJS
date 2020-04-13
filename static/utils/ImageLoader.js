

//Loads images linked in add section to PIXI texture array
function loadImgs() {

    PIXI.loader
        .add([
            "sprites/GrassCoveredDirt.png"
        ])
        .load(doneLoading)

}

//Called when loadImgs has finsihed making textures
function doneLoading() {

    console.log("ImageLoader: finished loading sprites.")

}