

class Room {

    constructor(width, height, numWalkable) {
        this.width = width
        this.height = height
        this.numWalkable = numWalkable

        //create two dimension map
        this.walkableMap = []
        for(var i = 0; i < height; i++) {
            var inner = []
            for(var j = 0; j < width; j++) {
                inner.push(false)
            }
            this.walkableMap.push(inner)
        }

        this.generateRoom()
    }


    //creates a random layout for the walkable map
    generateRoom() {
        console.log("Room: Generating room")

        //pick random starting tile
        let startX = Math.floor(Math.random() * this.width)
        let startY = Math.floor(Math.random() * this.height)

        //set starting tile to walkable
        this.walkableMap[startY][startX] = true

    }


    //logs walkable map 
    printWalkableMap() {
        
    }



}