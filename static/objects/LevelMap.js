const WALL_BOTTOM = 64
const WALL_TOP = 2
const WALL_RIGHT  = 16
const WALL_LEFT = 8
const CORNER_TR = 4
const CORNER_TL = 1
const CORNER_BR = 128
const CORNER_BL = 32

class LevelMap {

    constructor(numRooms) {

        this.numRooms = numRooms        //number of rooms level will have
        this.walkables = new Map();     //map of tiles that player can walk on 
        this.borders = new Map(); 
        this.scale = 1
        this.tileset = "floor"

        //create container
        this.container = new PIXI.Container()

        //start clean which is probably unneeded 
        this.reset()
        
        this.generateLevel()
        this.generateBorders()
        this.render()
    }

    //renders map
    render() {
        this.walkables.forEach(item => {
            this.container.addChild(item.render())
        })

        this.borders.forEach(item => {
            if(item.render() !== null) {
                this.container.addChild(item.render())
            }
        })

        //center map
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2

    } 

    //Reset maps and container 
    reset() {
        this.walkables.clear()
        this.borders.clear()
        while(this.container.children[0]) {this.container.removeChild(this.container.children[0])}
    }

    //Creates a hallway from a random rooms wall
    generateHallway(distance) {
        
    }

    //generates walkable areas for player
    generateLevel() {

        new Room(this.walkables, new Vec2d(0, 0), 4, 3, this.tileset, 1)

    }

    //creates border for walkable map 
    generateBorders() {

        this.walkables.forEach(item => {
            for(var i = -1; i < 2; i++) {
                for(var j = -1; j < 2; j++) {
                    if(i === 0 && j === 0) continue
                    let deltX = item.x + i
                    let deltY = item.y + j
                    //create key              
                    let key = deltX + "/" + deltY

                    //avoid double calculations and checking walkable tiles
                    if(this.borders.has(key) || this.walkables.has(key)) continue

                    //get tiles around 
                    let tilesAround = this.walkablesAround(new Vec2d(deltX, deltY))

                    //create tile and add to map
                    let tile = new Tile(deltX, deltY, this.scale)
                    this.setBorderSprite(tile, tilesAround)
                    this.borders.set(key, tile)
                }
            }
        })

    }

    //Sets sprite for the given tile based on tiles around 
    setBorderSprite(tile, tilesAround) {
        
        //Walls
        if(tilesAround & WALL_BOTTOM) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 0)
            tile.isWall = true
        }
        else if (tilesAround & WALL_TOP) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 2)
            tile.isWall = true
        }
        else if (tilesAround & WALL_RIGHT) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 3)
            tile.isWall = true
        }
        else if (tilesAround & WALL_LEFT) {
            tile.setSpriteWithDir(this.tileset + "_" + WALL, 1)
            tile.isWall = true
        }

        //Corners 
        else if(tilesAround & CORNER_TR) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 3)
        }
        else if(tilesAround & CORNER_TL) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 2)
        }
        else if(tilesAround & CORNER_BR) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 0)
        }
        else if(tilesAround & CORNER_BL) {
            tile.setSpriteWithDir(this.tileset + "_" + CONRNER, 1)
        }

        //TODO: Bends

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
            if(this.walkables.has(key)) {
                toReturn += Math.pow(2, power)
            }
            power++
        }
    }
    //console.log(toReturn.toString(2))
    return toReturn
}



}