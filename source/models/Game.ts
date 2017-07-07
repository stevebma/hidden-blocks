namespace HiddenBlocks {

    export class Game {

        private _grid: Grid = undefined;    // grid of Blocks
        private _shapes: Shape[] = [];      // shapes that the player should form
        private _swapCount: number = 0;     // number of swaps performed by the player
        private _score: number = 0;         // player score

        constructor() {
            this._grid = new Grid(Settings.Grid.Width, Settings.Grid.Height);
            this.initShapes();
        }

        get grid(): Grid {
            return this._grid;
        }

        get shapes(): Shape[] {
            return this._shapes;
        }

        private initShapes() {

            // This is configurable, obviously:

            this._shapes.push(new Shape(Settings.Masks.I, Color.Green));

            // Pink Block-shape
            this._shapes.push(new Shape(Settings.Masks.B, Color.Pink));

            // Yellow S-shape
            this._shapes.push(new Shape(Settings.Masks.S, Color.Yellow));

            // Black L-shape
            this._shapes.push(new Shape(Settings.Masks.L, Color.Black));

            // Experimental: Black T-shape
            // this._shapes.push(new Shape(Settings.Masks.T, Color.Black));
        }
    }
}