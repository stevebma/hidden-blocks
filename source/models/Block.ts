namespace HiddenBlocks {

    export class Block {

        public destroyed: Signal = null;
        public dropped: Signal = null;
        public swapped: Signal = null;

        private _color: Color;
        private _gridPos: Vec2;

        constructor(color: Color, gridPos: Vec2) {
            this._color = color;
            this._gridPos = gridPos.copy();
            this.destroyed = new Signal();
            this.dropped = new Signal();
            this.swapped = new Signal();
        }

        public get color(): Color {
            return this._color;
        }

        public set color(color: Color) {
            this._color = color;
        }

        public get gridPos() {
            return this._gridPos;
        }

        public set gridPos(gridPos: Vec2) {
            this._gridPos = gridPos.copy();
        }

        public destroy() {
            this.destroyed.dispatch();
        }

        public dropTo(gridPos: Vec2) {
            this.gridPos = gridPos.copy();
            this.dropped.dispatch(this.gridPos);
        }

        public swapPositionWith(other: Block) {

            let tmp: Vec2 = this.gridPos.copy();
            this.gridPos = other.gridPos.copy();
            other.gridPos = tmp.copy();

            this.swapped.dispatch(this.gridPos);
            other.swapped.dispatch(other.gridPos);
        }

        // check if this block is adjacent to other
        public isAdjacentTo(other: Block) {
            // only true if up/below/left/right with a distance of 1 unit
            return (Math.abs(other.gridPos.x - this.gridPos.x) + Math.abs(other.gridPos.y - this.gridPos.y) == 1)
        }

        public static createRandom(gridPos: Vec2): Block {
            let randomColor: Color = <Color>(Utils.randomInt(1, 4));
            return new Block(randomColor, gridPos.copy());
        }

    }

}