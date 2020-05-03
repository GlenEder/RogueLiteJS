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
        distance -- number of tiles that hallway will be in length
        tileset -- tileset for tiles 
        scaling -- scaling of tiles
    */
    constructor(walkables, startingPos, distance, tileset, scaling) {
        this.walkablesRef = walkables
        this.startPos = startingPos
        this.distanceToGo = distance
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
        let dir = UP           //keep track of dir hallway is going for turn 
        let turnPossilbe = CAN_NOT_TURN
        for(var i = 0; i < this.distanceToGo - 1; i++) {

            //Set turn possible
            if(turnPossilbe === CAN_NOT_TURN) {
                if(Math.random() > 0.5) turnPossilbe = CAN_TURN
            }
            else {
                turnPossilbe = CAN_NOT_TURN
            }
            let spotsAvail = this.possibleMoves(pos, this.walkablesRef, turnPossilbe)
            let newPos = spotsAvail[getRandomIndex(spotsAvail)]

            //create tile 
            this.addTile(newPos)
            
            //update pos
            pos = newPos
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

}