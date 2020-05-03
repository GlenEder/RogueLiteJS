const CAN_TURN = 3
const CAN_NOT_TURN = 2
const UP = 0
const DOWN = 1
const RIGHT = 2
const LEFT = 3

class Hallway {

    /*
        walkables -- map of walkable tiles already in the map
        startingPos -- position of first tile (Assumed valid tile ie. not in walkables)
        direction -- starting direction 
        distance -- number of tiles that hallway will be in length
        tileset -- tileset for tiles 
        scaling -- scaling of tiles
    */
    constructor(walkables, startingPos, direction, distance, tileset, scaling) {
        this.walkablesRef = walkables
        this.startPos = startingPos
        this.distanceToGo = distance
        this.startingDir = direction
        this.tileset = tileset
        this.scaling = scaling

        //map containing pos of tiles for this hallway 
        this.tiles = new Map()

        //generate the hallway bae bee
        this.generateHallway()
    }

    //Generates hallway based of params of constructor
    generateHallway() {

        //add first tile 
        this.addTile(this.startPos)
    
        let pos = this.startPos
        let lastPos = pos
        let dir = this.startingDir          //keep track of dir hallway is going for turn 
        let turnPossilbe = CAN_NOT_TURN
        let movesInDir = 1                  //how many moves in dir 

        for(var i = 0; i < this.distanceToGo - 1; i++) {

            //get next spot
            let spotsAvail = this.possibleMoves(pos, this.walkablesRef, turnPossilbe)
            let newPos = spotsAvail[getRandomIndex(spotsAvail)]

            //create tile 
            this.addTile(newPos)
            // console.log("adding tile at %d, %d", newPos.x, newPos.y)
            
            //update pos
            lastPos = pos
            pos = newPos

            //check dir and adjust turning
            if(turnPossilbe === CAN_TURN) {
                if(this.didTurn(newPos, lastPos, dir)) {
                    turnPossilbe = CAN_NOT_TURN
                    movesInDir = 0
                }
            }
            else {
                movesInDir++
                if(movesInDir > 2) {
                    turnPossilbe = CAN_TURN
                }
            }
            
            
        }
    }

    //returns array of possible moves 
    possibleMoves(pos, map, numAroundAllowed) {
        let missings = missingsAround(pos, map)
        let moves = []
        if(missings & WALL_BOTTOM) {
            let move = new Vec2d(pos.x, pos.y + 1)
            if(numberAround(move, this.walkablesRef) < numAroundAllowed) {
                moves.push(move)
            }
        }
        if(missings & WALL_TOP) {
            let move = new Vec2d(pos.x, pos.y - 1)
            if(numberAround(move, this.walkablesRef) < numAroundAllowed) {
                moves.push(move)
            }
        }
        if(missings & WALL_RIGHT) {
            let move = new Vec2d(pos.x + 1, pos.y)
            if(numberAround(move, this.walkablesRef) < numAroundAllowed) {
                moves.push(move)
            }
        }
        if(missings & WALL_LEFT) {
            let move = new Vec2d(pos.x - 1, pos.y)
            if(numberAround(move, this.walkablesRef) < numAroundAllowed) {
                moves.push(move)
            }
        }

        return moves
    }

    addTile(pos) {
        //create tile
        let t = new Tile(pos.x, pos.y, this.scaling)
        t.setSprite(this.tileset + "_" + FLOOR)

        //generate key and add to tiles map
        let key = pos.x + "/" + pos.y
        this.tiles.set(key, pos)

        //add tile to walkables map
        this.walkablesRef.set(key, t)
    }

    //returns true if dir from last to new position is differnt than provided dir
    didTurn(newPos, lastPos, lastDir) {

        let deltaX = newPos.x - lastPos.x
        let deltaY = newPos.y - lastPos.y

        //Going right
        if(deltaX > 0) {
            if(lastDir !== RIGHT) return true
        }
        //Going left 
        else if(deltaX < 0) {
            if(lastDir !== LEFT) return true 
        }
        //Going up
        if(deltaY < 0) {
            if(lastDir !== UP) return true
        }
        //Going down 
        else if (deltaY > 0) {
            if(lastDir !== DOWN) return true
        }

        //same dir 
        return false
    }

}