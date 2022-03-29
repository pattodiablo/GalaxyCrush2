var HORIZONTAL = 1;
		var VERTICAL = 2;
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: window.innerWidth,
		height: window.innerHeight,
		type: Phaser.AUTO,
        backgroundColor: "none",
		transparent: true,
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
	});
	

	game.fixedWidth=window.innerWidth;
	game.fixedHeight=window.innerHeight;
	
	
	game.scene.add("Preload", Preload);

	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");

		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
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
var encoded_url = encodeURI("../font/Roboto-Regular.ttf");
loadFont("Roboto", encoded_url);