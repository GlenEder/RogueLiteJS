

class Rect {

    constructor(x, y, w, h) {

        this.x = x
        this.y = y
        this.width = w
        this.height = h

        this.box = new PIXI.Graphics()
        this.box.render()
    }

    updatePos(x, y) {
        this.x = x
        this.y = y
    }


    render() {
        this.box.lineStyle(2, 0xFFFFFF, 1, 0);
        this.box.beginFill(0xAA4F08);
        this.box.drawRect(this.x, this.y, this.w, this.h)
        this.box.endFill()
    }

    printInfo() {
        console.log("Rect.js: x: " + this.x + ", y: " + this.y )
    }

}