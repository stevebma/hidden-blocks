namespace HiddenBlocks {

    export class ShapeView extends View {

        _shape: Shape = undefined;

        constructor(shape: Shape, maskIndex: number) {
            super();
            this._shape = shape;
            this.createBlockSprites(maskIndex);
            this.scale = new PIXI.Point(0.5, 0.5);
        }

        get shape(): Shape {
            return this._shape
        }

        public createBlockSprites(maskIndex: number) {

            let mask: Mask = this.shape.masks[maskIndex];

            // loop over the mask
            for (var x: number = 0; x < mask.width; x++) {
                for (var y: number = 0; y < mask.height; y++) {

                    var pos: Vec2 = new Vec2([x, y]);
                    if (mask.maskAt(pos)) {
                        var block: PIXI.Sprite= new PIXI.Sprite(BlockSprite.getTexture(this.shape.color));
                        block.position = Vec2.product(pos, Settings.Blocks.SizePixels).toPIXI();
                        this.addChild(block);
                    }
                }
            }
        }
    }
}