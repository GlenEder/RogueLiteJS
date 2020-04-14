let app;

window.addEventListener("load", () => {
    //Create a Pixi Application
    app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/dirtGrass.png", 16, 16, 9, "dirt", initGame)
})

function initGame() {
    let scale = 3

    for(var i = 0; i < 9; i++) {
        let key = "dirt_" + i
        let dirt = getSprite(key)
        dirt.scale.set(scale)
        dirt.x = i * 20 * scale

        app.stage.addChild(dirt)
    }

    // let currRoom = new Room(10, 10, 50, "dirt")
    // app.stage.addChild(currRoom.container)
}