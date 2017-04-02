
$(document).ready(function(){
	game.initialize(.05);

	$('.button').on('click', game.reset);
});

const game = {
	board: [],
	size: 10,
	mineChance: 0.15,
	activatedTiles: 0,
	flaggedTiles: 0,
	totalMines: null,

	initialize: function(mineChance) {
		game.mineChance = mineChance;
		createBoard();
		getAllNeighbors();
		game.totalMines = countMines();
		setEventHandlers();

	},

	reset: function() {
		$('.tileContainer').remove();
		game.board = [];
		game.activatedTiles = 0;
		game.totalMines = null;
		game.initialize(0.15);
	},

	win: function() {
		alert('Victory!');
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

function setEventHandlers() {
	$('.tile').on('click', function (event) {
		getTileByEvent(event).activate();
	});
	$('.tile').bind('contextmenu', function(e){
	return false;
	});
	$('.tile').on('contextmenu', function(event) {
		let tile = getTileByEvent(event);
		if (tile.activated && (tile.sumNeighbors('flagged') === tile.sumNeighbors('hasMine'))) {
			tile.activateNeighbors();
		} else {
			tile.flag();
		}
	});
}

function Tile(r, c) {
	this.r = r;
	this.c = c;
	this.coordinates = '[coordinates="' + r + ' ' + c + '"]'; //why is this working?
	this.$node = $('[coordinates="' + r + ' ' + c + '"]'); //and this is not working?
	this.hasMine = game.mineChance > Math.random();
	this.neighbors = null;
	this.flagged = false;
}

Tile.prototype.activate = function () {
	if (!this.activated && !this.flagged) {
		// console.log('activated');
		this.activated = true;
		game.activatedTiles++;
		let mineCount = this.sumNeighbors('hasMine');
		if(this.hasMine) {
			alert('kaboom \n\n try again');
		} else {
			$(this.coordinates).addClass(mineCount + "mine activated");
			if (mineCount === 0) {
				this.activateNeighbors();
				} else {
				$(this.coordinates).text(mineCount);
			}
		}
		if (game.activatedTiles + game.totalMines === (game.size * game.size)) {
			game.win();
		}
	}
}

Tile.prototype.flag = function () {
	if (!this.activated){
		this.flagged ? game.flaggedTiles-- : game.flaggedTiles++;
		this.flagged = !this.flagged;
		$(this.coordinates).toggleClass('flagged');
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

Tile.prototype.sumNeighbors = function(prop) {
	return this.neighbors.reduce( (sum, neighborTile) => {return sum + neighborTile[prop]}, 0);
}

Tile.prototype.activateNeighbors = function() {
	this.neighbors.forEach(function(neighborTile) {
		neighborTile.activate();
	})
}

function getAllNeighbors() {
	for (var r = 0; r < game.size; r++) {
		for (var c = 0; c < game.size; c++) {
			let tile = getTile(r, c);
			tile.getNeighbors();
		}
	}
}

function countMines() {
	let sum = 0;
	for (var r = 0; r < game.size; r++) {
		for (var c = 0; c < game.size; c++) {
			if(getTile(r, c).hasMine)
			sum++;
		}
	}
	return sum;
}

function onBoard (r, c) {
	return r >= 0 && r < game.size && c >= 0 && c < game.size;
}

function getTile(r, c) {
	return game.board[r][c];
}

function getTileByEvent(event) {
	let coordinates = $(event.target).attr('coordinates')
		.split(' ')
		.map( (el) => +el );
	return getTile(...coordinates)
}
