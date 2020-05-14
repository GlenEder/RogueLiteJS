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
        this.borders = new Map();       //map of border tiles
        this.rooms = []                 //array of rooms
        this.hallways = []              //array of hallways
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
            if(item.render() !== null) {
                this.container.addChild(item.render())
            }
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

        let nextRoomStart = new Vec2d(0, 0)
        let roomDir = RIGHT
        let minRoomWidth = 4
        let minRoomHeight = 3
        let maxRoomWidht = 8
        let maxRoomHeight = 6
        let roomScale = 1
        let hallwayLen = 4
        let possibleHallwayStarts = []

        let roomWidth = Math.floor(Math.random() * (maxRoomWidht - minRoomWidth)) + minRoomWidth
        let roomHeight = Math.floor(Math.random() * (maxRoomHeight - minRoomHeight)) + minRoomHeight

        //create starting room
        this.rooms.push(new Room(this.walkables, nextRoomStart, roomDir, roomWidth, roomHeight, this.tileset, roomScale))

        //get all hallway starting positions avail
        possibleHallwayStarts = this.getAllRoomEdges()

        //pick random avail start
        let edgeToTry = possibleHallwayStarts[getRandomIndex(possibleHallwayStarts)]    

        //generate hallway 
        let nextRoomData = this.generateHallway(hallwayLen, possibleHallwayStarts[getRandomIndex(possibleHallwayStarts)])

        for(var i = 1; i < this.numRooms; i++) {

            //update room data
            nextRoomStart = nextRoomData.pos
            roomDir = nextRoomData.direction
            roomWidth = Math.floor(Math.random() * (maxRoomWidht - minRoomWidth)) + minRoomWidth
            roomHeight = Math.floor(Math.random() * (maxRoomHeight - minRoomHeight)) + minRoomHeight

            //check that next rooms have space
            if(!this.roomSpaceIsAvailAble(nextRoomStart, roomDir, roomWidth, roomHeight)) {
                //remove last hallway and starting position of that hallway
                this.removeLastHallway()
                let spot = possibleHallwayStarts.indexOf(edgeToTry)
                possibleHallwayStarts.splice(spot, 1)

                //reset room counter 
                i--

                //generate new hallway 
                edgeToTry = possibleHallwayStarts[getRandomIndex(possibleHallwayStarts)]    
                nextRoomData = this.generateHallway(hallwayLen, possibleHallwayStarts[getRandomIndex(possibleHallwayStarts)])
            }
            else {
                //create room 
                this.rooms.push(new Room(this.walkables, nextRoomStart, roomDir, roomWidth, roomHeight, this.tileset, roomScale))

                //get all hallway starting positions avail
                possibleHallwayStarts = this.getAllRoomEdges()

                //pick random avail start
                let edgeToTry = possibleHallwayStarts[getRandomIndex(possibleHallwayStarts)]    

                //generate hallway 
                let nextRoomData = this.generateHallway(hallwayLen, possibleHallwayStarts[getRandomIndex(possibleHallwayStarts)])
            }
        

        }

        //remove last hallway 
        this.removeLastHallway()
    }

    //Creates a hallway from a random rooms wall
    //Returns hallways last tile position 
    generateHallway(distance, startingPos) {
        let dir = this.getDirOfEdge(startingPos)
        let hall = new Hallway(this.walkables, startingPos, dir, distance, this.tileset, this.scale)
        this.hallways.push(hall)
        return {pos: hall.lastTilePos, direction: dir}
    }

    //Removes tiles from walkables of last generated hallway 
    removeLastHallway() {

        let hallwayToDelete = this.hallways.pop()
        if(hallwayToDelete !== null && hallwayToDelete !== undefined) {
            hallwayToDelete.tiles.forEach(item => {
                this.walkables.delete(generateKey(item))
            })
        }
       

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
        //top right 
        if((tilesAround & WALL_RIGHT) && (tilesAround & WALL_TOP) && (tilesAround & CORNER_TR)) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 3)
        }
        //top left
        else if((tilesAround & WALL_LEFT) && (tilesAround & WALL_TOP) && (tilesAround & CORNER_TL)) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 2)
        }
        //bottom right
        else if((tilesAround & WALL_RIGHT) && (tilesAround & WALL_BOTTOM) && (tilesAround & CORNER_BR)) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 0)
        }
        //bottom left
        else if((tilesAround & WALL_LEFT) && (tilesAround & WALL_BOTTOM) && (tilesAround & CORNER_BL)) {
            tile.setSpriteWithDir(this.tileset + "_" + BEND, 1)
        }
    }

    //returns array of all edges of all rooms 
    getAllRoomEdges() {
        let edges = []
        this.rooms.forEach(item => {
            let roomEdges = this.getRoomEdges(item)
            roomEdges.forEach(inner => {
                edges.push(inner)
            })
        })

        return edges
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

    roomSpaceIsAvailAble(startPos, startingDir, roomWidth, roomHeight) {
         //Handle dir of room 
        let xDir = (startingDir === LEFT) ? -1 : 1
        let yDir = (startingDir === UP) ? -1 : 1
         
        //adjust room width and height for calculations 
        roomHeight--
        roomWidth--

    
        for(var i = 0; i < roomHeight; i++) {
            for(var j = 0; j < roomWidth; j++) {
                let xPos = (j * xDir) + startPos.x
                let yPos = (i * yDir) + startPos.y
                let key = generateKey(new Vec2d(xPos, yPos))
                if(this.walkables.has(key)) {
                    return false
                }
            }
        }

         return true
    }


}