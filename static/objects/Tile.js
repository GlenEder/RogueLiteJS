
const CONRNER = 0
const WALL = 1
const BEND = 2
const FLOOR = 3

class Tile {

    /*
    x -- x position of tile in walkable grid
    y -- y position of tile in walkable grid
    type -- type of tile (see consts above)
    scale -- scaling factor room is using
    */
    constructor(x, y, type, scale) {
        this.x = x
        this.y = y
        this.type = type
        this.sprite = null
        this.scale = scale
    }

    //Set sprite for tile and rotation 
    setSpriteWithDir(spriteName, spriteDir) {
        this.sprite = getSprite(spriteName)
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
        this.sprite.scale.set(this.scale)
        this.sprite.x = this.x * this.sprite.width
        this.sprite.y = this.y * this.sprite.height
        this.sprite.anchor.set(0.5)
        this.sprite.rotation = Math.PI * 2 * .25 * spriteDir
    }

    //default set sprite call
    setSprite(spriteName) {
        this.setSpriteWithDir(spriteName, 0)
    }

    //Returns sprite of tile with screen cords
    render() {
        return this.sprite
    }

}