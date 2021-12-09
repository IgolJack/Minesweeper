var canvas = document.querySelector("#game");

var h1 = document.getElementsByTagName('h3')[0];
var reset = document.getElementById('rst');
var sec = 0;
var min = 0;
var hrs = 0;
var t;

var context = canvas.getContext("2d");
var intPoleWidth = 20;
var intPoleHeight = 20;
var intCountOfMines = 30;
var widthAndHeightOfPole = 20;
var intSeizeOfCell = 20;

var arrPole = [];
var intCountOfSearchedMines = 0; 
var intCountOfPinnedFlags = 0;
var StatusOfGame;

function StartGame() {
	var intCountOfStandMines = 0; //n
	var row = 0;
	var col = 0;
	var intCountMines; //k

	for (row = 0; row < widthAndHeightOfPole; row++) {
		var arrTemp = [];
		for (col = 0; col < widthAndHeightOfPole; col++) {
			arrTemp.push(0);
		}
		
		arrPole.push(arrTemp);
	}

	do {
		row = getRandomInt(1, 19);
		col = getRandomInt(1, 19);

		if(arrPole[row][col] != 9) {
			arrPole[row][col] = 9; 
			intCountOfStandMines++;
		}

	} while (intCountOfStandMines != intCountOfMines);

	for (var row = 0; row < widthAndHeightOfPole; row++) {
		for(var col = 0; col < widthAndHeightOfPole; col++) {
			
			if (arrPole[row][col] != 9) {
				intCountMines = 0;

				var row_1 = row - 1; 
				var col_1 = col - 1;
				var col1  = col + 1;
				var row1  = row + 1;

				if (row_1 > 0 && col_1 > 0) {
					if (arrPole[row - 1][col - 1] == 9) intCountMines++;
				}
				if (row_1 > 0) {
					if (arrPole[row - 1][col] == 9) intCountMines++;
				}
				if (col_1 > 0) {
					if (arrPole[row][col - 1] == 9) intCountMines++;
				}
				if (col1 < widthAndHeightOfPole) {
					if (arrPole[row][col + 1] == 9) intCountMines++;
				}
				if (row_1 > 0 && col1 < widthAndHeightOfPole) {
					if (arrPole[row - 1][col + 1] == 9) intCountMines++;
				}
				if (row1 < widthAndHeightOfPole && col_1 > 0) {
					if (arrPole[row + 1][col - 1] == 9) intCountMines++;
				}
				if (row1 < widthAndHeightOfPole) {
					if (arrPole[row + 1][col] == 9) intCountMines++;
				}
				if (row1 < widthAndHeightOfPole && col1 < widthAndHeightOfPole) {
					if (arrPole[row + 1][col + 1] == 9) intCountMines++;
				}

				arrPole[row][col] = intCountMines;
			}
		
			StatusOfGame = 0;
			intCountOfSearchedMines = 0;
			intCountOfPinnedFlags = 0;
		}
	}
}

function ShowPole() {
	for (var row = 0; row < widthAndHeightOfPole; row++) {
		for (var col = 0; col < widthAndHeightOfPole; col++) {
			kletka(row, col)
		}
	}
}

function cell(x, y, color) {
	if (!color) {
		color = 'black';
	}
	context.fillStyle = color;
	context.strokestyle = color;
	context.fillRect(x, y, intSeizeOfCell, intSeizeOfCell);
	context.strokeRect(x, y, intSeizeOfCell, intSeizeOfCell);
}

function font(x, y, text, color) {
	if (!color) {
		color = "black"
	}
	context.fillStyle = color;
	context.strokeStyle = color;
	context.font = "10pt Arial";
	context.fillText(text, x+8, y+15)

	context.fillStyle = 'black';
	context.strokeStyle = 'black';
}

function openCell(row, col) {
 
	if (row < widthAndHeightOfPole && col < widthAndHeightOfPole && row >= 0 && col >= 0) {
		
		var Pole = arrPole[row][col];

		if (Pole == 0) {
			arrPole[row][col] = 100;
			kletka(row, col);
			
			//открыть примыкающие, сверху, снизу, слева, справа
			openCell(row, col-1);
			openCell(row-1, col);
			openCell(row, col+1);
			openCell(row+1, col);

			//открыть по диагонале
			openCell(row-1, col-1);
			openCell(row-1, col+1);
			openCell(row+1, col-1);
			openCell(row+1, col+1);
	
		} else {
			if (Pole < 100 && Pole != -3) {
				arrPole[row][col] = arrPole[row][col] + 100;
				kletka(row, col)
			}
		}
	}
}

function kletka(row, col) {
	var y = row * widthAndHeightOfPole;
	var x = col * widthAndHeightOfPole;
	var Pole = arrPole[row][col];

		if (Pole < 100) {
			cell(x, y, 'lightgray')
		}
	
		if (Pole >= 100) {
			if (Pole != 109) {
				cell(x, y, 'white')
			}
			else {
				mine(x,y);
			}
	
			if (Pole >= 101 && Pole <= 108) {
				font(x, y, String(Pole - 100))
			}
	
		}

		if (Pole >= 200) {
			flag(x,y);
		}

		// if (StatusOfGame == 2 && Pole % 10 == 9) {
		// 	mine(x,y);
		// }
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	gameObject.context.fillStyle = board_background;
	gameObject.context.strokestyle = board_border;
	gameObject.context.fillRect(0, 0, width, width);
	gameObject.context.strokeRect(0, 0, width, width);
}

function htmlInitialization() {
	gameObject.canvas = document.querySelector("#gameCanvas");
	gameObject.context = gameObject.canvas.getContext("2d");
	initialization();
}

canvas.addEventListener('mousedown', (e) => {
	if (StatusOfGame == 2) return;
	if (StatusOfGame == 0) StatusOfGame = 1;

	
	var col = Math.round(e.clientX / 20) - 1;
	var row = Math.round(e.clientY / 20) - 1;


	var Pole = arrPole[row][col];

	if (e.which == 1) {
		
		if (Pole == 9) {
			arrPole[row][col] += 100;
			kletka(row, col);
			console.log('BOMB!')
			setTimeout(console.log('ВЫ ПРОИГРАЛИ!!!!'), 2000)
		}
		else if (Pole < 9) {
			openCell(row, col)
		}
	}

	else if (e.which == 3) {
		if (Pole <= 9) {
			intCountOfPinnedFlags++;
			
			if(Pole == 9) {
				intCountOfSearchedMines++;
			}
			arrPole[row][col] += 200;

			if (intCountOfSearchedMines == intCountOfMines && intCountOfPinnedFlags == intCountOfMines) {
				StatusOfGame = 2;
				location.reload()
			} else {
				kletka(row, col);
			}
		}
		else {
			if (Pole >= 200) {
				intCountOfPinnedFlags--;
				if (Pole == 209) {
					intCountOfSearchedMines--;
				}
				arrPole[row][col] -= 200;
				kletka(row, col);
			}
		}
	}

	console.log('FLAGS:', intCountOfPinnedFlags, '\n', 'MINESFIND:', intCountOfSearchedMines, '\n', 'AllMInes:', intCountOfMines)
})

function op() {
	arrPole = [];
	StartGame();

	for (var row = 0; row < intPoleWidth; row++) {
		arrPole[row][0] = -3;
		arrPole[row][19] = -3;
	}

	for (var col = 0; col < intPoleWidth; col++) {
		arrPole[0][col] = -3;
		arrPole[19][col] = -3;
	}

	ShowPole();
	timer();
}


function flag(x,y) {
	font(x-5, y, '🚩');
}
function mine(x,y) {
	font(x-7, y, '💣');
}

op();


function tick(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}
function add() {
    tick();
    h1.textContent = (hrs > 9 ? hrs : "0" + hrs) 
        	 + ":" + (min > 9 ? min : "0" + min)
       		 + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}

