
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write more your code here

	create() {
		
		this.editorCreate();

		this.fieldSize=9;
        this.fieldWidth=5;
        this.fieldHeight=4;
		this.tokenSize=64;
		this.totalFieldSize = this.fieldSize*this.tokenSize;
        this.totalHeight= this.fieldHeight*this.tokenSize;
        this.totalWidth= this.fieldWidth*this.tokenSize;
		this.canPick = true;
		this.dragging = false;
		this.selectedGem = null;
		this.input.on("pointerdown", this.gemSelect, this);
        this.input.on("pointermove", this.startSwipe, this);
        this.input.on("pointerup", this.stopSwipe, this);
		
        
        console.log(this.game.fixedWidth);
        console.log(this.game.fixedHeight);

		this.fieldInitXPoint =  this.game.fixedWidth/2 - this.totalFieldSize/2;
		this.fieldInitYPoint =  this.game.fixedHeight/2 - this.totalFieldSize/2;
		this.fieldFinalXPoint = this.fieldInitXPoint + this.totalFieldSize;
		this.fieldFinalYPoint = this.fieldInitYPoint + this.totalFieldSize;
		
		this.drawBackgroundField();
		this.drawField();
		this.addPanels();
        this.showObjective()
	
        this.swapSound = this.sound.add('swap');
        this.error1 = this.sound.add('error1');
        this.correct1 = this.sound.add('correct1');
        this.pop1 = this.sound.add('pop1');
		this.pop1.loop = false;

        this.scale.scaleMode="FIT";
        console.log(this.scale.scaleMode)
    

	}

    showObjective(){
        let backSquare = this.add.graphics();

		backSquare.fillStyle(0x464646, 0.8);
	    backSquare.fillRoundedRect(0, this.fieldInitYPoint-32,this.game.fixedWidth, this.totalFieldSize+64, 0);
        backSquare.generateTexture('backSquare', this.game.fixedWidth, this.totalFieldSize*2);
  
        this.imageBG = this.add.image(0, 0, 'backSquare');
        backSquare.destroy();
        this.imageBG.y=-500;
        this.imageBG.setOrigin(0,0);

        var showUp = this.tweens.createTimeline();
        showUp.add({
            targets:  this.imageBG,
            y: 0,
            duration: 800,
            ease: "Bounce"
        
                });
                
                
         showUp.play();

         this.ObjectiveText = this.add.text(this.game.fixedWidth/2, this.game.fixedHeight/2, "Collect 30 STARS to win", {
                fontFamily: '"Roboto"',
                fontSize: '60px'
            })
            this.ObjectiveText.setOrigin(0.5,0.5);
            this.ObjectiveText.setScale(0.1);

            var showUpText = this.tweens.createTimeline();
            showUpText.add({
            targets:  this.ObjectiveText,
            scale: 1,
            duration: 800,
            ease: "Bounce"
        
                });
                
                
           showUpText.play();

           var timer = this.time.addEvent({
            delay: 2300,                // ms
            callback: function(){


                var showUpText = this.tweens.createTimeline();
                showUpText.add({
                targets:  this.ObjectiveText,
                alpha: 0,
                duration: 400,
                ease: "Linear"
            
                    });
                    
                    
               showUpText.play();

               var showUp = this.tweens.createTimeline();
               showUp.add({
                   targets:  this.imageBG,
                   alpha: 0,
                   duration: 400,
                   ease: "Linear"
               
                       });
                       
                       
                showUp.play();


            },
            //args: [],
            callbackScope: this,
            loop: true
        });


    }

    
	setLevel(data){
		this.data=data;

	}

    resize (gameSize, baseSize, displaySize, resolution){

        var width = gameSize.width;
        var height = gameSize.height;
    
        this.cameras.resize(width, height);
    
    
    }

	addPanels(){
		let infoPanel1 = this.add.sprite(  0, 0, "infoPanel");
		let infoPanel2 = this.add.sprite(  0, 0, "infoPanel");
		//let settings = this.add.sprite(  0, 0, "settings");
		let starIcon = this.add.sprite(  0, 0, "plannet1");

		if(this.game.fixedWidth>this.game.fixedHeight){

			infoPanel1.x=this.fieldInitXPoint-infoPanel1.width-10;
			infoPanel1.y=this.fieldInitYPoint+infoPanel1.height;

			starIcon.x=this.fieldInitXPoint-infoPanel1.width-50;
			starIcon.y=this.fieldInitYPoint+infoPanel1.height;

			infoPanel2.x=this.fieldInitXPoint-infoPanel1.width-10;
			infoPanel2.y=this.fieldInitYPoint+3*infoPanel1.height;

		//	settings.x=this.fieldInitXPoint-infoPanel1.width-10;
		//	settings.y=this.fieldInitYPoint+3*infoPanel1.height+infoPanel1.height*2;

            
            this.collectText = this.add.text(this.fieldInitXPoint-infoPanel1.width-80,this.fieldInitYPoint+infoPanel1.height-70, "Collect", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })


            this.collectObjective = this.add.text(this.fieldInitXPoint-infoPanel1.width+20,this.fieldInitYPoint+infoPanel1.height, "30", {
                fontFamily: '"Roboto"',
                fontSize: '50px'
            })
            this.collectObjective.setOrigin(0.5,0.5);

            this.movesText = this.add.text(this.fieldInitXPoint-infoPanel1.width-80,this.fieldInitYPoint+3*infoPanel1.height-70, "Moves Left", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })

            this.movesLeft = this.add.text(this.fieldInitXPoint-infoPanel1.width-40,this.fieldInitYPoint+3*infoPanel1.height-25, "20", {
                fontFamily: '"Roboto"',
                fontSize: '50px'
            })


		}else{

			infoPanel1.x=this.fieldInitXPoint+infoPanel2.width/2;
			infoPanel1.y=this.fieldInitYPoint-infoPanel1.height;

            
			starIcon.x=this.fieldInitXPoint+infoPanel2.width/2-50;
			starIcon.y=this.fieldInitYPoint-infoPanel1.height

            
			infoPanel2.x=this.fieldInitXPoint+infoPanel2.width+infoPanel2.width/1.5;
			infoPanel2.y=this.fieldInitYPoint-infoPanel1.height;

		//	settings.x=this.fieldInitXPoint+infoPanel2.width+infoPanel2.width*1.8;
		//	settings.y=this.fieldInitYPoint-infoPanel1.height;
            


              
            this.collectText = this.add.text(this.fieldInitXPoint+infoPanel2.width/2-80,this.fieldInitYPoint-infoPanel1.height-70, "Collect", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })


            this.collectObjective = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+20,this.fieldInitYPoint-infoPanel1.height, "30", {
                fontFamily: '"Roboto"',
                fontSize: '50px'
            })
            this.collectObjective.setOrigin(0.5,0.5);

            this.movesText = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+140,this.fieldInitYPoint-infoPanel1.height-70, "Moves Left", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })

            this.movesLeft = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+190,this.fieldInitYPoint-infoPanel1.height-25, "20", {
                fontFamily: '"Roboto"',
                fontSize: '50px'
            })


		}
	}

	drawBackgroundField(){

		let marbleBg = this.add.sprite(  this.game.fixedWidth/2, this.game.fixedHeight/2, "bgMarbles");
			

		let backSquare = this.add.graphics();

		backSquare.fillStyle(0x464646, 0.5);
	    backSquare.fillRoundedRect(this.fieldInitXPoint-32, this.fieldInitYPoint-32,this.totalFieldSize+64, this.totalFieldSize+64, 32);

		let backSquare2 = this.add.graphics();
		backSquare2.fillStyle(0xf1b07e, 1);
	    backSquare2.fillRoundedRect(this.fieldInitXPoint-12, this.fieldInitYPoint-12,this.totalFieldSize+24, this.totalFieldSize+24, 10);


		for (let i = 0; i < this.fieldSize; i++) {
			for (let j = 0; j < this.fieldSize; j++) {

				let token = this.add.sprite(i*this.tokenSize + this.fieldInitXPoint, j*this.tokenSize+ this.fieldInitYPoint, "square1");
				
				
				if(this.isOdd(i)){
					if(!this.isOdd(j)){
						let token = this.add.sprite(i*this.tokenSize+this.tokenSize/2+ this.fieldInitXPoint, j*this.tokenSize+this.tokenSize/2+ this.fieldInitYPoint, "square2");
					}
				}else{
					if(this.isOdd(j)){
						let token = this.add.sprite(i*this.tokenSize+this.tokenSize/2 + this.fieldInitXPoint, j*this.tokenSize+this.tokenSize/2+ this.fieldInitYPoint, "square2");
					}
					
				}
				token.setOrigin(0,0)
			}

		}

	}

	isOdd(num) { return num % 2;}

	drawField(){
		this.gameArray = [];
        this.poolArray = [];
		this.tokenGroup = this.add.group();
		for (let i = 0; i < this.fieldSize; i++) {
			this.gameArray[i] = [];
			for (let j = 0; j < this.fieldSize; j++) {
			
				let xposition = this.tokenSize * j + this.tokenSize / 2 + this.fieldInitXPoint;
				let yposition = this.tokenSize * i + this.tokenSize / 2 + this.fieldInitYPoint ;

				let token = this.add.sprite(xposition, yposition, "plannet1");
            
				this.tokenGroup.add(token);
				do {
					let randomImageToken=this.getRandomToken();
					token.setTexture(randomImageToken);
					this.gameArray[i][j] = {
					gemColor: randomImageToken,
					gemSprite: token,
					isEmpty: false
					}
				} while (this.isMatch(i, j));
				
				
			}
		}

	
	}



	gemSelect(pointer){
		if(this.canPick){
			this.dragging=true;


			
			if(pointer.y>this.fieldInitYPoint && pointer.y<this.fieldFinalYPoint){
				if(pointer.x>this.fieldInitXPoint && pointer.x<this.fieldFinalXPoint){
					
					let Yrelative = pointer.y - this.fieldInitYPoint;
					var row = Math.floor(Yrelative/ this.tokenSize);
			

					let Xrelative = pointer.x - this.fieldInitXPoint;
					var col = Math.floor(Xrelative/ this.tokenSize);
				
			
			
			let pickedGem = this.gemAt(row, col);
			if(pickedGem != -1){
				if(this.selectedGem == null){
                   pickedGem.gemSprite.setScale(1.2);
				   pickedGem.gemSprite.setDepth(1);
				   this.selectedGem = pickedGem;
                }
				else{
                    if(this.areTheSame(pickedGem, this.selectedGem)){
						
                        this.selectedGem.gemSprite.setScale(1);
                        this.selectedGem = null;
                    }
					else{
							if(this.areNext(pickedGem, this.selectedGem)){
								
								this.selectedGem.gemSprite.setScale(1);
                        
								this.swapGems(this.selectedGem, pickedGem, true);
                               
							}
							else{
								
								this.selectedGem.gemSprite.setScale(1);
								pickedGem.gemSprite.setScale(1.2);
								this.selectedGem = pickedGem;
									}
							}
                        
						}
                      
					}
				
				}
			}
		}

		
	}
	startSwipe(pointer){

		if(this.dragging && this.selectedGem != null){
			
            let deltaX = pointer.downX - pointer.x;
            let deltaY = pointer.downY - pointer.y;
            let deltaRow = 0;
            let deltaCol = 0;
            if(deltaX > this.tokenSize / 2 &&  Math.abs(deltaY) < this.tokenSize / 4){
                deltaCol = -1;
            }
            if(deltaX < -this.tokenSize / 2 &&  Math.abs(deltaY) < this.tokenSize / 4){
                deltaCol = 1;
            }
            if(deltaY > this.tokenSize / 2 &&  Math.abs(deltaX) < this.tokenSize / 4){
                deltaRow = -1;
            }
            if(deltaY < -this.tokenSize / 2 &&  Math.abs(deltaX) < this.tokenSize / 4){
                deltaRow = 1;
            }
            if(deltaRow + deltaCol != 0){
                let pickedGem = this.gemAt(this.getGemRow(this.selectedGem) + deltaRow, this.getGemCol(this.selectedGem) + deltaCol);
                if(pickedGem != -1){
                    this.selectedGem.gemSprite.setScale(1);
                    this.swapGems(this.selectedGem, pickedGem, true);
                    this.dragging = false;
                }
            }
        }
	}
	stopSwipe(pointer){
		this.dragging = false;

	}


	swapGems(gem1, gem2, swapBack){
     
        this.swappingGems = 2;
        this.canPick = false;
        let fromToken = gem1.gemColor;
        let fromSprite = gem1.gemSprite;
        let togemColor = gem2.gemColor;
        let toSprite = gem2.gemSprite;
        let gem1Row = this.getGemRow(gem1);
        let gem1Col = this.getGemCol(gem1);
        let gem2Row = this.getGemRow(gem2);
        let gem2Col = this.getGemCol(gem2);
        this.gameArray[gem1Row][gem1Col].gemColor = togemColor;
        this.gameArray[gem1Row][gem1Col].gemSprite = toSprite;
        this.gameArray[gem2Row][gem2Col].gemColor = fromToken;
        this.gameArray[gem2Row][gem2Col].gemSprite = fromSprite;
        this.tweenGem(gem1, gem2, swapBack);
        this.tweenGem(gem2, gem1, swapBack);
    }


	tweenGem(gem1, gem2, swapBack){
        let row = this.getGemRow(gem1);
        let col = this.getGemCol(gem1);
        this.tweens.add({
            targets: this.gameArray[row][col].gemSprite,
            x: col * this.tokenSize + this.tokenSize / 2+ this.fieldInitXPoint,
            y: row * this.tokenSize + this.tokenSize / 2+ this.fieldInitYPoint,
            duration: 100,
            callbackScope: this,
            onComplete: function(){
                this.swappingGems --;
                if(this.swappingGems == 0){
                    if(!this.matchInBoard() && swapBack){
                        this.swapGems(gem1, gem2, false);
                    }
                    else{
                        if(this.matchInBoard()){
                            this.handleMoves();
                            this.handleMatches();
                        }
                        else{
                            this.canPick = true;
                            this.selectedGem = null;

                        
                            this.error1.play();

                           
                            
                        }
                    }
                }
            }
        });
    }


    handleMoves(){

       this.swapSound.play();
   

        this.swapSound.on('complete', function(){

        //    this.correct1.play();
        },this);

        let movesLeft=Number(this.movesLeft.text);
        movesLeft-=1;
        if(movesLeft<=0){
            movesLeft=0;
            console.log("gameOver")
        }
        this.movesLeft.text=movesLeft;
    }
	matchInBoard(){
        for(let i = 0; i < this.fieldSize; i ++){
            for(let j = 0; j < this.fieldSize; j ++){
                if(this.isMatch(i, j)){
                    return true;
                }
            }
        }
        return false;
    }

	handleMatches(){
        this.removeMap = [];
        for(let i = 0; i < this.fieldSize; i ++){
            this.removeMap[i] = [];
            for(let j = 0; j < this.fieldSize; j ++){
                this.removeMap[i].push(0);
            }
        }
        this.markMatches(HORIZONTAL);
        this.markMatches(VERTICAL);
        this.destroyGems();
    }

	markMatches(direction){
        for(let i = 0; i < this.fieldSize; i ++){
            let colorStreak = 1;
            let currentColor = -1;
            let startStreak = 0;
            let colorToWatch = 0;
            for(let j = 0; j < this.fieldSize; j ++){
                if(direction == HORIZONTAL){
                    colorToWatch = this.gemAt(i, j).gemColor;
                }
                else{
                    colorToWatch = this.gemAt(j, i).gemColor;
                }
                if(colorToWatch == currentColor){
                    colorStreak ++;
                }
                if(colorToWatch != currentColor || j == this.fieldSize - 1){
                    if(colorStreak >= 3){

                        if(currentColor=="plannet1"){
                           this.handlePoints();
                           this.correct1.play();
                        }else{
                            this.pop1.play();
                        }
                        /*
                        if(direction == HORIZONTAL){
                            console.log("HORIZONTAL :: Length = " + colorStreak + " :: Start = (" + i + "," + startStreak + ") :: Color = " + currentColor);
                           
                        }
                        else{
                            console.log("VERTICAL :: Length = " + colorStreak + " :: Start = (" + startStreak + "," + i + ") :: Color = " + currentColor);
                        }*/
                        for(let k = 0; k < colorStreak; k ++){
                            if(direction == HORIZONTAL){
                                this.removeMap[i][startStreak + k] ++;
                            }
                            else{
                                this.removeMap[startStreak + k][i] ++;
                            }
                        }
                    }
                    startStreak = j;
                    colorStreak = 1;
                    currentColor = colorToWatch;
                }
            }
        }
    }


    handlePoints(){
        let points = Number( this.collectObjective.text);
        points-=3;
        if(points<=0){
            points=0;
            console.log("you win")
        }
        this.collectObjective.text=points;

        var flashyText = this.tweens.createTimeline();
            flashyText.add({
				targets: this.collectObjective,
                scale: 1.2,
                duration: 100,
                yoyo: true,
					});
					
					
		flashyText.play();

    }

	destroyGems(){
        let destroyed = 0;
        for(let i = 0; i < this.fieldSize; i ++){
            for(let j = 0; j < this.fieldSize; j ++){
                if(this.removeMap[i][j] > 0){
                  
                    destroyed ++;

                    if(this.gameArray[i][j].gemColor!="plannet1"){
                        	var destroyGem = this.tweens.createTimeline();
                            destroyGem.add({
                                targets: this.gameArray[i][j].gemSprite,
                                scale: 1.2,
                                duration: 100,
                            
                            });
                            destroyGem.add({
                                targets: this.gameArray[i][j].gemSprite,
                                scale: 1,
                                alpha: 0.1,
                                duration: 100,
                                callbackScope: this,
                                onComplete: function(){
                                    destroyed --;
                                    this.gameArray[i][j].gemSprite.visible = false;
                                    this.poolArray.push(this.gameArray[i][j].gemSprite);
                                    if(destroyed == 0){
                                        this.makeGemsFall();
                                        this.replenishField();
                                    }
                                }
                            });
					
					destroyGem.play();

                    }else{

                        var destroyGem = this.tweens.createTimeline();
                        destroyGem.add({
                            targets: this.gameArray[i][j].gemSprite,
                            scale: 1.5,
                            duration: 100,
                        
                        });
                        destroyGem.add({
                            targets: this.gameArray[i][j].gemSprite,
                            angle:360,
                            duration: 130,
                        
                        });
                        destroyGem.add({
                            targets: this.gameArray[i][j].gemSprite,
                            y:this.gameArray[i][j].gemSprite.y,
                            duration: 30,
                            scale: 1
                        
                        });
                        destroyGem.add({
                            targets: this.gameArray[i][j].gemSprite,
                      
                            x:this.collectObjective.x,
                            y:this.collectObjective.y,
                            alpha: 0.1,
                            duration: 400,
                            callbackScope: this,
                            onComplete: function(){
                                destroyed --;
                                this.gameArray[i][j].gemSprite.visible = false;
                                this.poolArray.push(this.gameArray[i][j].gemSprite);
                                if(destroyed == 0){
                                    this.makeGemsFall();
                                    this.replenishField();
                                }
                            }
                        });
                
                      destroyGem.play();


                    }
				
                 
                    this.gameArray[i][j].isEmpty = true;
                }
            }
        }
    }


	makeGemsFall(){
        for(let i = this.fieldSize - 2; i >= 0; i --){
            for(let j = 0; j < this.fieldSize; j ++){
                if(!this.gameArray[i][j].isEmpty){
                    let fallTiles = this.holesBelow(i, j);
                    if(fallTiles > 0){


						var fallGems = this.tweens.createTimeline();
					fallGems.add({
						targets: this.gameArray[i][j].gemSprite,
						y: this.gameArray[i][j].gemSprite.y - 5,
						duration: 20
                      
					});
					fallGems.add({
						targets: this.gameArray[i][j].gemSprite,
						y: this.gameArray[i][j].gemSprite.y + fallTiles * this.tokenSize,
						duration: 80 * fallTiles
					});
					
					fallGems.play();

                    
                        this.gameArray[i + fallTiles][j] = {
                            gemSprite: this.gameArray[i][j].gemSprite,
                            gemColor: this.gameArray[i][j].gemColor,
                            isEmpty: false
                        }
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        }
    }


	replenishField(){
        let replenished = 0;
        for(let j = 0; j < this.fieldSize; j ++){
            let emptySpots = this.holesInCol(j);
            if(emptySpots > 0){
                for(let i = 0; i < emptySpots; i ++){
                    replenished ++;
                    let randomColor = this.getRandomToken();
                    this.gameArray[i][j].gemColor = randomColor;
                    this.gameArray[i][j].gemSprite = this.poolArray.pop()
                    this.gameArray[i][j].gemSprite.setTexture(randomColor);
                    this.gameArray[i][j].gemSprite.visible = true;
                    this.gameArray[i][j].gemSprite.x = this.tokenSize * j + this.tokenSize / 2 + this.fieldInitXPoint;
                    this.gameArray[i][j].gemSprite.y = this.tokenSize / 2 - (emptySpots - i) * this.tokenSize + this.fieldInitYPoint ;
                    this.gameArray[i][j].gemSprite.alpha = 1;
                    this.gameArray[i][j].isEmpty = false;


					var fallGems = this.tweens.createTimeline();
					fallGems.add({
						targets: this.gameArray[i][j].gemSprite,
                        y: this.tokenSize * i + this.tokenSize / 2 + this.fieldInitYPoint+5,
                        duration: 80 * emptySpots,
					});
					fallGems.add({
						targets: this.gameArray[i][j].gemSprite,
                        y: this.tokenSize * i + this.tokenSize / 2 + this.fieldInitYPoint,
                        duration: 20,
                        callbackScope: this,
                        onComplete: function(){
                            replenished --;
                            if(replenished == 0){
                                if(this.matchInBoard()){
                                    this.time.addEvent({
                                        delay: 250,
                                        callback: this.handleMatches()
                                    });
                                }
                                else{
                                    this.canPick = true;
                                    this.selectedGem = null;
                                }
                            }
                        }
					});
					
					fallGems.play();


                 
                }
            }
        }
    }

	holesInCol(col){
        var result = 0;
        for(let i = 0; i < this.fieldSize; i ++){
            if(this.gameArray[i][col].isEmpty){
                result ++;
            }
        }
        return result;
    }

	holesBelow(row, col){
        let result = 0;
        for(let i = row + 1; i < this.fieldSize; i ++){
            if(this.gameArray[i][col].isEmpty){
                result ++;
            }
        }
        return result;
    }
	getRandomToken(){

		let RandomToken=Phaser.Math.Between(1,5);
		switch(RandomToken){

			case 1:
				var token="plannet1"
				break;
			case 2:
				var token="plannet2"
				break;
			case 3:
				var token="plannet3"
				break;
			case 4:
				var token="plannet4"
				break;
			case 5:
				var token="plannet5"
				break;
		}
		return token;
	}

   	isMatch(row, col){
		return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
   	}
   	isHorizontalMatch(row, col){
		return this.gemAt(row, col).gemColor == this.gemAt(row, col - 1).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row, col - 2).gemColor;
   	}
   	isVerticalMatch(row, col){
		return this.gemAt(row, col).gemColor == this.gemAt(row - 1, col).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row - 2, col).gemColor;
   	}
   	gemAt(row, col){
	   if(row < 0 || row >= this.fieldSize || col < 0 || col >= this.fieldSize){
		   return -1;
	   }
	   return this.gameArray[row][col];
   	}

	areTheSame(gem1, gem2){
		
		return this.getGemRow(gem1) == this.getGemRow(gem2) && this.getGemCol(gem1) == this.getGemCol(gem2);
	}

	areNext(gem1, gem2){
		return Math.abs(this.getGemRow(gem1) - this.getGemRow(gem2)) + Math.abs(this.getGemCol(gem1) - this.getGemCol(gem2)) == 1;
	}

	getGemRow(gem){
		let Yrelative = gem.gemSprite.y - this.fieldInitYPoint;
        return Math.floor(Yrelative/ this.tokenSize);

		
    }
    getGemCol(gem){

		let Xrelative = gem.gemSprite.x - this.fieldInitXPoint;
        return Math.floor(Xrelative/ this.tokenSize);
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
