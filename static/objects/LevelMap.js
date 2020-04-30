

class LevelMap {


    constructor(numRooms) {

        this.numRooms = numRooms        //number of rooms level will have
        this.walkables = new Map();     //map of tiles that player can walk on 

        //create container
        this.container = new PIXI.Container()

    }


}