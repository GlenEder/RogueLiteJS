

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

    setSprite(spriteName, spriteDir) {
        this.sprite = getSprite(spriteName)
        this.sprite.rotation = (90 * (spriteDir - 1))
    }


}