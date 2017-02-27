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
var BUMP = {
    revision: "0.2.5",
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
    damageTaken: 0,
    damageDealt: 1,
    create: function(velocity, mass, damping, elasticity) {
        var _this = Object.create(this);
        _this.initVectors(velocity);
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
    setDamageDealt: function(damageDealt) {
        this.damageDealt = damageDealt;
    },
    applyImpulse: function(impulsePerInverseMass) {
        this.velocity.addScaledVectorTo(impulsePerInverseMass, this.inverseMass);
    },
    applyDamage: function() {
        if (this.damageTaken) {
            var dmg = this.damageTaken;
            this.damageTaken = 0;
            return dmg;
        }
        return false;
    },
    collision: function(impulsePerInverseMass, object) {
        this.impulse.copyTo(impulsePerInverseMass);
        if (!this.damageTaken) this.damageTaken = object.damageDealt;
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
            a.collision(this.impulsePerInverseMass, b);
            b.collision(this.impulsePerInverseMass.oppositeTo(), a);
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
        _this.collision = BUMP.Collision.create();
        _this.bodies = [];
        _this.gravity = TYPE6.Vector2D.create(0, 400);
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
    testScene: function(scene) {
        for (var i = 0; i < this.bodiesLength; i++) {
            for (var j = 0; j < scene.bodiesLength; j++) {
                var p1 = this.bodies[i];
                var p2 = scene.bodies[j];
                this.collision.test(p1.body, p1.physics, p2.body, p2.physics);
            }
        }
    },
    setGravity: function() {},
    getGravity: function() {
        return this.gravity;
    }
};