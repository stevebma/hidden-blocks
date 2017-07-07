namespace HiddenBlocks {

    export class GameView extends View {

        private _game: Game = undefined;
        private _gridView: GridView = undefined;
        private _shapeViews: ShapeView[] = [];
        private _box: PIXI.Graphics = undefined;

        constructor(game: Game) {
            super();
            this._game = game;
            this._gridView = new GridView(this._game.grid);
            this._box = new PIXI.Graphics();
            this.initScene();
        }

        public get game(): Game {
            return this._game;
        }

        public initScene() {

            let monster: PIXI.Sprite = this.addChild(PIXI.Sprite.fromFrame('monster.png'));
            monster.x = 400;
            monster.y = 40;
            this._gridView.x = 64;
            this._gridView.y = 64;
            this.addChild(this._gridView);

            // draw a box with sample shapes
            this._box.lineStyle(2, 0xFFFFFF, 1);
            this._box.beginFill(0xFFFFFF, 0.75);
            this._box.drawRoundedRect(1024 - 128, 100, 128, 600, 15);
            this._box.endFill();
            this.addChild(this._box);

            this.createShapeViews();

            this._shapeViews[0].position = new PIXI.Point(1024 - 80, 128);
            this._shapeViews[1].position = new PIXI.Point(1024 - 100, 256 + 32);
            this._shapeViews[2].position = new PIXI.Point(1024 - 100, 256 + 128);
            this._shapeViews[3].position = new PIXI.Point(1024 - 100, 512);
        }

        public createShapeViews() {

            this._shapeViews.push(new ShapeView(this.game.shapes[0], 1));
            this.addChild(this._shapeViews[0]);

            this._shapeViews.push(new ShapeView(this.game.shapes[1], 0));
            this.addChild(this._shapeViews[1]);

            this._shapeViews.push(new ShapeView(this.game.shapes[2], 1));
            this.addChild(this._shapeViews[2]);

            this._shapeViews.push(new ShapeView(this.game.shapes[3], 3));
            this.addChild(this._shapeViews[3]);
        }

        get gridView(): GridView {
            return this._gridView;
        }
    }

}