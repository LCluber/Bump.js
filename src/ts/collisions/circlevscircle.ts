
import {Vector2} from 'type6js';

export class CircleVSCircle {

  static ab: Vector2 = new Vector2();
  //static penetration: Vector2 = new Vector2();
  //static rr: number = 0.0;

  static detect( apos: Vector2, radiusA: number, bpos: Vector2, radiusB: number ): Vector2 {
    this.ab.subtractVectors(apos,bpos);
    let rr = radiusA + radiusB;
    if(rr * rr - this.ab.getSquaredMagnitude() > 0) {//collision detected
      return this.getPenetration(rr);
    }
    return this.ab.origin();
  }

  private static getPenetration(rr: number): Vector2 {
    let len = this.ab.getMagnitude();
    //distance vector is normalized and scaled by penetration depth
    return this.ab.scale((rr-len)/len);
  }

}
