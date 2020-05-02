

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
        
        for(var i = 0; i < this.distanceToGo; i++) {

            

        }
    }

}