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

var Bump = (function (exports) {
    'use strict';

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    var Utils = function () {
        function Utils() {
            _classCallCheck(this, Utils);
        }

        _createClass(Utils, null, [{
            key: "round",
            value: function round(x, decimals) {
                decimals = Math.pow(10, decimals);
                return Math.round(x * decimals) / decimals;
            }
        }, {
            key: "floor",
            value: function floor(x, decimals) {
                decimals = Math.pow(10, decimals);
                return Math.floor(x * decimals) / decimals;
            }
        }, {
            key: "ceil",
            value: function ceil(x, decimals) {
                decimals = Math.pow(10, decimals);
                return Math.ceil(x * decimals) / decimals;
            }
        }, {
            key: "trunc",
            value: function trunc(x, decimals) {
                decimals = Math.pow(10, decimals);
                var v = +x * decimals;
                if (!isFinite(v)) {
                    return v;
                }
                return (v - v % 1) / decimals || (v < 0 ? -0 : v === 0 ? v : 0);
            }
        }, {
            key: "roundToNearest",
            value: function roundToNearest(x, nearest) {
                return Math.round(x / nearest) * nearest;
            }
        }, {
            key: "mix",
            value: function mix(x, y, ratio) {
                return (1 - ratio) * x + ratio * y;
            }
        }, {
            key: "sign",
            value: function sign(x) {
                return x ? x < 0 ? -1 : 1 : 0;
            }
        }, {
            key: "opposite",
            value: function opposite(x) {
                return -x;
            }
        }, {
            key: "clamp",
            value: function clamp(x, min, max) {
                return Math.min(Math.max(x, min), max);
            }
        }, {
            key: "normalize",
            value: function normalize(x, min, max) {
                return (x - min) / (max - min);
            }
        }, {
            key: "lerp",
            value: function lerp(normal, min, max) {
                return (max - min) * normal + min;
            }
        }, {
            key: "map",
            value: function map(x, sourceMin, sourceMax, destMin, destMax) {
                return this.lerp(this.normalize(x, sourceMin, sourceMax), destMin, destMax);
            }
        }, {
            key: "isEven",
            value: function isEven(x) {
                return !(x & 1);
            }
        }, {
            key: "isOdd",
            value: function isOdd(x) {
                return x & 1;
            }
        }, {
            key: "isOrigin",
            value: function isOrigin(x) {
                return x === 0 ? true : false;
            }
        }, {
            key: "isPositive",
            value: function isPositive(x) {
                return x >= 0 ? true : false;
            }
        }, {
            key: "isNegative",
            value: function isNegative(x) {
                return x < 0 ? true : false;
            }
        }, {
            key: "validate",
            value: function validate(x) {
                return isNaN(x) ? 0.0 : x;
            }
        }]);

        return Utils;
    }();

    var Trigonometry = function () {
        function Trigonometry() {
            _classCallCheck(this, Trigonometry);
        }

        _createClass(Trigonometry, null, [{
            key: "init",
            value: function init() {
                Trigonometry.createRoundedPis();
                Trigonometry.createFactorialArray();
            }
        }, {
            key: "createRoundedPis",
            value: function createRoundedPis() {
                var decimals = 2;
                this.pi = Utils.round(Math.PI, decimals);
                this.twopi = Utils.round(Math.PI * 2, decimals);
                this.halfpi = Utils.round(Math.PI * 0.5, decimals);
            }
        }, {
            key: "createFactorialArray",
            value: function createFactorialArray() {
                var maxSin = this.sineLoops[this.sineLoops.length - 1] * 3;
                var maxCos = this.cosineLoops[this.cosineLoops.length - 1] * 2;
                for (var i = 1, f = 1; i <= Math.max(maxSin, maxCos); i++) {
                    f *= this.factorial(i);
                    this.factorialArray.push(f);
                }
            }
        }, {
            key: "factorial",
            value: function factorial(i) {
                return i > 1 ? i - 1 : 1;
            }
        }, {
            key: "setSinePrecision",
            value: function setSinePrecision(value) {
                if (value < this.sineLoops.length) {
                    this.sineDecimals = value;
                    return value;
                }
                this.sineDecimals = 2;
                return 2;
            }
        }, {
            key: "setCosinePrecision",
            value: function setCosinePrecision(value) {
                if (value < Trigonometry.cosineLoops.length) {
                    this.cosineDecimals = value;
                    return value;
                }
                this.cosineDecimals = 2;
                return 2;
            }
        }, {
            key: "setArctanPrecision",
            value: function setArctanPrecision(value) {
                if (value < Trigonometry.arctanLoops.length) {
                    this.cosineDecimals = value;
                    return value;
                }
                this.arctanDecimals = 2;
                return 2;
            }
        }, {
            key: "degreeToRadian",
            value: function degreeToRadian(degree) {
                return degree * this.pi / 180;
            }
        }, {
            key: "radianToDegree",
            value: function radianToDegree(radian) {
                return radian * 180 / this.pi;
            }
        }, {
            key: "normalizeRadian",
            value: function normalizeRadian(angle) {
                if (angle > this.pi || angle < -this.pi) {
                    return angle - this.twopi * Math.floor((angle + this.pi) / this.twopi);
                }
                return angle;
            }
        }, {
            key: "sine",
            value: function sine(angle) {
                angle = this.normalizeRadian(angle);
                if (Trigonometry.sineDecimals <= 2 && angle < 0.28 && angle > -0.28) {
                    return angle;
                } else {
                    return this.taylorSerie(3, Trigonometry.sineLoops[this.sineDecimals], angle, angle, true);
                }
            }
        }, {
            key: "cosine",
            value: function cosine(angle) {
                angle = this.normalizeRadian(angle);
                var squaredAngle = angle * angle;
                if (this.cosineDecimals <= 2 && angle <= 0.5 && angle >= -0.5) {
                    return 1 - squaredAngle * 0.5;
                } else {
                    return this.taylorSerie(2, Trigonometry.cosineLoops[this.cosineDecimals], 1, angle, true);
                }
            }
        }, {
            key: "arctan2",
            value: function arctan2(x, y) {
                var angle = y / x;
                if (x > 0) {
                    return this.arctan(angle);
                } else if (x < 0) {
                    if (y < 0) {
                        return this.arctan(angle) - this.pi;
                    } else {
                        return this.arctan(angle) + this.pi;
                    }
                } else {
                    if (y < 0) {
                        return -this.halfpi;
                    } else if (y > 0) {
                        return this.halfpi;
                    } else {
                        return false;
                    }
                }
            }
        }, {
            key: "arctan2Vector2",
            value: function arctan2Vector2(vector2) {
                return this.arctan2(vector2.x, vector2.y);
            }
        }, {
            key: "arctan",
            value: function arctan(angle) {
                var loops = Trigonometry.arctanLoops[this.arctanDecimals];
                if (angle < 1 && angle > -1) {
                    return this.taylorSerie(3, loops, angle, angle, false);
                } else {
                    if (angle >= 1) {
                        angle = 1 / angle;
                        return -(this.taylorSerie(3, loops, angle, angle, false) - this.halfpi);
                    } else {
                        angle = -1 / angle;
                        return this.taylorSerie(3, loops, angle, angle, false) - this.halfpi;
                    }
                }
            }
        }, {
            key: "sineEquation",
            value: function sineEquation(amplitude, period, shiftX, shiftY) {
                return amplitude * this.sine(period + shiftX) + shiftY;
            }
        }, {
            key: "cosineEquation",
            value: function cosineEquation(amplitude, period, shiftX, shiftY) {
                return amplitude * this.cosine(period + shiftX) + shiftY;
            }
        }, {
            key: "arctanEquation",
            value: function arctanEquation(amplitude, period, shiftX, shiftY) {
                return amplitude * this.arctan(period + shiftX) + shiftY;
            }
        }, {
            key: "taylorSerie",
            value: function taylorSerie(start, max, x, angle, needFactorial) {
                var squaredAngle = angle * angle;
                var result = x;
                var denominator = 0;
                var sign = -1;
                for (var i = 0; start <= max; start += 2, i++) {
                    x *= squaredAngle;
                    denominator = needFactorial ? this.factorialArray[start] : start;
                    result += x / denominator * sign;
                    sign = Utils.opposite(sign);
                }
                return result;
            }
        }]);

        return Trigonometry;
    }();

    Trigonometry.sineLoops = [9, 11, 13, 15, 17, 18, 19, 21, 23];
    Trigonometry.cosineLoops = [6, 8, 10, 12, 14, 16, 18, 20, 22];
    Trigonometry.arctanLoops = [17, 19, 21, 23, 25, 27, 29, 31, 33];
    Trigonometry.sineDecimals = 2;
    Trigonometry.cosineDecimals = 2;
    Trigonometry.arctanDecimals = 2;
    Trigonometry.factorialArray = [];
    Trigonometry.init();

    var Time = function () {
        function Time() {
            _classCallCheck(this, Time);
        }

        _createClass(Time, null, [{
            key: "millisecondToSecond",
            value: function millisecondToSecond(millisecond) {
                return millisecond * 0.001;
            }
        }, {
            key: "secondToMilliecond",
            value: function secondToMilliecond(second) {
                return second * 1000;
            }
        }, {
            key: "millisecondToFramePerSecond",
            value: function millisecondToFramePerSecond(millisecond) {
                return Math.round(1000 / millisecond);
            }
        }, {
            key: "framePerSecondToMillisecond",
            value: function framePerSecondToMillisecond(refreshRate) {
                return Utils.round(1000 / refreshRate, 1);
            }
        }]);

        return Time;
    }();

    var Random = function () {
        function Random() {
            _classCallCheck(this, Random);
        }

        _createClass(Random, null, [{
            key: "float",
            value: function float(min, max) {
                return min + Math.random() * (max - min);
            }
        }, {
            key: "integer",
            value: function integer(min, max) {
                return Math.floor(min + Math.random() * (max - min + 1));
            }
        }, {
            key: "distribution",
            value: function distribution(min, max, iterations) {
                var total = 0;
                for (var i = 0; i < iterations; i++) {
                    total += this.float(min, max);
                }
                return total / iterations;
            }
        }, {
            key: "pick",
            value: function pick(value1, value2) {
                return Math.random() < 0.5 ? value1 : value2;
            }
        }]);

        return Random;
    }();

    var Bezier = function () {
        function Bezier() {
            _classCallCheck(this, Bezier);
        }

        _createClass(Bezier, null, [{
            key: "quadratic",
            value: function quadratic(p0, p1, p2, t) {
                var oneMinusT = 1 - t;
                return Math.pow(oneMinusT, 2) * p0 + oneMinusT * 2 * t * p1 + t * t * p2;
            }
        }, {
            key: "cubic",
            value: function cubic(p0, p1, p2, p3, t) {
                var oneMinusT = 1 - t;
                var tByT = t * t;
                return Math.pow(oneMinusT, 3) * p0 + Math.pow(oneMinusT, 2) * 3 * t * p1 + oneMinusT * 3 * tByT * p2 + tByT * t * p3;
            }
        }]);

        return Bezier;
    }();

    var Axis;
    (function (Axis) {
        Axis["x"] = "x";
        Axis["y"] = "y";
    })(Axis || (Axis = {}));

    var Vector2 = function () {
        function Vector2(x, y) {
            _classCallCheck(this, Vector2);

            this.x = x;
            this.y = y;
        }

        _createClass(Vector2, [{
            key: "isOrigin",
            value: function isOrigin() {
                return Utils.isOrigin(this.x) && Utils.isOrigin(this.y) ? true : false;
            }
        }, {
            key: "isNotOrigin",
            value: function isNotOrigin() {
                return !Utils.isOrigin(this.x) || !Utils.isOrigin(this.y) ? true : false;
            }
        }, {
            key: "isPositive",
            value: function isPositive() {
                return Utils.isPositive(this.x) && Utils.isPositive(this.y) ? true : false;
            }
        }, {
            key: "isNegative",
            value: function isNegative() {
                return Utils.isNegative(this.x) && Utils.isNegative(this.y) ? true : false;
            }
        }, {
            key: "fromArray",
            value: function fromArray(array, offset) {
                if (offset === undefined) {
                    offset = 0;
                }
                this.x = array[offset];
                this.y = array[offset + 1];
                return this;
            }
        }, {
            key: "toArray",
            value: function toArray() {
                return [this.x, this.y];
            }
        }, {
            key: "toString",
            value: function toString() {
                return '(' + Axis.x + ' = ' + this.x + ';' + Axis.y + ' = ' + this.y + ')';
            }
        }, {
            key: "set",
            value: function set(x, y) {
                this.x = x;
                this.y = y;
                return this;
            }
        }, {
            key: "clone",
            value: function clone() {
                return new Vector2(this.x, this.y);
            }
        }, {
            key: "copy",
            value: function copy(vector2) {
                this.x = vector2.x;
                this.y = vector2.y;
                return this;
            }
        }, {
            key: "origin",
            value: function origin() {
                this.x = 0.0;
                this.y = 0.0;
                return this;
            }
        }, {
            key: "setAngle",
            value: function setAngle(angle) {
                if (Utils.validate(angle)) {
                    var length = this.getMagnitude();
                    this.x = Trigonometry.cosine(angle) * length;
                    this.y = Trigonometry.sine(angle) * length;
                }
                return this;
            }
        }, {
            key: "getAngle",
            value: function getAngle() {
                return Math.atan2(this.y, this.x);
            }
        }, {
            key: "getMagnitude",
            value: function getMagnitude() {
                return Math.sqrt(this.getSquaredMagnitude());
            }
        }, {
            key: "getSquaredMagnitude",
            value: function getSquaredMagnitude() {
                return this.x * this.x + this.y * this.y;
            }
        }, {
            key: "getDistance",
            value: function getDistance(vector2) {
                this.subtract(vector2);
                var magnitude = this.getMagnitude();
                this.add(vector2);
                return magnitude;
            }
        }, {
            key: "getSquaredDistance",
            value: function getSquaredDistance(vector2) {
                this.subtract(vector2);
                var squaredMagnitude = this.getSquaredMagnitude();
                this.add(vector2);
                return squaredMagnitude;
            }
        }, {
            key: "quadraticBezier",
            value: function quadraticBezier(p0, p1, p2, t) {
                this.x = Bezier.quadratic(p0.x, p1.x, p2.x, t);
                this.y = Bezier.quadratic(p0.y, p1.y, p2.y, t);
                return this;
            }
        }, {
            key: "cubicBezier",
            value: function cubicBezier(p0, p1, p2, p3, t) {
                this.x = Bezier.cubic(p0.x, p1.x, p2.x, p3.x, t);
                this.y = Bezier.cubic(p0.y, p1.y, p2.y, p3.y, t);
                return this;
            }
        }, {
            key: "add",
            value: function add(vector2) {
                this.x += vector2.x;
                this.y += vector2.y;
                return this;
            }
        }, {
            key: "addScalar",
            value: function addScalar(scalar) {
                this.x += scalar;
                this.y += scalar;
                return this;
            }
        }, {
            key: "addScaledVector",
            value: function addScaledVector(vector2, scalar) {
                this.x += vector2.x * scalar;
                this.y += vector2.y * scalar;
                return this;
            }
        }, {
            key: "addVectors",
            value: function addVectors(v1, v2) {
                this.x = v1.x + v2.x;
                this.y = v1.y + v2.y;
                return this;
            }
        }, {
            key: "subtract",
            value: function subtract(vector2) {
                this.x -= vector2.x;
                this.y -= vector2.y;
                return this;
            }
        }, {
            key: "subtractScalar",
            value: function subtractScalar(scalar) {
                this.x -= scalar;
                this.y -= scalar;
                return this;
            }
        }, {
            key: "subtractScaledVector",
            value: function subtractScaledVector(vector2, scalar) {
                this.x -= vector2.x * scalar;
                this.y -= vector2.y * scalar;
                return this;
            }
        }, {
            key: "subtractVectors",
            value: function subtractVectors(v1, v2) {
                this.x = v1.x - v2.x;
                this.y = v1.y - v2.y;
                return this;
            }
        }, {
            key: "scale",
            value: function scale(value) {
                this.x *= value;
                this.y *= value;
                return this;
            }
        }, {
            key: "scaleVector",
            value: function scaleVector(v1, value) {
                this.x = v1.x * value;
                this.y = v1.y * value;
                return this;
            }
        }, {
            key: "multiply",
            value: function multiply(vector2) {
                this.x *= vector2.x;
                this.y *= vector2.y;
                return this;
            }
        }, {
            key: "multiplyScaledVector",
            value: function multiplyScaledVector(vector2, scalar) {
                this.x *= vector2.x * scalar;
                this.y *= vector2.y * scalar;
                return this;
            }
        }, {
            key: "multiplyVectors",
            value: function multiplyVectors(v1, v2) {
                this.x = v1.x * v2.x;
                this.y = v1.y * v2.y;
                return this;
            }
        }, {
            key: "divide",
            value: function divide(vector2) {
                this.x /= vector2.x;
                this.y /= vector2.y;
                return this;
            }
        }, {
            key: "divideScaledVector",
            value: function divideScaledVector(vector2, scalar) {
                this.x /= vector2.x * scalar;
                this.y /= vector2.y * scalar;
                return this;
            }
        }, {
            key: "divideVectors",
            value: function divideVectors(v1, v2) {
                this.x = v1.x / v2.x;
                this.y = v1.y / v2.y;
                return this;
            }
        }, {
            key: "halve",
            value: function halve() {
                this.x *= 0.5;
                this.y *= 0.5;
                return this;
            }
        }, {
            key: "max",
            value: function max(vector2) {
                this.x = Math.max(this.x, vector2.x);
                this.y = Math.max(this.y, vector2.y);
                return this;
            }
        }, {
            key: "min",
            value: function min(vector2) {
                this.x = Math.min(this.x, vector2.x);
                this.y = Math.min(this.y, vector2.y);
                return this;
            }
        }, {
            key: "maxScalar",
            value: function maxScalar(scalar) {
                this.x = Math.max(this.x, scalar);
                this.y = Math.max(this.y, scalar);
                return this;
            }
        }, {
            key: "minScalar",
            value: function minScalar(scalar) {
                this.x = Math.min(this.x, scalar);
                this.y = Math.min(this.y, scalar);
                return this;
            }
        }, {
            key: "maxAxis",
            value: function maxAxis() {
                if (this.y > this.x) {
                    return Axis.y;
                }
                return Axis.x;
            }
        }, {
            key: "minAxis",
            value: function minAxis() {
                if (this.y < this.x) {
                    return Axis.y;
                }
                return Axis.x;
            }
        }, {
            key: "setOppositeAxis",
            value: function setOppositeAxis(axis, value) {
                if (axis === Axis.y) {
                    this.x = value;
                } else {
                    this.y = value;
                }
                return this;
            }
        }, {
            key: "normalize",
            value: function normalize() {
                var length = this.getMagnitude();
                if (length && length != 1) {
                    this.scale(1 / length);
                }
                return this;
            }
        }, {
            key: "normalizeVector",
            value: function normalizeVector(v) {
                this.copy(v);
                return this.normalize();
            }
        }, {
            key: "absolute",
            value: function absolute() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                return this;
            }
        }, {
            key: "absoluteVector",
            value: function absoluteVector(v) {
                this.x = Math.abs(v.x);
                this.y = Math.abs(v.y);
                return this;
            }
        }, {
            key: "opposite",
            value: function opposite() {
                this.x = -this.x;
                this.y = -this.y;
                return this;
            }
        }, {
            key: "oppositeVector",
            value: function oppositeVector(v) {
                this.x = -v.x;
                this.y = -v.y;
                return this;
            }
        }, {
            key: "clamp",
            value: function clamp(rectangle) {
                this.x = Utils.clamp(this.x, rectangle.topLeftCorner.x, rectangle.bottomRightCorner.x);
                this.y = Utils.clamp(this.y, rectangle.topLeftCorner.y, rectangle.bottomRightCorner.y);
                return this;
            }
        }, {
            key: "lerp",
            value: function lerp(normal, min, max) {
                this.x = Utils.lerp(normal, min.x, max.x);
                this.y = Utils.lerp(normal, min.y, max.y);
                return this;
            }
        }, {
            key: "dotProduct",
            value: function dotProduct(vector2) {
                return this.x * vector2.x + this.y * vector2.y;
            }
        }, {
            key: "x",
            set: function set(x) {
                this._x = Utils.validate(x);
            },
            get: function get() {
                return this._x;
            }
        }, {
            key: "y",
            set: function set(y) {
                this._y = Utils.validate(y);
            },
            get: function get() {
                return this._y;
            }
        }]);

        return Vector2;
    }();

    var Circle = function () {
        function Circle(positionX, positionY, radius) {
            _classCallCheck(this, Circle);

            this.shape = 'circle';
            this.position = new Vector2(positionX, positionY);
            this.radius = radius;
        }

        _createClass(Circle, [{
            key: "clone",
            value: function clone() {
                return new Circle(this.position.x, this.position.y, this.radius);
            }
        }, {
            key: "copy",
            value: function copy(circle) {
                this.position.copy(circle.position);
                this.radius = circle.radius;
            }
        }, {
            key: "set",
            value: function set(positionX, positionY, radius) {
                this.position.set(positionX, positionY);
                this.radius = radius;
            }
        }, {
            key: "setPositionXY",
            value: function setPositionXY(positionX, positionY) {
                this.position.set(positionX, positionY);
            }
        }, {
            key: "setPositionFromVector",
            value: function setPositionFromVector(position) {
                this.position.copy(position);
            }
        }, {
            key: "scale",
            value: function scale(scalar) {
                this.radius *= scalar;
            }
        }, {
            key: "draw",
            value: function draw(context, fillColor, strokeColor, strokeWidth) {
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
        }, {
            key: "radius",
            set: function set(radius) {
                this._radius = radius;
                this._diameter = this._radius * 2;
            },
            get: function get() {
                return this._radius;
            }
        }, {
            key: "diameter",
            set: function set(diameter) {
                this._diameter = diameter;
                this._radius = this._diameter * 0.5;
            },
            get: function get() {
                return this._diameter;
            }
        }]);

        return Circle;
    }();

    var Rectangle = function () {
        function Rectangle(positionX, positionY, sizeX, sizeY) {
            _classCallCheck(this, Rectangle);

            this.shape = 'aabb';
            this.size = new Vector2(sizeX, sizeY);
            this.halfSize = new Vector2();
            this.setHalfSize();
            this.position = new Vector2(positionX, positionY);
            this.topLeftCorner = new Vector2(positionX - this.halfSize.x, positionY - this.halfSize.y);
            this.bottomRightCorner = new Vector2(positionX + this.halfSize.x, positionY + this.halfSize.y);
        }

        _createClass(Rectangle, [{
            key: "clone",
            value: function clone() {
                return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
            }
        }, {
            key: "copy",
            value: function copy(rectangle) {
                this.setSizeFromVector(rectangle.size);
                this.setPositionFromVector(rectangle.position);
            }
        }, {
            key: "set",
            value: function set(positionX, positionY, sizeX, sizeY) {
                this.setSizeXY(sizeX, sizeY);
                this.setPositionXY(positionX, positionY);
            }
        }, {
            key: "setPositionX",
            value: function setPositionX(x) {
                this.setPosition('x', x);
            }
        }, {
            key: "setPositionY",
            value: function setPositionY(y) {
                this.setPosition('y', y);
            }
        }, {
            key: "setPosition",
            value: function setPosition(property, value) {
                this.position[property] = value;
                this.topLeftCorner[property] = value - this.halfSize[property];
                this.bottomRightCorner[property] = value + this.halfSize[property];
            }
        }, {
            key: "setPositionXY",
            value: function setPositionXY(positionX, positionY) {
                this.position.set(positionX, positionY);
                this.setCorners();
            }
        }, {
            key: "setPositionFromVector",
            value: function setPositionFromVector(position) {
                this.position.copy(position);
                this.setCorners();
            }
        }, {
            key: "setSizeX",
            value: function setSizeX(width) {
                this.setSize('x', width);
            }
        }, {
            key: "setSizeY",
            value: function setSizeY(height) {
                this.setSize('y', height);
            }
        }, {
            key: "setSize",
            value: function setSize(property, value) {
                this.size[property] = value;
                this.setHalfSize();
                this.topLeftCorner[property] = this.position[property] - this.halfSize[property];
                this.bottomRightCorner[property] = this.position[property] + this.halfSize[property];
            }
        }, {
            key: "setSizeXY",
            value: function setSizeXY(width, height) {
                this.size.set(width, height);
                this.setHalfSize();
                this.setCorners();
            }
        }, {
            key: "setSizeFromVector",
            value: function setSizeFromVector(size) {
                this.size.copy(size);
                this.setHalfSize();
                this.setCorners();
            }
        }, {
            key: "setCorners",
            value: function setCorners() {
                this.topLeftCorner.set(this.position.x - this.halfSize.x, this.position.y - this.halfSize.y);
                this.bottomRightCorner.set(this.position.x + this.halfSize.x, this.position.y + this.halfSize.y);
            }
        }, {
            key: "setHalfSize",
            value: function setHalfSize() {
                this.halfSize.copy(this.size);
                this.halfSize.halve();
            }
        }, {
            key: "draw",
            value: function draw(context, fillColor, strokeColor, strokeWidth) {
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
        }]);

        return Rectangle;
    }();

    var Axis$1;
    (function (Axis) {
        Axis["x"] = "x";
        Axis["y"] = "y";
        Axis["z"] = "z";
    })(Axis$1 || (Axis$1 = {}));

    var Vector3 = function () {
        function Vector3(x, y, z) {
            _classCallCheck(this, Vector3);

            this.x = x;
            this.y = y;
            this.z = z;
        }

        _createClass(Vector3, [{
            key: "fromArray",
            value: function fromArray(array, offset) {
                if (offset === undefined) {
                    offset = 0;
                }
                this.x = array[offset];
                this.y = array[offset + 1];
                this.z = array[offset + 2];
                return this;
            }
        }, {
            key: "toArray",
            value: function toArray() {
                return [this.x, this.y, this.z];
            }
        }, {
            key: "toString",
            value: function toString() {
                return '(' + Axis$1.x + ' = ' + this.x + ';' + Axis$1.y + ' = ' + this.y + ';' + Axis$1.z + ' = ' + this.z + ')';
            }
        }, {
            key: "set",
            value: function set(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
        }, {
            key: "clone",
            value: function clone() {
                return new Vector3(this.x, this.y, this.z);
            }
        }, {
            key: "copy",
            value: function copy(vector3) {
                this.x = vector3.x;
                this.y = vector3.y;
                this.y = vector3.z;
                return this;
            }
        }, {
            key: "origin",
            value: function origin() {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
                return this;
            }
        }, {
            key: "getMagnitude",
            value: function getMagnitude() {
                return Math.sqrt(this.getSquaredMagnitude());
            }
        }, {
            key: "getSquaredMagnitude",
            value: function getSquaredMagnitude() {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            }
        }, {
            key: "getDistance",
            value: function getDistance(vector3) {
                this.subtract(vector3);
                var magnitude = this.getMagnitude();
                this.add(vector3);
                return magnitude;
            }
        }, {
            key: "getSquaredDistance",
            value: function getSquaredDistance(vector3) {
                this.subtract(vector3);
                var squaredMagnitude = this.getSquaredMagnitude();
                this.add(vector3);
                return squaredMagnitude;
            }
        }, {
            key: "add",
            value: function add(vector3) {
                this.x += vector3.x;
                this.y += vector3.y;
                this.z += vector3.z;
                return this;
            }
        }, {
            key: "addScalar",
            value: function addScalar(scalar) {
                this.x += scalar;
                this.y += scalar;
                this.z += scalar;
                return this;
            }
        }, {
            key: "addScaledVector",
            value: function addScaledVector(vector3, scalar) {
                this.x += vector3.x * scalar;
                this.y += vector3.y * scalar;
                this.z += vector3.z * scalar;
                return this;
            }
        }, {
            key: "addVectors",
            value: function addVectors(v1, v2) {
                this.x = v1.x + v2.x;
                this.y = v1.y + v2.y;
                this.z = v1.z + v2.z;
                return this;
            }
        }, {
            key: "subtract",
            value: function subtract(vector3) {
                this.x -= vector3.x;
                this.y -= vector3.y;
                this.z -= vector3.z;
                return this;
            }
        }, {
            key: "subtractScalar",
            value: function subtractScalar(scalar) {
                this.x -= scalar;
                this.y -= scalar;
                this.z -= scalar;
                return this;
            }
        }, {
            key: "subtractScaledVector",
            value: function subtractScaledVector(vector3, scalar) {
                this.x -= vector3.x * scalar;
                this.y -= vector3.y * scalar;
                this.z -= vector3.z * scalar;
                return this;
            }
        }, {
            key: "subtractVectors",
            value: function subtractVectors(v1, v2) {
                this.x = v1.x - v2.x;
                this.y = v1.y - v2.y;
                this.z = v1.z - v2.z;
                return this;
            }
        }, {
            key: "scale",
            value: function scale(value) {
                this.x *= value;
                this.y *= value;
                this.z *= value;
                return this;
            }
        }, {
            key: "multiply",
            value: function multiply(vector3) {
                this.x *= vector3.x;
                this.y *= vector3.y;
                this.z *= vector3.z;
                return this;
            }
        }, {
            key: "multiplyScaledVector",
            value: function multiplyScaledVector(vector3, scalar) {
                this.x *= vector3.x * scalar;
                this.y *= vector3.y * scalar;
                this.z *= vector3.z * scalar;
                return this;
            }
        }, {
            key: "multiplyVectors",
            value: function multiplyVectors(v1, v2) {
                this.x = v1.x * v2.x;
                this.y = v1.y * v2.y;
                this.z = v1.z * v2.z;
                return this;
            }
        }, {
            key: "divide",
            value: function divide(vector3) {
                this.x /= vector3.x;
                this.y /= vector3.y;
                this.z /= vector3.z;
                return this;
            }
        }, {
            key: "divideScaledVector",
            value: function divideScaledVector(vector3, scalar) {
                this.x /= vector3.x * scalar;
                this.y /= vector3.y * scalar;
                this.z /= vector3.z * scalar;
                return this;
            }
        }, {
            key: "divideVectors",
            value: function divideVectors(v1, v2) {
                this.x = v1.x / v2.x;
                this.y = v1.y / v2.y;
                this.z = v1.z / v2.z;
                return this;
            }
        }, {
            key: "halve",
            value: function halve() {
                this.x *= 0.5;
                this.y *= 0.5;
                this.z *= 0.5;
                return this;
            }
        }, {
            key: "max",
            value: function max(vector3) {
                this.x = Math.max(this.x, vector3.x);
                this.y = Math.max(this.y, vector3.y);
                this.z = Math.max(this.z, vector3.z);
                return this;
            }
        }, {
            key: "min",
            value: function min(vector3) {
                this.x = Math.min(this.x, vector3.x);
                this.y = Math.min(this.y, vector3.y);
                this.z = Math.min(this.z, vector3.z);
                return this;
            }
        }, {
            key: "maxScalar",
            value: function maxScalar(scalar) {
                this.x = Math.max(this.x, scalar);
                this.y = Math.max(this.y, scalar);
                this.z = Math.max(this.z, scalar);
                return this;
            }
        }, {
            key: "minScalar",
            value: function minScalar(scalar) {
                this.x = Math.min(this.x, scalar);
                this.y = Math.min(this.y, scalar);
                this.z = Math.min(this.z, scalar);
                return this;
            }
        }, {
            key: "normalize",
            value: function normalize() {
                var length = this.getMagnitude();
                if (length && length != 1) {
                    this.scale(1 / length);
                }
                return this;
            }
        }, {
            key: "dotProduct",
            value: function dotProduct(vector3) {
                return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z;
            }
        }, {
            key: "cross",
            value: function cross(vector3) {
                var x = this.x,
                    y = this.y,
                    z = this.z;
                this.x = y * vector3.z - z * vector3.y;
                this.y = z * vector3.x - x * vector3.z;
                this.z = x * vector3.y - y * vector3.x;
                return this;
            }
        }, {
            key: "crossVectors",
            value: function crossVectors(v1, v2) {
                var v1x = v1.x,
                    v1y = v1.y,
                    v1z = v1.z;
                var v2x = v2.x,
                    v2y = v2.y,
                    v2z = v2.z;
                this.x = v1y * v2z - v1z * v2y;
                this.y = v1z * v2x - v1x * v2z;
                this.z = v1x * v2y - v1y * v2x;
                return this;
            }
        }, {
            key: "x",
            set: function set(x) {
                this._x = Utils.validate(x);
            },
            get: function get() {
                return this._x;
            }
        }, {
            key: "y",
            set: function set(y) {
                this._y = Utils.validate(y);
            },
            get: function get() {
                return this._y;
            }
        }, {
            key: "z",
            set: function set(z) {
                this._z = Utils.validate(z);
            },
            get: function get() {
                return this._z;
            }
        }]);

        return Vector3;
    }();

    var Matrix4x3 = function () {
        function Matrix4x3(x1, x2, x3, y1, y2, y3, z1, z2, z3, t1, t2, t3) {
            _classCallCheck(this, Matrix4x3);

            this.m = new Float32Array(16);
            this.xAxis = new Vector3();
            this.yAxis = new Vector3();
            this.zAxis = new Vector3();
            this.make(x1, x2, x3, y1, y2, y3, z1, z2, z3, t1, t2, t3);
        }

        _createClass(Matrix4x3, [{
            key: "make",
            value: function make(x1, x2, x3, y1, y2, y3, z1, z2, z3, t1, t2, t3) {
                this.m[0] = Utils.validate(x1);
                this.m[1] = Utils.validate(x2);
                this.m[2] = Utils.validate(x3);
                this.m[3] = 0.0;
                this.m[4] = Utils.validate(y1);
                this.m[5] = Utils.validate(y2);
                this.m[6] = Utils.validate(y3);
                this.m[7] = 0.0;
                this.m[8] = Utils.validate(z1);
                this.m[9] = Utils.validate(z2);
                this.m[10] = Utils.validate(z3);
                this.m[11] = 0.0;
                this.m[12] = Utils.validate(t1);
                this.m[13] = Utils.validate(t2);
                this.m[14] = Utils.validate(t3);
                this.m[15] = 1.0;
            }
        }, {
            key: "copy",
            value: function copy(matrix4x3) {
                var m = matrix4x3.m;
                this.make(m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]);
                return this;
            }
        }, {
            key: "toArray",
            value: function toArray() {
                return this.m;
            }
        }, {
            key: "toString",
            value: function toString() {
                return '(' + this.m[0] + ',' + this.m[1] + ',' + this.m[2] + ',' + this.m[3] + ';' + this.m[4] + ',' + this.m[5] + ',' + this.m[6] + ',' + this.m[7] + ';' + this.m[8] + ',' + this.m[9] + ',' + this.m[10] + ',' + this.m[11] + ';' + this.m[12] + ',' + this.m[13] + ',' + this.m[14] + ',' + this.m[15] + ')';
            }
        }, {
            key: "identity",
            value: function identity() {
                this.make(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);
                return this;
            }
        }, {
            key: "scale",
            value: function scale(vector3) {
                this.make(vector3.x, 0.0, 0.0, 0.0, vector3.y, 0.0, 0.0, 0.0, vector3.z, 0.0, 0.0, 0.0);
                return this;
            }
        }, {
            key: "rotateX",
            value: function rotateX(angle) {
                var cos = Trigonometry.cosine(angle);
                var sin = Trigonometry.sine(angle);
                this.make(1.0, 0.0, 0.0, 0.0, cos, sin, 0.0, -sin, cos, 0.0, 0.0, 0.0);
                return this;
            }
        }, {
            key: "rotateY",
            value: function rotateY(angle) {
                var cos = Trigonometry.cosine(angle);
                var sin = Trigonometry.sine(angle);
                this.make(cos, 0.0, -sin, 0.0, 1.0, 0.0, sin, 0.0, cos, 0.0, 0.0, 0.0);
                return this;
            }
        }, {
            key: "rotateZ",
            value: function rotateZ(angle) {
                var cos = Trigonometry.cosine(angle);
                var sin = Trigonometry.sine(angle);
                this.make(cos, sin, 0.0, -sin, cos, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);
                return this;
            }
        }, {
            key: "translate",
            value: function translate(vector3) {
                this.make(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, vector3.x, vector3.y, vector3.z);
                return this;
            }
        }, {
            key: "multiply",
            value: function multiply(matrix4x3) {
                var m1 = this.m;
                var m2 = matrix4x3.m;
                this.make(m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2], m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2], m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2], m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6], m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6], m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6], m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10], m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10], m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10], m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12], m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13], m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14]);
                return this;
            }
        }, {
            key: "lookAtRH",
            value: function lookAtRH(eye, target, up) {
                this.zAxis.subtractVectors(eye, target).normalize();
                this.xAxis.crossVectors(up, this.zAxis).normalize();
                this.yAxis.crossVectors(this.zAxis, this.xAxis);
                this.make(this.xAxis.x, this.yAxis.x, this.zAxis.x, this.xAxis.y, this.yAxis.y, this.zAxis.y, this.xAxis.z, this.yAxis.z, this.zAxis.z, -this.xAxis.dotProduct(eye), -this.yAxis.dotProduct(eye), -this.zAxis.dotProduct(eye));
                return this;
            }
        }]);

        return Matrix4x3;
    }();

    var Matrix4x4 = function () {
        function Matrix4x4(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, t1, t2, t3, t4) {
            _classCallCheck(this, Matrix4x4);

            this.m = new Float32Array(16);
            this.xAxis = new Vector3();
            this.yAxis = new Vector3();
            this.zAxis = new Vector3();
            this.make(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, t1, t2, t3, t4);
        }

        _createClass(Matrix4x4, [{
            key: "make",
            value: function make(x1, x2, x3, x4, y1, y2, y3, y4, z1, z2, z3, z4, t1, t2, t3, t4) {
                this.m[0] = Utils.validate(x1);
                this.m[1] = Utils.validate(x2);
                this.m[2] = Utils.validate(x3);
                this.m[3] = Utils.validate(x4);
                this.m[4] = Utils.validate(y1);
                this.m[5] = Utils.validate(y2);
                this.m[6] = Utils.validate(y3);
                this.m[7] = Utils.validate(y4);
                this.m[8] = Utils.validate(z1);
                this.m[9] = Utils.validate(z2);
                this.m[10] = Utils.validate(z3);
                this.m[11] = Utils.validate(z4);
                this.m[12] = Utils.validate(t1);
                this.m[13] = Utils.validate(t2);
                this.m[14] = Utils.validate(t3);
                this.m[15] = Utils.validate(t4);
            }
        }, {
            key: "copy",
            value: function copy(matrix4x4) {
                var m = matrix4x4.m;
                this.make(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
                return this;
            }
        }, {
            key: "toArray",
            value: function toArray() {
                return this.m;
            }
        }, {
            key: "toString",
            value: function toString() {
                return '(' + this.m[0] + ',' + this.m[1] + ',' + this.m[2] + ',' + this.m[3] + ';' + this.m[4] + ',' + this.m[5] + ',' + this.m[6] + ',' + this.m[7] + ';' + this.m[8] + ',' + this.m[9] + ',' + this.m[10] + ',' + this.m[11] + ';' + this.m[12] + ',' + this.m[13] + ',' + this.m[14] + ',' + this.m[15] + ')';
            }
        }, {
            key: "identity",
            value: function identity() {
                this.make(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                return this;
            }
        }, {
            key: "scale",
            value: function scale(vector3) {
                this.make(vector3.x, 0.0, 0.0, 0.0, 0.0, vector3.y, 0.0, 0.0, 0.0, 0.0, vector3.z, 0.0, 0.0, 0.0, 0.0, 1.0);
                return this;
            }
        }, {
            key: "rotateX",
            value: function rotateX(angle) {
                var cos = Trigonometry.cosine(angle);
                var sin = Trigonometry.sine(angle);
                this.make(1.0, 0.0, 0.0, 0.0, 0.0, cos, sin, 0.0, 0.0, -sin, cos, 0.0, 0.0, 0.0, 0.0, 1.0);
                return this;
            }
        }, {
            key: "rotateY",
            value: function rotateY(angle) {
                var cos = Trigonometry.cosine(angle);
                var sin = Trigonometry.sine(angle);
                this.make(cos, 0.0, -sin, 0.0, 0.0, 1.0, 0.0, 0.0, sin, 0.0, cos, 0.0, 0.0, 0.0, 0.0, 1.0);
                return this;
            }
        }, {
            key: "rotateZ",
            value: function rotateZ(angle) {
                var cos = Trigonometry.cosine(angle);
                var sin = Trigonometry.sine(angle);
                this.make(cos, sin, 0.0, 0.0, -sin, cos, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                return this;
            }
        }, {
            key: "translate",
            value: function translate(vector3) {
                this.make(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, vector3.x, vector3.y, vector3.z, 1.0);
                return this;
            }
        }, {
            key: "multiply",
            value: function multiply(matrix4x4) {
                var m1 = this.m;
                var m2 = matrix4x4.m;
                this.make(m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2], m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2], m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2], 0.0, m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6], m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6], m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6], 0.0, m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10], m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10], m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10], 0.0, m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12], m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13], m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14], 1.0);
                return this;
            }
        }, {
            key: "perspective",
            value: function perspective(fovy, aspect, znear, zfar) {
                var f = Math.tan(Trigonometry.halfpi - 0.5 * fovy * Trigonometry.pi / 180);
                var rangeInv = 1.0 / (znear - zfar);
                this.make(f / aspect, 0.0, 0.0, 0.0, 0.0, f, 0.0, 0.0, 0.0, 0.0, (znear + zfar) * rangeInv, -1.0, 0.0, 0.0, znear * zfar * rangeInv * 2, 0.0);
                return this;
            }
        }, {
            key: "orthographic",
            value: function orthographic(left, right, top, bottom, near, far) {
                var w = right - left;
                var h = top - bottom;
                var p = far - near;
                var x = (right + left) / w;
                var y = (top + bottom) / h;
                var z = (far + near) / p;
                this.make(2 / w, 0.0, 0.0, 0.0, 0.0, 2 / h, 0.0, 0.0, 0.0, 0.0, -2 / p, 0.0, -x, -y, -z, 1.0);
                return this;
            }
        }]);

        return Matrix4x4;
    }();

    var CircleVSCircle = function () {
        function CircleVSCircle() {}
        CircleVSCircle.detect = function (apos, radiusA, bpos, radiusB) {
            this.ab.subtractVectors(apos, bpos);
            var rr = radiusA + radiusB;
            if (rr * rr - this.ab.getSquaredMagnitude() > 0) {
                return this.getPenetration(rr);
            }
            return this.ab.origin();
        };
        CircleVSCircle.getPenetration = function (rr) {
            var len = this.ab.getMagnitude();
            return this.ab.scale((rr - len) / len);
        };
        CircleVSCircle.ab = new Vector2();
        return CircleVSCircle;
    }();

    var AabbVSAabb = function () {
        function AabbVSAabb() {}
        AabbVSAabb.detect = function (apos, ahs, bpos, bhs) {
            this.ab.subtractVectors(apos, bpos);
            if (this.penetration.absoluteVector(this.ab).opposite().add(ahs).add(bhs).isPositive()) {
                return this.getPenetration();
            }
            return this.penetration.origin();
        };
        AabbVSAabb.getPenetration = function () {
            var minAxis = this.penetration.minAxis();
            this.penetration.setOppositeAxis(minAxis, 0.0);
            if (this.ab[minAxis] < 0) {
                this.penetration[minAxis] = -this.penetration[minAxis];
            }
            return this.penetration;
        };
        AabbVSAabb.ab = new Vector2();
        AabbVSAabb.penetration = new Vector2();
        return AabbVSAabb;
    }();

    var CircleVSAabb = function () {
        function CircleVSAabb() {}
        CircleVSAabb.detect = function (apos, radiusA, bpos, bhs) {
            this.ab.subtractVectors(apos, bpos);
            if (this.penetration.absoluteVector(this.ab).opposite().addScalar(radiusA).add(bhs).isPositive()) {
                if (this.diagonalHit(apos, radiusA, bpos, bhs)) {
                    return this.getPenetration(radiusA);
                }
            }
            return this.penetration.origin();
        };
        CircleVSAabb.diagonalHit = function (apos, radiusA, bpos, bhs) {
            this.setVoronoiRegion(bhs);
            if (this.voronoi.x === 0) {
                if (this.voronoi.y === 0) {
                    this.projectionAxis = this.penetration.minAxis();
                } else {
                    this.projectionAxis = 'y';
                }
                return true;
            } else if (this.voronoi.y === 0) {
                this.projectionAxis = 'x';
                return true;
            } else {
                this.avertex.multiplyVectors(this.voronoi, bhs).add(bpos).subtractVectors(apos, this.avertex);
                var len = this.avertex.getSquaredMagnitude();
                if (radiusA * radiusA - len > 0) {
                    this.projectionAxis = 'diag';
                    return true;
                }
                return false;
            }
        };
        CircleVSAabb.setVoronoiRegion = function (bhs) {
            this.voronoi.origin();
            if (this.ab.x < -bhs.x) {
                this.voronoi.x = -1;
            } else if (this.ab.x > bhs.x) {
                this.voronoi.x = 1;
            }
            if (this.ab.y < -bhs.y) {
                this.voronoi.y = -1;
            } else if (this.ab.y > bhs.y) {
                this.voronoi.y = 1;
            }
        };
        CircleVSAabb.getPenetration = function (radiusA) {
            if (this.projectionAxis != 'diag') {
                this.penetration.setOppositeAxis(this.projectionAxis, 0.0);
                if (this.ab[this.projectionAxis] < 0) {
                    this.penetration[this.projectionAxis] = -this.penetration[this.projectionAxis];
                }
            } else {
                var len = this.avertex.getMagnitude();
                var pen = radiusA - len;
                if (len === 0) {
                    this.penetration.scaleVector(this.voronoi, pen / 1.41);
                } else {
                    this.penetration.scaleVector(this.avertex, pen / len);
                }
            }
            return this.penetration;
        };
        CircleVSAabb.ab = new Vector2();
        CircleVSAabb.penetration = new Vector2();
        CircleVSAabb.voronoi = new Vector2();
        CircleVSAabb.avertex = new Vector2();
        CircleVSAabb.vertex = new Vector2();
        CircleVSAabb.projectionAxis = 'x';
        return CircleVSAabb;
    }();

    var Shape;
    (function (Shape) {
        Shape["circle"] = "circle";
        Shape["aabb"] = "aabb";
    })(Shape || (Shape = {}));

    var CollisionDetection = function () {
        function CollisionDetection() {}
        CollisionDetection.test = function (a, b) {
            this.invert = false;
            this.detect(a.body, b.body);
            if (this.penetration.isNotOrigin()) {
                if (this.resolve(a, b)) {
                    this.computeImpulse(a, b);
                }
                return true;
            }
            return false;
        };
        CollisionDetection.detect = function (a, b) {
            if (a.shape === Shape.circle) {
                if (b.shape === Shape.circle) {
                    this.penetration = CircleVSCircle.detect(a.position, a.radius, b.position, b.radius);
                } else if (b.shape === Shape.aabb) {
                    this.penetration = CircleVSAabb.detect(a.position, a.radius, b.position, b.halfSize);
                }
            } else if (a.shape === Shape.aabb) {
                if (b.shape === Shape.circle) {
                    this.penetration = CircleVSAabb.detect(b.position, b.radius, a.position, a.halfSize);
                    this.invert = true;
                } else if (b.shape === Shape.aabb) {
                    this.penetration = AabbVSAabb.detect(a.position, a.halfSize, b.position, b.halfSize);
                }
            }
        };
        CollisionDetection.resolve = function (a, b) {
            this.totalInverseMass = a.inverseMass + b.inverseMass;
            this.correction.copy(this.penetration).scale(this.percent / this.totalInverseMass);
            if (this.correction.isNotOrigin()) {
                if (this.invert) {
                    b.correctPosition(this.correction);
                    a.correctPosition(this.correction.opposite());
                } else {
                    a.correctPosition(this.correction);
                    b.correctPosition(this.correction.opposite());
                }
                return true;
            }
            return false;
        };
        CollisionDetection.computeImpulse = function (a, b) {
            this.contactNormal.normalizeVector(this.penetration);
            var separatingVelocity = this.relativeVelocity.subtractVectors(a.velocity, b.velocity).dotProduct(this.contactNormal);
            if (separatingVelocity < 0) {
                var restitution = Math.max(a.restitution, b.restitution);
                separatingVelocity = separatingVelocity * restitution - separatingVelocity;
                this.impulse = separatingVelocity / this.totalInverseMass;
                this.impulsePerInverseMass.copy(this.contactNormal).scale(this.impulse);
                a.collision(this.impulsePerInverseMass, b);
                this.impulsePerInverseMass.opposite();
                b.collision(this.impulsePerInverseMass, a);
            }
        };
        CollisionDetection.penetration = new Vector2();
        CollisionDetection.contactNormal = new Vector2();
        CollisionDetection.correction = new Vector2();
        CollisionDetection.relativeVelocity = new Vector2();
        CollisionDetection.impulsePerInverseMass = new Vector2();
        CollisionDetection.totalInverseMass = 0;
        CollisionDetection.impulse = 0;
        CollisionDetection.k_slop = 0.01;
        CollisionDetection.percent = 0.99;
        return CollisionDetection;
    }();

    var Scene = function () {
        function Scene() {
            this.bodies = [];
            this.bodiesLength = 0;
            this.iterations = 1;
            this.gravity = new Vector2(0, 400);
        }
        Scene.prototype.addBody = function (body) {
            if (!body.collisionSceneId) {
                this.bodiesLength++;
                body.collisionSceneId = this.bodiesLength;
                this.bodies.push(body);
                return true;
            }
            return false;
        };
        Scene.prototype.test = function () {
            for (var k = 0; k < this.iterations; k++) {
                for (var i = 0; i < this.bodiesLength; i++) {
                    var body1 = this.bodies[i];
                    if (body1.isActive()) {
                        for (var j = i + 1; j < this.bodiesLength; j++) {
                            var body2 = this.bodies[j];
                            if (body2.isActive()) {
                                if (CollisionDetection.test(body1, body2)) {}
                            }
                        }
                    }
                }
            }
        };
        Scene.prototype.testScene = function (scene) {
            for (var k = 0; k < this.iterations; k++) {
                for (var _i = 0, _a = this.bodies; _i < _a.length; _i++) {
                    var body1 = _a[_i];
                    if (body1.isActive()) {
                        for (var _b = 0, _c = scene.bodies; _b < _c.length; _b++) {
                            var body2 = _c[_b];
                            if (body2.isActive()) {
                                if (CollisionDetection.test(body1, body2)) {}
                            }
                        }
                    }
                }
            }
        };
        Scene.prototype.setIteration = function (iterations) {
            this.iterations = iterations;
        };
        return Scene;
    }();

    var Physics = function () {
        function Physics(positionX, positionY, velocityX, velocityY, sizeX, sizeY, mass, damping, restitution, type) {
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
        Physics.prototype.setActive = function () {
            this.active = true;
        };
        Physics.prototype.setInactive = function () {
            this.active = false;
        };
        Physics.prototype.toggleActive = function () {
            return this.active = !this.active;
        };
        Physics.prototype.isActive = function () {
            return this.active;
        };
        Physics.prototype.updatePosition = function (second) {
            this.translate.origin();
            if (this.active && second > 0) {
                if (this.inverseMass) {
                    this.applyImpulse();
                    this.applyForces(second);
                }
                this.applyVelocity(second);
            }
            return this.position;
        };
        Physics.prototype.applyForces = function (second) {
            this.resultingAcc.copy(this.gravity);
            if (this.force.isNotOrigin()) {
                this.resultingAcc.addScaledVector(this.force, this.inverseMass);
                this.force.origin();
            }
            if (this.resultingAcc.isNotOrigin()) {
                this.velocity.addScaledVector(this.resultingAcc, second);
            }
        };
        Physics.prototype.applyImpulse = function () {
            if (this.impulse.isNotOrigin()) {
                this.velocity.addScaledVector(this.impulse, this.inverseMass);
                this.impulse.origin();
            }
        };
        Physics.prototype.applyVelocity = function (second) {
            if (this.velocity.isNotOrigin()) {
                if (this.damping < 1) {
                    this.velocity.scale(Math.pow(this.damping, second));
                }
                this.translate.copy(this.velocity).scale(second);
                this.position.add(this.translate);
            }
        };
        Physics.prototype.correctPosition = function (correction) {
            if (this.inverseMass) {
                this.position.addScaledVector(correction, this.inverseMass);
                this.body.setPositionFromVector(this.position);
            }
        };
        Physics.prototype.setPosition = function (x, y) {
            this.body.setPositionXY(x, y);
        };
        Physics.prototype.setPositionFromVector = function (position) {
            this.body.setPositionFromVector(position);
        };
        Physics.prototype.setGravity = function (x, y) {
            this.gravity.set(x, y);
        };
        Physics.prototype.setDamageDealt = function (damageDealt) {
            this.damageDealt = damageDealt;
        };
        Physics.prototype.applyDamage = function () {
            if (this.active && this.damageTaken) {
                var dmg = this.damageTaken;
                this.damageTaken = 0;
                return dmg;
            }
            return false;
        };
        Physics.prototype.collision = function (impulsePerInverseMass, object) {
            if (this.inverseMass) {
                this.impulse.copy(impulsePerInverseMass);
            }
            if (!this.damageTaken) {
                this.damageTaken = object.damageDealt;
            }
        };
        Physics.prototype.reset = function () {
            this.velocity.copy(this.initialVelocity);
            this.translate.origin();
            this.force.origin();
            this.impulse.origin();
            this.resultingAcc.origin();
        };
        Physics.prototype.draw = function (context, fillColor, strokeColor, strokeWidth) {
            this.body.draw(context, fillColor, strokeColor, strokeWidth);
        };
        return Physics;
    }();

    exports.Scene = Scene;
    exports.Physics = Physics;

    return exports;

}({}));
