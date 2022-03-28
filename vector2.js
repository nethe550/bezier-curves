/**
 * @author nethe550
 * @license MIT
 */

/**
 * A two-dimensional vector.
 * @class
 */
class Vector2 {

    /**
     * Creates a new Vector2.
     * @param {number} x - The x component.
     * @param {number} y - The y component.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Linearly interpolates between two vectors at point t.
     * @param {Vector2} a - The starting vector.
     * @param {Vector2} b - The ending vector.
     * @param {number} t - The percentage toward the ending vector.
     * @returns {Vector2} The interpolated vector at point t.
     */
    static Lerp(a, b, t) {
        return new Vector2(
            (1 - t) * a.x + t * b.x,
            (1 - t) * a.y + t * b.y
        );
    }

    /**
     * Calculates the distance between two vectors.
     * @param {Vector2} a - The first vector.
     * @param {Vector2} b - The second vector.
     * @returns {number} The distance between the two vectors.
     */
    static Distance(a, b) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

}