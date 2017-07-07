namespace HiddenBlocks {

    export class GameController {

        private _gameModel: Game = undefined;
        private _gameView: GameView = undefined;
        private _gridController: GridController = undefined;

        constructor(game: Game, gameView: GameView) {

            this._gameModel = game;
            this._gameView = gameView;

            // Grid controller, performs manipulation on the GridModel and handles the GridView
            this._gridController = new GridController(this.gameModel.grid, this._gameView.gridView);

            // attach listeners to the GridController
            this.attachListeners();
        }

        get gameModel(): Game {
            return this._gameModel;
        }

        private get gridController() : GridController {
            return this._gridController;
        }

        private onSwapSelectionComplete(first: BlockSprite, second: BlockSprite) {
            var from: Vec2 = first.block.gridPos;
            var to: Vec2 = second.block.gridPos;
            this.gameModel.grid.swap(from, to);
        }

        private onSwapComplete() {
            this.startChain();
        }

        private startChain() {

            // start chained events for main game mechanics:
            //
            // 1) find matching shapes within the grid
            // 2) clear these matches from the grid
            // 3) apply gravity (blocks fall down)
            // 4) insert new blocks on top
            // ** repeat until no more new matches occur

            // Start by finding and clearing all matching Shapes
            // Allowed shapes are stored in the GameModel
            var matches: ShapeMatch[] = this.gridController.findAllMatches(this.gameModel.shapes);
            if (matches.length > 0) {
                // don't allow any user interaction while animating etc.
                this.gridController.inputLocked = true;
                // clear
                this.gridController.clearMatches(matches);
            }
        }

        private onMatchesCleared() {
            this.gridController.applyGravity();
        }

        private onGravityCompleted() {
            this.gridController.insertNewBlocks();
        }

        private onInsertionCompleted() {
            // allow user interaction
            this.gridController.inputLocked = false;
            this.startChain();
        }

        // listen to the GridController
        private attachListeners() {

            // handle swapping of two blocks
            this._gridController.swapSelectionComplete.add((first: BlockSprite, second: BlockSprite) => {
               this.onSwapSelectionComplete(first, second);
            });

            // 1) Swap
            this.gridController.swapCompleted.add(()=> {
                this.onSwapComplete();
            });

            // 2) Clear matches
            this.gridController.matchesCleared.add(() => {
                this.onMatchesCleared();
            });

            // 3) Apply gravity
            this.gridController.gravityCompleted.add(() => {
                this.onGravityCompleted();
            });

            // 4) Insert new blocks, and repeat
            this.gridController.insertionCompleted.add(() => {
                this.onInsertionCompleted();
            });
        }
    }
}