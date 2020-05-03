const WALL_BOTTOM = 64
const WALL_TOP = 2
const WALL_RIGHT  = 16
const WALL_LEFT = 8
const CORNER_TR = 4
const CORNER_TL = 1
const CORNER_BR = 128
const CORNER_BL = 32
const BEND_TR = 151
const BEND_TL = 43
const BEND_BR = 0
const BEND_BL = 233

class LevelMap {

    constructor(numRooms) {

        this.numRooms = numRooms        //number of rooms level will have
        this.walkables = new Map();     //map of tiles that player can walk on 
        this.borders = new Map();       //map of border tiles
        this.rooms = []                 //array of rooms
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

    //generates walkable areas for player
    generateLevel() {

        this.rooms.push(new Room(this.walkables, new Vec2d(0, 0), 4, 3, this.tileset, 1))
        this.generateHallway(8)
    }

    //Creates a hallway from a random rooms wall
    generateHallway(distance) {
        let possibleStarts = this.getRoomEdges(this.rooms[0])
        let hallwayStart = possibleStarts[getRandomIndex(possibleStarts)]
        let dir = this.getDirOfEdge(hallwayStart)
        new Hallway(this.walkables, hallwayStart, dir, distance, this.tileset, this.scale)
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
                    let tilesAround = entriesAround(new Vec2d(deltX, deltY), this.walkables)

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

    //returns array of edges for room 
    getRoomEdges(room) {
        let edges = []
        room.roomTiles.forEach(item => {
            let bordersAround = missingsAround(item, this.walkables) 
            
            //Check for walls
            if(bordersAround & WALL_BOTTOM) {
                edges.push(new Vec2d(item.x, item.y + 1))
            }
            if(bordersAround & WALL_LEFT) {
                edges.push(new Vec2d(item.x - 1, item.y))
            }
            if(bordersAround & WALL_RIGHT) {
                edges.push(new Vec2d(item.x + 1, item.y)) 
            }
            if(bordersAround & WALL_TOP) {
                edges.push(new Vec2d(item.x, item.y - 1))
            }
        })

        return edges
    }

    //returns dir that tile came from
    getDirOfEdge(pos) {
        let tilesAround = entriesAround(pos, this.walkables)
        if(tilesAround & WALL_TOP) {
            return DOWN
        }
        if(tilesAround & WALL_BOTTOM) {
            return UP
        }
        if(tilesAround & WALL_LEFT) {
            return RIGHT
        }
        if(tilesAround & WALL_RIGHT) {
            return LEFT
        }
    }

    //Reset maps and container 
    reset() {
        this.walkables.clear()
        this.borders.clear()
        while(this.container.children[0]) {this.container.removeChild(this.container.children[0])}
    }



}