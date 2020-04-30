class Room {
    constructor(numWalkable, tileset, tilesize) {
        
        this.numWalkable = numWalkable
        this.tileset = tileset
        this.tileSize = tilesize
        this.scale = 1

        //create container
        this.container = new PIXI.Container()
        
        

        //create array for tiles
        this.walkableMap = new Map()
        this.borderMap = new Map()
    
        this.reset()
        this.generateRoom()
        this.render()        
    }

    //removes sprites from container so new ones can be addes
    //resets walkable map to falses
    reset() {
        while(this.container.children[0]) {this.container.removeChild(this.container.children[0])}
        this.walkableMap.clear()
        this.borderMap.clear()
    }

    //creates new room using same assets 
    loadNewRoom() {
        this.reset()
        this.generateRoom()
        this.render()
    }

    //Renders room using tile array provided
    render() {
        this.walkableMap.forEach(item => {
            this.container.addChild(item.render())
        })
        this.borderMap.forEach(item => {
            if(item.render() !== null)  this.container.addChild(item.render())
        })

    }

    //returns tile value given screen coords
    isWalkable(posX, posY) {

        //get pos in array
        let tileX = Math.floor(posX / (this.tileSize * this.scale))
        let tileY = Math.floor(posY / (this.tileSize * this.scale))

        //saftey check
        if(tileX < 0 || tileX > this.width - 1) return false
        if(tileY < 0 || tileY > this.height - 1) return false 

        return this.walkableMap[tileY][tileX].isWalkable
    }

    //returns vector of position of tile in screen space
    getRandomWalkableTilePos() {

        let randtile = Math.floor(Math.random() * this.numWalkable)
        let count = 0

        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {

                if(this.walkableMap[i][j].isWalkable) {
                    if(count === randtile) {
                        let x = j * this.tileSize * this.scale
                        let y = i * this.tileSize * this.scale
                        return new Vec2d(x, y)
                    }
    
                    count++
                }
            }
        }

        return null

    }

    //creates a random layout for the walkable map
    generateRoom() {
        //console.log("Room: Generating room")

        //starting tile
        let x = 0
        let y = 0
    

        //add starting location to array 
        let first = new Vec2d(x, y)
        let key = first.x + "/" + first.y

        //create maps to store locations
        let selectedTiles = new Map()
        selectedTiles.clear()
        let availTiles = new Map()
        availTiles.clear()

        //add first avail tile to map
        availTiles.set(key, first)

        for(var i = 0; i < this.numWalkable; i++) {
            //get random from avail list
            let toSetKey = this.getRandomKey(availTiles)
            let toSet = availTiles.get(toSetKey)

            if(this.createsTunnel(toSet, selectedTiles, availTiles)) {
                i--
                continue
            }

            //add to secleted list
            selectedTiles.set(toSetKey, toSet)

            //create tile and add to walkable map
            let tile = new Tile(toSet.x, toSet.y, true, this.scale)
            tile.setSprite(this.tileset + "_" + FLOOR)
            this.walkableMap.set(toSetKey, tile)


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
        if(tilesAround[2] && !tilesAround[1] && !tilesAround[4]) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 3)
        }
        //Top right corner
        if(tilesAround[5] && !tilesAround[3] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 1)
        }
        //Top left corner 
        if(tilesAround[7] && !tilesAround[4] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 0)
        }

        //Walls
        if(tilesAround[4] && !tilesAround[1] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 3)
        }
        if(tilesAround[3] && !tilesAround[1] && !tilesAround[6]) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 1)
        }

    }

    //returns array of bools indicating tiles around 
    /*
        0 1 2
        3   4
        5 6 7 
    */
    walkablesAround(pos) {
        let tiles = []
        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {

                if(i === 0 && j === 0) continue

                let deltX = pos.x + j
                let deltY = pos.y + i
                //create key              
                let key = deltX + "/" + deltY
                tiles.push(this.walkableMap.has(key))
            }
        }

        return tiles
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
    createsTunnel(pos, selectedMap, availMap) {

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
                    return true
                }
            }
        }

        return false
    }

    //logs walkable map 
    printWalkableMap() {
        console.log("Room: printing room")
        console.log(this.walkableMap)

    }


}