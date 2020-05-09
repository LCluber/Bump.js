
import {Vector2} from '@lcluber/type6js';

type ProjectionAxis = 'x' | 'y' | 'diag';

export class CircleVSAabb {

  static ab             : Vector2 = new Vector2();
  static penetration    : Vector2 = new Vector2();
  static voronoi        : Vector2 = new Vector2();
  static avertex        : Vector2 = new Vector2();
  static vertex         : Vector2 = new Vector2();
  //static radiusA        : number = 0.0;
  static projectionAxis : ProjectionAxis = 'x';

  static detect( apos: Vector2, radiusA: number, bpos: Vector2, bhs: Vector2): Vector2 {
    this.ab.subtractVectors(apos,bpos);
    if(this.penetration.absoluteVector(this.ab)
                       .opposite()
                       .addScalar(radiusA)
                       .add(bhs)
                       .isPositive()) { //aabbVSaabb hit test
      if (this.diagonalHit(apos, radiusA, bpos, bhs)){
        return this.getPenetration(radiusA);
      }
    }
    return this.penetration.origin();
  }

  private static diagonalHit(apos: Vector2, radiusA: number, bpos: Vector2, bhs: Vector2 ): boolean {
    this.setVoronoiRegion(bhs);
    if( this.voronoi.x === 0 ) {
      if( this.voronoi.y === 0 ) { //circle is in the aabb
        this.projectionAxis = this.penetration.minAxis() as ProjectionAxis;
      } else { //project on y axis
        this.projectionAxis = 'y';
      }
      return true;
    } else if( this.voronoi.y === 0 ) { //project on x axis
      this.projectionAxis = 'x';
      return true;
    } else { //possible diagonal collision
      this.avertex.multiplyVectors( this.voronoi, bhs )
                  .add( bpos )//get nearest vertex position
                  .subtractVectors(apos, this.avertex);//calc vert->circle vector
      let len = this.avertex.getSquaredMagnitude();
      if( radiusA * radiusA - len > 0 ) { //vertex is in the circle; project outward
        this.projectionAxis = 'diag';
        return true; //collision detected
      }
      return false;
    }
  }

  private static setVoronoiRegion(bhs: Vector2): void {//determine grid/voronoi region of circle center

    this.voronoi.origin();
    // x axis
    if(this.ab.x < -bhs.x) {
      this.voronoi.x = -1;//circle is on left side of tile
    }else if(this.ab.x > bhs.x) {
      this.voronoi.x = 1;//circle is on right side of tile
    }
    // y axis
    if(this.ab.y < -bhs.y) {
      this.voronoi.y = -1;//circle is on bottom side of tile
    }else if(this.ab.y > bhs.y) {
      this.voronoi.y = 1;//circle is on top side of tile
    }
  }

  private static getPenetration(radiusA: number): Vector2 {

    if (this.projectionAxis != 'diag'){ //aabbvsaabb like collision

      this.penetration.setOppositeAxis(this.projectionAxis, 0.0);
      if(this.ab[this.projectionAxis] < 0) {
        this.penetration[this.projectionAxis] = -this.penetration[this.projectionAxis];
      }

    }else{//diagonal collision

      let len = this.avertex.getMagnitude();
      let pen = radiusA - len;
      if( len === 0 ) {
        this.penetration.scaleVector(this.voronoi, pen/1.41);//project out by 45deg (1/square root of 2)
      }else{
        this.penetration.scaleVector(this.avertex, pen/len);
      }
    }
    return this.penetration;
  }

}
