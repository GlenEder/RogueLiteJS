

class Player {

    constructor() {

        this.x = 0.0;
        this.y = 0.0;
        this.dir = 1;
        this.scale = 2
        this.sprite = getSprite("knight_2")
        this.sprite.scale.set(this.scale)

        this.isMoving = false
        this.dir = 1
        this.moveSpeed = 1

    }

    //sets the x and y position of the player to the provided vector
    spawn(spawnLoc) {

        if(spawnLoc !== null && spawnLoc !== undefined) {
            this.x = spawnLoc.x
            this.y = spawnLoc.y
        }

        this.update()
    }

    update() {
    
        if(this.isMoving) {

            switch(this.dir){
                case 1:
                    //Right
                    this.x += this.moveSpeed
                    break
                case 2:
                    //Left
                    this.x -= this.moveSpeed
                    break
                case 3:
                    //Up
                    this.y -= this.moveSpeed
                    break
                case 4:
                    //Down 
                    this.y += this.moveSpeed
                    break
            } 

        }


        //set player location 
        this.sprite.x = this.x
        this.sprite.y = this.y

       

    }





}