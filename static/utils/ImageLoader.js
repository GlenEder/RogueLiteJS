

//loads sprite and saves it to map
function loadSprite(key, imgFile) {

    let newSprite = new PIXI.Texture.from(imgFile)
    addSpriteToMap(key, newSprite)
}


//loads sprites from sprite sheet and stores in sprite map
//maps with key: <tileKey>_<tileNumber>
function loadSheet(pixiRef, sheetFile, tileW, tileH, numTilesPerRow, numRows, tileKey, callBack) {

    //load sheet file into cache 
    pixiRef.loader.add(tileKey, sheetFile)
    .load( () => {

        //get ref to sheet in cache
        let sheet = new PIXI.BaseTexture.from(pixiRef.loader.resources[tileKey].url)

        //number for key in map
        let tileNumber = 0

        //create sprites from png file
        for(var j = 0; j < numRows; j++) {
            for(var i = 0; i < numTilesPerRow; i++) {

                //get texture from sheet
                let texture = new PIXI.Texture(sheet, new PIXI.Rectangle(i * tileW, j * tileH, tileW, tileH))
    
                //create unique key for subsprite
                let key = tileKey + "_" + tileNumber
                
                //create new key
                tileNumber++

                addSpriteToMap(key, texture)
            }
        }
        


        console.log("ImageLoader: Done adding sprites from - " + sheetFile)

        callBack()

    })

}