

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

//returns PIXI sprite given the provied file link
function getSprite(imgFile) {

    return new PIXI.Sprite(PIXI.loader.resources[imgFile].texture)

}