var size = 10;
var tileSize = 500/size;
var board = [];

// creates html to represent the board and fill the board with new Tile()
function initBoard() {
	var htmlStr = "<div class='tileContainer'>";
	for (var i = 0; i < size; i++) {
		htmlStr += "<div class='row'>"
		board.push([]);
		for (var j = 0; j < size; j++) {
			htmlStr += "<div class='tile " + j + " " + i + "'></div>"
			board[i].push(new Tile(j, i));
		}
		htmlStr += "</div>"
	}
	htmlStr += "</div>"
	$(".container").append(htmlStr);
}

function Tile(x, y) {
	this.x = x;
	this.y = y;
	//this.html = $(".tile ." + x + " ." + y);
}

$(document).ready(function(){
	initBoard();
});
