namespace HiddenBlocks {

    export class Shape {

        private _masks: Mask[] = [];        // various masks for this shape, for e.g. each rotation / transpose / flip
        private _color: Color;              // color

        constructor(masks: number[][][], color: Color) {

            this._masks = [];
            masks.forEach( (mask: number[][]) => {
                this._masks.push(new Mask(mask));
            });

            this._color = color;
        }

        public get masks(): Mask[] {
            return this._masks;
        }

        public get color(): Color {
            return this._color;
        }

        public set color(color: Color) {
            this._color = color;
        }
    }
}