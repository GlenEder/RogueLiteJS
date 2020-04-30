

class LevelMap {


    constructor(numRooms) {

        this.numRooms = numRooms        //number of rooms level will have
        this.walkables = new Map();     //map of tiles that player can walk on 
        this.borders = new Map();

        //tileset 
        this.tileset = "floor"

        //create container
        this.container = new PIXI.Container()
        
        this.generateLevel()
        this.render()
    }

    generateLevel() {

        new Room(this.walkables, new Vec2d(0, 0), 10, 8, this.tileset, 1)

    }

    render() {
        this.walkables.forEach(item => {
            this.container.addChild(item.render())
        })

        this.generateBorders()

        this.borders.forEach(item => {
            if(item.render() !== null)
            this.container.addChild(item.render())
        })

        //center map
        this.container.pivot.x = this.container.width / 2
        this.container.pivot.y = this.container.height / 2
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
                    let tile = new Tile(deltX, deltY, WALL, this.scale)
                    this.setBorderSprite(tile, tilesAround)
                    this.borders.set(key, tile)

                }
            }
        })

    }

    setBorderSprite(tile, tilesAround) {
    
        //Walls
        if(tilesAround & parseInt("11100000", 2) === parseInt("11100000", 2)) {
            tile.setSprite(this.tileset + "_" + WALL)
            tile.type = WALL
        }

        


        else {
            console.log("Level: (ERROR) Border Tile not Implemented")
        }

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