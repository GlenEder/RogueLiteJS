

class Player {

    constructor() {

        this.x = 0.0;
        this.y = 0.0;
        this.dir = 1;

    }

    spawn() {
        let spawnLoc = getRandomWalkableTile()
        if(spawnLoc !== null) {
            this.x = spawnLoc.x
            this.y = spawnLoc.y
        }
    }

    render() {



    }

}