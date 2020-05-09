
import {Vector2,Circle,Rectangle} from '@lcluber/type6js';


export class Physics {

  //correction      : Vector2;
  public position : Vector2;
  translate       : Vector2;
  velocity        : Vector2;
  initialVelocity : Vector2;
  gravity         : Vector2;
  force           : Vector2;
  impulse         : Vector2;
  resultingAcc    : Vector2;

  damping     : number = 0.8;
  mass        : number = 1.0;
  inverseMass : number = 1.0;
  restitution : number = -1;//-e elasticity

  body        : Rectangle | Circle;

  //size        : Vector2.create();
  //halfSize    : Vector2.create();
  // cells       : [ 0, 0, 0, 0 ],
  // frame       : [ Vector2.create(),
  //                 Vector2.create(),
  //                 Vector2.create(),
  //                 Vector2.create()
  //               ],

  collisionSceneId : number = 0;
  active : boolean = true;
  damageTaken : number = 0;
  damageDealt : number = 1;

  // deactivationTresholdActive : false,
  // deactivationTreshold       : Vector2.create(),

  // materials
  // Rock       Density : 0.6  Restitution : 0.1
  // Wood       Density : 0.3  Restitution : 0.2
  // Metal      Density : 1.2  Restitution : 0.05
  // BouncyBall Density : 0.3  Restitution : 0.8
  // SuperBall  Density : 0.3  Restitution : 0.95
  // Pillow     Density : 0.1  Restitution : 0.2
  // Static     Density : 0.0  Restitution : 0.4
//margin=[-halfSize.y,ROOSTR.Screen.size.x+halfSize.x,ROOSTR.Screen.size.y+halfSize.y,-halfSize.x];

  //impulsePerInverseMass : Vector2.create(),

  constructor(  positionX: number, positionY: number,
                velocityX: number, velocityY: number,
                sizeX: number, sizeY: number,
                mass: number,
                damping: number,
                restitution: number,
                type: string ) {

    this.velocity        = new Vector2( velocityX, velocityY );
    this.initialVelocity = this.velocity.clone();

    //this.correction      = new Vector2();
    this.translate       = new Vector2();
    this.gravity         = new Vector2();
    this.force           = new Vector2();
    this.impulse         = new Vector2();
    this.resultingAcc    = new Vector2();

    this.mass         = mass;
    this.inverseMass  = !mass ? 0 : 1/mass ;
    this.damping      = damping;
    this.restitution  = -restitution;

    switch (type) {
      case 'rectangle':
        this.body = new Rectangle( positionX, positionY, sizeX, sizeY );
        break;
      default:
        this.body = new Circle( positionX, positionY, sizeX );
    }
    this.position = this.body.position;
    //_this.setFrame();

  }

  public setActive(): void {
    this.active = true;
  }

  public setInactive(): void {
    this.active = false;
  }

  public toggleActive(): boolean {
    return this.active = !this.active;
  }

  public isActive(): boolean {
    return this.active;
  }


  // /**
  // * Set the element as active
  // * @since 0.4.0
  // * @method
  // */
  // setDeactivationTresholdActive : function(){
  //   this.deactivationTresholdActive = true;
  // },
  //
  // /**
  // * Set the element as inactive
  // * @since 0.4.0
  // * @method
  // */
  // setDeactivationTresholdInactive : function(){
  //   this.deactivationTresholdActive = false;
  // },
  //
  // /**
  // * Return true if the element is active. false otherwise
  // * @since 0.4.0
  // * @method
  // */
  // isDeactivationTresholdActive : function(){
  //   return this.deactivationTresholdActive;
  // },

  // /**
  // * Return true if the element is active. false otherwise
  // * @since 0.4.0
  // * @method
  // */
  // setDeactivationTreshold : function(treshold){
  //   this.deactivationTreshold = treshold;
  // },

  // /**
  // * Return true if the element is active. false otherwise
  // * @since 0.4.0
  // * @method
  // */
  // getDeactivationTreshold : function(){
  //   return this.deactivationTreshold;
  // },

  public updatePosition( second: number ): Vector2 {
    this.translate.origin();
    if (this.active && second > 0) {
      if (this.inverseMass) {
        this.applyImpulse();
        this.applyForces( second );
      }
      this.applyVelocity( second );
    }
    //if(moved)//if moved
    //  this.newCells();//need to find new cells

		/*if(LEVEL.scaledVel.c0()){
			this.position.add(LEVEL.scaledVel);
			for(var i=0;i<4;i++)this.fram[i].add(LEVEL.scaledVel);
			p=1;
		}*/
    return this.position;
    //this.translate;
	}

  public applyForces( second: number ): void {
    this.resultingAcc.copy( this.gravity );// initialize resulting acceleration for this frame
    if(!this.force.isOrigin()) {
      this.resultingAcc.addScaledVector( this.force, this.inverseMass );
      this.force.origin();
    }
    if(!this.resultingAcc.isOrigin()){
      this.velocity.addScaledVector( this.resultingAcc, second );
    }
  }

  private applyImpulse() : void {
    //apply impulse from collision directly to velocity
    if(!this.impulse.isOrigin()) {
      this.velocity.addScaledVector( this.impulse, this.inverseMass );//add impulse vector to velocity
      this.impulse.origin();
    }
  }

  private applyVelocity( second: number ): void {
    if(!this.velocity.isOrigin()) {
      if(this.damping < 1) {
        this.velocity.scale( Math.pow( this.damping, second ) );
      }
      //this.velocity.scaleBy(this.damping);// use if damping just solves numerical problems and other drag forces are applied
      this.translate.copy(this.velocity).scale(second);
      this.position.add(this.translate);
      //moved = true;
    }
  }

  public correctPosition(correction: Vector2): void {
    if (this.inverseMass) {
      this.position.addScaledVector(correction, this.inverseMass);
      this.body.setPositionFromVector(this.position);
    }
  }

  public setPosition(x: number, y: number ): void {
    this.body.setPositionXY( x, y );
  }

  public setPositionFromVector( position: Vector2 ): void {
    this.body.setPositionFromVector( position );
  }

  public setGravity(x: number, y: number) {
    this.gravity.set(x,y);
  }


  // /**
  // * Get the resulting acceleration vector.
  // * @since 0.4.0
  // * @method
  // * @returns {vector}  The resulting acceleration vector
  // */
  // getResultingAcceleration : function(){
  //   return this.resultingAcc;
  // },


  // /**
  // * Get the restitution.
  // * @since 0.4.0
  // * @method
  // * @returns {float}  The restitution
  // */
  // getRestitution : function(){
  //   return this.restitution;
  // },


  public setDamageDealt( damageDealt: number ): void {
    this.damageDealt = damageDealt;
  }

  public applyDamage(): number|false {
    if(this.active && this.damageTaken) {
      let dmg = this.damageTaken;
      this.damageTaken = 0;
      return dmg;
    }
    return false;
  }

  public collision (impulsePerInverseMass: Vector2, object: Physics): void {
    //if (this.active) {
    if(this.inverseMass) {
      this.impulse.copy(impulsePerInverseMass);
    }
    if(!this.damageTaken) {
      this.damageTaken = object.damageDealt;
    }
  }

  private reset(): void {
    this.velocity.copy(this.initialVelocity);
    //this.size          = size;
    //this.halfSize      = Vector2.create();
    this.translate.origin();
    //this.gravity;
    this.force.origin();
    this.impulse.origin();
    this.resultingAcc.origin();
  }

  public draw(context: CanvasRenderingContext2D, fillColor: string, strokeColor: string, strokeWidth: number): void {
    this.body.draw( context, fillColor, strokeColor, strokeWidth );
  }

  // newCells : function(){
  //   for(var i=0;i<4;i++)// can be in for cells maximum
  //     this.cells[i]=Math.floor((this.fram[i].X-SCREEN.margin[3])/SCREEN.cellSize.X) +Math.floor((this.fram[i].Y-SCREEN.margin[0])/SCREEN.cellSize.Y)*SCREEN.nbCell.X;
  // },

  // setHalfSize : function(){
  //   this.halfSize.copyScaledVectorTo( this.size, 0.5 );
  // },

  // setFrame : function(){
  //   var pxmh = this.position.getX() - this.halfSize.getX();
  //   var pxph = this.position.getX() + this.halfSize.getX();
  //   var pymh = this.position.getY() - this.halfSize.getY();
  //   var pyph = this.position.getY() + this.halfSize.getY();
  //   this.frame[0].setXY( pxmh, pymh );
  //   this.frame[1].setXY( pxph, pymh );
  //   this.frame[2].setXY( pxph, pyph );
  //   this.frame[3].setXY( pxmh, pyph );
  // }

};
