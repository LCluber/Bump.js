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
var TYPE6 = {
    Revision: "0.2.2"
};

TYPE6.MathUtils = {
    round: function(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.round(x * decimals) / decimals;
    },
    floor: function(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.floor(x * decimals) / decimals;
    },
    ceil: function(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.ceil(x * decimals) / decimals;
    },
    trunc: function(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.trunc(x * decimals) / decimals;
    },
    roundToNearest: function(value, nearest) {
        return Math.round(value / nearest) * nearest;
    },
    isEven: function(x) {
        return !(x & 1);
    },
    isOdd: function(x) {
        return x & 1;
    },
    mix: function(x, y, ratio) {
        return (1 - ratio) * x + ratio * y;
    },
    getSign: function(x) {
        return x ? x < 0 ? -1 : 1 : 0;
    },
    getOppositeSign: function(x) {
        return -x;
    },
    clamp: function(x, min, max) {
        return Math.min(Math.max(x, min), max);
    },
    normalize: function(x, min, max) {
        return (x - min) / (max - min);
    },
    lerp: function(normal, min, max) {
        return (max - min) * normal + min;
    },
    map: function(x, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(this.normalize(x, sourceMin, sourceMax), destMin, destMax);
    }
};

TYPE6.Random = {
    "float": function(min, max) {
        return min + Math.random() * (max - min);
    },
    integer: function(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },
    distribution: function(min, max, iterations) {
        var total = 0;
        for (var i = 0; i < iterations; i++) {
            total += this.float(min, max);
        }
        return total / iterations;
    },
    pick: function(value1, value2) {
        return Math.random() < .5 ? value1 : value2;
    }
};

TYPE6.Bezier = {
    quadratic: function(p0x, p1x, p2x, t, tt, oneMinusT, powerOf2, oneMinusTByTwo2ByT) {
        return powerOf2 * p0x + oneMinusTByTwo2ByT * p1x + tt * p2x;
    },
    cubic: function(p0x, p1x, p2x, p3x, t, tt, oneMinusT) {
        return Math.pow(oneMinusT, 3) * p0x + Math.pow(oneMinusT, 2) * 3 * t * p1x + oneMinusT * 3 * tt * p2x + tt * t * p3x;
    }
};

TYPE6.Vector2D = {
    x: 0,
    y: 0,
    create: function(x, y) {
        var _this = Object.create(this);
        _this.setX(x);
        _this.setY(y);
        return _this;
    },
    createFromArray: function(array) {
        var _this = Object.create(this);
        _this.setX(array[0]);
        _this.setY(array[1]);
        return _this;
    },
    toArray: function() {
        return [ this.x, this.y ];
    },
    toString: function() {
        return "(" + this.x + ";" + this.y + ")";
    },
    setX: function(value) {
        this.x = this.valueValidation(value);
        return this.x;
    },
    getX: function() {
        return this.x;
    },
    setY: function(value) {
        this.y = this.valueValidation(value);
        return this.y;
    },
    getY: function() {
        return this.y;
    },
    set: function(property, value) {
        if (this.hasOwnProperty(property)) {
            this[property] = this.valueValidation(value);
            return this[property];
        }
        return false;
    },
    get: function(property) {
        if (this.hasOwnProperty(property)) {
            return this[property];
        }
        return false;
    },
    setXY: function(x, y) {
        this.x = this.valueValidation(x);
        this.y = this.valueValidation(y);
    },
    setToOrigin: function() {
        this.x = 0;
        this.y = 0;
    },
    setXToOrigin: function() {
        this.x = 0;
    },
    setYToOrigin: function() {
        this.y = 0;
    },
    setAngle: function(angle) {
        if (this.valueValidation(angle)) {
            var length = this.getMagnitude();
            this.x = TYPE6.Trigonometry.cosinus(angle) * length;
            this.y = TYPE6.Trigonometry.sinus(angle) * length;
            return true;
        }
        return false;
    },
    getAngle: function() {
        return Math.atan2(this.y, this.x);
    },
    setMagnitude: function(length) {
        if (this.valueValidation(length)) {
            var angle = this.getAngle();
            this.x = TYPE6.Trigonometry.cosinus(angle) * length;
            this.y = TYPE6.Trigonometry.sinus(angle) * length;
            return true;
        }
        return false;
    },
    getMagnitude: function() {
        return Math.sqrt(this.getSquaredMagnitude());
    },
    getSquaredMagnitude: function() {
        return this.x * this.x + this.y * this.y;
    },
    getDistance: function(vector2D) {
        this.subtractFrom(vector2D);
        var magnitude = this.getMagnitude();
        this.addTo(vector2D);
        return magnitude;
    },
    getSquaredDistance: function(vector2D) {
        this.subtractFrom(vector2D);
        var squaredMagnitude = this.getSquaredMagnitude();
        this.addTo(vector2D);
        return squaredMagnitude;
    },
    copy: function() {
        return this.create(this.getX(), this.getY());
    },
    add: function(vector2D) {
        return this.create(this.x + vector2D.getX(), this.y + vector2D.getY());
    },
    addX: function(x) {
        return this.create(this.x + x, this.y);
    },
    addY: function(y) {
        return this.create(this.x, this.y + y);
    },
    addScalar: function(scalar) {
        return this.create(this.x + scalar, this.y + scalar);
    },
    addScaledVector: function(vector2D, scalar) {
        return this.create(this.x + vector2D.getX() * scalar, this.y + vector2D.getY() * scalar);
    },
    subtract: function(vector2D) {
        return this.create(this.x - vector2D.getX(), this.y - vector2D.getY());
    },
    subtractScalar: function(scalar) {
        return this.create(this.x - scalar, this.y - scalar);
    },
    subtractScaledVector: function(vector2D, scalar) {
        return this.create(this.x - vector2D.getX() * scalar, this.y - vector2D.getY() * scalar);
    },
    scale: function(value) {
        return this.create(this.x * value, this.y * value);
    },
    multiply: function(vector2D) {
        return this.create(this.x * vector2D.getX(), this.y * vector2D.getY());
    },
    divide: function(vector2D) {
        return this.create(this.x / vector2D.getX(), this.y / vector2D.getY());
    },
    halve: function() {
        return this.create(this.x * .5, this.y * .5);
    },
    normalize: function() {
        var length = this.getMagnitude();
        if (length) {
            return this.scale(1 / length);
        }
    },
    absolute: function() {
        return this.create(Math.abs(this.x), Math.abs(this.y));
    },
    opposite: function() {
        return this.create(-this.x, -this.y);
    },
    oppositeX: function() {
        return this.create(-this.x, this.y);
    },
    oppositeY: function() {
        return this.create(this.x, -this.y);
    },
    clamp: function(rectangle) {
        return this.create(TYPE6.MathUtils.clamp(this.x, rectangle.topLeftCorner.getX(), rectangle.bottomRightCorner.getX()), TYPE6.MathUtils.clamp(this.y, rectangle.topLeftCorner.getY(), rectangle.bottomRightCorner.getY()));
    },
    lerp: function(normal, min, max) {
        return this.create(TYPE6.MathUtils.lerp(normal, min.getX(), max.getX()), TYPE6.MathUtils.lerp(normal, min.getY(), max.getY()));
    },
    quadraticBezier: function(p0, p1, p2, t) {
        var tt = t * t;
        var oneMinusT = 1 - t;
        var powerOf2 = Math.pow(oneMinusT, 2);
        var oneMinusTByTwo2ByT = oneMinusT * 2 * t;
        return this.create(TYPE6.Bezier.quadratic(p0.getX(), p1.getX(), p2.getX(), t, tt, oneMinusT, powerOf2, oneMinusTByTwo2ByT), TYPE6.Bezier.quadratic(p0.getY(), p1.getY(), p2.getY(), t, tt, oneMinusT, powerOf2, oneMinusTByTwo2ByT));
    },
    cubicBezier: function(p0, p1, p2, p3, t) {
        var tt = t * t;
        var oneMinusT = 1 - t;
        return this.create(TYPE6.Bezier.cubic(p0.getX(), p1.getX(), p2.getX(), p3.getX(), t, tt, oneMinusT), TYPE6.Bezier.cubic(p0.getY(), p1.getY(), p2.getY(), p3.getY(), t, tt, oneMinusT));
    },
    quadraticBezierTo: function(p0, p1, p2, t) {
        var tt = t * t;
        var oneMinusT = 1 - t;
        var powerOf2 = Math.pow(oneMinusT, 2);
        var oneMinusTByTwo2ByT = oneMinusT * 2 * t;
        this.x = TYPE6.Bezier.quadratic(p0.getX(), p1.getX(), p2.getX(), t, tt, oneMinusT, powerOf2, oneMinusTByTwo2ByT);
        this.y = TYPE6.Bezier.quadratic(p0.getY(), p1.getY(), p2.getY(), t, tt, oneMinusT, powerOf2, oneMinusTByTwo2ByT);
    },
    cubicBezierTo: function(p0, p1, p2, p3, t) {
        var tt = t * t;
        var oneMinusT = 1 - t;
        this.x = TYPE6.Bezier.cubic(p0.getX(), p1.getX(), p2.getX(), p3.getX(), t, tt, oneMinusT);
        this.y = TYPE6.Bezier.cubic(p0.getY(), p1.getY(), p2.getY(), p3.getY(), t, tt, oneMinusT);
    },
    copyTo: function(vector2D) {
        this.x = vector2D.getX();
        this.y = vector2D.getY();
    },
    addTo: function(vector2D) {
        this.x += vector2D.getX();
        this.y += vector2D.getY();
    },
    addToX: function(x) {
        this.x += x;
    },
    addToY: function(y) {
        this.y += y;
    },
    addScalarTo: function(scalar) {
        this.x += scalar;
        this.y += scalar;
    },
    addScaledVectorTo: function(vector2D, scalar) {
        this.x += vector2D.getX() * scalar;
        this.y += vector2D.getY() * scalar;
    },
    copyScaledVectorTo: function(vector2D, scalar) {
        this.x = vector2D.getX() * scalar;
        this.y = vector2D.getY() * scalar;
    },
    subtractFrom: function(vector2D) {
        this.x -= vector2D.getX();
        this.y -= vector2D.getY();
    },
    copySubtractFromTo: function(vector2DA, vector2DB) {
        this.x = vector2DA.getX() - vector2DB.getX();
        this.y = vector2DA.getY() - vector2DB.getY();
    },
    subtractScalarFrom: function(scalar) {
        this.x -= scalar;
        this.y -= scalar;
    },
    subtractScaledVectorFrom: function(vector2D, scalar) {
        this.x -= vector2D.getX() * scalar;
        this.y -= vector2D.getY() * scalar;
    },
    scaleBy: function(value) {
        this.x *= value;
        this.y *= value;
    },
    multiplyBy: function(vector2D) {
        this.x *= vector2D.getX();
        this.y *= vector2D.getY();
    },
    divideBy: function(vector2D) {
        this.x /= vector2D.getX();
        this.y /= vector2D.getY();
    },
    halveBy: function() {
        this.x *= .5;
        this.y *= .5;
    },
    normalizeTo: function() {
        var length = this.getMagnitude();
        if (length) {
            this.scaleBy(1 / length);
        }
    },
    absoluteTo: function() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
    },
    oppositeTo: function() {
        this.x = -this.x;
        this.y = -this.y;
    },
    oppositeXTo: function() {
        this.x = -this.x;
    },
    oppositeYTo: function() {
        this.y = -this.y;
    },
    clampTo: function(rectangle) {
        this.x = TYPE6.MathUtils.clamp(this.x, rectangle.topLeftCorner.getX(), rectangle.bottomRightCorner.getX());
        this.y = TYPE6.MathUtils.clamp(this.y, rectangle.topLeftCorner.getY(), rectangle.bottomRightCorner.getY());
    },
    lerpTo: function(normal, min, max) {
        this.x = TYPE6.MathUtils.lerp(normal, min.getX(), max.getX());
        this.y = TYPE6.MathUtils.lerp(normal, min.getY(), max.getY());
    },
    dotProduct: function(vector2D) {
        return this.x * vector2D.getX() + this.y * vector2D.getY();
    },
    isOrigin: function() {
        if (this.x === 0 || this.y === 0) return true;
        return false;
    },
    isPositive: function() {
        if (this.getX() > 0 && this.getY() > 0) return true;
        return false;
    },
    isNegative: function() {
        if (this.getX() < 0 && this.getY() < 0) return true;
        return false;
    },
    isNotOrigin: function() {
        if (this.x || this.y) {
            return true;
        }
        return false;
    },
    valueValidation: function(value) {
        return isNaN(value) ? 0 : value;
    }
};

TYPE6.Geometry = {};

TYPE6.Geometry.Circle = {
    position: {},
    radius: 0,
    diameter: 0,
    shape: "circle",
    size: {},
    halfSize: {},
    create: function(positionX, positionY, radius) {
        var obj = Object.create(this);
        obj.init();
        obj.setRadius(radius);
        obj.initSize();
        obj.setPositionXY(positionX, positionY);
        return obj;
    },
    init: function() {
        this.position = TYPE6.Vector2D.create();
        this.radius = 0;
        this.diameter = 0;
    },
    initSize: function() {
        this.size = TYPE6.Vector2D.create(this.diameter, this.diameter);
        this.halfSize = TYPE6.Vector2D.create(this.radius, this.radius);
    },
    copy: function(circle) {
        return this.create(circle.getPositionX(), circle.getPositionY(), circle.getRadius());
    },
    copyTo: function(circle) {
        this.setPositionFromVector2D(circle.getPosition());
        this.setRadius(circle.getRadius());
    },
    setPositionX: function(x) {
        this.position.setX(x);
        return this.position.getX();
    },
    setPositionY: function(y) {
        this.position.setY(y);
        return this.position.getY();
    },
    setPositionXY: function(positionX, positionY) {
        this.position.setXY(positionX, positionY);
        return this.position;
    },
    setPositionFromVector2D: function(position) {
        this.position.copyTo(position);
        return this.position;
    },
    getPosition: function() {
        return this.position;
    },
    getPositionX: function() {
        return this.position.getX();
    },
    getPositionY: function() {
        return this.position.getY();
    },
    setRadius: function(radius) {
        this.radius = radius;
        this.diameter = this.radius * 2;
        this.initSize();
        return this.radius;
    },
    getRadius: function() {
        return this.radius;
    },
    setDiameter: function(diameter) {
        this.diameter = diameter;
        this.radius = this.diameter * .5;
        this.initSize();
        return this.diameter;
    },
    getDiameter: function() {
        return this.diameter;
    },
    getHalfSize: function() {
        return this.halfSize;
    },
    clampTo: function(rectangle) {
        this.position.clampTo(rectangle);
    },
    scale: function(scalar) {
        return this.create(this.position.getX(), this.position.getY(), this.radius * scalar);
    },
    scaleBy: function(scalar) {
        this.setRadius(this.radius * scalar);
        return this.radius;
    },
    getDistance: function(vector2) {
        return this.position.getDistance(vector2);
    },
    getSquaredDistance: function(vector2) {
        return this.position.getSquaredDistance(vector2);
    }
};

TYPE6.Geometry.Rectangle = {
    position: {},
    topLeftCorner: {},
    bottomRightCorner: {},
    size: {},
    halfSize: {},
    shape: "aabb",
    create: function(positionX, positionY, sizeX, sizeY) {
        var obj = Object.create(this);
        obj.initSize(sizeX, sizeY);
        obj.initPosition(positionX, positionY);
        return obj;
    },
    initSize: function(sizeX, sizeY) {
        this.size = TYPE6.Vector2D.create(sizeX, sizeY);
        this.halfSize = TYPE6.Vector2D.create(sizeX * .5, sizeY * .5);
    },
    initPosition: function(positionX, positionY) {
        this.position = TYPE6.Vector2D.create(positionX, positionY);
        this.topLeftCorner = TYPE6.Vector2D.create(positionX - this.halfSize.getX(), positionY - this.halfSize.getY());
        this.bottomRightCorner = TYPE6.Vector2D.create(positionX + this.halfSize.getX(), positionY + this.halfSize.getY());
    },
    copy: function(rectangle) {
        return this.create(rectangle.getPositionX(), rectangle.getPositionY(), rectangle.getSizeX(), rectangle.getSizeY());
    },
    copyTo: function(rectangle) {
        this.setSizeFromVector2D(rectangle.getSize());
        this.setPositionFromVector2D(rectangle.getPosition());
    },
    setPositionXY: function(positionX, positionY) {
        this.position.setXY(positionX, positionY);
        this.setTopLeftCornerXY(positionX - this.getHalfSizeX(), positionY - this.getHalfSizeY());
        this.setBottomRightCornerXY(positionX + this.getHalfSizeX(), positionY + this.getHalfSizeY());
        return this.position;
    },
    setPositionFromVector2D: function(position) {
        this.position.copyTo(position);
        this.setTopLeftCornerXY(position.getX() - this.getHalfSizeX(), position.getY() - this.getHalfSizeY());
        this.setBottomRightCornerXY(position.getX() + this.getHalfSizeX(), position.getY() + this.getHalfSizeY());
        return this.position;
    },
    setTopLeftCornerXY: function(topLeftCornerX, topLeftCornerY) {
        this.topLeftCorner.setXY(topLeftCornerX, topLeftCornerY);
        return this.topLeftCorner;
    },
    setTopLeftCornerFromVector2D: function(topLeftCorner) {
        this.topLeftCorner.copyTo(topLeftCorner);
        return this.topLeftCorner;
    },
    setBottomRightCornerXY: function(bottomRightCornerX, bottomRightCornerY) {
        this.bottomRightCorner.setXY(bottomRightCornerX, bottomRightCornerY);
        return this.bottomRightCorner;
    },
    setBottomRightCornerFromVector2D: function(bottomRightCorner) {
        this.bottomRightCorner.copyTo(bottomRightCorner);
        return this.bottomRightCorner;
    },
    getPosition: function() {
        return this.position;
    },
    getPositionX: function() {
        return this.position.getX();
    },
    getPositionY: function() {
        return this.position.getY();
    },
    getTopLeftCorner: function() {
        return this.topLeftCorner;
    },
    getTopLeftCornerX: function() {
        return this.topLeftCorner.getX();
    },
    getTopLeftCornerY: function() {
        return this.topLeftCorner.getY();
    },
    getBottomRightCorner: function() {
        return this.bottomRightCorner;
    },
    getBottomRightCornerX: function() {
        return this.bottomRightCorner.getX();
    },
    getBottomRightCornerY: function() {
        return this.bottomRightCorner.getY();
    },
    setSizeXY: function(sizeX, sizeY) {
        this.size.setXY(sizeX, sizeY);
        return this.size;
    },
    setSizeFromVector2D: function(size) {
        this.size.copyTo(size);
        return this.size;
    },
    getSize: function() {
        return this.size;
    },
    getSizeX: function() {
        return this.size.getX();
    },
    getSizeY: function() {
        return this.size.getY();
    },
    getHalfSize: function() {
        return this.halfSize;
    },
    getHalfSizeX: function() {
        return this.halfSize.getX();
    },
    getHalfSizeY: function() {
        return this.halfSize.getY();
    }
};

TYPE6.Trigonometry = {
    PI: TYPE6.MathUtils.round(Math.PI, 2),
    TWOPI: TYPE6.MathUtils.round(Math.PI * 2, 2),
    HALFPI: TYPE6.MathUtils.round(Math.PI * .5, 2),
    sineDecimals: 2,
    cosineDecimals: 2,
    arctanDecimals: 2,
    factorialArray: [],
    sineLoops: {
        0: 9,
        1: 11,
        2: 13,
        3: 15,
        4: 17,
        5: 18,
        6: 19,
        7: 21,
        8: 23
    },
    cosineLoops: {
        0: 6,
        1: 8,
        2: 10,
        3: 12,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 22
    },
    arctanLoops: {
        0: 17,
        1: 19,
        2: 21,
        3: 23,
        4: 25,
        5: 27,
        6: 29,
        7: 31,
        8: 33
    },
    setSinePrecision: function(value) {
        if (this.sineLoops.hasOwnProperty(property)) {
            this.sineDecimals = value;
            return value;
        }
        this.sineDecimals = 2;
        return 2;
    },
    setCosinePrecision: function(value) {
        if (this.cosineLoops.hasOwnProperty(property)) {
            this.cosineDecimals = value;
            return value;
        }
        this.cosineDecimals = 2;
        return 2;
    },
    degreeToRadian: function(degree) {
        return degree * this.PI / 180;
    },
    radianToDegree: function(radian) {
        return radian * 180 / this.PI;
    },
    sine: function(angle) {
        angle = this.normalizeRadian(angle);
        if (this.sineDecimals <= 2 && (angle < .28 && angle > -.28)) {
            return angle;
        } else {
            return this.taylorSerie(3, this.sineLoops[this.sineDecimals], angle, angle, true);
        }
    },
    cosine: function(angle) {
        angle = this.normalizeRadian(angle);
        var squaredAngle = angle * angle;
        if (this.cosineDecimals <= 2 && (angle <= .5 && angle >= -.5)) {
            return 1 - squaredAngle * .5;
        } else {
            return this.taylorSerie(2, this.cosineLoops[this.cosineDecimals], 1, angle, true);
        }
    },
    arctan2: function(x, y) {
        var angle = y / x;
        if (x > 0) {
            return this.arctan(angle);
        } else if (x < 0) {
            if (y < 0) {
                return this.arctan(angle) - this.PI;
            } else {
                return this.arctan(angle) + this.PI;
            }
        } else {
            if (y < 0) {
                return -this.HALFPI;
            } else if (y > 0) {
                return this.HALFPI;
            } else {
                return false;
            }
        }
    },
    arctan2fromVector2D: function(vector2D) {
        return this.arctan2(vector2D.getX(), vector2D.getY());
    },
    arctan: function(angle) {
        var loops = this.arctanLoops[this.arctanDecimals];
        if (angle < 1 && angle > -1) {
            return this.taylorSerie(3, loops, angle, angle, false);
        } else {
            if (angle >= 1) {
                angle = 1 / angle;
                return -(this.taylorSerie(3, loops, angle, angle, false) - this.HALFPI);
            } else {
                angle = -1 / angle;
                return this.taylorSerie(3, loops, angle, angle, false) - this.HALFPI;
            }
        }
    },
    sineEquation: function(amplitude, period, shiftX, shiftY) {
        return amplitude * this.sine(period + shiftX) + shiftY;
    },
    cosineEquation: function(amplitude, period, shiftX, shiftY) {
        return amplitude * this.cosine(period + shiftX) + shiftY;
    },
    arctanEquation: function(amplitude, period, shiftX, shiftY) {
        return amplitude * this.arctan(period + shiftX) + shiftY;
    },
    taylorSerie: function(start, max, x, angle, needFactorial) {
        var squaredAngle = angle * angle;
        var result = x;
        var denominator = 0;
        var sign = -1;
        for (var i = 0; start <= max; start += 2, i++) {
            x *= squaredAngle;
            denominator = needFactorial ? this.factorialArray[start] : start;
            result += x / denominator * sign;
            sign = TYPE6.MathUtils.getOppositeSign(sign);
        }
        return result;
    },
    createFactorialArray: function() {
        for (var i = 1, f = 1; i <= Math.max(this.sineLoops[8] * 3, this.cosineLoops[8] * 2); i++) {
            f *= this.factorial(i);
            this.factorialArray.push(f);
        }
    },
    factorial: function(i) {
        return i > 1 ? i - 1 : 1;
    },
    normalizeRadian: function(angle) {
        if (angle > this.PI || angle < -this.PI) {
            return angle - this.TWOPI * Math.floor((angle + this.PI) / this.TWOPI);
        }
        return angle;
    }
};

TYPE6.Trigonometry.createFactorialArray();
var BUMP = {
    revision: "0.2.3",
    options: {
        space: "2D"
    }
};

BUMP.Physics = {
    translate: TYPE6.Vector2D.create(),
    velocity: TYPE6.Vector2D.create(),
    initialVelocity: TYPE6.Vector2D.create(),
    gravity: TYPE6.Vector2D.create(),
    force: TYPE6.Vector2D.create(),
    impulse: TYPE6.Vector2D.create(),
    resultingAcc: TYPE6.Vector2D.create(),
    damping: .8,
    mass: 1,
    inverseMass: 1,
    elasticity: -1,
    collisionSceneId: 0,
    create: function(velocity, size, mass, damping, elasticity) {
        var _this = Object.create(this);
        _this.initVectors(velocity, size);
        _this.mass = mass;
        _this.inverseMass = !mass ? 0 : 1 / mass;
        _this.damping = damping;
        _this.elasticity = -elasticity;
        return _this;
    },
    initVectors: function(velocity) {
        this.velocity = velocity;
        this.initialVelocity = this.velocity.copy();
        this.translate = TYPE6.Vector2D.create();
        this.gravity = TYPE6.Vector2D.create();
        this.force = TYPE6.Vector2D.create();
        this.impulse = TYPE6.Vector2D.create();
        this.resultingAcc = TYPE6.Vector2D.create();
    },
    setGravity: function(x, y) {
        this.gravity.setXY(x, y);
    },
    setPosition: function(second) {
        this.translate.setToOrigin();
        if (second > 0) {
            this.resultingAcc.copyTo(this.gravity);
            if (this.inverseMass && this.impulse.isNotOrigin()) {
                this.velocity.addScaledVectorTo(this.impulse, this.inverseMass);
                this.impulse.setToOrigin();
            }
            if (this.inverseMass && this.force.isNotOrigin()) {
                this.resultingAcc.addScaledVectorTo(this.force, this.inverseMass);
                this.force.setToOrigin();
            }
            if (this.resultingAcc.isNotOrigin()) this.velocity.addScaledVectorTo(this.resultingAcc, second);
            if (this.velocity.isNotOrigin()) {
                this.velocity.scaleBy(Math.pow(this.damping, second));
                this.translate.copyScaledVectorTo(this.velocity, second);
            }
        }
        return this.translate;
    },
    applyImpulse: function(impulsePerInverseMass) {
        this.velocity.addScaledVectorTo(impulsePerInverseMass, this.inverseMass);
    },
    reset: function() {
        this.velocity.copyTo(this.initialVelocity);
        this.translate.setToOrigin();
        this.force.setToOrigin();
        this.impulse.setToOrigin();
        this.resultingAcc.setToOrigin();
    }
};

BUMP.Collision = {
    delta: TYPE6.Vector2D.create(),
    delta2: TYPE6.Vector2D.create(),
    penetration: TYPE6.Vector2D.create(),
    vertex: TYPE6.Vector2D.create(),
    relativeVelocity: TYPE6.Vector2D.create(),
    voronoi: TYPE6.Vector2D.create(),
    deltaVelocity: 0,
    totalInverseMass: 0,
    impulse: 0,
    impulsePerInverseMass: TYPE6.Vector2D.create(),
    create: function() {
        var _this = Object.create(this);
        return _this;
    },
    test: function(bodyA, physicsA, bodyB, physicsB) {
        this.setDelta(bodyA.getPosition(), bodyB.getPosition());
        if (this.getPenetration(bodyA, bodyB)) {
            this.separate(bodyA.getPosition(), physicsA.inverseMass, bodyB.getPosition(), physicsB.inverseMass);
            this.computeImpulseVectors(physicsA, physicsB);
        }
    },
    setDelta: function(positionA, positionB) {
        this.delta.copySubtractFromTo(positionA, positionB);
    },
    circleVScircle: function(radius) {
        if (this.circleVScircleHit(radius)) return this.circleVScircleProjection(radius);
        return false;
    },
    aabbVSaabb: function(halfSizeA, halfSizeB) {
        if (this.aabbVSaabbHit(halfSizeA, halfSizeB)) return this.aabbVSaabbProjection();
        return false;
    },
    circleVSaabb: function(positionA, halfSizeA, radiusA, positionB, halfSizeB) {
        if (this.aabbVSaabbHit(halfSizeA, halfSizeB)) return this.circleVSaabbProjection(positionA, radiusA, positionB, halfSizeB);
        return false;
    },
    getPenetration: function(bodyA, bodyB) {
        if (bodyA.shape === "circle") {
            if (bodyB.shape === "circle") return this.circleVScircle(bodyA.getRadius() + bodyB.getRadius()); else if (bodyB.shape === "aabb") return this.circleVSaabb(bodyA.getPosition(), bodyA.getHalfSize(), bodyA.getRadius(), bodyB.getPosition(), bodyB.getHalfSize());
        } else if (bodyA.shape === "aabb") {
            if (bodyB.shape === "circle") return this.circleVSaabb(bodyB.getPosition(), bodyB.getHalfSize(), bodyB.getRadius(), bodyA.getPosition(), bodyA.getHalfSize()); else if (bodyB.shape === "aabb") return this.aabbVSaabb(bodyA.getHalfSize(), bodyB.getHalfSize());
        }
        return false;
    },
    aabbVSaabbHit: function(ahs, bhs) {
        this.penetration.copyTo(this.delta);
        this.penetration.absoluteTo();
        this.penetration.oppositeTo();
        this.penetration.addTo(ahs);
        this.penetration.addTo(bhs);
        if (this.penetration.isPositive()) return true;
        return false;
    },
    aabbVSaabbProjection: function() {
        if (this.penetration.getX() < this.penetration.getY()) this.projectOnX(); else this.projectOnY();
    },
    circleVScircleHit: function(radius) {
        var squaredLen = this.delta.getSquaredMagnitude();
        var squaredRad = radius * radius;
        if (squaredRad - squaredLen > 0) return true;
        return false;
    },
    circleVScircleProjection: function(radius) {
        var len = this.delta.getMagnitude(), pen = radius - len;
        this.penetration.copyScaledVectorTo(this.delta, pen / len);
        return true;
    },
    setVoronoiRegion: function(bhs) {
        this.voronoi.setToOrigin();
        var dx = this.delta.getX();
        var dy = this.delta.getY();
        var bhsX = bhs.getX();
        var bhsY = bhs.getY();
        if (dx < -bhsX) this.voronoi.setX(-1); else if (dx > bhsX) this.voronoi.setX(1);
        if (dy < -bhsY) this.voronoi.setY(-1); else if (dy > bhsY) this.voronoi.setY(1);
    },
    circleVSaabbProjection: function(apos, radiusA, bpos, bhs) {
        this.setVoronoiRegion(bhs);
        if (this.voronoi.getX() === 0) {
            if (this.voronoi.getY() === 0) {
                if (this.penetration.getX() < this.penetration.getY()) this.projectOnX(); else this.projectOnY();
                return true;
            } else return this.projectOnY();
        } else if (this.voronoi.getY() === 0) return this.projectOnX(); else {
            this.vertex.copyTo(this.voronoi);
            this.vertex.multiplyBy(bhs);
            this.vertex.addTo(bpos);
            this.delta2.copySubtractFromTo(apos, this.vertex);
            var len = this.delta2.getSquaredMagnitude();
            var pen = radiusA * radiusA - len;
            if (pen > 0) {
                len = this.delta2.getMagnitude();
                pen = radiusA - len;
                if (len === 0) this.penetration.copyScaledVectorTo(this.voronoi, pen / 1.41); else this.penetration.copyScaledVectorTo(this.delta2, pen / len);
                return true;
            }
        }
        return false;
    },
    projectOnX: function() {
        this.penetration.setYToOrigin();
        if (this.delta.getX() < 0) {
            this.penetration.oppositeXTo();
            return true;
        }
        return false;
    },
    projectOnY: function() {
        this.penetration.setXToOrigin();
        if (this.delta.getY() < 0) {
            this.penetration.oppositeYTo();
            return true;
        }
        return false;
    },
    separate: function(positionA, imA, positionB, imB) {
        this.totalInverseMass = imA + imB;
        if (imA) positionA.addScaledVectorTo(this.penetration, imA / this.totalInverseMass);
        if (imB) positionB.subtractScaledVectorFrom(this.penetration, imB / this.totalInverseMass);
    },
    computeImpulseVectors: function(a, b) {
        var separatingVelocity = this.separatingVel(a.velocity, b.velocity);
        if (separatingVelocity < 0) {
            this.deltaVelocity = separatingVelocity * a.elasticity - separatingVelocity;
            this.impulse = this.deltaVelocity / this.totalInverseMass;
            this.impulsePerInverseMass.copyScaledVectorTo(this.penetration, this.impulse);
            a.impulse.copyTo(this.impulsePerInverseMass);
            this.impulsePerInverseMass.oppositeTo();
            b.impulse.copyTo(this.impulsePerInverseMass);
        }
    },
    separatingVel: function(av, bv) {
        this.penetration.normalizeTo();
        this.relativeVelocity.copySubtractFromTo(av, bv);
        return this.relativeVelocity.dotProduct(this.penetration);
    }
};

BUMP.Scene = {
    bodies: [],
    bodiesLength: 0,
    collision: BUMP.Collision.create(),
    gravity: TYPE6.Vector2D.create(0, 400),
    create: function() {
        var _this = Object.create(this);
        return _this;
    },
    addBody: function(body) {
        if (!body.physics.collisionSceneId) {
            this.bodiesLength++;
            body.physics.collisionSceneId = this.bodiesLength;
            this.bodies.push(body);
            return true;
        } else return false;
    },
    removeBody: function() {},
    test: function() {
        for (var i = 0; i < this.bodiesLength; i++) {
            for (var j = i + 1; j < this.bodiesLength; j++) {
                var p1 = this.bodies[i];
                var p2 = this.bodies[j];
                this.collision.test(p1.body, p1.physics, p2.body, p2.physics);
            }
        }
    },
    setGravity: function() {},
    getGravity: function() {
        return this.gravity;
    }
};