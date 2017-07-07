namespace HiddenBlocks {

    export class GridController {

        // public signals
        public selectionChanged: Signal = undefined;
        public swapSelectionComplete: Signal = undefined;
        public swapCompleted: Signal = undefined;
        public matchesCleared: Signal = undefined;
        public gravityCompleted: Signal = undefined;
        public insertionCompleted: Signal = undefined;

        private _currentSelection: BlockSprite = undefined;
        private _grid: Grid = undefined;
        private _gridView: GridView = undefined;

        private _swapCounter: number = 2;
        private _destructionCounter: number = 0;
        private _gravityDropCounter: number = 0;
        private _insertionDropCounter: number = 0;

        private _inputLocked: boolean= false;

        constructor(grid: Grid, gridView) {

            this._grid = grid;
            this._gridView = gridView;
            this._currentSelection = null;
            this._inputLocked = false;

            this.swapCompleted = new Signal();
            this.selectionChanged = new Signal();
            this.swapSelectionComplete = new Signal();
            this.matchesCleared = new Signal();
            this.gravityCompleted = new Signal();
            this.insertionCompleted = new Signal();
            this.matchesCleared = new Signal();

            this.initBlocks();
        }

        get grid(): Grid {
            return this._grid;
        }

        get gridView(): GridView {
            return this._gridView;
        }

        get inputLocked(): boolean {
            return this._inputLocked;
        }

        set inputLocked(value: boolean) {
            this._inputLocked = value;
        }

        public initBlocks(): void {

            for (var x: number = 0; x < this.grid.width; x++) {
                for (var y: number = 0; y < this.grid.height; y++) {
                    let gridPos: Vec2 = new Vec2([x, y]);
                    let block: Block = this.grid.blockAt(gridPos);
                    let blockSprite: BlockSprite = this.gridView.createBlockSprite(block);
                    this.attachListenersTo(blockSprite);
                }
            }
        }

        private attachListenersTo(blockSprite: BlockSprite) {

            blockSprite.clicked.add((selected: BlockSprite) => {
                this.onBlockClicked(selected);
            });

            blockSprite.dropCompleted.add((sprite: BlockSprite) => {
                this._gravityDropCounter = Math.max(0, this._gravityDropCounter - 1);
                if (this._gravityDropCounter == 0) {
                    // gravity animation completed
                    this.gravityCompleted.dispatch();
                }
            });

            blockSprite.swapCompleted.add((sprite: BlockSprite) => {

                this._swapCounter = Math.max(0, this._swapCounter - 1);

                sprite.highlight(false);

                if (this._swapCounter == 0) {
                    // swap animation completed
                    this._swapCounter = 2;
                    // clear selection
                    this.clearSelection();
                    this.swapCompleted.dispatch();
                }
            });

            blockSprite.destroyed.addOnce(() => {
                this._destructionCounter = Math.max(0, this._destructionCounter - 1);
                if (this._destructionCounter == 0) {
                    // destruction completed
                    this.matchesCleared.dispatch();
                }
            });

        }

        // apply "gravity" and return the number of blocks that were moved
        public applyGravity(): number {

            var dropCount: number = 0;

            // left to right
            for (var x: number = 0; x < this.grid.width; x++) {

                // bottom to top
                for (var y: number = this.grid.height - 1; y >= 0; y--) {

                    let gridPos: Vec2 = new Vec2([x, y]);

                    if (this.grid.isEmptyAt(gridPos)) {

                        // find first block above the emtpy grid location, and drop this block
                        let block: Block = this.grid.firstBlockAbove(gridPos);

                        if (block) {
                            this.grid.moveBlock(block.gridPos, gridPos);
                            dropCount++;
                        }
                    }
                }
            }

            if (dropCount == 0) {
                this.gravityCompleted.dispatch();
            }

            this._gravityDropCounter += dropCount;
            return dropCount;
        }

        // create new blocks in the grid.
        // returns the number of blocks created
        public insertNewBlocks() {

            let insertCount: number = 0;

            // loop over columns
            for (var x: number = 0; x < this.grid.width; x++) {

                // determine how many blocks to insert for this column
                var colInsertCount = this.grid.columnEmptyCount(x);
                var columnJitter: number = Utils.randomInt(25, 50);

                for (var count: number = 0; count < colInsertCount; count++) {

                    // create BlockModel
                    let gridPos: Vec2 = new Vec2([x, count]);
                    let newBlock: Block = Block.createRandom(gridPos);
                    this.grid.setBlockAt(gridPos, newBlock);

                    // create BLockSprite
                    let newBlockSprite: BlockSprite = this.gridView.createBlockSprite(newBlock);
                    let yOffset: number = (count + 2) * Settings.Blocks.SizePixels.y;
                    newBlockSprite.y -= yOffset;
                    this.attachListenersTo(newBlockSprite);

                    // delay each tween to create a gravity 'jitter' effect
                    let animationJitter: number = columnJitter + (colInsertCount - count) * 50;

                    // tween the new sprite towards the grid location
                    newBlockSprite.tweenTo(new PIXI.Point(newBlockSprite.x, newBlockSprite.y + yOffset))
                        .stop().delay(animationJitter).start()
                        .onComplete( () => {
                            this._insertionDropCounter = Math.max(0, this._insertionDropCounter - 1);
                            if (this._insertionDropCounter == 0) {
                                this.insertionCompleted.dispatch();
                            }
                        });

                    this._gridView.addChild(newBlockSprite);

                }

                insertCount += colInsertCount;
            }

            this._insertionDropCounter += insertCount;

            return insertCount;
        }

        public clearMatches(matches: ShapeMatch[]) {

            matches.forEach((match: ShapeMatch) => {
                this._destructionCounter += this.grid.clearMatch(match);
            });
        }

        public findAllMatches(shapes: Shape[]): ShapeMatch[] {
            return this.grid.findAllMatches(shapes);
        }

        public onBlockClicked(selected: BlockSprite) {

            // skip any interaction
            if (this.inputLocked) {
                return;
            }

            // first selection?
            if (this._currentSelection == null) {
                this.select(selected);
                return;
            }

            // only allow selection of adjacent blocks (UP/BELOW or to LEFT/RIGHT)
            if (selected.block.isAdjacentTo(this._currentSelection.block)) {

                // signal that we have a selection of two blocks, which should be swapped
                this.swapSelectionComplete.dispatch(selected, this._currentSelection);

                this.clearSelection();
                selected.highlight(false);

            } else {
                // some non-adjacent block was selected, switch selection
                this.select(selected);
            }
        }

        // marks one block as the current selection
        public select(selected: BlockSprite) {

            // clear any previous selection
            if (this._currentSelection) {
                this.clearSelection();
            }
            this._currentSelection = selected;
            this._currentSelection.highlight(true);
            this.selectionChanged.dispatch(this._currentSelection);
        }

        // clear current selection, and remove highlight
        public clearSelection() {
            if (this._currentSelection) {
                this._currentSelection.highlight(false);
                this._currentSelection = null;
            }
        }
    }
}