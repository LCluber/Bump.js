/**
* @class
* @classdesc A class that represents a rigid body.
*/
BUMP.Physics = {

  translate       : TYPE6.Vector2D.create(),
  velocity        : TYPE6.Vector2D.create(),
  initialVelocity : TYPE6.Vector2D.create(),
  gravity         : TYPE6.Vector2D.create(),
  force           : TYPE6.Vector2D.create(),
  impulse         : TYPE6.Vector2D.create(),
  resultingAcc    : TYPE6.Vector2D.create(),

  damping     : 0.8,
  mass        : 1.0,
  inverseMass : 1.0,
  elasticity  : -1,//-e

  //size        : TYPE6.Vector2D.create(),
  //halfSize    : TYPE6.Vector2D.create(),
  // cells       : [ 0, 0, 0, 0 ],
  // frame       : [ TYPE6.Vector2D.create(),
  //                 TYPE6.Vector2D.create(),
  //                 TYPE6.Vector2D.create(),
  //                 TYPE6.Vector2D.create()
  //               ],
                
  collisionSceneId : 0,
    
  damageTaken : 0,
  damageDealt : 1,  
  // materials              
  // Rock       Density : 0.6  Restitution : 0.1
  // Wood       Density : 0.3  Restitution : 0.2
  // Metal      Density : 1.2  Restitution : 0.05
  // BouncyBall Density : 0.3  Restitution : 0.8
  // SuperBall  Density : 0.3  Restitution : 0.95
  // Pillow     Density : 0.1  Restitution : 0.2
  // Static     Density : 0.0  Restitution : 0.4
//margin=[-halfSize.y,ROOSTR.Screen.size.x+halfSize.x,ROOSTR.Screen.size.y+halfSize.y,-halfSize.x];

  //impulsePerInverseMass : TYPE6.Vector2D.create(),

  //collision : BUMP.Collision.create(),

  /**
  * Create a new physics class.
  * @since 0.2.0
  * @method
  * @param {vector} velocity an initial velocity vector
  * @param {float} mass the mass of the body
  * @param {float} damping the drag force of the object between 0 and 1
  * @param {float} elasticity the elasticity of the object between 0 and 1
  * @returns {Physics}  The new physics class
  */
  create : function( velocity,
                     mass,
                     damping,
                     elasticity ){
    var _this = Object.create( this );
    _this.initVectors( velocity );
    _this.mass         = mass;
    _this.inverseMass  = !mass ? 0 : 1/mass ;
    _this.damping      = damping;
    _this.elasticity   = elasticity;
    //_this.setHalfSize(); 
    //_this.setFrame();
    return _this;
  },

  initVectors : function( velocity ){
    this.velocity        = velocity;
    this.initialVelocity = this.velocity.copy();
    
    //this.size          = size;
    //this.halfSize      = TYPE6.Vector2D.create();
    this.translate       = TYPE6.Vector2D.create();
    this.gravity         = TYPE6.Vector2D.create();
    this.force           = TYPE6.Vector2D.create();
    this.impulse         = TYPE6.Vector2D.create();
    this.resultingAcc    = TYPE6.Vector2D.create();
  },
  
  /**
  * set the gravity.
  * @since 0.2.1
  * @method
  * @param {float} [x = 0.0] x The new value of the x axis.
  * @param {float} [y = 0.0] y The new value of the y axis.
  */
  setGravity : function( x, y ){
    this.gravity.setXY( x, y );
  },

  /**
  * Update the position.
  * @since 0.2.0
  * @method
  * @param {float} second The elapsed time between 2 frames in seconds 
  * @returns {vector}  The translation vector
  */
  setPosition : function( second ){

    this.translate.setToOrigin();
    
    if( second > 0 ){  
      this.resultingAcc.copyTo( this.gravity );
      //apply impulse from collision directly to velocity
      if( this.inverseMass && this.impulse.isNotOrigin() ){
        //add impulse per inverse mass
        this.velocity.addScaledVectorTo( this.impulse, this.inverseMass );
        this.impulse.setToOrigin();
      }

      if( this.inverseMass && this.force.isNotOrigin() ){
        this.resultingAcc.addScaledVectorTo( this.force, this.inverseMass );
        this.force.setToOrigin();
      }
      
      if(this.resultingAcc.isNotOrigin())
        this.velocity.addScaledVectorTo( this.resultingAcc, second );

      if(this.velocity.isNotOrigin()){
        this.velocity.scaleBy( Math.pow( this.damping, second ) );
        //this.velocity.scaleBy(this.damping);// use if damping just solves numerical problems and other drag forces are applied
        this.translate.copyScaledVectorTo( this.velocity, second );
        //moved = true;
      }
    }

    //if(moved)//if moved
    //  this.newCells();//need to find new cells

		/*if(LEVEL.scaledVel.c0()){
			this.position.add(LEVEL.scaledVel);
			for(var i=0;i<4;i++)this.fram[i].add(LEVEL.scaledVel);
			p=1;
		}*/
    return this.translate;
	},
  
  setDamageDealt : function( damageDealt ){
    this.damageDealt = damageDealt; 
  },
  
  applyImpulse : function( impulsePerInverseMass ){
    this.velocity.addScaledVectorTo( impulsePerInverseMass, this.inverseMass );//add impulse vector to velocity
  },
  
  applyDamage : function(){
    if( this.damageTaken ){
      var dmg = this.damageTaken;
      this.damageTaken = 0;
      return dmg;
    }
    return false;
  },
  
  collision: function( impulsePerInverseMass, object ){
    this.impulse.copyTo( impulsePerInverseMass );
    if( !this.damageTaken )
      this.damageTaken = object.damageDealt;
  },
  
  reset : function(){
    this.velocity.copyTo(this.initialVelocity);
    //this.size          = size;
    //this.halfSize      = TYPE6.Vector2D.create();
    this.translate.setToOrigin();
    //this.gravity;
    this.force.setToOrigin();
    this.impulse.setToOrigin();
    this.resultingAcc.setToOrigin();
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
