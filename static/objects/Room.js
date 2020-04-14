

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
        let x = Math.floor(Math.random() * this.width)
        let y = Math.floor(Math.random() * this.height)

        //set starting tile to walkable
        this.walkableMap[y][x] = true

        let numSet = 1

        while(numSet < this.numWalkable) {

            //pick direction to walk
            let dir = Math.floor(Math.random() * 4)
            
            switch(dir) {
                case 0:
                    y--
                    break
                case 1:
                    x++
                    break
                case 2:
                    y++
                    break
                case 3:
                    x--
                    break
            }

            //check x y bounds
            x = clamp(x, 0, this.width - 1)
            y = clamp(y, 0, this.height - 1)

            console.log("X: " + x + ", Y: " + y)

            //set position to true
            if(!this.walkableMap[y][x]) {
                this.walkableMap[y][x] = true
                numSet++
            }

        }

        this.printWalkableMap()

    }



    //logs walkable map 
    printWalkableMap() {
        console.log("Room: printing room")
        
        let output = ""
        for(var i = 0; i < this.height; i++) {

            let row = ""
            for(var j = 0; j < this.width; j++) {
                if(this.walkableMap[i][j]) {
                    row += "1 "
                }
                else {
                    row += "0 "
                }
            }

            output += row 
            output += '\n'
        }

        console.log(output)

    }



}