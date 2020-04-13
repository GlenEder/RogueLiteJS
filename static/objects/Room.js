

class Room {

    constructor(width, height, numWalkable) {
        this.width = width
        this.height = height
        this.numWalkable = numWalkable

        this.map = [height][width]

        this.generateRoom()
    }


    generateRoom() {
        console.log("Room: Generating room")
    }


}