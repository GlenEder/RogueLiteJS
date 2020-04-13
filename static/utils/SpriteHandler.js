
let spriteMap = new Map()


//Adds provied sprite to map under provided key
function addSpriteToMap(key, sprite) {
    spriteMap.set(key, sprite)
}

//returns sprite under associted key
function getSprite(key) {
    return spriteMap.get(key)
}