
window.addEventListener("load", () => {
    //Create a Pixi Application
    let app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/dirtGrass.json")

    app.stage.addChild(getSprite("grassMap"))

})

