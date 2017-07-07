namespace HiddenBlocks {

    export class ShapeMatch {

        private _shape: Shape = null;
        private _mask: Mask = null;
        private _gridPos: Vec2 = null;

        constructor(shape: Shape, mask: Mask, gridPos: Vec2) {
            this._gridPos = gridPos;
            this._shape = shape;
            this._mask = mask;
        }

        public get shape(): Shape {
            return this._shape;
        }

        public get mask(): Mask {
            return this._mask;
        }

        public get gridPos(): Vec2 {
            return this._gridPos;
        }
    }
}
