

//loads sprite and saves it to map
function loadSprite(key, imgFile) {

    let newSprite = new PIXI.Texture.from(imgFile)
    addSpriteToMap(key, newSprite)
}


//loads sprites from sprite sheet and stores in sprite map
//maps with key: <tileKey>_<tileNumber>
function loadSheet(pixiRef, sheetFile, tileW, tileH, numTiles, tileKey, callBack) {

    //load sheet file into cache 
    pixiRef.loader.add(tileKey, sheetFile)
    .load( () => {

        //get ref to sheet in cache
        let sheet = new PIXI.BaseTexture.from(pixiRef.loader.resources[tileKey].url)

        //create sprites from png file
        for(var i = 0; i < numTiles; i++) {

            //get texture from sheet
            let texture = new PIXI.Texture(sheet, new PIXI.Rectangle(i * tileW, 0, tileW, tileH))

            //create unique key for subsprite
            let key = tileKey + "_" + i

            addSpriteToMap(key, texture)
        }


        console.log("ImageLoader: Done adding sprites from - " + sheetFile)

        callBack()

    })

}