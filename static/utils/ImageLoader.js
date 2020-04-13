

//loads sprite and saves it to map
function loadSprite(key, imgFile) {

    let newSprite = new PIXI.Sprite.from(imgFile)
    addSpriteToMap(key, newSprite)
}