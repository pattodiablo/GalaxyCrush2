# WEVEANA GALAXY CRUSH GAME
# www.weveana.com

Settings guide:

# "version": 
The number version of the game, does not affect anything if changed
# "scaleMode":
The scale mode to display the game withing the loader, use FIT
# "gameWidth":
The default width of the game
# "gameHeight": 
The default height of the game
# "boardUnitsSize": 
The size in units of the game its always a square, use 9 for a classic size
# "tokenSize": 
the size of each image on the game, must be the same of the image scaled size, other number than 64 not tested 
# "initialScore": 
A initial value for the score, by default 0

# "isTimerMode":
If enabled will show the timer.
- If FALSE and Party mode is FALSE game will play untill collected items reached 0 
- If TRUE  and Party mode is FALSE game will play from 0 collected items and 0 moves
- If TRUE  and Party mode is  TRUE game will play from 0 moves and objects values will be toke1Value,toke2Value,toke3Value,toke4Value,toke5Value

# "isPartyMode": 
- If enabled, the game is about getting the most lines but the values vary depending toke1Value,toke2Value,toke3Value,toke4Value,toke5Value
- If disabled, the game is about getting the most STARs tokens, the STAR token is always the image loaded as "plannet1". 

# "backSquareFill"
the color of the outside border line of the board
# "backSquare2Fill"
the color of the inside border line of the board

# "InitialTime": 
The time in seconds to be displayed on the counter until reach 0

# "gemsValue":
When PARTY MODE IS DISABLED this is the value of the the STARS and the value of normal tokens divided by 3, for example if Stars value is 30, the other tokens value will be 10 each

# "movesLeft":
When timer is FALSE, and Party mode is FALSE, this value will indicate how many moves are left at the begining

# "toke1Value":
When PartyMode is TRUE, the value of token 1
# "toke2Value": 
When PartyMode is TRUE, the value of token 2
# "toke3Value":
When PartyMode is TRUE, the value of token 3
# "toke4Value": 
When PartyMode is TRUE, the value of token 4
# "toke5Value":
When PartyMode is TRUE, the value of token 5

# "responsive":
To enable or disable the responsive adapting of the game
# "backgroundColor":
the background color of the game in hexadecial value by default #C84A49

# FILES LISTING AND DESCRIPTION

# bgMarbles.png
   The Marbles Background over the background color recomended to be a transparent image with any shape
# correct1.mp3  
   The sound when correct and swap
# error1.mp3
   The sound when a not allowed move is made
# infoPanel.png
   Thebackground image for the collected, moves, timer panels
# plannet1.png
    The shape of the first token, THIS token is always the one to be collected for the NON PARTYMODES
    must be 128x128 IMPORTANT
# plannet2.png
   The shape of the second token
   must be 128x128 IMPORTANT
# plannet3.png
   The shape of the third token
   must be 128x128 IMPORTANT
# plannet4.png
   The shape of the fourth token
   must be 128x128 IMPORTANT
# plannet5.png
   The shape of the fifth token
   must be 128x128 IMPORTANT
# pop1.mp3
    The sound when a normal line is made
# square1.png
    The ligth Shape of the board 
# square2.png
   The darker Shape of the board, displayed in odd by rows
# swap.mp3
    The sound when swaping a token 

  