namespace HiddenBlocks {

    export class BlockSprite extends PIXI.Sprite {

        public clicked: Signal = undefined;
        public swapCompleted: Signal = undefined;
        public dropCompleted: Signal = undefined;
        public destroyed: Signal = undefined;

        private _block: Block;
        private _tween: TWEEN.Tween = null;

        constructor(block: Block) {

            super(BlockSprite.getTexture(block.color));
            this._block = block;

            this.clicked = new Signal();
            this.swapCompleted = new Signal();
            this.dropCompleted = new Signal();
            this.destroyed = new Signal();

            // observe the block model
            this.attachListeners(block);

            this.interactive = true;
            // button mode enable a hand cursor
            this.buttonMode = true;

            // anchor in center
            this.anchor.set(0.5);

            // PIXI pointer events
            this.on('pointerdown', this.onPointerDown)
            this.on('pointerup', this.onPointerUp)
        }

        public get block(): Block {
            return this._block;
        }

        private attachListeners(block: Block) {

            block.destroyed.add(() => {
                this.onDestroyed();
            });

            block.dropped.add((gridPos: Vec2) => {
                this.onDropped(gridPos);
            });

            block.swapped.add((gridPos: Vec2) => {
                this.onSwapped(gridPos);
            });
        }

        public highlight(toggle: boolean): void {
            const white: number = 0xFFFFFF;
            this.alpha = toggle ? 0.9 : 1.0;
            this.tint = toggle ? 0xAAAAAA : white;
        }

        // returns the grid position in pixels (local to grid)
        public gridToPixelPos(gridPos: Vec2): Vec2 {
            // anchor + (x,y) * blocksize
            return Vec2.sum(Settings.Blocks.PivotPixels, Vec2.product(gridPos, Settings.Blocks.SizePixels));
        }

        // returns an Object with {x, y}
        public gridToPixelPosObj(gridPos: Vec2): Object {
            let pixelPos: Vec2 = this.gridToPixelPos(gridPos);
            return { x: pixelPos.x, y: pixelPos.y };
        }

        public onSwapped(gridPos: Vec2) {

            // tile swap tween
            this._tween = new TWEEN.Tween(this.position)
                .to(this.gridToPixelPosObj(gridPos), Settings.Tweens.BlockSwapDurationMsecs)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(() => {
                    this.swapCompleted.dispatch(this);
                })
                .start();
        }

        public onDropped(gridPos: Vec2) {

            // drop animation tween
            this._tween = new TWEEN.Tween(this.position)
                .to(this.gridToPixelPosObj(gridPos), Settings.Tweens.BlockDropDurationMsecs)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(() => {
                    this.dropCompleted.dispatch(this);
                })
                .start();
        }

        public onDestroyed() {

            // destruction tween, scales the sprite
            this._tween = new TWEEN.Tween(this.scale)
                .to({x: 0.01, y: 0.01}, Settings.Tweens.BlockDestroyDurationMsecs)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(() => {
                    this.destroyed.dispatch(this);
                    this.destroy();
                })
                .start();
        }

        public tweenTo(position: PIXI.ObservablePoint | PIXI.Point): TWEEN.Tween {

            this._tween = new TWEEN.Tween(this.position)
                .to({x: position.x, y: position.y}, Settings.Tweens.BlockInsertDropDurationMsecs)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();

            return this._tween;
        }

        private onPointerDown() {
        }

        private onPointerUp() {
            this.clicked.dispatch(this);
        }

        public static getTexture(color: Color): PIXI.Texture {

            var blockFrameNames: string[] = [
                '',
                'block-pink-64x64.png',
                'block-yellow-64x64.png',
                'block-black-64x64.png',
                'block-green-64x64.png'
            ];

            var frameName: string = blockFrameNames[<number>color];
            return PIXI.Texture.fromFrame(frameName);
        }
    }
}