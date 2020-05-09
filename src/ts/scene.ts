
import { Vector2 } from '@lcluber/type6js';
import { CollisionDetection } from './collision';
import { Physics } from './physics';

// export interface IBody {
//   physics : Physics;
// }

export class Scene {

  bodies : Physics[];
  bodiesLength : number;

  //collision : BUMP.Collision.create();
  gravity : Vector2;
  iterations : number;

  constructor() {
    //_this.collision = BUMP.Collision.create();
    this.bodies = [];
    this.bodiesLength = 0;
    this.iterations = 1;
    this.gravity = new Vector2( 0, 400 );
  }

  public addBody(body: Physics): boolean {

    if(!body.collisionSceneId) {
      this.bodiesLength ++;
      body.collisionSceneId = this.bodiesLength;
      this.bodies.push(body);
      return true;
    }
    return false;
  }

  // removeBody : function(){
  //
  // },

  public test(): void {
    for(let k = 0 ; k < this.iterations ; k++) {
      for(let i = 0 ; i < this.bodiesLength ; i++) {
        let body1 = this.bodies[i];
        if (body1.isActive()) {
          for(let j = i + 1 ; j < this.bodiesLength ; j++) {
            let body2 = this.bodies[j];
            if (body2.isActive()) {
              if (CollisionDetection.test(body1, body2)) {
                //MOUETTE.Logger.debug('Collision detected');
              }
            }
          }
        }
      }
    }
  }

  public testScene(scene: Scene): void {
    for(let k = 0 ; k < this.iterations ; k++) {
      for(let body1 of this.bodies) {
        if (body1.isActive()) {
          for(let body2 of scene.bodies) {
            if (body2.isActive()) {
              if(CollisionDetection.test(body1, body2)) {
                //MOUETTE.Logger.debug('Collision detected');
              }
            }
          }
        }
      }
    }
  }

  public setIteration(iterations: number): void {
    this.iterations = iterations;
  }

  // checkPairs : function(){
  //   var duplicate = false;
  //   for( k = 0 ; k < pairs.length ; k++ ){
  //     if( (pairs[k][0] === i && pairs[k][1] === j) || (pairs[k][0] === j && pairs[k][1] === i) ){
  //       duplicate = true;
  //     }
  //   }
  //   if (!duplicate)
  //    this.pairs.push([i,j]);
  // },

  // public setGravity() {
  //
  // }


};
