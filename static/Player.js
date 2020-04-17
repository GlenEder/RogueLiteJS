

class Player {

    constructor(currRoom) {

        this.x = 0.0;
        this.y = 0.0;
        this.scale = 2
        this.sprite = getSprite("knight_2")
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(this.scale)
        this.movement = [false, false, false, false]
        this.facingRight = true
        this.moveSpeed = 2.5

        //Buffer Values for hit box 
        this.colliderBufferTop = 22
        this.colliderBufferSide = 4

        //ref to current room object
        this.currRoom = currRoom

        //TODO: Remove const minus after getting own player sprites
        this.boxCollider = new PIXI.Rectangle(this.x, this.y, this.sprite.width - this.colliderBufferSide, this.sprite.height - this.colliderBufferTop)
    }

    //sets the x and y position of the player to the provided vector
    spawn() {
        //if found valid spawn location
        let success = false
        do {
            //get random map position
            let spawnLoc = this.currRoom.getRandomWalkableTilePos()
            if(spawnLoc !== null && spawnLoc !== undefined) {
                this.x = spawnLoc.x
                this.y = spawnLoc.y

                //update collider pos and check for collisions with wall
                this.setColliderPos(this.x, this.y)
                if(!this.isCollideWithWall()) {
                    success = true
                }
            }
        }while(!success)
        
    }

    update(delta) {

        //move player 
        this.move(delta)      
    

    }

    //returns true if collider lands on unwalkable tile
    isCollideWithWall() {
    
        if(
        //top left
        (!this.currRoom.isWalkable(this.boxCollider.left, this.boxCollider.top)) ||
        //top right
        (!this.currRoom.isWalkable(this.boxCollider.right, this.boxCollider.top)) ||
        //bottom left
        (!this.currRoom.isWalkable(this.boxCollider.left, this.boxCollider.bottom)) ||
        //bottom right
        (!this.currRoom.isWalkable(this.boxCollider.right, this.boxCollider.bottom))) 
        {
            return true
        }

        return false

    }


    //Updates player position based on movment array
    move(delta) {

        let tempX = this.x
        let tempY = this.y

         //right
        if(this.movement[0]) {
            tempX += this.moveSpeed * delta
        }

        //left 
        if(this.movement[1]) {
            tempX -= this.moveSpeed * delta
        }

        //up
        if(this.movement[2]) {
            tempY -= this.moveSpeed * delta
        }

        //down
        if(this.movement[3]) {
            tempY += this.moveSpeed * delta
        }

        //Convert back to ints
        tempX = Math.floor(tempX)
        tempY = Math.floor(tempY)

        //update collider acconting for sprite half width/height
        this.setColliderPos(tempX, tempY)


        //Check for room bounds
        if(this.isCollideWithWall()) {
            //reset box collider
            this.setColliderPos(this.x, this.y)
        }
        else {
            //Assign temp positions to real x and y
            this.x = tempX
            this.y = tempY

            //set player sprite pos 
            this.sprite.x = this.x
            this.sprite.y = this.y
        }
    }


    //Sets collider pos with respect to the params
    setColliderPos(x, y) {
        this.boxCollider.x = x - (this.sprite.width / 2)  + this.colliderBufferSide
        this.boxCollider.y = y - (this.sprite.height / 2) + this.colliderBufferTop 
    }

    //sets player dir to value provdied
    //Assigns facing of player
    setMoving(dir, b) {     
        if(dir === 0 && b) {
            if(!this.facingRight) {
                this.sprite.scale.x *= -1
            }

            this.facingRight = true
        } 
        else if(dir === 1 && b) {
            if(this.facingRight) {
                this.sprite.scale.x *= -1
            }

            this.facingRight = false
        }

        this.movement[dir] = b
    }


    printInfo() {

        console.log("Player pos: (" + this.x + ", " + this.y +")\n" +
                    "Player collider: top: " + this.boxCollider.top + 
                                    ", bot: " + this.boxCollider.bottom +
                                    ", right: " + this.boxCollider.right + 
                                    ", left: " + this.boxCollider.left)

    }


}