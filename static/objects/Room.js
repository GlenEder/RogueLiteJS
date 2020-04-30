class Room {

    /*
        walkables -- ref to walkables map for levelmap
        startpos  -- vector for starting location of room generation algorithm 
        width -- width of room 
        height -- height of room 
        tileset -- tileset for room to use
        scaling -- scaling of tiles 
    */ 
    constructor(walkables, startpos, width, height, tileset, scaling) {
        this.walkableRef = walkables
        this.startingPos = startpos
        this.width = width
        this.height = height
        this.tileset = tileset
        this.scale = scaling

        //TODO: make this a param to make more fancy rooms in future
        this.numWalkable = width * height
    }


    //creates a random layout for the walkable map
    generateRoom() {

        //console.log("Room: Generating room")

        //create starting key
        let key = this.startingPos.x + "/" + this.startingPos.y

        //create maps to store locations
        let selectedTiles = new Map()
        let availTiles = new Map()
        selectedTiles.clear()
        availTiles.clear()

        //add first avail tile to map
        availTiles.set(key, first)

        for(var i = 0; i < this.numWalkable; i++) {
            //get random from avail list
            let toSetKey = this.getRandomKey(availTiles)
            let toSet = availTiles.get(toSetKey)

            if(this.walkableRef.has(toSetKey)) {
                console.log("Room(ERROR): Selected Tile Already in Level")
            }

            //add to secleted list
            selectedTiles.set(toSetKey, toSet)

            //create tile and add to walkable map
            let tile = new Tile(toSet.x, toSet.y, FLOOR, this.scale)
            tile.setSprite(this.tileset + "_" + FLOOR)
            this.walkableRef.set(toSetKey, tile)

            //get surrounding tiles that have yet to be visited 
            this.getAvailTilesAround(toSetKey, selectedTiles, availTiles)    
        }
        
        this.generateBorders()
        console.log("Room: Room generated.")
        //this.setTileSprites()
    }

    //creates border for walkable map 
    generateBorders() {

        this.walkableMap.forEach(item => {
            for(var i = -1; i < 2; i++) {
                for(var j = -1; j < 2; j++) {
                    if(i === 0 && j === 0) continue
                    let deltX = item.x + i
                    let deltY = item.y + j
                    //create key              
                    let key = deltX + "/" + deltY

                    //avoid double calculations and checking walkable tiles
                    if(this.borderMap.has(key) || this.walkableMap.has(key)) continue

                    //get tiles around 
                    let tilesAround = this.walkablesAround(new Vec2d(deltX, deltY))

                    //create tile and add to map
                    let tile = new Tile(deltX, deltY, false, this.scale)
                    this.setBorderSprite(tile, tilesAround)
                    this.borderMap.set(key, tile)

                }
            }
        })

    }

    //Sets provided tiles sprite given the tiles around
    setBorderSprite(tile, tilesAround) {
        //Bottom right corner
        if(tilesAround[0] && !tilesAround[1] && !tilesAround[3]) {
                tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 2)
        }
        //Bottom left corner
        else if(tilesAround[2] && !tilesAround[1] && !tilesAround[4]) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 3)
        }
        //Top right corner
        else if(tilesAround[5] && !tilesAround[3] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 1)
        }
        //Top left corner 
        else if(tilesAround[7] && !tilesAround[4] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 0)
        }

        //Walls
        else if(tilesAround[4] && !tilesAround[1] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 3)
        }
        else if(tilesAround[3] && !tilesAround[1] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 1)
        }
        else if(tilesAround[1] && !tilesAround[3] && !tilesAround[4]) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 2)
        }
        else if(tilesAround[6] && !tilesAround[3] && !tilesAround[4]) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 0)
        }

        //Bends
        else if(tilesAround[1] && tilesAround[4]) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 3)
        }
        else if(tilesAround[3] && tilesAround[1]) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 2)
        }
        else if(tilesAround[6] && tilesAround[3]) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 1)
        }
        else if(tilesAround[6] && tilesAround[4]) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 0)
        }
    }


    // returns random key from map
    getRandomKey(collection) {
        let keys = Array.from(collection.keys())
        return keys[Math.floor(Math.random() * keys.length)]
    }

    //adds tiles that are not yet in selectedMap to avail map around tileKey
    getAvailTilesAround(tileKey, selectedMap, availMap) {

        //get cords of provied tile 
        let tile = availMap.get(tileKey)
        let x = tile.x
        let y = tile.y

        //remove from list now that we have needed data 
        availMap.delete(tileKey)

        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {

                if(Math.abs(i) === Math.abs(j)) continue
            
                let deltX = x + i
                let deltY = y + j

                //create key              
                let key = deltX + "/" + deltY

                //check that maps dont already have this spot
                if(!availMap.has(key) && !selectedMap.has(key)) {
                    availMap.set(key, new Vec2d(deltX, deltY))
                }
            }
        }
    }

    //checks if adding tile at pos will creat tunel that doesnt work for tileset
    canSelectTile(pos, selectedMap, availMap) {

        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {

                if(Math.abs(i) === Math.abs(j)) continue
            
                let deltX = pos.x + i
                let deltY = pos.y + j
                let deltX2 = pos.x + (i * 2)
                let deltY2 = pos.y + (j * 2)
                //create key              
                let key = deltX + "/" + deltY
                let key2 = deltX2 + "/" + deltY2

                if(selectedMap.has(key2) && availMap.has(key)) {
                    return false
                }
            }
        }

        //check for weird diag pinch thing
        let tilesAround = this.walkablesAroundBitwise(pos)
        let isCorner = this.isInCorner(tilesAround)

        if(this.inCubbieHole(tilesAround) || isCorner) {

            //check diags for selected tiles 
            for(var i = -1; i < 2; i++) {
                for(var j = -1; j < 2; j++) {

                    if(Math.abs(i) !== Math.abs(j)) continue
            
                    let deltX2 = pos.x + (i * 2)
                    let deltY2 = pos.y + (j * 2)
                    //create key              
                    let key2 = deltX2 + "/" + deltY2

                    if(selectedMap.has(key2)) {
                        return false
                    }

                    //handle corner bug
                    if(isCorner) {
                        let textX = pos.x + i
                        let testY = pos.y + j
                        let otherTilesAround = this.walkablesAroundBitwise(new Vec2d(textX, testY))
                        if(i < 0 && j < 0 && otherTilesAround & 8) {
                            return false
                        }
                        else if (i > 0 && j < 0 && otherTilesAround & 4) {
                            return false
                        }
                        else if (i < 0 && j > 0 && otherTilesAround & 64) {
                            return false
                        }
                        else if (i > 0 && j > 0 && otherTilesAround & 16) {
                            return false
                        }
                    }
                }
            }

        }
        return true
    }

    //Returns true if tile is in cubbie hole ie.
    /*
        0 0 0
        0 * 0 
        1 1 1
    */
    inCubbieHole(tilesAround) {

       let holes = [parseInt("00101001", 2), 
                    parseInt("00101000", 2), 
                    parseInt("00001000", 2),

                    parseInt("00000111", 2),
                    parseInt("00000110", 2),
                    parseInt("00000010", 2),


                    parseInt("10010100", 2),
                    parseInt("00010100", 2),
                    parseInt("00010000", 2),

                    parseInt("11100000", 2),
                    parseInt("01100000", 2),
                    parseInt("01000000", 2),

                ]
        // console.log(holes)
        // console.log(tilesAround)
        // // console.log(holes.indexOf(tilesAround))
        if(holes.indexOf(tilesAround) > 0) {
            return true
        }
        
    }

    //checks if tile is in corner 
    isInCorner(tilesAround) {

        //top left
        if(tilesAround & 1 && tilesAround & 2 && tilesAround && 8) {
            return true
        } 
        //top right 
        if(tilesAround & 2 && tilesAround & 4 && tilesAround & 16) {
            return true
        }
        //bottom left 
        if(tilesAround & 8 && tilesAround & 32 && tilesAround & 64) {
            return true
        }
        //bottom right 
        if(tilesAround & 16 && tilesAround & 128 && tilesAround && 64) {
            return true
        }

        return false

    }


    //returns 8 bit number to use for bitwise operations 
     /*
        0 1 2
        3   4
        5 6 7 
    */
    walkablesAround(pos) {
        let power = 0
        let toReturn = 0
        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {

                if(i === 0 && j === 0) continue

                let deltX = pos.x + j
                let deltY = pos.y + i
                //create key              
                let key = deltX + "/" + deltY                
                if(this.walkableMap.has(key)) {
                    toReturn += Math.pow(2, power)
                }
                power++
            }
        }
        //console.log(toReturn.toString(2))
        return toReturn
    }

    //logs walkable map 
    printWalkableMap() {
        console.log("Room: printing room")
        console.log(this.walkableMap)

    }


}