

class Player {

    constructor(currRoom) {

        this.x = 0.0;
        this.y = 0.0;
        this.dir = 1;
        this.scale = 2
        this.sprite = getSprite("knight_2")
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(this.scale)
        this.movement = [false, false, false, false]
        this.facingRight = true
        this.moveSpeed = 1.5

        //ref to current room object
        this.currRoom = currRoom

        //TODO: Remove const minus after getting own player sprites
        this.boxCollider = new PIXI.Rectangle(this.x, this.y, this.sprite.width, this.sprite.height -16)
    }

    //sets the x and y position of the player to the provided vector
    spawn() {

        let spawnLoc = this.currRoom.getRandomWalkableTilePos()

        if(spawnLoc !== null && spawnLoc !== undefined) {
            this.x = spawnLoc.x
            this.y = spawnLoc.y
        }

        this.update()
    }

    update(delta) {

        //move player 
        this.move(delta)

        //check collisions
        this.handleCollisions()


        //set player location 
        this.sprite.x = this.x
        this.sprite.y = this.y

        //update collider acconting for sprite half width/height
        this.boxCollider.x = this.x - (this.sprite.width / 2)
        this.boxCollider.y = this.y - (this.sprite.height / 2) + 16     //TODO: Remove const with new player sprite 

    }

    handleCollisions() {

        //top left
        if(!this.currRoom.isWalkable(this.boxCollider.left, this.boxCollider.top)) {
            console.log("Colliding top left")
        }

        //top right
        if(!this.currRoom.isWalkable(this.boxCollider.right, this.boxCollider.top)) {
            console.log("Colliding top right")
        }

        //bottom left
        if(!this.currRoom.isWalkable(this.boxCollider.left, this.boxCollider.bottom)) {
            console.log("Colliding bottom left")
        }
     
        //bottom right
        if(!this.currRoom.isWalkable(this.boxCollider.right, this.boxCollider.bottom)) {
            console.log("Colliding bottom right")
        }

    }


    //Updates player position based on movment array
    move(delta) {

         //right
        if(this.movement[0]) {
            this.x += this.moveSpeed * delta
        }

        //left 
        if(this.movement[1]) {
            this.x -= this.moveSpeed * delta
        }

        //up
        if(this.movement[2]) {
            this.y -= this.moveSpeed * delta
        }

        //down
        if(this.movement[3]) {
            this.y += this.moveSpeed * delta
        }

        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
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