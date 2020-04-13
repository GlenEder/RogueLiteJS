
window.addEventListener("load", () => {
    //Create a Pixi Application
    let app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/dirtGrass.png", 16, 16, 9, "dirt", () => {
        let dirt = getSprite("dirt_1")
        dirt.scale.set(10)
        app.stage.addChild(dirt)
    })

    let currRoom = new Room(10, 10, 20)


})

