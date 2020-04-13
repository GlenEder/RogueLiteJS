

//loads sprite and saves it to map
function loadSprite(key, imgFile) {

    let newSprite = new PIXI.Sprite.from(imgFile)
    addSpriteToMap(key, newSprite)
}

function loadSheet(pixiRef, sheetFile) {

    pixiRef.loader.add(sheetFile)
    .load( () => {
        console.log("ImageLoader: loaded sheet")
    })

}