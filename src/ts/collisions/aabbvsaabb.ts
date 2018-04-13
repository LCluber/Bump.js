
import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';

export class AabbVSAabb {

  static ab         : TYPE6.Vector2 = new TYPE6.Vector2();
  static penetration: TYPE6.Vector2 = new TYPE6.Vector2();
  //static rr: number = 0.0;

  static detect( apos: TYPE6.Vector2,
                 ahs : TYPE6.Vector2,
                 bpos: TYPE6.Vector2,
                 bhs : TYPE6.Vector2 ): TYPE6.Vector2 {
    this.ab.subtractVectors(apos,bpos);
    if (this.penetration.absoluteVector(this.ab)
                        .opposite()
                        .add(ahs)
                        .add(bhs)
                        .isPositive()){
      return this.getPenetration();
    }
    return this.penetration.origin();
  }

  private static getPenetration(): TYPE6.Vector2 {
    //pick the projection axis
    let minAxis = this.penetration.minAxis();
    this.penetration.setOppositeAxis(minAxis, 0.0);
    if(this.ab[minAxis] < 0) {
      this.penetration[minAxis] = -this.penetration[minAxis];
    }
    return this.penetration;
  }

}
