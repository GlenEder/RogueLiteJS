

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
    }

    //Generates hallway based of params of constructor
    generateHallway() {

        //Add first tile 
        let t = new Tile(this.startPos.x, this.startPos.y, this.scaling)
        t.setSprite(this.tileset + "_" + FLOOR)

        //generate key and add to tiles map
        let key = this.startPos.x + "/" + this.startPos.y
        this.tiles.set(key, this.startPos)

        //add first tile to walkables map
        this.walkablesRef.set(key, t)

        //pos of tile
        let pos = this.startPos

        for(var i = 0; i < this.distanceToGo; i++) {

            let spotsAvail = missingsAround(pos, this.walkablesRef)

        }
    }

}