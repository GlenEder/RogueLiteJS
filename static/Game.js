let app;
let room;
let player;

window.addEventListener("load", () => {
    //Create a Pixi Application
    app = new PIXI.Application();


    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


    //load grass tile
    loadSprite("grassMap", "sprites/GrassCoveredDirt.png")

    loadSheet(app, "sprites/rockTileset.png", 32, 32, 4, 1, "floor", () => {
        loadSheet(app, "sprites/knights.png", 16, 32, 3, 1, "knight", initGame)
    })
    
})

function initGame() {

    //Create Room
    room = new Room(40, "floor", 2)
    room.container.x = app.screen.width / 2
    room.container.y = app.screen.height /2
    app.stage.addChild(room.container)

    //Create plyaer
    //player = new Player(room)
    //player.spawn()
    //room.container.addChild(player.sprite)


    //Event listeners for moment and what not
    document.addEventListener("keydown", (event) => {

        switch(event.keyCode) {
            //d
            case 68:
                player.setMoving(0, true)
                break
            //a
            case 65:
                player.setMoving(1, true)
                break
            //w
            case 87:
                player.setMoving(2, true)
                break
            //s
            case 83:
                player.setMoving(3, true)
                break
            //space bar
            case 32:
                goToNewLevel()
                break
            default:
                console.log(event.keyCode)
        }

    })

    document.addEventListener("keyup", (event) => {

        switch(event.keyCode) {
            //d
            case 68:
                player.setMoving(0, false)
                break
            //a
            case 65:
                player.setMoving(1, false)
                break
            //w
            case 87:
                player.setMoving(2, false)
                break
            //s
            case 83:
                player.setMoving(3, false)
                break
        }

    })






    app.ticker.add((delta) => {
        //player.update(delta)
    })
}


//Handles everything dealing with going to next level
function goToNewLevel() {

    room.loadNewRoom()
    //player.spawn()
    //oom.container.addChild(player.sprite)

}

