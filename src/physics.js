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

  body        : {},

  //size        : TYPE6.Vector2D.create(),
  //halfSize    : TYPE6.Vector2D.create(),
  // cells       : [ 0, 0, 0, 0 ],
  // frame       : [ TYPE6.Vector2D.create(),
  //                 TYPE6.Vector2D.create(),
  //                 TYPE6.Vector2D.create(),
  //                 TYPE6.Vector2D.create()
  //               ],
                
  collisionSceneId : 0,
  active : true,
  damageTaken : 0,
  damageDealt : 1,
  
  // deactivationTresholdActive : false, 
  // deactivationTreshold       : TYPE6.Vector2D.create(),
  
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
                     elasticity,
                     type, positionX, positionY, sizeX, sizeY ){
    var _this = Object.create( this );
    _this.initVectors( velocity );
    _this.mass         = mass;
    _this.inverseMass  = !mass ? 0 : 1/mass ;
    _this.damping      = damping;
    _this.elasticity   = -elasticity;
    _this.createBody(type, positionX, positionY, sizeX, sizeY); 
    //_this.setFrame();
    return _this;
  },

  createBody : function(type, positionX, positionY, sizeX, sizeY) {
    switch (type) {
      case 'circle':
        this.body = TYPE6.Geometry.Circle.create( positionX, positionY, sizeX );
        break;
      case 'rectangle':
        this.body = TYPE6.Geometry.Rectangle.create( positionX, positionY, sizeX, sizeY );
        break;
      default:
        return false;
    }
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
  * Set the element as active
  * @since 0.4.0
  * @method
  */
  setActive : function(){
    this.active = true;
  },
  
  /**
  * Set the element as inactive
  * @since 0.4.0
  * @method
  */
  setInactive : function(){
    this.active = false;
  },
  
  /**
  * Toggle the element between active and inactive.
  * @since 0.4.0
  * @method
  * @returns {vector} The active boolean
  */
  toggleActive : function(){
    this.active = !this.active;
    return this.active;
  },
  
  /**
  * Return true if the element is active. false otherwise
  * @since 0.4.0
  * @method
  */
  isActive : function(){
    return this.active;
  },
  
  
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

  /**
  * Update the position.
  * @since 0.2.0
  * @method
  * @param {float} second The elapsed time between 2 frames in seconds 
  * @returns {vector}  The position vector
  */
  updatePosition : function( second ){
    this.translate.setToOrigin();
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
    return this.getPosition();
    //this.translate;
	},
  
  /**
  * set the position.
  * @since 0.4.0
  * @method
  * @param {float} [x = 0.0] x The new value of the x axis.
  * @param {float} [y = 0.0] y The new value of the y axis.
  */
  setPosition : function( x, y ){
    this.body.setPositionXY( x, y );
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
  * Get the position vector.
  * @since 0.4.0
  * @method
  * @returns {vector}  The position vector
  */
  getPosition : function(){
    return this.body.position;
  },
  
  /**
  * Get the x component of the position vector.
  * @since 0.4.0
  * @method
  * @returns {float}  The x component of the position vector
  */
  getPositionX : function(){
    return this.body.getPositionX();
  },
  
  /**
  * Get the y component of the position vector.
  * @since 0.4.0
  * @method
  * @returns {float}  The y component of the position vector
  */
  getPositionY : function(){
    return this.body.getPositionY();
  },
  
  /**
  * Get the translation vector.
  * @since 0.4.0
  * @method 
  * @returns {vector}  The translation vector
  */
  getTranslate : function(){
    return this.translate;
  },
  
  /**
  * Get the velocity vector.
  * @since 0.4.0
  * @method 
  * @returns {vector}  The velocity vector
  */
  getVelocity : function(){
    return this.velocity;
  },
  
  /**
  * Get the force vector
  * @since 0.4.0
  * @method
  * @returns {vector}  The force vector
  */
  getForce : function(){
    return this.force;
  },
  
  /**
  * Get the resulting acceleration vector.
  * @since 0.4.0
  * @method
  * @returns {vector}  The resulting acceleration vector
  */
  getResultingAcceleration : function(){
    return this.resultingAcc;
  },
  
  /**
  * get the gravity vector.
  * @since 0.4.0
  * @method
  * @returns {vector}  The gravity vector
  */
  getGravity : function(){
    return this.gravity;
  },
  
  /**
  * Get the impulse vector.
  * @since 0.4.0
  * @method
  * @returns {vector}  The impulse vector
  */
  getImpulse : function(){
    return this.impulse;
  },
  
  /**
  * Get the restitution.
  * @since 0.4.0
  * @method 
  * @returns {float}  The elasticity
  */
  getRestitution : function(){
    return this.elasticity;
  },
  
  /**
  * Get the damping.
  * @since 0.4.0
  * @method
  * @returns {float}  The damping
  */
  getDamping : function(){
    return this.damping;
  },

  /**
  * Get mass.
  * @since 0.4.0
  * @method
  * @returns {float}  The mass
  */
  getMass : function(){
    return this.mass;
  },

  /**
  * Get the inverse mass.
  * @since 0.4.0
  * @method
  * @returns {float}  The inverse mass
  */
  getInverseMass : function(){
    return this.inverseMass;
  },
  
  setDamageDealt : function( damageDealt ){
    this.damageDealt = damageDealt; 
  },
  
  applyForces : function( second ){
    this.resultingAcc.copyTo( this.gravity );// initialize resulting acceleration for this frame
    if( this.force.isNotOrigin() ){
      this.resultingAcc.addScaledVectorTo( this.force, this.inverseMass );
      this.force.setToOrigin();
    }
    if( this.resultingAcc.isNotOrigin() )
      this.velocity.addScaledVectorTo( this.resultingAcc, second );
  },
  
  applyImpulse : function(){
    //apply impulse from collision directly to velocity
    if( this.impulse.isNotOrigin() ){
      this.velocity.addScaledVectorTo( this.impulse, this.inverseMass );//add impulse vector to velocity
      this.impulse.setToOrigin();
    }
  },
  
  applyVelocity : function( second ){
    if(this.velocity.isNotOrigin()){
      this.velocity.scaleBy( Math.pow( this.damping, second ) );
      //this.velocity.scaleBy(this.damping);// use if damping just solves numerical problems and other drag forces are applied
      this.translate.copyScaledVectorTo( this.velocity, second );
      this.body.position.addTo(this.translate);
      //moved = true;
    }
  },
  
  applyDamage : function(){
    if( this.active && this.damageTaken ){
      var dmg = this.damageTaken;
      this.damageTaken = 0;
      return dmg;
    }
    return false;
  },
  
  collision: function( impulsePerInverseMass, object ){
    //if (this.active) {
    if( this.inverseMass )
      this.impulse.copyTo( impulsePerInverseMass );
    if( !this.damageTaken )
      this.damageTaken = object.damageDealt;
    //}
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
  },
  
  /**
  * draw the collision mask.
  * @since 0.2.0
  * @method
  * @param {float} second The elapsed time between 2 frames in seconds 
  * @returns {vector}  The translation vector
  */
  drawBody : function(context, fillColor, strokeColor, strokeWidth){
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
