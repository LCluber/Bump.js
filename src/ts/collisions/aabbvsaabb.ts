
import {Vector2} from '@lcluber/type6js';

export class AabbVSAabb {

  static ab         : Vector2 = new Vector2();
  static penetration: Vector2 = new Vector2();
  //static rr: number = 0.0;

  static detect( apos: Vector2,
                 ahs : Vector2,
                 bpos: Vector2,
                 bhs : Vector2 ): Vector2 {
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

  private static getPenetration(): Vector2 {
    //pick the projection axis
    let minAxis = this.penetration.minAxis();
    this.penetration.setOppositeAxis(minAxis, 0.0);
    if(this.ab[minAxis] < 0) {
      this.penetration[minAxis] = -this.penetration[minAxis];
    }
    return this.penetration;
  }

}
