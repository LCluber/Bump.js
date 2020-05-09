
import {Vector2,Circle,Rectangle} from '@lcluber/type6js';
import {Physics} from './physics';
import {CircleVSCircle} from './collisions/circlevscircle';
import {AabbVSAabb} from './collisions/aabbvsaabb';
import {CircleVSAabb} from './collisions/circlevsaabb';

enum Shape { circle = 'circle', aabb = 'aabb' };

export class CollisionDetection {

  //static ab                     : Vector2 = new Vector2();
  static penetration            : Vector2 = new Vector2();
  static contactNormal          : Vector2 = new Vector2();
  static correction             : Vector2 = new Vector2();
  static relativeVelocity       : Vector2 = new Vector2();
  static impulsePerInverseMass  : Vector2 = new Vector2();

  static totalInverseMass       : number = 0;
  static impulse                : number = 0;

  static k_slop                 : number = 0.01; // Penetration allowance
  static percent                : number = 0.99; // Penetration percentage to correct

  static invert                 : boolean; //invert correction if true

  static test( a: Physics, b: Physics ): boolean {
    //if( a.onScreen() ){
      //if( this.cellTest( physicsA.cells, physicsB.cells ) ){
        this.invert = false;
        this.detect( a.body, b.body );
        if( this.penetration.isNotOrigin()) {
          if ( this.resolve( a, b )) {
            this.computeImpulse( a, b );
          }
          return true;
        }
        return false;
      //}
    //}
  }

  // private setDelta( positionA: Vector2, positionB: Vector2 ): Vector2 {
  //   return positionA.subtract(positionB);//ab between a and b centers on each axis
  // }

  private static detect( a: Circle|Rectangle, b: Circle|Rectangle ): void {
    if( a.shape === Shape.circle ) {//circle
      if( b.shape === Shape.circle ) {
        this.penetration = CircleVSCircle.detect( a.position, a.radius, b.position, b.radius );
      }else if( b.shape === Shape.aabb ) {
        this.penetration = CircleVSAabb.detect( a.position, a.radius, b.position, b.halfSize );
      }
    }else if( a.shape === Shape.aabb ) {//aabb
      if( b.shape === Shape.circle ) {
        this.penetration = CircleVSAabb.detect( b.position, b.radius, a.position, a.halfSize );
        this.invert = true;
      }else if( b.shape === Shape.aabb ) {
        this.penetration = AabbVSAabb.detect( a.position, a.halfSize, b.position, b.halfSize );
      }
    }
  }

  // cellTest:function(a,b){
  //   for( var i = 0, k = -1 ; i < 4; i++ ){
  //     if( k != a[i] ){
  //       for( var j = 0; j < 4; j++ ){
  //         if( a[i] === b[j] )//common cell found
  //           return true;
  //       }
  //       k = a[i];
  //     }
  //   }
  //   return false;
  // },


  private static resolve( a: Physics, b: Physics  ) {
    this.totalInverseMass = a.inverseMass + b.inverseMass;

    //compute correction
    //movePerIMass
    this.correction.copy(this.penetration)
                   .scale( this.percent/this.totalInverseMass );
    // this.correction.absoluteVector(this.penetration)
    //                .subtractScalar(this.k_slop)
    //                .maxScalar(0)
    //                .scale( this.percent/this.totalInverseMass )
    //                .multiply(this.contactNormal);
    // this.correction.setXY(
    //   Math.max( Math.abs(this.penetration.getX()) - this.k_slop, 0 ) / this.totalInverseMass * this.percent * this.contactNormal.getX(),
    //   Math.max( Math.abs(this.penetration.getY()) - this.k_slop, 0 ) / this.totalInverseMass * this.percent * this.contactNormal.getY()
    // );

    if(this.correction.isNotOrigin()) {
      if(this.invert) {
        b.correctPosition( this.correction /*, imA / this.totalInverseMass*/ );
        a.correctPosition( this.correction.opposite());
      } else {
        a.correctPosition( this.correction /*, imA / this.totalInverseMass*/ );
        b.correctPosition( this.correction.opposite());
      }
      return true;
    }
    return false;

  }


  private static computeImpulse( a: Physics, b: Physics ) {

    this.contactNormal.normalizeVector(this.penetration);//is now surfaceNormal //unit length vector perpendicular to the surface between the two objects || contactnormal
    let separatingVelocity = this.relativeVelocity.subtractVectors(a.velocity,b.velocity)
                                                  .dotProduct(this.contactNormal);
    if( separatingVelocity < 0 ) {//apply collision response forces only if objects are travelling in each other
      //vel+=1/m*impulse
      //calculate separating velocity with restitution (between 0 and 1)
      //Calculate the new separating velocity
      let restitution = Math.max( a.restitution, b.restitution );
      separatingVelocity = separatingVelocity * restitution - separatingVelocity;
      //this.abVelocity = separatingVelocity * restitution - separatingVelocity;
      // Calculate the impulse to apply.
      this.impulse = separatingVelocity / this.totalInverseMass;
      // Find the amount of impulse per unit of inverse mass.
      //Vector3 impulsePerIMass = contactNormal * impulse;
      this.impulsePerInverseMass.copy(this.contactNormal).scale(this.impulse);
      // Apply impulses: they are applied in the direction of the contact,
      // and are proportional to the inverse mass.
      a.collision( this.impulsePerInverseMass, b );
      //a.impulse.copyTo( this.impulsePerInverseMass );
      //a.velocity.addScaledVectorTo( this.impulsePerInverseMass, a.inverseMass );
      this.impulsePerInverseMass.opposite();
      b.collision( this.impulsePerInverseMass, a );
      //b.impulse.copyTo( this.impulsePerInverseMass );
      //b.velocity.addScaledVectorTo( this.impulsePerInverseMass, b.inverseMass );
    }
  }

};
