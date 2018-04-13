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




export declare class CollisionDetection {
    static penetration: TYPE6.Vector2;
    static contactNormal: TYPE6.Vector2;
    static correction: TYPE6.Vector2;
    static relativeVelocity: TYPE6.Vector2;
    static impulsePerInverseMass: TYPE6.Vector2;
    static totalInverseMass: number;
    static impulse: number;
    static k_slop: number;
    static percent: number;
    static invert: boolean;
    static test(a: Physics, b: Physics): boolean;
    private static detect(a, b);
    private static resolve(a, b);
    private static computeImpulse(a, b);
}

export declare class AabbVSAabb {
    static ab: TYPE6.Vector2;
    static penetration: TYPE6.Vector2;
    static detect(apos: TYPE6.Vector2, ahs: TYPE6.Vector2, bpos: TYPE6.Vector2, bhs: TYPE6.Vector2): TYPE6.Vector2;
    private static getPenetration();
}

export declare class CircleVSAabb {
    static ab: TYPE6.Vector2;
    static penetration: TYPE6.Vector2;
    static voronoi: TYPE6.Vector2;
    static avertex: TYPE6.Vector2;
    static vertex: TYPE6.Vector2;
    static projectionAxis: 'x' | 'y' | 'diag';
    static detect(apos: TYPE6.Vector2, radiusA: number, bpos: TYPE6.Vector2, bhs: TYPE6.Vector2): TYPE6.Vector2;
    private static diagonalHit(apos, radiusA, bpos, bhs);
    private static setVoronoiRegion(bhs);
    private static getPenetration(radiusA);
}

export declare class CircleVSCircle {
    static ab: TYPE6.Vector2;
    static detect(apos: TYPE6.Vector2, radiusA: number, bpos: TYPE6.Vector2, radiusB: number): TYPE6.Vector2;
    private static getPenetration(rr);
}

export declare class Physics {
    position: TYPE6.Vector2;
    translate: TYPE6.Vector2;
    velocity: TYPE6.Vector2;
    initialVelocity: TYPE6.Vector2;
    gravity: TYPE6.Vector2;
    force: TYPE6.Vector2;
    impulse: TYPE6.Vector2;
    resultingAcc: TYPE6.Vector2;
    damping: number;
    mass: number;
    inverseMass: number;
    restitution: number;
    body: TYPE6.Rectangle | TYPE6.Circle;
    collisionSceneId: number;
    active: boolean;
    damageTaken: number;
    damageDealt: number;
    constructor(positionX: number, positionY: number, velocityX: number, velocityY: number, sizeX: number, sizeY: number, mass: number, damping: number, restitution: number, type: string);
    setActive(): void;
    setInactive(): void;
    toggleActive(): boolean;
    isActive(): boolean;
    updatePosition(second: number): TYPE6.Vector2;
    applyForces(second: number): void;
    private applyImpulse();
    private applyVelocity(second);
    correctPosition(correction: TYPE6.Vector2): void;
    setPosition(x: number, y: number): void;
    setPositionFromVector(position: TYPE6.Vector2): void;
    setGravity(x: number, y: number): void;
    setDamageDealt(damageDealt: number): void;
    applyDamage(): number | false;
    collision(impulsePerInverseMass: TYPE6.Vector2, object: Physics): void;
    private reset();
    draw(context: CanvasRenderingContext2D, fillColor: string, strokeColor: string, strokeWidth: number): void;
}


export declare class Scene {
    bodies: Array<Physics>;
    bodiesLength: number;
    gravity: TYPE6.Vector2;
    iterations: number;
    constructor();
    addBody(body: Physics): boolean;
    test(): void;
    testScene(scene: Scene): void;
    setIteration(iterations: number): void;
}
