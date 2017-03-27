var gameboard = [];

function setBoard(size) {
	for (var i = 0; i < size; i++) {
		gameboard[i] = [];
		for (var j = 0; j < size; j++) {
			gameboard[i][j] = new Tile(i, j);
			//insert that tile to the html board as a div
		}
	}
}

function Tile(x, y) {
	this.x = x;
	this.y = j;
	this.html = $
}

