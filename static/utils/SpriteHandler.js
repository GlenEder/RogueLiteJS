
let spriteMap = new Map()


//Adds provied sprite to map under provided key
function addSpriteToMap(key, texture) {
    spriteMap.set(key, texture)
}

//returns sprite under associted key
function getSprite(key) {
    return new PIXI.Sprite(spriteMap.get(key))
}