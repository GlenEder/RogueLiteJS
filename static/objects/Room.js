class Room {
    constructor(width, height, numWalkable, tileset, tilesize) {
        this.width = width
        this.height = height
        this.numWalkable = numWalkable
        this.tileset = tileset
        this.tileSize = tilesize
        this.scale = 1

        //create container
        this.container = new PIXI.Container()
        
        

        //create two dimension map
        this.walkableMap = []
        for(var i = 0; i < height; i++) {
            var inner = []
            for(var j = 0; j < width; j++) {
                inner.push(new Tile(j, i, false))
            }
            this.walkableMap.push(inner)
        }

        this.generateRoom()
        this.render()

        //center tiles
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2
        
    }

    //removes sprites from container so new ones can be addes
    //resets walkable map to falses
    reset() {
        while(this.container.children[0]) {this.container.removeChild(this.container.children[0])}
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++) {
                this.walkableMap[i][j] = new Tile(j, i, false)
            }
        }
    }


    //creates new room using same assets 
    loadNewRoom() {
        this.reset()
        this.generateRoom()
        this.render()
    }

    //Renders room using tile array provided
    render() {
        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {
                let tile = this.walkableMap[i][j].render()
                if(tile !== null) {
                    this.container.addChild(tile)
                }
            }
        }
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

    //sets tile sprites of walkable map
    setTileSprites() {

        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {

                //nonwalkable tiles are left null 
                if(!this.walkableMap[i][j].isWalkable) continue

                let tilePos = new Vec2d(j, i)
                let top = false
                let bot = false
                let left = false
                let right = false
        
                //check tiles around
                if(tilePos.x + 1 < this.width        && this.walkableMap[tilePos.y][tilePos.x + 1].isWalkable) right = true
                if(tilePos.x - 1 >= 0                && this.walkableMap[tilePos.y][tilePos.x - 1].isWalkable) left = true
                if(tilePos.y + 1 < this.height       && this.walkableMap[tilePos.y + 1][tilePos.x].isWalkable) bot = true
                if(tilePos.y - 1 >= 0                && this.walkableMap[tilePos.y - 1][tilePos.x].isWalkable) top = true

                if(top && bot && left && right)                 this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && bot && left && !right)           this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && bot && !left && right)           this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && bot && !left && !right)          this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && !bot && left && right)           this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && !bot && left && !right)          this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && !bot && !left && right)          this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(top && !bot && !left && !right)         this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)

                else if(!top && bot && left && right)           this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && bot && left && !right)          this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && bot && !left && right)          this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && bot && !left && !right)         this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && !bot && left && right)          this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && !bot && left && !right)         this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && !bot && !left && right)         this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)
                else if(!top && !bot && !left && !right)        this.walkableMap[tilePos.y][tilePos.x].setSprite(this.tileset + "_" + 0)

            }
        }

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
        console.log("Room: Generating room")

        //pick random starting tile
        let x = Math.floor(Math.random() * this.width)
        let y = Math.floor(Math.random() * this.height)

        //set starting tile to walkable
        this.walkableMap[y][x].isWalkable = true

        //create array of tiles able to visit 
        let availTiles = new Map()
    
        //add starting location to array 
        let first = new Vec2d(x, y)
        let key = first.x + "-" + first.y
        
        //add first avail tile to map
        availTiles.set(key, first)

        for(var i = 0; i < this.numWalkable; i++) {
            //get random from avail list
            let toSetKey = this.getRandomKey(availTiles)

            let toSet = availTiles.get(toSetKey)

            //set random spot
            this.walkableMap[toSet.y][toSet.x].isWalkable = true

            //get surrounding tiles that have yet to be visited 
            this.getAvailTilesAround(toSetKey, availTiles)

            //remove from avail list
            availTiles.delete(toSetKey)      
            
        }

        //this.printWalkableMap()

        this.setTileSprites()
    }

    // returns random key from map
    getRandomKey(collection) {
        let keys = Array.from(collection.keys())
        return keys[Math.floor(Math.random() * keys.length)]
    }

    getAvailTilesAround(tileKey, availMap) {

        //get cords of provied tile 
        let tile = availMap.get(tileKey)
        let x = tile.x
        let y = tile.y

        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {

                if(Math.abs(i) === Math.abs(j)) continue
            
                let deltX = x + i
                let deltY = y + j

                if(deltX < 0 || deltX > this.width - 1 || deltY < 0 || deltY > this.height - 1) {
                    continue
                }

                if(!this.walkableMap[deltY][deltX].isWalkable) {
                    //create key and add to map
                    let key = deltX + "-" + deltY
                    if(!availMap.has(key)) {
                        availMap.set(key, new Vec2d(deltX, deltY))
                    }
                }
            }
        }

     }



    //logs walkable map 
    printWalkableMap() {
        console.log("Room: printing room")
        
        let output = ""
        for(var i = 0; i < this.height; i++) {

            let row = ""
            for(var j = 0; j < this.width; j++) {
                if(this.walkableMap[i][j].isWalkable) {
                    row += "1 "
                }
                else {
                    row += "0 "
                }
            }

            output += row 
            output += '\n'
        }

        console.log(output)

    }

    printMap(map) {

        let output = ""
        for(var i = 0; i < this.height; i++) {

            let row = ""
            for(var j = 0; j < this.width; j++) {

                if(map.has(j + "-" + i)) {
                    row += "A "
                }
                else if(this.walkableMap[i][j].isWalkable) {
                    row += "1 "
                }
                else {
                    row += "0 "
                }

            }

            output += row
            output += "\n"
        }


        console.log(output)

    }


    printNumTilesWalkable() {
        let count = 0
        this.walkableMap.forEach(item => {
            item.forEach(item => {
                if(item.isWalkable) count++
            })
        })

        console.log("Room: Num tiles assigned: " + count)
    }



}