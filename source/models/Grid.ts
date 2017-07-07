namespace HiddenBlocks {

    export class Grid {

        private _width: number = 0;
        private _height: number = 0;
        private _size: Vec2 = undefined;
        private _blocks: Block[][] = undefined;

        constructor(width: number, height: number) {

            this._width = width;
            this._height = height;
            this._blocks = new Array<Array<Block>>(this.height);

            for (var index: number = 0; index < this.width; index++) {
                this._blocks[index] = Array<Block>(this.height);
            }

            this.initCheckerBoardRandom();
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        public get size(): Vec2 {
            return this._size;
        }

        public get blocks(): Block[][] {
            return this._blocks;
        }

        public isWithinGrid(pos: Vec2): boolean {
            return (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height);
        }

        private checkBoundsWithException(pos: Vec2) {
            if (!this.isWithinGrid(pos)) {
                throw new Error("Grid index out of bounds (" + pos.xy + ")");
            }
        }

        // returns the number of blanks for a column of the grid
        public columnEmptyCount(columnIndex: number): number {

            var totalEmpty = 0;
            for (var y: number = 0; y < this.height; y++) {
                totalEmpty += this.blocks[y][columnIndex] == null ? 1 : 0;
            }
            return totalEmpty;
        }

        // initialize the grid using a randomized checkerboard pattern
        public initCheckerBoardRandom() {

            // start with all colors
            let colors: Color[] = [Color.Black, Color.Green, Color.Pink, Color.Yellow];

            // pick two random colors for our checkerboard pattern (these are removed from the array)
            let colorA: Color = Utils.removeRandomFrom<Color>(colors);
            let colorB: Color = Utils.removeRandomFrom<Color>(colors);

            // initialize the entire grid
            for (var x: number = 0; x < this.width; x++) {
                for (var y: number = 0; y < this.height; y++) {

                    let gridPos: Vec2 = new Vec2([x, y]);

                    // checkerboard index, 1 for "white" tiles and 0 or 2 for "black" tiles
                    let pattern: number = x % 2 + y % 2;

                    // select a color, this is
                    let color: Color = pattern == 1 ? Utils.randomFrom<Color>(colors) : (pattern == 0 ? colorA : colorB);
                    this.setBlockAt(gridPos, new Block(color, gridPos));
                }
            }
        }

        public moveBlock(from: Vec2, to: Vec2): void {

            var block: Block = this.blockAt(from);

            if (!block) {
                throw new Error('No block?');
            }

            if (!this.isEmptyAt(to)) {
                throw new Error('Trying to move block to non-empty position');
            }
            this.blocks[from.y][from.x] = null;
            this.blocks[to.y][to.x] = block;
            block.dropTo(to);
        }

        public isEmptyAt(pos: Vec2): boolean {
            this.checkBoundsWithException(pos);
            return (this.blocks[pos.y][pos.x] == null);
        }

        public firstBlockAbove(pos: Vec2): Block {

            this.checkBoundsWithException(pos);
            for (var row: number = pos.y - 1; row >= 0; row--) {
                if (this.blocks[row][pos.x]) {
                    return this.blocks[row][pos.x];
                }
            }
            return null;
        }

        public blockAt(pos: Vec2): Block {
            this.checkBoundsWithException(pos);
            return this._blocks[pos.y][pos.x];
        }

        public setBlockAt(pos: Vec2, block: Block) {
            this.checkBoundsWithException(pos);
            this._blocks[pos.y][pos.x] = block;
        }

        // swap two grid locations
        public swap(from: Vec2, to: Vec2): void {

            // swap blocks (with implicit grid bounds check )
            let first: Block = this.blockAt(from);
            let second: Block = this.blockAt(to);
            // update grid
            this.setBlockAt(to, first);
            this.setBlockAt(from, second);
            // update the Block models
            first.swapPositionWith(second);
        }

        // clear a ShapeMatch from the grid, returns the number of destroyed Blocks
        public clearMatch(match: ShapeMatch): number {

            let clearCount: number = 0;

            // loop over the mask
            for (var x: number = 0; x < match.mask.width; x++) {
                for (var y: number = 0; y < match.mask.height; y++) {

                    var pivot: Vec2 = new Vec2([x, y]);
                    var gridPos: Vec2 = Vec2.sum(match.gridPos, pivot);
                    if (match.mask.maskAt(pivot)) {

                        var block: Block = this.blockAt(gridPos);
                        if (block) {
                            block.destroy();
                            this.setBlockAt(gridPos, null);
                            clearCount++;
                        }
                    }
                }
            }

            return clearCount;
        }

        public colorMatchMaskAt(mask: Mask, color: Color, pos: Vec2): boolean {

            // perform a simple bounds check (prevent lookup outside the grid)
            let maxIndex: Vec2 = Vec2.sum(pos, mask.size).subtract(new Vec2([1,1])); // pos + mask.size - (1, 1)

            if ( pos.x  < 0 || pos.y < 0 || maxIndex.x >= this.width || maxIndex.y >= this.height) {
                return false;
            }

            // loop over the mask
            for (var x: number = 0; x < mask.width; x++) {

                for (var y: number = 0; y < mask.height; y++) {

                    var maskPos: Vec2 = new Vec2([x, y]);
                    var gridPos: Vec2 = Vec2.sum(pos, maskPos);
                    var block: Block = this.blockAt(gridPos);

                    // if mask == 1 we should find a block of matching color here..
                    if (mask.maskAt(maskPos) && (block == undefined || block.color != color)) {
                        return false;   // otherwise no match
                    }
                }
            }
            return true;
        }

        // match a shape at a grid position
        // returns an array of ShapeMatch objects or an empty array.
        public matchShapeAt(shape: Shape, pos: Vec2): ShapeMatch[] {

            var matches: ShapeMatch[] = [];

            // try all available masks for this shape
            shape.masks.forEach( (mask: Mask) => {
                if (this.colorMatchMaskAt(mask, shape.color, pos)) {
                    matches.push(new ShapeMatch(shape, mask, pos));
                }
            });

            return matches;
        }

        // brute-force search of all matches within the grid
        // returns an array of ShapeMatch objects or an empty array.
        public findAllMatches(shapes: Shape[]): ShapeMatch[] {

            var matches: ShapeMatch[] = [];

            // loop over the entire grid
            for (var x: number = 0; x < this.width; x++) {
                for (var y: number = 0; y < this.height; y++) {

                    let gridPos: Vec2 = new Vec2([x, y]);

                    // match each shape at the current grid location
                    shapes.forEach((shape: Shape) => {
                        let matchesForShape: ShapeMatch[] = this.matchShapeAt(shape, gridPos);
                        matches = matches.concat(matchesForShape);
                    });
                }
            }

            return matches;
        }
    }
}