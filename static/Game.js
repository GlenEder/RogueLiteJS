let app;

window.addEventListener("load", () => {
    //Create a Pixi Application
    app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/dirt.png", 16, 16, 8, 2, "dirt", initGame)
})

function initGame() {
    // let scale = 5
    // let keyValue = 0
    // for(var j = 0; j < 2; j++) {
    //     for(var i = 0; i < 8; i++) {
    //         let key = "dirt_" + keyValue
    //         keyValue++
    //         let dirt = getSprite(key)
    //         dirt.scale.set(scale)
    //         dirt.x = (i * 20 * scale)
    //         dirt.y = (j * 30 * scale)

    //         let ftsz = 3 * scale
    //         const textStyle = new PIXI.TextStyle({
    //             fill: "white",
    //             fontSize: ftsz
    //         })
    //         const text = new PIXI.Text(key, textStyle)
    //         text.x = i * 20 * scale
    //         text.y = (j * 30 * scale) + (16 * scale) + 10

    //         app.stage.addChild(text)
    //         app.stage.addChild(dirt)
    //     }

    // }
    
    let currRoom = new Room(10, 10, 50, "dirt")
    app.stage.addChild(currRoom.container)
}