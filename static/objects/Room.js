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

        //validate room 
        if(!this.roomAreaIsAvailable(xDir, yDir, this.startingPos)) {
            console.log("Room(ERROR): room overlaps exisiting tiles")
        }

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

    roomAreaIsAvailable(xDir, yDir, startPos) {

        //check corners 
        let topLeft = new Vec2d(startPos.x, startPos.y + (this.height * yDir))
        let topRight = new Vec2d(startPos.x + (this.width * xDir), startPos.y + (this.height * yDir))
        let bottomRight = new Vec2d(startPos.x + (this.width * xDir), startPos.y)
        if(this.walkableRef.has(generateKey(topLeft)) ||
            this.walkableRef.has(generateKey(topRight)) ||
            this.walkableRef.has(generateKey(bottomRight))) 
        {
            return false
        }

        return true
    }
  



}