class Room {
    constructor(width, height, numWalkable, tileset) {
        this.width = width
        this.height = height
        this.numWalkable = numWalkable
        this.tileset = tileset
        this.tileSize = 16
        this.scale = 3

        //create container
        this.container = new PIXI.Container()
        
        

        //create two dimension map
        this.walkableMap = []
        for(var i = 0; i < height; i++) {
            var inner = []
            for(var j = 0; j < width; j++) {
                inner.push(false)
            }
            this.walkableMap.push(inner)
        }

        this.generateRoom()
        this.render()

        //center tiles
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2
        
    }

    //Renders room using tile array provided
    render() {

        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {

                let tileType = this.getTileType(new Vec2d(j, i))
                // console.log("Tile Type: " + tileType + ", x: " + j + ", y: " + i)

                //dont draw tiles we cant walk on
                if(tileType < 0) continue

                const sprite = getSprite(this.tileset + "_" + tileType)
                sprite.scale.set(this.scale)
                sprite.x = j * this.tileSize * this.scale
                sprite.y = i * this.tileSize * this.scale


                this.container.addChild(sprite)
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

        return this.walkableMap[tileY][tileX]
    }


    //returns tile number for sprite sheet
    getTileType(tilePos) {

        if(!this.walkableMap[tilePos.y][tilePos.x]) { return -1}

        let top = false
        let bot = false
        let left = false
        let right = false


        if(tilePos.x + 1 < this.width        && this.walkableMap[tilePos.y][tilePos.x + 1]) right = true
        if(tilePos.x - 1 >= 0                && this.walkableMap[tilePos.y][tilePos.x - 1]) left = true
        if(tilePos.y + 1 < this.height       && this.walkableMap[tilePos.y + 1][tilePos.x]) bot = true
        if(tilePos.y - 1 >= 0                && this.walkableMap[tilePos.y - 1][tilePos.x]) top = true

        
        if(top && bot && left && right) return 0
        if(top && bot && left && !right) return 7
        if(top && bot && !left && right) return 1
        if(top && bot && !left && !right) return 10
        if(top && !bot && left && right) return 8
        if(top && !bot && left && !right) return 5
        if(top && !bot && !left && right) return 6
        if(top && !bot && !left && !right) return 13

        if(!top && bot && left && right) return 3
        if(!top && bot && left && !right) return 4
        if(!top && bot && !left && right) return 2
        if(!top && bot && !left && !right) return 12
        if(!top && !bot && left && right) return 9
        if(!top && !bot && left && !right) return 15
        if(!top && !bot && !left && right) return 14
        if(!top && !bot && !left && !right) return 11


        //return something that isnt clean tile if something goes wrong 
        return -1
    }


    //returns vector of position of tile in screen space
    getRandomWalkableTilePos() {

        let randtile = Math.floor(Math.random() * this.numWalkable)
        let count = 0

        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {

                if(this.walkableMap[i][j]) {
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
        this.walkableMap[y][x] = true

        //create array of tiles able to visit 
        let availTiles = new Map()
    
        //add starting location to array 
        let first = new Vec2d(x, y)
        let key = first.x + "-" + first.y
        
        availTiles.set(key, first)

        for(var i = 0; i < this.numWalkable; i++) {
            //get random from avail list
            let toSetKey = this.getRandomKey(availTiles)
            let toSet = availTiles.get(toSetKey)

            //set random spot
            this.walkableMap[toSet.y][toSet.x] = true

            //get surrounding tiles that have yet to be visited 
            this.getAvailTilesAround(toSetKey, availTiles)

            //remove from avail list
            availTiles.delete(toSetKey)      
            
        }

        //this.printWalkableMap()
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

                if(!this.walkableMap[deltY][deltX]) {
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
                if(this.walkableMap[i][j]) {
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
                else if(this.walkableMap[i][j]) {
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
                if(item) count++
            })
        })

        console.log("Room: Num tiles assigned: " + count)
    }



}