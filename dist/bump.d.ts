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


import { Vector2, Circle, Rectangle } from '@lcluber/type6js';

export declare class CollisionDetection {
    static ab: Vector2;
    static penetration: Vector2;
    static contactNormal: Vector2;
    static correction: Vector2;
    static relativeVelocity: Vector2;
    static impulsePerInverseMass: Vector2;
    static totalInverseMass: number;
    static impulse: number;
    static k_slop: number;
    static percent: number;
    static invert: boolean;
    static test(a: Physics, b: Physics): boolean;
    private static detect;
    private static resolve;
    private static computeImpulse;
}

export declare class AabbVSAabb {
    static ab: Vector2;
    static penetration: Vector2;
    static detect(apos: Vector2, ahs: Vector2, bpos: Vector2, bhs: Vector2): Vector2;
    private static getPenetration;
}

declare type ProjectionAxis = 'x' | 'y' | 'diag';
export declare class CircleVSAabb {
    static ab: Vector2;
    static penetration: Vector2;
    static voronoi: Vector2;
    static avertex: Vector2;
    static vertex: Vector2;
    static projectionAxis: ProjectionAxis;
    static detect(apos: Vector2, radiusA: number, bpos: Vector2, bhs: Vector2): Vector2;
    private static diagonalHit;
    private static setVoronoiRegion;
    private static getPenetration;
}

export declare class CircleVSCircle {
    static ab: Vector2;
    static detect(apos: Vector2, radiusA: number, bpos: Vector2, radiusB: number): Vector2;
    private static getPenetration;
}

export declare class Physics {
    position: Vector2;
    translate: Vector2;
    velocity: Vector2;
    initialVelocity: Vector2;
    gravity: Vector2;
    force: Vector2;
    impulse: Vector2;
    resultingAcc: Vector2;
    damping: number;
    mass: number;
    inverseMass: number;
    restitution: number;
    body: Rectangle | Circle;
    collisionSceneId: number;
    active: boolean;
    damageTaken: number;
    damageDealt: number;
    constructor(positionX: number, positionY: number, velocityX: number, velocityY: number, sizeX: number, sizeY: number, mass: number, damping: number, restitution: number, type: string);
    setActive(): void;
    setInactive(): void;
    toggleActive(): boolean;
    isActive(): boolean;
    updatePosition(second: number): Vector2;
    applyForces(second: number): void;
    private applyImpulse;
    private applyVelocity;
    correctPosition(correction: Vector2): void;
    setPosition(x: number, y: number): void;
    setPositionFromVector(position: Vector2): void;
    setGravity(x: number, y: number): void;
    setDamageDealt(damageDealt: number): void;
    applyDamage(): number | false;
    collision(impulsePerInverseMass: Vector2, object: Physics): void;
    private reset;
    draw(context: CanvasRenderingContext2D, fillColor: string, strokeColor: string, strokeWidth: number): void;
}

export declare class Scene {
    bodies: Physics[];
    bodiesLength: number;
    gravity: Vector2;
    iterations: number;
    constructor();
    addBody(body: Physics): boolean;
    test(): void;
    testScene(scene: Scene): void;
    setIteration(iterations: number): void;
}
