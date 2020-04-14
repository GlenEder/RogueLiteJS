

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
            this.clampValueToMap(x, y)

            console.log("X: " + x +", Y: " + y)

        }

        this.printWalkableMap()

    }


    //clamps x to 0 - (width - 1)
    //clamps y to 0 - (height - 1) 
    clampValueToMap(x, y) {
        if(x < 0) {
            x = 0
        }
        else if(x > this.width - 1) {
            x = this.width - 1
        }

        if(y < 0) {
            y = 0
        }
        else if(y > this.height - 1) {
            y = this.height - 1
        }
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