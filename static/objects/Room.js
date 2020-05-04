class Room {

    /*
        walkables -- ref to walkables map for levelmap
        startpos  -- vector for starting location of room generation algorithm 
        width -- width of room 
        height -- height of room 
        tileset -- tileset for room to use
        scaling -- scaling of tiles 
    */ 
    constructor(walkables, startpos, direction, width, height, tileset, scaling) {
        this.walkableRef = walkables
        this.startingPos = startpos
        this.direction = direction
        this.width = width
        this.height = height
        this.tileset = tileset
        this.scale = scaling

        //TODO: make this a param to make more fancy rooms in future
        this.numWalkable = width * height
        this.roomTiles = new Map()  //only contains cords, not tiles themselves
        this.generateRoom()
    }


    //creates a random layout for the walkable map
    generateRoom() {

        //console.log("Room: Generating room")
        let roomSpots = new Map()
        roomSpots.clear()

        //Handle dir of room 
        let xDir = (this.direction === LEFT) ? -1 : 1
        let yDir = (this.direction === UP) ? -1 : 1

        for(var i = 0; i < this.width; i++) {
            for(var j = 0; j < this.height; j++) {
                let x = i * xDir
                let y = j * yDir
                let key = x + "/" + y
                roomSpots.set(key, new Vec2d(x, y))
            }
        }

        //create starting key
        let first = getRandomKey(roomSpots)
        let firstPos = roomSpots.get(first)

        //create maps to store locations
        let selectedTiles = new Map()
        let availTiles = new Map()
        selectedTiles.clear()
        availTiles.clear()

        //add first avail tile to map
        availTiles.set(first, firstPos)

        for(var i = 0; i < this.numWalkable; i++) {
            //get random from avail list
            let toSetKey = getRandomKey(availTiles)
            let toSet = availTiles.get(toSetKey)

            if(toSet === undefined || toSet === null) {
                console.log("Room(ERROR): toSet is null")
                continue
            }

            //add to secleted list
            selectedTiles.set(toSetKey, toSet)

            //create tile and add to walkable map
            let tilePosX = toSet.x + this.startingPos.x
            let tilePosY = toSet.y + this.startingPos.y
            let tileKey = tilePosX + "/" + tilePosY
            let tile = new Tile(tilePosX, tilePosY, this.scale)
            tile.setSprite(this.tileset + "_" + FLOOR)
            this.roomTiles.set(tileKey, tile.pos)
            
            //log if tile is written again
            if(this.walkableRef.has(tileKey)) {
                console.log("Room(ERROR): Selected Tile Already in Level")
            }

            this.walkableRef.set(tileKey, tile)

            //get surrounding tiles that have yet to be visited 
            this.getAvailTilesAround(toSetKey, tileKey, selectedTiles, availTiles, roomSpots)    
        }

        console.log("Room: Room generated.")
        //this.setTileSprites()
    }



    

    //adds tiles that are not yet in selectedMap to avail map around tileKey
    getAvailTilesAround(tileKey, worldKey, selectedMap, availMap, roomMap) {

        //get cords of provied tile 
        let tile = availMap.get(tileKey)
        let x = tile.x
        let y = tile.y

        //get cords of world tile
        let worldTile = this.walkableRef.get(worldKey)
        let worldX = worldTile.x
        let worldY = worldTile.y

        //remove from list now that we have needed data 
        availMap.delete(tileKey)

        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {

                if(Math.abs(i) === Math.abs(j)) continue
            
                let deltX = x + i
                let deltY = y + j

                let deltaX2 = worldX + i
                let deltaY2 = worldY + j

                //create keys              
                let key = deltX + "/" + deltY
                let wKey = deltaX2 + "/" + deltaY2 

                //check that maps dont already have this spot
                if(!availMap.has(key) && !selectedMap.has(key) && !this.walkableRef.has(wKey) && roomMap.has(key)) {
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


  



}