

//returns value within range of min - max
function clamp(value, min, max) {
    if(value < min) return min
    if(value > max) return max
    return value
}