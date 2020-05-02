

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


//returns 8 bit number to use for bitwise operations checking provided map for entries
    /*
        0 1 2
        3   4
        5 6 7 
    */
function entriesAround(pos, map) {
    let power = 0
    let toReturn = 0
    for(var i = -1; i < 2; i++) {
        for(var j = -1; j < 2; j++) {

            if(i === 0 && j === 0) continue

            let deltX = pos.x + j
            let deltY = pos.y + i
            //create key              
            let key = deltX + "/" + deltY                
            if(map.has(key)) {
                toReturn += Math.pow(2, power)
            }
            power++
        }
    }

    return toReturn
}


//Inverts bits of number provided
//https://stackoverflow.com/questions/42450510/invert-unsigned-arbitrary-binary-bits-in-javascript
function invert(x) {
    let significant = 0;
    let test = x;
  
    while (test > 1) {
      test = test >> 1;
      significant = (significant << 1) | 1;
    }
  
    return (~x) & significant;
  }
  