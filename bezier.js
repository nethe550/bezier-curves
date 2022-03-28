/**
 * @author nethe550
 * @license MIT 
 */

/**
 * Creates an asynchronous delay for n milliseconds.
 * @param {number} n - The length of the delay in milliseconds.
 * @returns {Promise} A promise that will be resolved after n milliseconds.
 */
const delay = (n) => new Promise(r => setTimeout(r, n));

/**
 * A generic Bezier curve.
 * @class
 */
class Curve {

    /**
     * Creates a new Bezier curve.
     * @param {[DraggablePoint]} controlPoints - The control points for the curve.
     */
    constructor(...controlPoints) {

        controlPoints = controlPoints[0];

        if (controlPoints.length < 3) throw new Error('A Bezier curve requires a minimum of 3 control points.');

        /**
         * @type {[DraggablePoint]}
         */
        this.controlPoints = controlPoints;

    }

    /**
     * Draws this curve's control points.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    async drawControlPoints(ctx) {
        this.controlPoints.forEach(point => point.draw(ctx), this);
    }


}

/**
 * A quadratic Bezier curve.
 * @class
 */
class QuadraticCurve extends Curve {

    /**
     * Creates a new quadratic Bezier curve.
     * @param {[DraggablePoint]} controlPoints - The control points for the curve.
     */
    constructor(...controlPoints) {

        super(controlPoints);

        /**
         * @type {boolean}
         */
        this.renderControl = true;

        /**
         * @type {boolean}
         */
        this.renderTangent = true;

    }

    /**
     * Draws the curve.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} precision - The step size of the line renderer.
     */
    async draw(ctx, precision=0.01) {

        ctx.lineCap = 'round';

        // control nodes
        if (this.renderControl) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.controlPoints[0].position.x, this.controlPoints[0].position.y);
            ctx.lineTo(this.controlPoints[1].position.x, this.controlPoints[1].position.y);
            ctx.lineTo(this.controlPoints[2].position.x, this.controlPoints[2].position.y);
            ctx.stroke();
        }

        // tangent
        if (this.renderTangent) {
            let atob = Vector2.Lerp(this.controlPoints[0].position, this.controlPoints[1].position, 0.5);
            let btoc = Vector2.Lerp(this.controlPoints[1].position, this.controlPoints[2].position, 0.5);
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(atob.x, atob.y);
            ctx.lineTo(btoc.x, btoc.y);
            ctx.stroke();
        }

        // curve
        let t = 0;
        let lastPoint = null;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;

        while (t < 1) {

            let a = Vector2.Lerp(this.controlPoints[0].position, this.controlPoints[1].position, t);
            let b = Vector2.Lerp(this.controlPoints[1].position, this.controlPoints[2].position, t);
            let c = Vector2.Lerp(a, b, t);

            if (lastPoint) {

                ctx.beginPath();
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();

            }

            lastPoint = c;

            t += precision;

        }

        await this.drawControlPoints(ctx);

    }

}

/**
 * A cubic Bezier curve.
 * @class
 */
class CubicCurve extends Curve {  

    /**
     * Creates a new cubic Bezier curve.
     * @param {[DraggablePoint]} controlPoints - The control points for the curve.
     */
    constructor(...controlPoints) {

        super(controlPoints);

        if (controlPoints.length < 4) throw new Error('A cubic Bezier curve requires at least 4 control points.');

        /**
         * @type {boolean}
         */
        this.renderControl = true;

        /**
         * @type {boolean}
         */
        this.renderTangent = true;

    }

    /**
     * Draws the curve.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} precision - The step size of the line renderer.
     */
    async draw(ctx, precision=0.01) {

        ctx.lineCap = 'round';

        // control nodes
        if (this.renderControl) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.controlPoints[0].position.x, this.controlPoints[0].position.y);
            ctx.lineTo(this.controlPoints[1].position.x, this.controlPoints[1].position.y);
            ctx.lineTo(this.controlPoints[2].position.x, this.controlPoints[2].position.y);
            ctx.lineTo(this.controlPoints[3].position.x, this.controlPoints[3].position.y);
            ctx.stroke();
        }

        // tangent
        if (this.renderTangent) {
            let atob = Vector2.Lerp(this.controlPoints[0].position, this.controlPoints[1].position, 0.5);
            let btoc = Vector2.Lerp(this.controlPoints[1].position, this.controlPoints[2].position, 0.5);
            let ctod = Vector2.Lerp(this.controlPoints[2].position, this.controlPoints[3].position, 0.5);
            let abtobc = Vector2.Lerp(atob, btoc, 0.5);
            let bctocd = Vector2.Lerp(btoc, ctod, 0.5);
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(atob.x, atob.y);
            ctx.lineTo(btoc.x, btoc.y);
            ctx.lineTo(ctod.x, ctod.y);
            ctx.moveTo(abtobc.x, abtobc.y);
            ctx.lineTo(bctocd.x, bctocd.y);
            ctx.stroke();
        }

        // curve
        let t = 0;
        let lastPoint = null;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;

        while (t < 1) {

            let a = Vector2.Lerp(this.controlPoints[0].position, this.controlPoints[1].position, t);
            let b = Vector2.Lerp(this.controlPoints[1].position, this.controlPoints[2].position, t);
            let c = Vector2.Lerp(this.controlPoints[2].position, this.controlPoints[3].position, t);
            let d = Vector2.Lerp(a, b, t);
            let e = Vector2.Lerp(b, c, t);
            let f = Vector2.Lerp(d, e, t);

            if (lastPoint) {

                ctx.beginPath();
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(f.x, f.y);
                ctx.stroke();

            }

            lastPoint = f;

            t += precision;

        }

        await this.drawControlPoints(ctx);

    }

}

/**
 * A quartic Bezier curve.
 * @class
 */
class QuarticCurve extends Curve {

    /**
     * Creates a new quartic Bezier curve.
     * @param {[DraggablePoint]} controlPoints - The control points for the curve.
     */
     constructor(...controlPoints) {

        super(controlPoints);

        if (controlPoints.length < 5) throw new Error('A quartic Bezier curve requires at least 5 control points.');

        /**
         * @type {boolean}
         */
        this.renderControl = true;

        /**
         * @type {boolean}
         */
        this.renderTangent = true;

    }

    /**
     * Draws the curve.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} precision - The step size of the line renderer.
     */
    async draw(ctx, precision=0.01) {

        ctx.lineCap = 'round';

        // control nodes
        if (this.renderControl) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.controlPoints[0].position.x, this.controlPoints[0].position.y);
            ctx.lineTo(this.controlPoints[1].position.x, this.controlPoints[1].position.y);
            ctx.lineTo(this.controlPoints[2].position.x, this.controlPoints[2].position.y);
            ctx.lineTo(this.controlPoints[3].position.x, this.controlPoints[3].position.y);
            ctx.lineTo(this.controlPoints[4].position.x, this.controlPoints[4].position.y);
            ctx.stroke();
        }

        // tangent
        if (this.renderTangent) {
            let atob = Vector2.Lerp(this.controlPoints[0].position, this.controlPoints[1].position, 0.5);
            let btoc = Vector2.Lerp(this.controlPoints[1].position, this.controlPoints[2].position, 0.5);
            let ctod = Vector2.Lerp(this.controlPoints[2].position, this.controlPoints[3].position, 0.5);
            let dtoe = Vector2.Lerp(this.controlPoints[3].position, this.controlPoints[4].position, 0.5);
            let abtobc = Vector2.Lerp(atob, btoc, 0.5);
            let bctocd = Vector2.Lerp(btoc, ctod, 0.5);
            let cdtode = Vector2.Lerp(ctod, dtoe, 0.5);
            // a renaming of these interpolated points may be needed
            let abtobcTobctocd = Vector2.Lerp(abtobc, bctocd, 0.5);
            let bctocdTocdtode = Vector2.Lerp(bctocd, cdtode, 0.5);
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(atob.x, atob.y);
            ctx.lineTo(btoc.x, btoc.y);
            ctx.lineTo(ctod.x, ctod.y);
            ctx.lineTo(dtoe.x, dtoe.y);
            ctx.moveTo(abtobc.x, abtobc.y);
            ctx.lineTo(bctocd.x, bctocd.y);
            ctx.lineTo(cdtode.x, cdtode.y);
            ctx.moveTo(abtobcTobctocd.x, abtobcTobctocd.y);
            ctx.lineTo(bctocdTocdtode.x, bctocdTocdtode.y);
            ctx.stroke();
        }

        // curve
        let t = 0;
        let lastPoint = null;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;

        while (t < 1) {

            let a = Vector2.Lerp(this.controlPoints[0].position, this.controlPoints[1].position, t);
            let b = Vector2.Lerp(this.controlPoints[1].position, this.controlPoints[2].position, t);
            let c = Vector2.Lerp(this.controlPoints[2].position, this.controlPoints[3].position, t);
            let d = Vector2.Lerp(this.controlPoints[3].position, this.controlPoints[4].position, t);

            let e = Vector2.Lerp(a, b, t);
            let f = Vector2.Lerp(b, c, t);
            let g = Vector2.Lerp(c, d, t);

            let h = Vector2.Lerp(e, f, t);
            let i = Vector2.Lerp(f, g, t);
            let j = Vector2.Lerp(h, i, t);

            if (lastPoint) {

                ctx.beginPath();
                ctx.moveTo(lastPoint.x, lastPoint.y);
                ctx.lineTo(j.x, j.y);
                ctx.stroke();

            }

            lastPoint = j;

            t += precision;

        }

        await this.drawControlPoints(ctx);

    }

}

/**
 * A draggable control point.
 * @class
 */
class DraggablePoint {

    constructor(radius, position) {

        this.radius = radius;

        this.position = position;

    }

    /**
     * Draws the control point.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {string} color - The color to render the control point as.
     */
    draw(ctx, color='#0000ff') {

        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();

    }

}