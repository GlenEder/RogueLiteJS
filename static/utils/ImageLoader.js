

//loads sprite and saves it to map
function loadSprite(key, imgFile) {

    let newSprite = new PIXI.Sprite.from(imgFile)
    addSpriteToMap(key, newSprite)
}


//loads sprites from sprite sheet and stores in sprite map
//maps with key: <tileKey>_<tileNumber>
function loadSheet(pixiRef, sheetFile, tileW, tileH, numTiles, tileKey) {

    

}