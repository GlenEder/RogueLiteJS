

class Player {

    constructor(currRoom) {

        this.x = 0.0;
        this.y = 0.0;
        this.dir = 1;
        this.scale = 2
        this.sprite = getSprite("knight_2")
        this.sprite.scale.set(this.scale)
        this.sprite.anchor.set(0.5)
        this.movement = [false, false, false, false]
        this.facingRight = true
        this.moveSpeed = 1.5

        //ref to current room object
        this.currRoom = currRoom

        this.boxCollider = new PIXI.Rectangle(this.x, this.y, this.sprite.width, this.sprite.height)
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


        //set player location 
        this.sprite.x = this.x
        this.sprite.y = this.y

        //update collider 
        this.boxCollider.x = this.x
        this.boxCollider.y = this.y
    }

    handleCollisions() {

        //top left
        if(!this.currRoom.isWalkable(this.boxCollider.left, this.boxCollider.top)) {
            console.log("Colliding top left")
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





}