namespace HiddenBlocks {

    // Represent a variation of a shape as a ("binary") mask
    export class Mask {

        private _mask: number[][] = [];

        constructor(mask: number[][]) {
            this._mask = mask;
        }

        public maskAt(pos: Vec2): boolean {
            return (this._mask[pos.y][pos.x] > 0) ? true : false;
        }

        public get width(): number {
            return this._mask[0].length;    // note: this assumes all rows are of equal size
        }

        public get height(): number {
            return this._mask.length;
        }

        public get size(): Vec2 {
            return new Vec2([this.width, this.height]);
        }
    }
}