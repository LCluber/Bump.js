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
    revision: "0.4.1",
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
    body: {},
    collisionSceneId: 0,
    active: true,
    damageTaken: 0,
    damageDealt: 1,
    create: function(velocity, mass, damping, elasticity, type, positionX, positionY, sizeX, sizeY) {
        var _this = Object.create(this);
        _this.initVectors(velocity);
        _this.mass = mass;
        _this.inverseMass = !mass ? 0 : 1 / mass;
        _this.damping = damping;
        _this.elasticity = -elasticity;
        _this.createBody(type, positionX, positionY, sizeX, sizeY);
        return _this;
    },
    createBody: function(type, positionX, positionY, sizeX, sizeY) {
        switch (type) {
          case "circle":
            this.body = TYPE6.Geometry.Circle.create(positionX, positionY, sizeX);
            break;

          case "rectangle":
            this.body = TYPE6.Geometry.Rectangle.create(positionX, positionY, sizeX, sizeY);
            break;

          default:
            return false;
        }
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
    setActive: function() {
        this.active = true;
    },
    setInactive: function() {
        this.active = false;
    },
    toggleActive: function() {
        this.active = !this.active;
        return this.active;
    },
    isActive: function() {
        return this.active;
    },
    updatePosition: function(second) {
        this.translate.setToOrigin();
        if (this.active && second > 0) {
            if (this.inverseMass) {
                this.applyImpulse();
                this.applyForces(second);
            }
            this.applyVelocity(second);
        }
        return this.getPosition();
    },
    applyForces: function(second) {
        this.resultingAcc.copyTo(this.gravity);
        if (this.force.isNotOrigin()) {
            this.resultingAcc.addScaledVectorTo(this.force, this.inverseMass);
            this.force.setToOrigin();
        }
        if (this.resultingAcc.isNotOrigin()) this.velocity.addScaledVectorTo(this.resultingAcc, second);
    },
    applyImpulse: function() {
        if (this.impulse.isNotOrigin()) {
            this.velocity.addScaledVectorTo(this.impulse, this.inverseMass);
            this.impulse.setToOrigin();
        }
    },
    applyVelocity: function(second) {
        if (this.velocity.isNotOrigin()) {
            if (this.damping < 1) {
                this.velocity.scaleBy(Math.pow(this.damping, second));
            }
            this.translate.copyScaledVectorTo(this.velocity, second);
            this.body.position.addTo(this.translate);
        }
    },
    setPosition: function(x, y) {
        this.body.setPositionXY(x, y);
    },
    setVelocity: function(x, y) {
        this.velocity.setXY(x, y);
    },
    setGravity: function(x, y) {
        this.gravity.setXY(x, y);
    },
    getPosition: function() {
        return this.body.position;
    },
    getPositionX: function() {
        return this.body.getPositionX();
    },
    getPositionY: function() {
        return this.body.getPositionY();
    },
    getTranslate: function() {
        return this.translate;
    },
    getVelocity: function() {
        return this.velocity;
    },
    getVelocityX: function() {
        return this.velocity.getX();
    },
    getVelocityY: function() {
        return this.velocity.getY();
    },
    getForce: function() {
        return this.force;
    },
    getResultingAcceleration: function() {
        return this.resultingAcc;
    },
    getGravity: function() {
        return this.gravity;
    },
    getImpulse: function() {
        return this.impulse;
    },
    getRestitution: function() {
        return this.elasticity;
    },
    getDamping: function() {
        return this.damping;
    },
    getMass: function() {
        return this.mass;
    },
    getInverseMass: function() {
        return this.inverseMass;
    },
    setDamageDealt: function(damageDealt) {
        this.damageDealt = damageDealt;
    },
    applyDamage: function() {
        if (this.active && this.damageTaken) {
            var dmg = this.damageTaken;
            this.damageTaken = 0;
            return dmg;
        }
        return false;
    },
    collision: function(impulsePerInverseMass, object) {
        if (this.inverseMass) this.impulse.copyTo(impulsePerInverseMass);
        if (!this.damageTaken) this.damageTaken = object.damageDealt;
    },
    reset: function() {
        this.velocity.copyTo(this.initialVelocity);
        this.translate.setToOrigin();
        this.force.setToOrigin();
        this.impulse.setToOrigin();
        this.resultingAcc.setToOrigin();
    },
    drawBody: function(context, fillColor, strokeColor, strokeWidth) {
        this.body.draw(context, fillColor, strokeColor, strokeWidth);
    }
};

BUMP.Collision = {
    delta: TYPE6.Vector2D.create(),
    delta2: TYPE6.Vector2D.create(),
    penetration: TYPE6.Vector2D.create(),
    contactNormal: TYPE6.Vector2D.create(),
    correction: TYPE6.Vector2D.create(),
    vertex: TYPE6.Vector2D.create(),
    relativeVelocity: TYPE6.Vector2D.create(),
    voronoi: TYPE6.Vector2D.create(),
    deltaVelocity: 0,
    totalInverseMass: 0,
    impulse: 0,
    impulsePerInverseMass: TYPE6.Vector2D.create(),
    k_slop: .01,
    percent: .8,
    create: function() {
        var _this = Object.create(this);
        return _this;
    },
    test: function(a, b) {
        this.setDelta(a.getPosition(), b.getPosition());
        if (this.getPenetration(a.body, b.body)) {
            if (this.separate(a.getPosition(), a.getInverseMass(), b.getPosition(), b.getInverseMass())) this.computeImpulseVectors(a, b);
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
    getPenetration: function(a, b) {
        if (a.shape === "circle") {
            if (b.shape === "circle") return this.circleVScircle(a.getRadius() + b.getRadius()); else if (b.shape === "aabb") return this.circleVSaabb(a.getPosition(), a.getHalfSize(), a.getRadius(), b.getPosition(), b.getHalfSize());
        } else if (a.shape === "aabb") {
            if (b.shape === "circle") return this.circleVSaabb(b.getPosition(), b.getHalfSize(), b.getRadius(), a.getPosition(), a.getHalfSize()); else if (b.shape === "aabb") return this.aabbVSaabb(a.getHalfSize(), b.getHalfSize());
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
        this.computeContactNormal();
        this.computeCorrection();
        if (this.correction.isNotOrigin()) {
            if (imA) positionA.addScaledVectorTo(this.correction, imA);
            if (imB) positionB.subtractScaledVectorFrom(this.correction, imB);
            return true;
        }
        return false;
    },
    computeCorrection: function() {
        this.correction.copyTo(this.penetration);
        this.correction.absoluteTo();
        this.correction.subtractScalarFrom(this.k_slop);
        this.correction.maxScalarTo(0);
        this.correction.scaleBy(this.percent / this.totalInverseMass);
        this.correction.multiplyBy(this.contactNormal);
    },
    computeImpulseVectors: function(a, b) {
        var separatingVelocity = this.computeSeparatingVelocity(a.getVelocity(), b.getVelocity());
        if (separatingVelocity < 0) {
            var restitution = Math.max(a.getRestitution(), b.getRestitution());
            separatingVelocity = separatingVelocity * restitution - separatingVelocity;
            this.impulse = separatingVelocity / this.totalInverseMass;
            this.impulsePerInverseMass.copyScaledVectorTo(this.contactNormal, this.impulse);
            a.collision(this.impulsePerInverseMass, b);
            this.impulsePerInverseMass.oppositeTo();
            b.collision(this.impulsePerInverseMass, a);
        }
    },
    computeSeparatingVelocity: function(av, bv) {
        this.relativeVelocity.copySubtractFromTo(av, bv);
        return this.relativeVelocity.dotProduct(this.contactNormal);
    },
    computeContactNormal: function() {
        this.contactNormal.copyTo(this.penetration);
        this.contactNormal.normalizeTo();
    }
};

BUMP.Scene = {
    bodies: [],
    bodiesLength: 0,
    collision: BUMP.Collision.create(),
    gravity: TYPE6.Vector2D.create(0, 400),
    iteration: 1,
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
        for (var k = 0; k < this.iteration; k++) {
            for (var i = 0; i < this.bodiesLength; i++) {
                var p1 = this.bodies[i];
                if (p1.physics.isActive()) {
                    for (var j = i + 1; j < this.bodiesLength; j++) {
                        var p2 = this.bodies[j];
                        if (p2.physics.isActive()) {
                            this.collision.test(p1.physics, p2.physics);
                        }
                    }
                }
            }
        }
    },
    testScene: function(scene) {
        for (var k = 0; k < this.iteration; k++) {
            for (var i = 0; i < this.bodiesLength; i++) {
                var p1 = this.bodies[i];
                if (p1.physics.isActive()) {
                    for (var j = 0; j < scene.bodiesLength; j++) {
                        var p2 = scene.bodies[j];
                        if (p2.physics.isActive()) {
                            this.collision.test(p1.physics, p2.physics);
                        }
                    }
                }
            }
        }
    },
    setIteration: function(iteration) {
        this.iteration = iteration;
    },
    getIteration: function() {
        return this.iteration;
    },
    setGravity: function() {},
    getGravity: function() {
        return this.gravity;
    }
};