var HORIZONTAL = 1;
var VERTICAL = 2;

class Main extends Phaser.Scene {
	constructor(key) {
		super(key);
	}

	preload() {
	
	
		this.load.pack("pack", "assets.json");
	

	}

	create() {
	
		console.log(this)
		if(this.gameWidth!="undefined"){
			this.game.fixedWidth=this.scale.gameSize.width;
		}

		if(this.gameHeight!="undefined"){
			this.game.fixedHeight=this.scale.gameSize.height;
		}
		
		this.game.settings = this.settings;
		this.sceneToGo = this.scene.get("Level");
		this.sceneToGo.setLevel(this);
		this.scene.start("Level");
		
		

	}


}




function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}
var encoded_url = encodeURI("../GalaxyCrush2/font/Roboto-Regular.ttf");
loadFont("Roboto", encoded_url);


function addBackground(){

	let gameDiv = document.getElementById("gameDiv");
	gameDiv.style.backgroundColor = this.LeadLiaisonGame.settings.gameData.backgroundColor;
	
}
addBackground();