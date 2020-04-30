

class Tile {

    /*
    x -- x position of tile in walkable grid
    y -- y position of tile in walkable grid
    isWalkable -- if tile is walkable by player & npcs
    */
    constructor(x, y, isWalkable) {
        this.x = x
        this.y = y
        this.isWalkable = isWalkable
        this.sprite = null
    }

    //Set sprite for tile and rotation 
    setSprite(spriteName, spriteDir) {
        this.sprite = getSprite(spriteName)
        this.sprite.x = this.x * this.sprite.width
        this.sprite.y = this.y * this.sprite.height
        this.sprite.anchor.set(0.5)
        this.sprite.rotation = Math.PI * 2 * .25 * spriteDir
        console.log(this.sprite.rotation)
    }

    //Returns sprite of tile with screen cords
    render() {
        return this.sprite
    }

}