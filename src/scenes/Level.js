
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

        this.canPlay=true;
        this.isGameOver = false;
		this.fieldSize=9;
        this.linesMade=0;
        this.isplaying=false;

		this.tokenSize=64;
		this.totalFieldSize = this.fieldSize*this.tokenSize;

        this.score=0;
        this.timesNormalLines=0;
        this.starCollected=0;


        this.initialTime =this.game.settings.gameData.InitialTime;
   
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
       // this.showObjective()
	
        this.swapSound = this.sound.add('swap');
        this.error1 = this.sound.add('error1');
        this.correct1 = this.sound.add('correct1');
        this.pop1 = this.sound.add('pop1');
		this.pop1.loop = false;

        this.scale.scaleMode="FIT";
        console.log(this.scale.scaleMode)
    

	}

    showText(){
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
        starIcon.displayWidth=this.tokenSize;
        starIcon.displayHeight=this.tokenSize;
        let fixer=25;

       
			infoPanel1.x=this.fieldInitXPoint+infoPanel2.width/2-fixer;
			infoPanel1.y=this.fieldInitYPoint-infoPanel1.height+20;

			starIcon.x=this.fieldInitXPoint+infoPanel2.width/2-50-fixer;
			starIcon.y=this.fieldInitYPoint-infoPanel1.height+20;
            
			infoPanel2.x=this.fieldInitXPoint+infoPanel2.width+infoPanel2.width/1.5-fixer;
			infoPanel2.y=this.fieldInitYPoint-infoPanel1.height+20;
              
            this.collectText = this.add.text(this.fieldInitXPoint+infoPanel2.width/2-80-fixer,this.fieldInitYPoint-infoPanel1.height-50, "Collect", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })


            this.collectObjective = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+20-fixer,this.fieldInitYPoint-infoPanel1.height+20, "30", {
                fontFamily: '"Roboto"',
                fontSize: '50px'
            })
            this.collectObjective.setOrigin(0.5,0.5);

            this.movesText = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+140-fixer,this.fieldInitYPoint-infoPanel1.height-50, "Moves", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })
            
            if(this.game.settings.gameData.isPartyMode){
                this.movesLeft = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+215-fixer,this.fieldInitYPoint-infoPanel1.height+20, "0", {
                    fontFamily: '"Roboto"',
                    fontSize: '50px'
                })

            }else{
                this.movesLeft = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+215-fixer,this.fieldInitYPoint-infoPanel1.height+20, this.game.settings.gameData.movesLeft, {
                    fontFamily: '"Roboto"',
                    fontSize: '50px'
                })

            }

           
            this.movesLeft.setOrigin(0.5,0.5);


            this.scoreText = this.add.text( this.cameras.main.width-100,20, "score", {
                fontFamily: '"Roboto"',
                fontSize: '20px'
            })
            this.scoreText.setOrigin(0.5,0.5)


            this.liveScore = this.add.text( this.cameras.main.width-100,50, "0", {
                fontFamily: '"Roboto"',
                fontSize: '40px'
            })
            this.liveScore.setOrigin(0.5,0.5)

      
        if(this.game.settings.gameData.isPartyMode){
            infoPanel2.visible=false;
            this.collectText.visible=false;
            starIcon.visible=false;
            this.collectObjective.visible=false;

            this.movesText.x-=220;
            this.movesLeft.x-=220;

        }

        if(this.game.settings.gameData.isTimerMode){

            let infoPanel3 = this.add.sprite(  0, 0, "infoPanel");
            infoPanel3.x=this.fieldInitXPoint+infoPanel2.width/2+440-fixer;
            infoPanel3.y=this.fieldInitYPoint-infoPanel1.height+20;

             
            this.timerText = this.add.text(this.fieldInitXPoint+infoPanel2.width/2+440-fixer,this.fieldInitYPoint-infoPanel1.height+20, this.formatTime(this.initialTime), {
                fontFamily: '"Roboto"',
                fontSize: '40px'
            })
            this.timerText.setOrigin(0.5,0.5);
            this.startTimer();

            this.collectText.text="Collected";
            this.movesText.text="Moves";
            this.collectObjective.text=0;
            this.movesLeft.text=0;

          
        }

	}

    startTimer(){

        var flashyText = this.tweens.createTimeline();
        flashyText.add({
            targets: this.timerText,
            scale: 1.2,
            duration: 100,
            repeat:2,
            yoyo: true,
                });         
        flashyText.play();

        this.clockTimer = this.time.addEvent({
            delay: 1000,                // ms
            callback: function(){
                console.log("esto en timer")
                this.initialTime--;
                if(this.initialTime<=0){
                    this.clockTimer.remove();
                    this.results();
                }
            },
            //args: [],
            callbackScope: this,
            loop: true
        });

   
    }

    calcultateScore(){
 
        
       
        let normalLineValue = Math.round(this.game.settings.gameData.gemsValue/3);
   
        let collectedGems = this.collectObjective.text;

        
        this.liveScore.text=this.timesNormalLines*normalLineValue+this.starCollected*this.game.settings.gameData.gemsValue;
    }

    results(){

        let finalScore = Number(this.liveScore.text);
        console.log(finalScore)
                    
            this.data.done({
                prizesWon: [this.data.prizes.pick()],
                score:finalScore
            });
      

           
    }



    showResults(totalScore){
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

         this.ObjectiveText = this.add.text(this.game.fixedWidth/2, this.game.fixedHeight/2, totalScore, {
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
    
    

    update(){

       
        if(this.game.settings.gameData.isTimerMode){

            this.timerFormated=this.formatTime(this.initialTime);
            this.timerText.text= this.timerFormated;

        }
       
    }

    formatTime(seconds){
		// Minutes
		var minutes = Math.floor(seconds/60);
		// Seconds
		var partInSeconds = seconds%60;
		// Adds left zeros to seconds
		partInSeconds = partInSeconds.toString().padStart(2,'0');
		// Returns formated time
		return `${minutes}:${partInSeconds}`;
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
        
                token.setScale(0.5);
                

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
            this.isplaying=true;
            console.log("isPlaygin " + this.isplaying);
			this.dragging=true;
			
			if(pointer.y>this.fieldInitYPoint && pointer.y<this.fieldFinalYPoint){
				if(pointer.x>this.fieldInitXPoint && pointer.x<this.fieldFinalXPoint){ //si esta dentro del tablero
					
					let Yrelative = pointer.y - this.fieldInitYPoint;
					var row = Math.floor(Yrelative/ this.tokenSize);
			

					let Xrelative = pointer.x - this.fieldInitXPoint;
					var col = Math.floor(Xrelative/ this.tokenSize);
				
			
			
			let pickedGem = this.gemAt(row, col);
			if(pickedGem != -1){
				if(this.selectedGem == null){
                   pickedGem.gemSprite.setScale(0.6);
				   pickedGem.gemSprite.setDepth(1);
				   this.selectedGem = pickedGem;
                }
				else{
                    if(this.areTheSame(pickedGem, this.selectedGem)){
						
                        this.selectedGem.gemSprite.setScale(0.5);
                        this.selectedGem = null;
                        this.isplaying=false;
                        console.log("is playing " + this.isplaying)
                    }
					else{
							if(this.areNext(pickedGem, this.selectedGem)){
								console.log("are next")
								this.selectedGem.gemSprite.setScale(0.5);
                                this.dragging=false;
								this.swapGems(this.selectedGem, pickedGem, true);
                               
							}
							else{
								
								this.selectedGem.gemSprite.setScale(0.5);
								pickedGem.gemSprite.setScale(0.6);
								this.selectedGem = pickedGem;
                                this.isplaying=false;
                                console.log("is playing " + this.isplaying)
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
                    this.selectedGem.gemSprite.setScale(0.5);
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
                        this.isplaying=false;
                        console.log("is playing " + this.isplaying)
                    }
                    else{
                        if(this.matchInBoard()){
                            this.handleMoves();
                            this.handleMatches();
                         
                        }
                        else{

                            this.isplaying=false;
                            console.log("is playing " + this.isplaying)

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

           this.correct1.play();
        },this);

        if(this.game.settings.gameData.isTimerMode){
            this.movesLeft.text++;

        }else{
            let movesLeft=Number(this.movesLeft.text);
            if(this.game.settings.gameData.isPartyMode){
                
                movesLeft++;
            }else{
               
                            movesLeft-=1;
                            if(movesLeft<=0){
                                movesLeft=0;
                                this.canPick=false;
                            this.results();
                            }

            }
           
            this.movesLeft.text=movesLeft;
        }
       
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

                    if(this.game.settings.gameData.isPartyMode){
                            console.log("is party mode")
                            this.handlePointsPartyMode(currentColor);
                            this.correct1.play();
                    }else{
                        if(currentColor=="plannet1"){

                                this.handlePoints(true);
                                this.correct1.play();

                                }else{
                                
                                  this.handlePoints(false);
                                  this.pop1.play();
                                 }

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

    handlePointsPartyMode(currentColor){

        let currentScore=Number(this.liveScore.text);
        

        switch(currentColor){

            case "plannet1":
              currentScore+=this.game.settings.gameData.toke1Value;
              
            break;

            
            case "plannet2":
                currentScore+=this.game.settings.gameData.toke2Value;
            break;

            
            case "plannet3":
                currentScore+=this.game.settings.gameData.toke3Value;
            break;

            
            case "plannet4":
                currentScore+=this.game.settings.gameData.toke4Value;
            break;

            
            case "plannet5":
                currentScore+=this.game.settings.gameData.toke5Value;
            break;

        }

        this.liveScore.text=currentScore;

    }

    handlePoints(isStar){
   
        this.timesNormalLines++;
        if(isStar){
           this.starCollected++;
       

        if(this.game.settings.gameData.isTimerMode){
            this.collectObjective.text++;

        }else{
            let points = Number( this.collectObjective.text);
                    points-=3;
                    if(points<=0){
                        points=0;
                        console.log("you win");
                        this.canPick=false;
                        this.isGameOver=true;
                        this.results();
                    }
                    this.collectObjective.text=points;

        }
    

        var flashyText = this.tweens.createTimeline();
            flashyText.add({
				targets: this.collectObjective,
                scale: 1.2,
                duration: 100,
                yoyo: true,
					});
					
					
		flashyText.play();
    }
                this.calcultateScore();
    }

	destroyGems(){
        let destroyed = 0;
        for(let i = 0; i < this.fieldSize; i ++){
            for(let j = 0; j < this.fieldSize; j ++){
                if(this.removeMap[i][j] > 0){
                  
                    destroyed ++;
                if(this.game.settings.gameData.isPartyMode){

                    var destroyGem = this.tweens.createTimeline();
                    destroyGem.add({
                        targets: this.gameArray[i][j].gemSprite,
                        scale: 0.8,
                        duration: 100,
                    
                    });
                  
                    destroyGem.add({
                        targets: this.gameArray[i][j].gemSprite,
                        scale: 0.1,
                        y:this.gameArray[i][j].gemSprite.y,
                        duration: 30,
                        scale: 0.5
                    
                    });
                    destroyGem.add({
                        targets: this.gameArray[i][j].gemSprite,
                        
                        y:this.gameArray[i][j].gemSprite.y,
                        alpha: 0.1,
                        duration: 200,
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

                    if(this.gameArray[i][j].gemColor!="plannet1"){
                        var destroyGem = this.tweens.createTimeline();
                        destroyGem.add({
                            targets: this.gameArray[i][j].gemSprite,
                            scale: 0.6,
                            duration: 100,
                        
                        });
                        destroyGem.add({
                            targets: this.gameArray[i][j].gemSprite,
                            scale: 0.5,
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
                        scale: 0.8,
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
                        scale: 0.5
                    
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
                      
                        scaleY:0.6,
                     
						y: this.gameArray[i][j].gemSprite.y - 10,
						duration: 20
                      
					});

                    fallGems.add({
						targets: this.gameArray[i][j].gemSprite,
                     
						y: this.gameArray[i][j].gemSprite.y + fallTiles * this.tokenSize+10,
						duration: 80 * fallTiles
					});

					fallGems.add({
						targets: this.gameArray[i][j].gemSprite,
                        alpha:1,
                        scaleY:0.5,
						y: this.gameArray[i][j].gemSprite.y + fallTiles * this.tokenSize,
						duration: 20
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
