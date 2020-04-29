

class Tile {

    /*
    x -- x position of tile in walkable grid
    y -- y position of tile in walkable grid
    spriteName -- name for sprite for getting from image handler
    spriteDir -- direction sprite faces (1: no rot, 2: 90deg, 3: 180deg, 4: 270deg) 
    */
    constructor(x, y, walkable, spriteName, spriteDir) {
        this.x = x
        this.y = y
        this.walkable = walkable
        this.sprite = getSprite(spriteName)
        this.sprite.rotation = (90 * (spriteDir - 1))
    }


}