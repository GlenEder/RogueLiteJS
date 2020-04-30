

class LevelMap {


    constructor(numRooms) {

        this.numRooms = numRooms        //number of rooms level will have
        this.walkables = new Map();     //map of tiles that player can walk on 

        //create container
        this.container = new PIXI.Container()
        
        this.generateLevel()
        this.render()
    }

    generateLevel() {

        new Room(this.walkables, new Vec2d(0, 0), 5, 5, "floor", 1)

    }

    render() {
        this.walkables.forEach(item => {
            this.container.addChild(item.render())
        })
    }


}