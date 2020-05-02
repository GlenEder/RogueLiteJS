

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
  