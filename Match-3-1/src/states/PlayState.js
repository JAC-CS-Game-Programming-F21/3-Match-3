import Board from "../objects/Board.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import { SoundName } from "../enums.js";
import {
	BOARD_POSITION_CENTER,
	BOARD_SIZE,
	context,
	keys,
	sounds,
	TILE_SIZE,
} from "../globals.js";
import State from "../../lib/State.js";

export default class PlayState extends State {
	constructor() {
		super();

		this.board = new Board(BOARD_POSITION_CENTER.x, BOARD_POSITION_CENTER.y);

		// Position in the grid which we're currently highlighting.
		this.cursor = { boardX: 0, boardY: 0 };

		// Tile we're currently highlighting (preparing to swap).
		this.selectedTile = null;
	}

	update(dt) {
		this.updateCursor();

		// If we've pressed enter, select or deselect the currently highlighted tile.
		if (keys.Enter) {
			keys.Enter = false;

			this.selectTile();
		}
	}

	render() {
		this.board.render();

		if (this.selectedTile) {
			this.renderSelectedTile();
		}

		this.renderCursor();
		this.renderUserInterface();
	}

	updateCursor() {
		let x = this.cursor.boardX;
		let y = this.cursor.boardY;

		if (keys.w) {
			keys.w = false;
			y = Math.max(0, this.cursor.boardY - 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.s) {
			keys.s = false;
			y = Math.min(BOARD_SIZE - 1, this.cursor.boardY + 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.a) {
			keys.a = false;
			x = Math.max(0, this.cursor.boardX - 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.d) {
			keys.d = false;
			x = Math.min(BOARD_SIZE - 1, this.cursor.boardX + 1);
			sounds.play(SoundName.Select);
		}

		this.cursor.boardX = x;
		this.cursor.boardY = y;
	}

	selectTile() {
		const highlightedTile = this.board.tiles[this.cursor.boardY][this.cursor.boardX];

		// If nothing is selected, select current tile.
		if (!this.selectedTile) {
			this.selectedTile = highlightedTile;
		}
		// Remove highlight if already selected.
		else if (this.selectedTile === highlightedTile) {
			this.selectedTile = null;
		}
		// Otherwise, do the swap.
		else {
			this.board.swapTiles(this.selectedTile, highlightedTile);
			this.selectedTile = null;
		}
	}

	renderSelectedTile() {
		context.save();
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		roundedRectangle(
			context,
			this.selectedTile.x + this.board.x,
			this.selectedTile.y + this.board.y,
			TILE_SIZE,
			TILE_SIZE,
			5,
			true,
			false
		);
		context.restore();
	}

	renderCursor() {
		context.save();
		context.strokeStyle = 'white';
		context.lineWidth = 4;

		roundedRectangle(
			context,
			this.cursor.boardX * TILE_SIZE + this.board.x,
			this.cursor.boardY * TILE_SIZE + this.board.y,
			TILE_SIZE,
			TILE_SIZE,
		);
		context.restore();
	}

	renderUserInterface() {
		context.save();
		context.fillStyle = 'white';
		context.font = '15px Joystix';
		context.fillText(`Cursor Tile:   (${this.cursor.boardX}, ${this.cursor.boardY})`, 10, 20);
		context.fillText(`Selected Tile: (${this.selectedTile ? this.selectedTile.boardX : '_'}, ${this.selectedTile ? this.selectedTile.boardY : '_'})`, 10, 40);
		context.restore();
	}
}
