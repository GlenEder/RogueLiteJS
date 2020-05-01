

//returns value within range of min - max
function clamp(value, min, max) {
    if(value < min) return min
    if(value > max) return max
    return value
}

// returns random key from map
function getRandomKey(collection) {
    let keys = Array.from(collection.keys())
    return keys[Math.floor(Math.random() * keys.length)]
}