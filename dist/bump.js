/** MIT License
* 
* Copyright (c) 2011 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://bumpjs.lcluber.com
*/

/** MIT License
* 
* Copyright (c) 2011 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://type6js.lcluber.com
*/

class Utils {
    static round(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.round(x * decimals) / decimals;
    }
    static floor(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.floor(x * decimals) / decimals;
    }
    static ceil(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.ceil(x * decimals) / decimals;
    }
    static trunc(x, decimals) {
        decimals = Math.pow(10, decimals);
        let v = +x * decimals;
        if (!isFinite(v)) {
            return v;
        }
        return ((v - v % 1) / decimals) || (v < 0 ? -0 : v === 0 ? v : 0);
    }
    static roundToNearest(x, nearest) {
        return Math.round(x / nearest) * nearest;
    }
    static mix(x, y, ratio) {
        return (1 - ratio) * x + ratio * y;
    }
    static sign(x) {
        return x ? x < 0 ? -1 : 1 : 0;
    }
    static opposite(x) {
        return -x;
    }
    static clamp(x, min, max) {
        return Math.min(Math.max(x, min), max);
    }
    static normalize(x, min, max) {
        return (x - min) / (max - min);
    }
    static lerp(normal, min, max) {
        return (max - min) * normal + min;
    }
    static map(x, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(this.normalize(x, sourceMin, sourceMax), destMin, destMax);
    }
    static isEven(x) {
        return !(x & 1);
    }
    static isOdd(x) {
        return x & 1;
    }
    static isOrigin(x) {
        return (x === 0) ? true : false;
    }
    static isPositive(x) {
        return x >= 0 ? true : false;
    }
    static isNegative(x) {
        return x < 0 ? true : false;
    }
    static validate(x) {
        return isNaN(x) ? 0.0 : x;
    }
}

class Trigonometry {
    static init() {
        Trigonometry.createRoundedPis();
        Trigonometry.createFactorialArray();
    }
    static createRoundedPis() {
        let decimals = 2;
        this.pi = Utils.round(Math.PI, decimals);
        this.twopi = Utils.round(Math.PI * 2, decimals);
        this.halfpi = Utils.round(Math.PI * 0.5, decimals);
    }
    static createFactorialArray() {
        let maxSin = this.sineLoops[this.sineLoops.length - 1] * 3;
        let maxCos = this.cosineLoops[this.cosineLoops.length - 1] * 2;
        for (let i = 1, f = 1; i <= Math.max(maxSin, maxCos); i++) {
            f *= this.factorial(i);
            this.factorialArray.push(f);
        }
    }
    static factorial(i) {
        return i > 1 ? (i - 1) : 1;
    }
    static setSinePrecision(value) {
        if (value < this.sineLoops.length) {
            this.sineDecimals = value;
            return value;
        }
        this.sineDecimals = 2;
        return 2;
    }
    static setCosinePrecision(value) {
        if (value < Trigonometry.cosineLoops.length) {
            this.cosineDecimals = value;
            return value;
        }
        this.cosineDecimals = 2;
        return 2;
    }
    static setArctanPrecision(value) {
        if (value < Trigonometry.arctanLoops.length) {
            this.cosineDecimals = value;
            return value;
        }
        this.arctanDecimals = 2;
        return 2;
    }
    static degreeToRadian(degree) {
        return degree * this.pi / 180;
    }
    static radianToDegree(radian) {
        return radian * 180 / this.pi;
    }
    static normalizeRadian(angle) {
        if (angle > this.pi || angle < -this.pi) {
            return angle - this.twopi * Math.floor((angle + this.pi) / this.twopi);
        }
        return angle;
    }
    static sine(angle) {
        angle = this.normalizeRadian(angle);
        if (Trigonometry.sineDecimals <= 2 && (angle < 0.28 && angle > -0.28)) {
            return angle;
        }
        else {
            return this.taylorSerie(3, Trigonometry.sineLoops[this.sineDecimals], angle, angle, true);
        }
    }
    static cosine(angle) {
        angle = this.normalizeRadian(angle);
        var squaredAngle = angle * angle;
        if (this.cosineDecimals <= 2 && (angle <= 0.5 && angle >= -0.5)) {
            return 1 - (squaredAngle * 0.5);
        }
        else {
            return this.taylorSerie(2, Trigonometry.cosineLoops[this.cosineDecimals], 1, angle, true);
        }
    }
    static arctan2(x, y) {
        let angle = y / x;
        if (x > 0) {
            return this.arctan(angle);
        }
        else if (x < 0) {
            if (y < 0) {
                return this.arctan(angle) - this.pi;
            }
            else {
                return this.arctan(angle) + this.pi;
            }
        }
        else {
            if (y < 0) {
                return -this.halfpi;
            }
            else if (y > 0) {
                return this.halfpi;
            }
            else {
                return false;
            }
        }
    }
    static arctan2Vector2(vector2) {
        return this.arctan2(vector2.x, vector2.y);
    }
    static arctan(angle) {
        let loops = Trigonometry.arctanLoops[this.arctanDecimals];
        if (angle < 1 && angle > -1) {
            return this.taylorSerie(3, loops, angle, angle, false);
        }
        else {
            if (angle >= 1) {
                angle = 1 / angle;
                return -(this.taylorSerie(3, loops, angle, angle, false) - this.halfpi);
            }
            else {
                angle = -1 / angle;
                return this.taylorSerie(3, loops, angle, angle, false) - this.halfpi;
            }
        }
    }
    static sineEquation(amplitude, period, shiftX, shiftY) {
        return amplitude * this.sine(period + shiftX) + shiftY;
    }
    static cosineEquation(amplitude, period, shiftX, shiftY) {
        return amplitude * this.cosine(period + shiftX) + shiftY;
    }
    static arctanEquation(amplitude, period, shiftX, shiftY) {
        return amplitude * this.arctan(period + shiftX) + shiftY;
    }
    static taylorSerie(start, max, x, angle, needFactorial) {
        let squaredAngle = angle * angle;
        let result = x;
        let denominator = 0;
        let sign = -1;
        for (let i = 0; start <= max; start += 2, i++) {
            x *= squaredAngle;
            denominator = needFactorial ? this.factorialArray[start] : start;
            result += x / denominator * sign;
            sign = Utils.opposite(sign);
        }
        return result;
    }
}
Trigonometry.sineLoops = [
    9,
    11,
    13,
    15,
    17,
    18,
    19,
    21,
    23
];
Trigonometry.cosineLoops = [
    6,
    8,
    10,
    12,
    14,
    16,
    18,
    20,
    22
];
Trigonometry.arctanLoops = [
    17,
    19,
    21,
    23,
    25,
    27,
    29,
    31,
    33
];
Trigonometry.sineDecimals = 2;
Trigonometry.cosineDecimals = 2;
Trigonometry.arctanDecimals = 2;
Trigonometry.factorialArray = [];
Trigonometry.init();

class Bezier {
    static quadratic(p0, p1, p2, t) {
        let oneMinusT = 1 - t;
        return Math.pow(oneMinusT, 2) * p0 +
            oneMinusT * 2 * t * p1 +
            t * t * p2;
    }
    static cubic(p0, p1, p2, p3, t) {
        let oneMinusT = 1 - t;
        let tByT = t * t;
        return Math.pow(oneMinusT, 3) * p0 +
            Math.pow(oneMinusT, 2) * 3 * t * p1 +
            oneMinusT * 3 * tByT * p2 +
            tByT * t * p3;
    }
}

var Axis;
(function (Axis) {
    Axis["x"] = "x";
    Axis["y"] = "y";
})(Axis || (Axis = {}));

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    set x(x) {
        this._x = Utils.validate(x);
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = Utils.validate(y);
    }
    get y() {
        return this._y;
    }
    isOrigin() {
        return (Utils.isOrigin(this.x) && Utils.isOrigin(this.y)) ? true : false;
    }
    isNotOrigin() {
        return (!Utils.isOrigin(this.x) || !Utils.isOrigin(this.y)) ? true : false;
    }
    isPositive() {
        return (Utils.isPositive(this.x) && Utils.isPositive(this.y)) ? true : false;
    }
    isNegative() {
        return (Utils.isNegative(this.x) && Utils.isNegative(this.y)) ? true : false;
    }
    fromArray(array, offset) {
        if (offset === undefined) {
            offset = 0;
        }
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }
    toArray() {
        return [this.x, this.y];
    }
    toString() {
        return '(' + Axis.x + ' = ' + this.x + ';' + Axis.y + ' = ' + this.y + ')';
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    copy(vector2) {
        this.x = vector2.x;
        this.y = vector2.y;
        return this;
    }
    origin() {
        this.x = 0.0;
        this.y = 0.0;
        return this;
    }
    setAngle(angle) {
        if (Utils.validate(angle)) {
            let length = this.getMagnitude();
            this.x = Trigonometry.cosine(angle) * length;
            this.y = Trigonometry.sine(angle) * length;
        }
        return this;
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    getMagnitude() {
        return Math.sqrt(this.getSquaredMagnitude());
    }
    getSquaredMagnitude() {
        return this.x * this.x + this.y * this.y;
    }
    getDistance(vector2) {
        this.subtract(vector2);
        let magnitude = this.getMagnitude();
        this.add(vector2);
        return magnitude;
    }
    getSquaredDistance(vector2) {
        this.subtract(vector2);
        let squaredMagnitude = this.getSquaredMagnitude();
        this.add(vector2);
        return squaredMagnitude;
    }
    quadraticBezier(p0, p1, p2, t) {
        this.x = Bezier.quadratic(p0.x, p1.x, p2.x, t);
        this.y = Bezier.quadratic(p0.y, p1.y, p2.y, t);
        return this;
    }
    cubicBezier(p0, p1, p2, p3, t) {
        this.x = Bezier.cubic(p0.x, p1.x, p2.x, p3.x, t);
        this.y = Bezier.cubic(p0.y, p1.y, p2.y, p3.y, t);
        return this;
    }
    add(vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
        return this;
    }
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }
    addScaledVector(vector2, scalar) {
        this.x += vector2.x * scalar;
        this.y += vector2.y * scalar;
        return this;
    }
    addVectors(v1, v2) {
        this.x = v1.x + v2.x;
        this.y = v1.y + v2.y;
        return this;
    }
    subtract(vector2) {
        this.x -= vector2.x;
        this.y -= vector2.y;
        return this;
    }
    subtractScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }
    subtractScaledVector(vector2, scalar) {
        this.x -= vector2.x * scalar;
        this.y -= vector2.y * scalar;
        return this;
    }
    subtractVectors(v1, v2) {
        this.x = v1.x - v2.x;
        this.y = v1.y - v2.y;
        return this;
    }
    scale(value) {
        this.x *= value;
        this.y *= value;
        return this;
    }
    scaleVector(v1, value) {
        this.x = v1.x * value;
        this.y = v1.y * value;
        return this;
    }
    multiply(vector2) {
        this.x *= vector2.x;
        this.y *= vector2.y;
        return this;
    }
    multiplyScaledVector(vector2, scalar) {
        this.x *= vector2.x * scalar;
        this.y *= vector2.y * scalar;
        return this;
    }
    multiplyVectors(v1, v2) {
        this.x = v1.x * v2.x;
        this.y = v1.y * v2.y;
        return this;
    }
    divide(vector2) {
        this.x /= vector2.x;
        this.y /= vector2.y;
        return this;
    }
    divideScaledVector(vector2, scalar) {
        this.x /= vector2.x * scalar;
        this.y /= vector2.y * scalar;
        return this;
    }
    divideVectors(v1, v2) {
        this.x = v1.x / v2.x;
        this.y = v1.y / v2.y;
        return this;
    }
    halve() {
        this.x *= 0.5;
        this.y *= 0.5;
        return this;
    }
    max(vector2) {
        this.x = Math.max(this.x, vector2.x);
        this.y = Math.max(this.y, vector2.y);
        return this;
    }
    min(vector2) {
        this.x = Math.min(this.x, vector2.x);
        this.y = Math.min(this.y, vector2.y);
        return this;
    }
    maxScalar(scalar) {
        this.x = Math.max(this.x, scalar);
        this.y = Math.max(this.y, scalar);
        return this;
    }
    minScalar(scalar) {
        this.x = Math.min(this.x, scalar);
        this.y = Math.min(this.y, scalar);
        return this;
    }
    maxAxis() {
        if (this.y > this.x) {
            return Axis.y;
        }
        return Axis.x;
    }
    minAxis() {
        if (this.y < this.x) {
            return Axis.y;
        }
        return Axis.x;
    }
    setOppositeAxis(axis, value) {
        if (axis === Axis.y) {
            this.x = value;
        }
        else {
            this.y = value;
        }
        return this;
    }
    normalize() {
        let length = this.getMagnitude();
        if (length && length != 1) {
            this.scale(1 / length);
        }
        return this;
    }
    normalizeVector(v) {
        this.copy(v);
        return this.normalize();
    }
    absolute() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    absoluteVector(v) {
        this.x = Math.abs(v.x);
        this.y = Math.abs(v.y);
        return this;
    }
    opposite() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    oppositeVector(v) {
        this.x = -v.x;
        this.y = -v.y;
        return this;
    }
    clamp(rectangle) {
        this.x = Utils.clamp(this.x, rectangle.topLeftCorner.x, rectangle.bottomRightCorner.x);
        this.y = Utils.clamp(this.y, rectangle.topLeftCorner.y, rectangle.bottomRightCorner.y);
        return this;
    }
    lerp(normal, min, max) {
        this.x = Utils.lerp(normal, min.x, max.x);
        this.y = Utils.lerp(normal, min.y, max.y);
        return this;
    }
    dotProduct(vector2) {
        return this.x * vector2.x + this.y * vector2.y;
    }
}

class Circle {
    constructor(positionX, positionY, radius) {
        this.shape = 'circle';
        this.position = new Vector2(positionX, positionY);
        this.radius = radius;
    }
    set radius(radius) {
        this._radius = radius;
        this._diameter = this._radius * 2;
    }
    get radius() {
        return this._radius;
    }
    set diameter(diameter) {
        this._diameter = diameter;
        this._radius = this._diameter * 0.5;
    }
    get diameter() {
        return this._diameter;
    }
    clone() {
        return new Circle(this.position.x, this.position.y, this.radius);
    }
    copy(circle) {
        this.position.copy(circle.position);
        this.radius = circle.radius;
    }
    set(positionX, positionY, radius) {
        this.position.set(positionX, positionY);
        this.radius = radius;
    }
    setPositionXY(positionX, positionY) {
        this.position.set(positionX, positionY);
    }
    setPositionFromVector(position) {
        this.position.copy(position);
    }
    scale(scalar) {
        this.radius *= scalar;
    }
    draw(context, fillColor, strokeColor, strokeWidth) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Trigonometry.twopi, false);
        if (fillColor) {
            context.fillStyle = fillColor;
            context.fill();
        }
        if (strokeColor) {
            context.strokeStyle = strokeColor;
            context.lineWidth = strokeWidth;
            context.stroke();
        }
    }
}

class Rectangle {
    constructor(positionX, positionY, sizeX, sizeY) {
        this.shape = 'aabb';
        this.size = new Vector2(sizeX, sizeY);
        this.halfSize = new Vector2();
        this.setHalfSize();
        this.position = new Vector2(positionX, positionY);
        this.topLeftCorner = new Vector2(positionX - this.halfSize.x, positionY - this.halfSize.y);
        this.bottomRightCorner = new Vector2(positionX + this.halfSize.x, positionY + this.halfSize.y);
    }
    clone() {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    copy(rectangle) {
        this.setSizeFromVector(rectangle.size);
        this.setPositionFromVector(rectangle.position);
    }
    set(positionX, positionY, sizeX, sizeY) {
        this.setSizeXY(sizeX, sizeY);
        this.setPositionXY(positionX, positionY);
    }
    setPositionX(x) {
        this.setPosition('x', x);
    }
    setPositionY(y) {
        this.setPosition('y', y);
    }
    setPosition(property, value) {
        this.position[property] = value;
        this.topLeftCorner[property] = value - this.halfSize[property];
        this.bottomRightCorner[property] = value + this.halfSize[property];
    }
    setPositionXY(positionX, positionY) {
        this.position.set(positionX, positionY);
        this.setCorners();
    }
    setPositionFromVector(position) {
        this.position.copy(position);
        this.setCorners();
    }
    setSizeX(width) {
        this.setSize('x', width);
    }
    setSizeY(height) {
        this.setSize('y', height);
    }
    setSize(property, value) {
        this.size[property] = value;
        this.setHalfSize();
        this.topLeftCorner[property] = this.position[property] - this.halfSize[property];
        this.bottomRightCorner[property] = this.position[property] + this.halfSize[property];
    }
    setSizeXY(width, height) {
        this.size.set(width, height);
        this.setHalfSize();
        this.setCorners();
    }
    setSizeFromVector(size) {
        this.size.copy(size);
        this.setHalfSize();
        this.setCorners();
    }
    setCorners() {
        this.topLeftCorner.set(this.position.x - this.halfSize.x, this.position.y - this.halfSize.y);
        this.bottomRightCorner.set(this.position.x + this.halfSize.x, this.position.y + this.halfSize.y);
    }
    setHalfSize() {
        this.halfSize.copy(this.size);
        this.halfSize.halve();
    }
    draw(context, fillColor, strokeColor, strokeWidth) {
        context.beginPath();
        context.rect(this.topLeftCorner.x, this.topLeftCorner.y, this.size.x, this.size.y);
        if (fillColor) {
            context.fillStyle = fillColor;
            context.fill();
        }
        if (strokeColor) {
            context.strokeStyle = strokeColor;
            context.lineWidth = strokeWidth;
            context.stroke();
        }
    }
}

var Axis$1;
(function (Axis) {
    Axis["x"] = "x";
    Axis["y"] = "y";
    Axis["z"] = "z";
})(Axis$1 || (Axis$1 = {}));

class CircleVSCircle {
    static detect(apos, radiusA, bpos, radiusB) {
        this.ab.subtractVectors(apos, bpos);
        let rr = radiusA + radiusB;
        if (rr * rr - this.ab.getSquaredMagnitude() > 0) {
            return this.getPenetration(rr);
        }
        return this.ab.origin();
    }
    static getPenetration(rr) {
        let len = this.ab.getMagnitude();
        return this.ab.scale((rr - len) / len);
    }
}
CircleVSCircle.ab = new Vector2();

class AabbVSAabb {
    static detect(apos, ahs, bpos, bhs) {
        this.ab.subtractVectors(apos, bpos);
        if (this.penetration.absoluteVector(this.ab)
            .opposite()
            .add(ahs)
            .add(bhs)
            .isPositive()) {
            return this.getPenetration();
        }
        return this.penetration.origin();
    }
    static getPenetration() {
        let minAxis = this.penetration.minAxis();
        this.penetration.setOppositeAxis(minAxis, 0.0);
        if (this.ab[minAxis] < 0) {
            this.penetration[minAxis] = -this.penetration[minAxis];
        }
        return this.penetration;
    }
}
AabbVSAabb.ab = new Vector2();
AabbVSAabb.penetration = new Vector2();

class CircleVSAabb {
    static detect(apos, radiusA, bpos, bhs) {
        this.ab.subtractVectors(apos, bpos);
        if (this.penetration.absoluteVector(this.ab)
            .opposite()
            .addScalar(radiusA)
            .add(bhs)
            .isPositive()) {
            if (this.diagonalHit(apos, radiusA, bpos, bhs)) {
                return this.getPenetration(radiusA);
            }
        }
        return this.penetration.origin();
    }
    static diagonalHit(apos, radiusA, bpos, bhs) {
        this.setVoronoiRegion(bhs);
        if (this.voronoi.x === 0) {
            if (this.voronoi.y === 0) {
                this.projectionAxis = this.penetration.minAxis();
            }
            else {
                this.projectionAxis = 'y';
            }
            return true;
        }
        else if (this.voronoi.y === 0) {
            this.projectionAxis = 'x';
            return true;
        }
        else {
            this.avertex.multiplyVectors(this.voronoi, bhs)
                .add(bpos)
                .subtractVectors(apos, this.avertex);
            let len = this.avertex.getSquaredMagnitude();
            if (radiusA * radiusA - len > 0) {
                this.projectionAxis = 'diag';
                return true;
            }
            return false;
        }
    }
    static setVoronoiRegion(bhs) {
        this.voronoi.origin();
        if (this.ab.x < -bhs.x) {
            this.voronoi.x = -1;
        }
        else if (this.ab.x > bhs.x) {
            this.voronoi.x = 1;
        }
        if (this.ab.y < -bhs.y) {
            this.voronoi.y = -1;
        }
        else if (this.ab.y > bhs.y) {
            this.voronoi.y = 1;
        }
    }
    static getPenetration(radiusA) {
        if (this.projectionAxis != 'diag') {
            this.penetration.setOppositeAxis(this.projectionAxis, 0.0);
            if (this.ab[this.projectionAxis] < 0) {
                this.penetration[this.projectionAxis] = -this.penetration[this.projectionAxis];
            }
        }
        else {
            let len = this.avertex.getMagnitude();
            let pen = radiusA - len;
            if (len === 0) {
                this.penetration.scaleVector(this.voronoi, pen / 1.41);
            }
            else {
                this.penetration.scaleVector(this.avertex, pen / len);
            }
        }
        return this.penetration;
    }
}
CircleVSAabb.ab = new Vector2();
CircleVSAabb.penetration = new Vector2();
CircleVSAabb.voronoi = new Vector2();
CircleVSAabb.avertex = new Vector2();
CircleVSAabb.vertex = new Vector2();
CircleVSAabb.projectionAxis = 'x';

var Shape;
(function (Shape) {
    Shape["circle"] = "circle";
    Shape["aabb"] = "aabb";
})(Shape || (Shape = {}));

class CollisionDetection {
    static test(a, b) {
        this.invert = false;
        this.detect(a.body, b.body);
        if (this.penetration.isNotOrigin()) {
            if (this.resolve(a, b)) {
                this.computeImpulse(a, b);
            }
            return true;
        }
        return false;
    }
    static detect(a, b) {
        if (a.shape === Shape.circle) {
            if (b.shape === Shape.circle) {
                this.penetration = CircleVSCircle.detect(a.position, a.radius, b.position, b.radius);
            }
            else if (b.shape === Shape.aabb) {
                this.penetration = CircleVSAabb.detect(a.position, a.radius, b.position, b.halfSize);
            }
        }
        else if (a.shape === Shape.aabb) {
            if (b.shape === Shape.circle) {
                this.penetration = CircleVSAabb.detect(b.position, b.radius, a.position, a.halfSize);
                this.invert = true;
            }
            else if (b.shape === Shape.aabb) {
                this.penetration = AabbVSAabb.detect(a.position, a.halfSize, b.position, b.halfSize);
            }
        }
    }
    static resolve(a, b) {
        this.totalInverseMass = a.inverseMass + b.inverseMass;
        this.correction.copy(this.penetration)
            .scale(this.percent / this.totalInverseMass);
        if (this.correction.isNotOrigin()) {
            if (this.invert) {
                b.correctPosition(this.correction);
                a.correctPosition(this.correction.opposite());
            }
            else {
                a.correctPosition(this.correction);
                b.correctPosition(this.correction.opposite());
            }
            return true;
        }
        return false;
    }
    static computeImpulse(a, b) {
        this.contactNormal.normalizeVector(this.penetration);
        let separatingVelocity = this.relativeVelocity.subtractVectors(a.velocity, b.velocity)
            .dotProduct(this.contactNormal);
        if (separatingVelocity < 0) {
            let restitution = Math.max(a.restitution, b.restitution);
            separatingVelocity = separatingVelocity * restitution - separatingVelocity;
            this.impulse = separatingVelocity / this.totalInverseMass;
            this.impulsePerInverseMass.copy(this.contactNormal).scale(this.impulse);
            a.collision(this.impulsePerInverseMass, b);
            this.impulsePerInverseMass.opposite();
            b.collision(this.impulsePerInverseMass, a);
        }
    }
}
CollisionDetection.penetration = new Vector2();
CollisionDetection.contactNormal = new Vector2();
CollisionDetection.correction = new Vector2();
CollisionDetection.relativeVelocity = new Vector2();
CollisionDetection.impulsePerInverseMass = new Vector2();
CollisionDetection.totalInverseMass = 0;
CollisionDetection.impulse = 0;
CollisionDetection.k_slop = 0.01;
CollisionDetection.percent = 0.99;

class Scene {
    constructor() {
        this.bodies = [];
        this.bodiesLength = 0;
        this.iterations = 1;
        this.gravity = new Vector2(0, 400);
    }
    addBody(body) {
        if (!body.collisionSceneId) {
            this.bodiesLength++;
            body.collisionSceneId = this.bodiesLength;
            this.bodies.push(body);
            return true;
        }
        return false;
    }
    test() {
        for (let k = 0; k < this.iterations; k++) {
            for (let i = 0; i < this.bodiesLength; i++) {
                let body1 = this.bodies[i];
                if (body1.isActive()) {
                    for (let j = i + 1; j < this.bodiesLength; j++) {
                        let body2 = this.bodies[j];
                        if (body2.isActive()) {
                            if (CollisionDetection.test(body1, body2)) {
                            }
                        }
                    }
                }
            }
        }
    }
    testScene(scene) {
        for (let k = 0; k < this.iterations; k++) {
            for (let body1 of this.bodies) {
                if (body1.isActive()) {
                    for (let body2 of scene.bodies) {
                        if (body2.isActive()) {
                            if (CollisionDetection.test(body1, body2)) {
                            }
                        }
                    }
                }
            }
        }
    }
    setIteration(iterations) {
        this.iterations = iterations;
    }
}

class Physics {
    constructor(positionX, positionY, velocityX, velocityY, sizeX, sizeY, mass, damping, restitution, type) {
        this.damping = 0.8;
        this.mass = 1.0;
        this.inverseMass = 1.0;
        this.restitution = -1;
        this.collisionSceneId = 0;
        this.active = true;
        this.damageTaken = 0;
        this.damageDealt = 1;
        this.velocity = new Vector2(velocityX, velocityY);
        this.initialVelocity = this.velocity.clone();
        this.translate = new Vector2();
        this.gravity = new Vector2();
        this.force = new Vector2();
        this.impulse = new Vector2();
        this.resultingAcc = new Vector2();
        this.mass = mass;
        this.inverseMass = !mass ? 0 : 1 / mass;
        this.damping = damping;
        this.restitution = -restitution;
        switch (type) {
            case 'rectangle':
                this.body = new Rectangle(positionX, positionY, sizeX, sizeY);
                break;
            default:
                this.body = new Circle(positionX, positionY, sizeX);
        }
        this.position = this.body.position;
    }
    setActive() {
        this.active = true;
    }
    setInactive() {
        this.active = false;
    }
    toggleActive() {
        return this.active = !this.active;
    }
    isActive() {
        return this.active;
    }
    updatePosition(second) {
        this.translate.origin();
        if (this.active && second > 0) {
            if (this.inverseMass) {
                this.applyImpulse();
                this.applyForces(second);
            }
            this.applyVelocity(second);
        }
        return this.position;
    }
    applyForces(second) {
        this.resultingAcc.copy(this.gravity);
        if (this.force.isNotOrigin()) {
            this.resultingAcc.addScaledVector(this.force, this.inverseMass);
            this.force.origin();
        }
        if (this.resultingAcc.isNotOrigin()) {
            this.velocity.addScaledVector(this.resultingAcc, second);
        }
    }
    applyImpulse() {
        if (this.impulse.isNotOrigin()) {
            this.velocity.addScaledVector(this.impulse, this.inverseMass);
            this.impulse.origin();
        }
    }
    applyVelocity(second) {
        if (this.velocity.isNotOrigin()) {
            if (this.damping < 1) {
                this.velocity.scale(Math.pow(this.damping, second));
            }
            this.translate.copy(this.velocity).scale(second);
            this.position.add(this.translate);
        }
    }
    correctPosition(correction) {
        if (this.inverseMass) {
            this.position.addScaledVector(correction, this.inverseMass);
            this.body.setPositionFromVector(this.position);
        }
    }
    setPosition(x, y) {
        this.body.setPositionXY(x, y);
    }
    setPositionFromVector(position) {
        this.body.setPositionFromVector(position);
    }
    setGravity(x, y) {
        this.gravity.set(x, y);
    }
    setDamageDealt(damageDealt) {
        this.damageDealt = damageDealt;
    }
    applyDamage() {
        if (this.active && this.damageTaken) {
            let dmg = this.damageTaken;
            this.damageTaken = 0;
            return dmg;
        }
        return false;
    }
    collision(impulsePerInverseMass, object) {
        if (this.inverseMass) {
            this.impulse.copy(impulsePerInverseMass);
        }
        if (!this.damageTaken) {
            this.damageTaken = object.damageDealt;
        }
    }
    reset() {
        this.velocity.copy(this.initialVelocity);
        this.translate.origin();
        this.force.origin();
        this.impulse.origin();
        this.resultingAcc.origin();
    }
    draw(context, fillColor, strokeColor, strokeWidth) {
        this.body.draw(context, fillColor, strokeColor, strokeWidth);
    }
}

export { Scene, Physics };
