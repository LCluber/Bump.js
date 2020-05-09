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

import { Circle, Rectangle, Vector2 } from '@lcluber/type6js';

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
