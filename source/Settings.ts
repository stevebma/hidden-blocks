namespace HiddenBlocks {

    export module Settings {

        export class Grid {
            public static Height: number = 10;
            public static Width: number = 10;
        }

        export class Blocks {
            public static PivotPixels: Vec2 = new Vec2([32, 32]);   // anchor point
            public static SizePixels: Vec2 = new Vec2([64, 64]);    // size of a block in pixels
        }

        // tween durations in milliseconds
        export class Tweens {

            public static BlockDestroyDurationMsecs: number = 200;
            public static BlockDropDurationMsecs: number = 400;
            public static BlockInsertDropDurationMsecs: number = 300;
            public static BlockSwapDurationMsecs: number = 250;
        }

        export class Masks {

            // L-shape (8 configurations)
            public static L: number[][][] = [
                [
                    [1, 0],
                    [1, 0],
                    [1, 1]
                ],
                [
                    [0, 1],
                    [0, 1],
                    [1, 1]
                ],
                [
                    [1, 1],
                    [1, 0],
                    [1, 0]
                ],
                [
                    [1, 1],
                    [0, 1],
                    [0, 1]
                ],
                [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                [
                    [1, 1, 1],
                    [1, 0, 0]
                ],
                [
                    [1, 1, 1],
                    [0, 0, 1]
                ]
            ];

            // Square/block -shape (just 1 configuration)

            public static B: number[][][] = [
                [
                    [1, 1],
                    [1, 1]
                ]
            ];

            // I-shape (2 configurations)

            public static I: number[][][] = [
                [
                    [1, 1, 1, 1]
                ],
                [
                    [1],
                    [1],
                    [1],
                    [1]
                ]
            ];

            // S-shape (4 configurations)

            public static S: number[][][] = [
                [
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [1, 0]
                ],
                [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                [
                    [0, 1, 1],
                    [1, 1, 0]
                ]
            ];

            // T-shape (4 configurations)

            public static T: number[][][] = [
                [
                    [1, 0],
                    [1, 1],
                    [1, 0]
                ],
                [
                    [0, 1],
                    [1, 1],
                    [0, 1]
                ],
                [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                [
                    [1, 1, 1],
                    [0, 1, 0]
                ]
            ];
        }
    }
}