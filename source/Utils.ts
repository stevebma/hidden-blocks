namespace HiddenBlocks {

    // various utility methods
    export class Utils {

        // generate random integer
        public static randomInt(min: number, max: number): number {
          return min + Math.floor(Math.random() * (max - min + 1));
        }

        // return random element from an array
        public static randomFrom<T>(options: T[]): T {
            return options[Utils.randomInt(0, options.length - 1)];
        }

        // remove a random element from an array
        // returns that element
        public static removeRandomFrom<T>(options: T[]): T {
            let randomIndex: number = Utils.randomInt(0, options.length - 1);
            return options.splice(randomIndex, 1)[0];
        }
    }
}