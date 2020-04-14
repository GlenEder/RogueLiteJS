

class Room {

    constructor(width, height, numWalkable, tileset) {


        this.width = width
        this.height = height
        this.numWalkable = numWalkable
        this.tileset = tileset
        this.tileSize = 16
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
        this.render(this.tileSize)
    }

    //Renders room using tile array provided

    render(tileSize) {

        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {

                let tileType = this.getTileType(new Vec2d(j, i))
                //console.log("Tile Type: " + tileType + ", x: " + j + ", y: " + i)

                let sprite = getSprite(this.tileset + "_" + tileType)
                sprite.x = j * tileSize
                sprite.y = i * tileSize

                this.container.addChild(sprite)

            }
        }

    }

    //returns tile number for sprite sheet
    getTileType(tilePos) {

        let top = false
        let bot = false
        let left = false
        let right = false

        if(tilePos.x + 1 < this.width - 1 && this.walkableMap[tilePos.y][tilePos.x + 1]) right = true
        if(tilePos.x - 1 > 0 && this.walkableMap[tilePos.y][tilePos.x - 1]) left = true
        if(tilePos.y + 1 < this.height - 1 && this.walkableMap[tilePos.y + 1][tilePos.x]) bot = true
        if(tilePos.y - 1 > 0 && this.walkableMap[tilePos.y - 1][tilePos.x]) top = true

        

        //return something that isnt clean tile if something goes wrong 
        return 1



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



        this.printWalkableMap()
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