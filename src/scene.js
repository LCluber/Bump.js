/**
* @class
* @classdesc A class that represents a physics scene containing bodies to check.
*/
BUMP.Scene = {

  bodies : [],
  bodiesLength : 0,
  
  collision : BUMP.Collision.create(),
  gravity : TYPE6.Vector2D.create( 0, 400 ),
  iteration : 1,
  /**
  * Create a new collision scene.
  * @since 0.2.0
  * @method
  * @returns {Scene}  The new collision Scene
  */
  create : function() {
    var _this = Object.create( this );
    _this.collision = BUMP.Collision.create();
    _this.bodies    = [];
    _this.gravity   = TYPE6.Vector2D.create( 0, 400 );
    return _this;
  },
  
  /**
  * Add a body to the collision scene in order to test it during the collision tests phase.
  * @since 0.2.0
  * @method
  * @param {object} body an object containing a Bump.js physics and a Type6.js geometry.
  * @returns {boolean}  The new finite state machine
  */
  addBody : function( body ){

    if( /*body.hasOwnProperty(body) && body.hasOwnProperty(physics) &&*/ !body.physics.collisionSceneId ){
      this.bodiesLength ++;
      body.physics.collisionSceneId = this.bodiesLength ;
      this.bodies.push(body);
      return true;
    }
    else
      return false;
    
  },
  
  removeBody : function(){
    
  },
  
  /**
  * test collisions between object in the scene.
  * @since 0.2.0
  * @method
  */
  test : function(){
    for( var k = 0 ; k < this.iteration ; k++ ){
      for( var i = 0 ; i < this.bodiesLength ; i++ ){
        var p1 = this.bodies[i];
        if (p1.physics.isActive()) {
          for( var j = i + 1 ; j < this.bodiesLength ; j++ ){
            var p2 = this.bodies[j];
            if (p2.physics.isActive()) {
              this.collision.test( p1.physics, p2.physics );
            } 
          }
        }
      }
    }
  },
  
  /**
  * test collisions between object in another scene.
  * @since 0.2.4
  * @method
  * @param {object} scene Another collision scene
  */
  testScene : function(scene){
    for( var k = 0 ; k < this.iteration ; k++ ){
      for( var i = 0 ; i < this.bodiesLength ; i++ ){
        var p1 = this.bodies[i];
        if (p1.physics.isActive()) {
          for( var j = 0 ; j < scene.bodiesLength ; j++ ){
            var p2 = scene.bodies[j];
            if (p2.physics.isActive()) {
              this.collision.test( p1.physics, p2.physics ); 
            }
          }
        }
      }
    }
  },
  
  setIteration : function( iteration ){
    this.iteration = iteration;
  },
  
  getIteration : function(){
    return this.iteration;
  },
  
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
  
  setGravity : function(){
    
  },
  
  getGravity : function(){
    return this.gravity;
  }
  
  
};
