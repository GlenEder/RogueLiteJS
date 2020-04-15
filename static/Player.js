

class Player {

    constructor() {

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
    }

    //sets the x and y position of the player to the provided vector
    spawn(spawnLoc) {

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
        this.sprite.x = Math.floor(this.x)
        this.sprite.y = Math.floor(this.y)

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