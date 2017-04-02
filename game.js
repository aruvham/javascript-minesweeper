
$(document).ready(function(){
	game.initialize(.1);
});

const game = {
	board: [],
	size: 10,
	mineChance: 0.1,

	initialize: function(mineChance) {
		game.mineChance = mineChance;
		createBoard();
		getAllNeighbors();
		$('.tile').on('click', (event) => {
			let coordinates = $(event.target).attr('coordinates')
				.split(' ')
				.map( (el) => +el );
			getTile(...coordinates).activate();
		});
	},

	reset: function() {
		$('.tileContainer').remove();
		game.board = [];
		game.initialize(.1);
	}
}

function createBoard() {
	var htmlStr = "<div class='tileContainer'>";
	for (var r = 0; r < game.size; r++) {
		htmlStr += "<div class='row'>"
		game.board.push([]);
		for (var c = 0; c < game.size; c++) {
			htmlStr += "<div class='tile' coordinates='" + r + " " + c + "'></div>";
			game.board[r].push(new Tile(r, c));
		}
		htmlStr += "</div>"
	}
	htmlStr += "</div>"
	$(".container").append(htmlStr);
}

function Tile(r, c) {
	this.r = r;
	this.c = c;
	this.coordinates = '[coordinates="' + r + ' ' + c + '"]'; //why is this working?
	this.$node = $('[coordinates="' + r + ' ' + c + '"]'); //and this is not working?
	this.hasMine = game.mineChance > Math.random();
	this.neighbors = null;
	this.adjacentMines = null;
}

Tile.prototype.activate = function () {
	if (!this.activated) {
		// console.log('activated');
		this.activated = true;
		let mineCount = this.adjacentMines;
		if(this.hasMine) {
			alert('kaboom \n\n\n try again');
			game.reset();
		} else {
			$(this.coordinates).addClass(mineCount + "mine activated");
			if (mineCount === 0) {
				this.neighbors.forEach(function(neighborTile) {
					neighborTile.activate();
				});
			} else {
				$(this.coordinates).append('<div class="' + mineCount + '">' + mineCount + '</div>');
			}
		}
	}
}


Tile.prototype.getNeighbors = function() {
	let neighbors = [];
	for (var r = this.r - 1; r <= this.r + 1; r++) {
		for (var c = this.c - 1; c <= this.c + 1; c++) {
			if(onBoard(r, c)) {
				neighbors.push(game.board[r][c]);
			};
		}
	}
	this.neighbors = neighbors;
}

Tile.prototype.sumNeighbors = function() {
	this.adjacentMines = this.neighbors.reduce( (sum, neighborTile) => {return sum + neighborTile.hasMine}, 0);
}

function onBoard (r, c) {
	return r >= 0 && r < game.size && c >= 0 && c < game.size;
}

function getTile(r, c) {
	return game.board[r][c];
}


function getAllNeighbors() {
	for (var r = 0; r < game.size; r++) {
		for (var c = 0; c < game.size; c++) {
			getTile(r, c).getNeighbors();
			getTile(r, c).sumNeighbors();
		}
	}
}
