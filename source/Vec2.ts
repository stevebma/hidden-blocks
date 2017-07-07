module HiddenBlocks {

    export class Vec2 {

        private values = new Float32Array(2);

        get x(): number {
            return this.values[0];
        }

        get y(): number {
            return this.values[1];
        }

        get xy(): number[] {
            return [
                this.values[0],
                this.values[1]
            ];
        }

        set x(value: number) {
            this.values[0] = value;
        }

        set y(value: number) {
            this.values[1] = value;
        }

        set xy(values: number[]) {
            this.values[0] = values[0];
            this.values[1] = values[1];
        }

        constructor(values: number[]= null) {
            if (values) {
                this.xy = values;
            }
        }

        public toPIXI(): PIXI.Point {
            return new PIXI.Point(this.x, this.y);
        }

        at(index: number): number {
            return this.values[index];
        }

        reset(): void {
            this.x = 0;
            this.y = 0;
        }

        copy(dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            dest.x = this.x;
            dest.y = this.y;

            return dest;
        }

        negate(dest: Vec2 = null): Vec2 {
            if (!dest) dest = this;

            dest.x = -this.x;
            dest.y = -this.y;

            return dest;
        }

        equals(vector: Vec2): boolean {

            const EPSILON: number = 0.000001;

            if (Math.abs(this.x - vector.x) > EPSILON)
                return false;

            if (Math.abs(this.y - vector.y) > EPSILON)
                return false;

            return true;
        }

        length(): number {
            return Math.sqrt(this.squaredLength());
        }

        squaredLength(): number {
            var x = this.x,
                y = this.y;

            return (x * x + y * y);
        }

        add(vector: Vec2): Vec2 {
            this.x += vector.x;
            this.y += vector.y;

            return this;
        }

        subtract(vector: Vec2): Vec2 {
            this.x -= vector.x;
            this.y -= vector.y;

            return this;
        }

        multiply(vector: Vec2): Vec2 {
            this.x *= vector.x;
            this.y *= vector.y;

            return this;
        }

        divide(vector: Vec2): Vec2 {
            this.x /= vector.x;
            this.y /= vector.y;

            return this;
        }

        scale(value: number, dest: Vec2 = null): Vec2 {
            if (!dest) dest = this;

            dest.x *= value;
            dest.y *= value;

            return dest;
        }

        normalize(dest: Vec2 = null): Vec2 {
            if (!dest) dest = this;

            var length = this.length();

            if (length === 1) {
                return this;
            }

            if (length === 0) {
                dest.x = 0;
                dest.y = 0;

                return dest;
            }

            length = 1.0 / length;

            dest.x *= length;
            dest.y *= length;

            return dest;
        }

        static dot(vector: Vec2, vector2: Vec2): number {
            return (vector.x * vector2.x + vector.y * vector2.y);
        }

        static distance(vector: Vec2, vector2: Vec2): number {
            return Math.sqrt(this.squaredDistance(vector, vector2));
        }

        static squaredDistance(vector: Vec2, vector2: Vec2): number {
            var x = vector2.x - vector.x,
                y = vector2.y - vector.y;

            return (x * x + y * y);
        }

        static direction(vector: Vec2, vector2: Vec2, dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            var x = vector.x - vector2.x,
                y = vector.y - vector2.y;

            var length = Math.sqrt(x * x + y * y);

            if (length === 0) {
                dest.x = 0;
                dest.y = 0;

                return dest;
            }

            length = 1 / length;

            dest.x = x * length;
            dest.y = y * length;

            return dest;
        }

        static mix(vector: Vec2, vector2: Vec2, time: number, dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            var x = vector.x,
                y = vector.y;

            var x2 = vector2.x,
                y2 = vector2.y;

            dest.x = x + time * (x2 - x);
            dest.y = y + time * (y2 - y);

            return dest;
        }

        static sum(vector: Vec2, vector2: Vec2, dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;

            return dest;
        }

        static difference(vector: Vec2, vector2: Vec2, dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;

            return dest;
        }

        static product(vector: Vec2, vector2: Vec2, dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;

            return dest;
        }

        static quotient(vector: Vec2, vector2: Vec2, dest: Vec2 = null): Vec2 {
            if (!dest) dest = new Vec2();

            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;

            return dest;
        }

        static zero = new Vec2([0, 0]);

    }

}


