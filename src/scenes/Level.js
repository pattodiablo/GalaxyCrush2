
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
		this.tokenSize=64;
		this.canPick = true;
		this.dragging = false;
		this.selectedGem = null;
		this.input.on("pointerdown", this.gemSelect, this);
        this.input.on("pointermove", this.startSwipe, this);
        this.input.on("pointerup", this.stopSwipe, this);
		this.drawField();
		
		
	}

	drawField(){
		this.gameArray = [];
        this.poolArray = [];
		this.tokenGroup = this.add.group();
		for (let i = 0; i < this.fieldSize; i++) {
			this.gameArray[i] = [];
			for (let j = 0; j < this.fieldSize; j++) {
			
			
				let token = this.add.sprite(this.tokenSize * j + this.tokenSize / 2, this.tokenSize * i + this.tokenSize / 2, "plannet1");
            
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
			let row = Math.floor(pointer.y / this.tokenSize);
            let col = Math.floor(pointer.x / this.tokenSize);
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
            x: col * this.tokenSize + this.tokenSize / 2,
            y: row * this.tokenSize + this.tokenSize / 2,
            duration: 200,
            callbackScope: this,
            onComplete: function(){
                this.swappingGems --;
                if(this.swappingGems == 0){
                    if(!this.matchInBoard() && swapBack){
                        this.swapGems(gem1, gem2, false);
                    }
                    else{
                        if(this.matchInBoard()){
                            this.handleMatches();
                        }
                        else{
                            this.canPick = true;
                            this.selectedGem = null;
                        }
                    }
                }
            }
        });
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
                        if(direction == HORIZONTAL){
                            console.log("HORIZONTAL :: Length = " + colorStreak + " :: Start = (" + i + "," + startStreak + ") :: Color = " + currentColor);
                        }
                        else{
                            console.log("VERTICAL :: Length = " + colorStreak + " :: Start = (" + startStreak + "," + i + ") :: Color = " + currentColor);
                        }
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

	destroyGems(){
        let destroyed = 0;
        for(let i = 0; i < this.fieldSize; i ++){
            for(let j = 0; j < this.fieldSize; j ++){
                if(this.removeMap[i][j] > 0){
                    destroyed ++;
                    this.tweens.add({
                        targets: this.gameArray[i][j].gemSprite,
                        alpha: 0.5,
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
                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            y: this.gameArray[i][j].gemSprite.y + fallTiles * this.tokenSize,
                            duration: 100 * fallTiles
                        });
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
                    this.gameArray[i][j].gemSprite.x = this.tokenSize * j + this.tokenSize / 2;
                    this.gameArray[i][j].gemSprite.y = this.tokenSize / 2 - (emptySpots - i) * this.tokenSize;
                    this.gameArray[i][j].gemSprite.alpha = 1;
                    this.gameArray[i][j].isEmpty = false;
                    this.tweens.add({
                        targets: this.gameArray[i][j].gemSprite,
                        y: this.tokenSize * i + this.tokenSize / 2,
                        duration: 100 * emptySpots,
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
	
        return Math.floor(gem.gemSprite.y / this.tokenSize);
    }
    getGemCol(gem){
        return Math.floor(gem.gemSprite.x / this.tokenSize);
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
