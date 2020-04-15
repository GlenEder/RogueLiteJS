

class Player {

    constructor() {

        this.x = 0.0;
        this.y = 0.0;
        this.dir = 1;
        this.sprite = getSprite("knight_0")
        this.spawn()
        this.update()

    }

    //sets the x and y position of the player to the provided vector
    spawn(spawnLoc) {
        if(spawnLoc !== null && spawnLoc !== undefined) {
            this.x = spawnLoc.x
            this.y = spawnLoc.y
        }
    }

    update() {

        //set player location 
        this.sprite.x = this.x
        this.sprite.y = this.y

    }



}