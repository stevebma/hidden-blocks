namespace HiddenBlocks {

    export class GridView extends View {

        private _grid: Grid = undefined;
        private _background: PIXI.Graphics = undefined;

        constructor(grid: Grid ) {
            super();
            this._grid = grid;

            this._background = new PIXI.Graphics();
            this.initialize();
        }

        public initialize() {

            // draw a rounded rectangle
            this._background.lineStyle(2, 0xFFFFFF, 1);
            this._background.beginFill(0xFFFFFF, 0.75);
            this._background.drawRoundedRect(0, 0, this.grid.width * Settings.Blocks.SizePixels.x, this.grid.height * Settings.Blocks.SizePixels.y, 15);
            this._background.endFill();
            this.addChild(this._background);
        }

        public get grid(): Grid {
            return this._grid;
        }

        public createBlockSprite(block: Block): BlockSprite {
            var blockSprite: BlockSprite = new BlockSprite(block);
            // anchor + (x,y) * blocksize
            var pos: Vec2 = Vec2.sum(Settings.Blocks.PivotPixels, Vec2.product(block.gridPos, Settings.Blocks.SizePixels));
            blockSprite.position = pos.toPIXI();
            this.addChild(blockSprite);
            return blockSprite;
        }
    }
}