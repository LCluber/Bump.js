
import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';

export class CircleVSCircle {

  static ab: TYPE6.Vector2 = new TYPE6.Vector2();
  //static penetration: TYPE6.Vector2 = new TYPE6.Vector2();
  //static rr: number = 0.0;

  static detect( apos: TYPE6.Vector2, radiusA: number, bpos: TYPE6.Vector2, radiusB: number ): TYPE6.Vector2 {
    this.ab.subtractVectors(apos,bpos);
    let rr = radiusA + radiusB;
    if(rr * rr - this.ab.getSquaredMagnitude() > 0) {//collision detected
      return this.getPenetration(rr);
    }
    return this.ab.origin();
  }

  private static getPenetration(rr: number): TYPE6.Vector2 {
    let len = this.ab.getMagnitude();
    //distance vector is normalized and scaled by penetration depth
    return this.ab.scale((rr-len)/len);
  }

}
