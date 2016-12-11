
BUMP.Scene = {

  bodies : [],
  bodiesLength : 0,
  
  collision : BUMP.Collision.create(),
  gravity : TYPE6JS.Vector2D.create( 0, 400 ),
  
  create : function() {
    var _this = Object.create( this );
    //_this.config = config;

    return _this;
  },
  
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
  
  test : function(){
  
    for( var i = 0 ; i < this.bodiesLength ; i++ ){
      for( var j = i + 1 ; j < this.bodiesLength ; j++ ){
        //if( i != j ){
          var p1 = this.bodies[i];
          var p2 = this.bodies[j];
          this.collision.test( p1.body, p1.physics, p2.body, p2.physics );
        //}  
      }
    }
    
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
  },
  
  
};
