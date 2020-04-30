

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

        new Room(this.walkables, new Vec2d(0, 0), 10, 8, "floor", 1)

    }

    render() {
        this.walkables.forEach(item => {
            this.container.addChild(item.render())
        })



        //center map
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2
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
            if(this.walkableMap.has(key)) {
                toReturn += Math.pow(2, power)
            }
            power++
        }
    }
    //console.log(toReturn.toString(2))
    return toReturn
}



}