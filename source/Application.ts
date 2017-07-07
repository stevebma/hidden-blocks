namespace HiddenBlocks {

    export class Application extends PIXI.Application {

        // Model-View-Controller instances for the game
        private _gameModel: Game = undefined;
        private _gameController: GameController = undefined;
        private _gameView: GameView = undefined;

        constructor() {
            super({ width: 1024, height: 768, backgroundColor: 0xf7ec5f}); // yellllloo
            this.preload();
        }

        public preload(): void {

            PIXI.loader
                .add('spritesheet', 'assets/spritesheet.json')
                .load((loader, resources) => {
                    console.log('Preload complete');
                    this.onAssetsLoaded();
                });
        }

        public initScene(): void {

            // create game MVC
            this._gameModel = new Game();
            this._gameView = new GameView(this._gameModel);
            this._gameController = new GameController(this._gameModel, this._gameView);

            // add gameView to PIXI stage
            this.stage.addChild(this._gameView);

            // Animate update
            this.ticker.add((delta) => {
                // update all tweens
                TWEEN.update(this.ticker.lastTime);
            });
        }

        public onAssetsLoaded(): void {
            this.initScene();
        }
    }
}