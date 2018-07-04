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

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('../../bower_components/Type6js/dist/type6.js')) :
    typeof define === 'function' && define.amd ? define(['exports', '../../bower_components/Type6js/dist/type6.js'], factory) :
    (factory((global.BUMP = {}),global.TYPE6));
}(this, (function (exports,TYPE6) { 'use strict';

    var CircleVSCircle = (function () {
        function CircleVSCircle() {
        }
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
        CircleVSCircle.ab = new TYPE6.Vector2();
        return CircleVSCircle;
    }());

    var AabbVSAabb = (function () {
        function AabbVSAabb() {
        }
        AabbVSAabb.detect = function (apos, ahs, bpos, bhs) {
            this.ab.subtractVectors(apos, bpos);
            if (this.penetration.absoluteVector(this.ab)
                .opposite()
                .add(ahs)
                .add(bhs)
                .isPositive()) {
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
        AabbVSAabb.ab = new TYPE6.Vector2();
        AabbVSAabb.penetration = new TYPE6.Vector2();
        return AabbVSAabb;
    }());

    var CircleVSAabb = (function () {
        function CircleVSAabb() {
        }
        CircleVSAabb.detect = function (apos, radiusA, bpos, bhs) {
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
        };
        CircleVSAabb.diagonalHit = function (apos, radiusA, bpos, bhs) {
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
        };
        CircleVSAabb.getPenetration = function (radiusA) {
            if (this.projectionAxis != 'diag') {
                this.penetration.setOppositeAxis(this.projectionAxis, 0.0);
                if (this.ab[this.projectionAxis] < 0) {
                    this.penetration[this.projectionAxis] = -this.penetration[this.projectionAxis];
                }
            }
            else {
                var len = this.avertex.getMagnitude();
                var pen = radiusA - len;
                if (len === 0) {
                    this.penetration.scaleVector(this.voronoi, pen / 1.41);
                }
                else {
                    this.penetration.scaleVector(this.avertex, pen / len);
                }
            }
            return this.penetration;
        };
        CircleVSAabb.ab = new TYPE6.Vector2();
        CircleVSAabb.penetration = new TYPE6.Vector2();
        CircleVSAabb.voronoi = new TYPE6.Vector2();
        CircleVSAabb.avertex = new TYPE6.Vector2();
        CircleVSAabb.vertex = new TYPE6.Vector2();
        CircleVSAabb.projectionAxis = 'x';
        return CircleVSAabb;
    }());

    var Shape;
    (function (Shape) {
        Shape["circle"] = "circle";
        Shape["aabb"] = "aabb";
    })(Shape || (Shape = {}));

    var CollisionDetection = (function () {
        function CollisionDetection() {
        }
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
        };
        CollisionDetection.resolve = function (a, b) {
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
        };
        CollisionDetection.computeImpulse = function (a, b) {
            this.contactNormal.normalizeVector(this.penetration);
            var separatingVelocity = this.relativeVelocity.subtractVectors(a.velocity, b.velocity)
                .dotProduct(this.contactNormal);
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
        CollisionDetection.penetration = new TYPE6.Vector2();
        CollisionDetection.contactNormal = new TYPE6.Vector2();
        CollisionDetection.correction = new TYPE6.Vector2();
        CollisionDetection.relativeVelocity = new TYPE6.Vector2();
        CollisionDetection.impulsePerInverseMass = new TYPE6.Vector2();
        CollisionDetection.totalInverseMass = 0;
        CollisionDetection.impulse = 0;
        CollisionDetection.k_slop = 0.01;
        CollisionDetection.percent = 0.99;
        return CollisionDetection;
    }());

    var Scene = (function () {
        function Scene() {
            this.bodies = [];
            this.bodiesLength = 0;
            this.iterations = 1;
            this.gravity = new TYPE6.Vector2(0, 400);
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
                                if (CollisionDetection.test(body1, body2)) {
                                }
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
                                if (CollisionDetection.test(body1, body2)) {
                                }
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
    }());

    var Physics = (function () {
        function Physics(positionX, positionY, velocityX, velocityY, sizeX, sizeY, mass, damping, restitution, type) {
            this.damping = 0.8;
            this.mass = 1.0;
            this.inverseMass = 1.0;
            this.restitution = -1;
            this.collisionSceneId = 0;
            this.active = true;
            this.damageTaken = 0;
            this.damageDealt = 1;
            this.velocity = new TYPE6.Vector2(velocityX, velocityY);
            this.initialVelocity = this.velocity.clone();
            this.translate = new TYPE6.Vector2();
            this.gravity = new TYPE6.Vector2();
            this.force = new TYPE6.Vector2();
            this.impulse = new TYPE6.Vector2();
            this.resultingAcc = new TYPE6.Vector2();
            this.mass = mass;
            this.inverseMass = !mass ? 0 : 1 / mass;
            this.damping = damping;
            this.restitution = -restitution;
            switch (type) {
                case 'rectangle':
                    this.body = new TYPE6.Rectangle(positionX, positionY, sizeX, sizeY);
                    break;
                default:
                    this.body = new TYPE6.Circle(positionX, positionY, sizeX);
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
    }());

    exports.Scene = Scene;
    exports.Physics = Physics;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
