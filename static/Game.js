let app;

window.addEventListener("load", () => {
    //Create a Pixi Application
    app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/dirt.png", 16, 16, 8, 2, "dirt", () => {
        loadSheet(app, "sprites/knights.png", 16, 32, 3, 1, "knight", initGame)
    })
    
})

function initGame() {

    //Create Room
    let currRoom = new Room(8, 8, 50, "dirt")
    currRoom.container.x = app.screen.width / 2
    currRoom.container.y = app.screen.height /2
    app.stage.addChild(currRoom.container)

    //Create plyaer
    let player = new Player()
    player.spawn(currRoom.getRandomWalkableTilePos())
    currRoom.container.addChild(player.sprite)


    //Event listeners for moment and what not
    document.addEventListener("keydown", (event) => {

        console.log(event.keyCode)

    })







    app.ticker.add((delta) => {
        player.update()
    })
}
