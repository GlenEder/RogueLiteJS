


function loadImgs() {

    PIXI.loader
        .add([
            "sprites/GrassCoveredDirt.png"
        ])
        .load(doneLoading)

}

function doneLoading() {

    console.log("ImageLoader: finished loading sprites.")

}