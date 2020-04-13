
window.addEventListener("load", () => {
    //Create a Pixi Application
    let app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/dirtGrass.png", 16, 16, 9, "dirt", () => {
        app.stage.addChild(getSprite("dirt_1"))
    })


})

