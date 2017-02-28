
BUMP.Collision = {

  delta                  : TYPE6.Vector2D.create(),
  delta2                 : TYPE6.Vector2D.create(),
  penetration            : TYPE6.Vector2D.create(),
  contactNormal          : TYPE6.Vector2D.create(),
  correction             : TYPE6.Vector2D.create(),
  vertex                 : TYPE6.Vector2D.create(),
  relativeVelocity       : TYPE6.Vector2D.create(),
  voronoi                : TYPE6.Vector2D.create(),

  deltaVelocity          : 0,
  totalInverseMass       : 0,
  impulse                : 0,
  impulsePerInverseMass  : TYPE6.Vector2D.create(),

  create : function() {
    var _this = Object.create( this );

    return _this;
  },

  test : function( bodyA, physicsA, bodyB, physicsB ) {
    //if( a.onScreen() ){
      //if( this.cellTest( physicsA.cells, physicsB.cells ) ){
        this.setDelta( bodyA.getPosition(), bodyB.getPosition() );
        
        if( this.getPenetration( bodyA, bodyB )){
          if ( this.separate( bodyA.getPosition(), physicsA.inverseMass, bodyB.getPosition(), physicsB.inverseMass ) )
            this.computeImpulseVectors( physicsA, physicsB );
        }
      //}
    //}
  },
  
  setDelta: function( positionA, positionB ){
    this.delta.copySubtractFromTo( positionA, positionB );//delta between a and b centers on each axis
  },
  
  circleVScircle : function( radius ){
    if( this.circleVScircleHit( radius ))// vs circle
      return this.circleVScircleProjection( radius );
    return false;
  },
  
  aabbVSaabb : function( halfSizeA, halfSizeB ){
    if( this.aabbVSaabbHit( halfSizeA, halfSizeB ))
      return this.aabbVSaabbProjection();
    return false;
  },
  
  circleVSaabb : function( positionA, halfSizeA, radiusA,
                           positionB, halfSizeB ){
    if ( this.aabbVSaabbHit( halfSizeA, halfSizeB ) )
      return this.circleVSaabbProjection( positionA, radiusA,
                                          positionB, halfSizeB );//vs aabb
    return false;
  },
  
  getPenetration : function( bodyA, bodyB ){
    
    if( bodyA.shape === 'circle' ){//circle
      
      if( bodyB.shape === 'circle' )
        return this.circleVScircle( bodyA.getRadius() + bodyB.getRadius() );
      else if( bodyB.shape === 'aabb' )
        return this.circleVSaabb( bodyA.getPosition(), bodyA.getHalfSize(), bodyA.getRadius(),
                                  bodyB.getPosition(), bodyB.getHalfSize() );
      
    }else if( bodyA.shape === 'aabb' ){//aabb
      
      if( bodyB.shape === 'circle' )
        return this.circleVSaabb( bodyB.getPosition(), bodyB.getHalfSize(), bodyB.getRadius(),
                                  bodyA.getPosition(), bodyA.getHalfSize() );
      else if( bodyB.shape === 'aabb' )
        return this.aabbVSaabb( bodyA.getHalfSize(), bodyB.getHalfSize() );
            
    }
    return false;
  },
  
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
  
  aabbVSaabbHit : function( ahs, bhs ){//separating axis theorem
    
    this.penetration.copyTo( this.delta );
    this.penetration.absoluteTo();
    this.penetration.oppositeTo();
    this.penetration.addTo( ahs );
    this.penetration.addTo( bhs );//penetration depth on each axis
    
    if( this.penetration.isPositive() )
      return true;
      
    return false;
    
  },
  
  aabbVSaabbProjection : function(){

    if( this.penetration.getX() < this.penetration.getY() ) //project on x axis
      this.projectOnX();
    else //project on y axis
      this.projectOnY();

  },

  circleVScircleHit : function( radius ){
    
    var squaredLen = this.delta.getSquaredMagnitude();
    var squaredRad = radius * radius;
    if( squaredRad - squaredLen > 0 )
      return true; //collision detected

    return false;
  },

  circleVScircleProjection : function( radius ){
    var len = this.delta.getMagnitude(),
    pen = radius - len;
    //distance vector is normalized and scaled by penetration depth
    this.penetration.copyScaledVectorTo( this.delta, pen/len );
    return true;
  },

  setVoronoiRegion: function(bhs){//determine grid/voronoi region of circle center
    
    this.voronoi.setToOrigin();
   
    var dx   = this.delta.getX();
    var dy   = this.delta.getY();
    var bhsX = bhs.getX();
    var bhsY = bhs.getY();
   
    // x axis
    if( dx < -bhsX )
      this.voronoi.setX( -1 ) ;//circle is on left side of tile
    else if( dx > bhsX )
      this.voronoi.setX( 1 );//circle is on right side of tile
    
    // y axis
    if( dy < -bhsY )
      this.voronoi.setY( -1 );//circle is on bottom side of tile
    else if( dy > bhsY )
      this.voronoi.setY( 1 );//circle is on top side of tile
  
  },

  circleVSaabbProjection: function( apos, radiusA,
                                    bpos, bhs ){
    
    this.setVoronoiRegion( bhs );
      
    if( this.voronoi.getX() === 0 ){
      
      if( this.voronoi.getY() === 0 ){//circle is in the aabb
        if( this.penetration.getX() < this.penetration.getY() ) //penetration in x is smaller; project on x
          this.projectOnX();
        else //penetration in y is smaller; project on y
          this.projectOnY();
        return true;
      }else //project on y axis
        return this.projectOnY();

    }else if( this.voronoi.getY() === 0 ) //project on x axis
      return this.projectOnX();
    
    else{//possible diagonal collision
      
      this.vertex.copyTo( this.voronoi );
      this.vertex.multiplyBy( bhs ); //component product in 3D
      this.vertex.addTo( bpos );//get diag vertex position
      //calc vert->circle vector
      this.delta2.copySubtractFromTo( apos, this.vertex );
      var len = this.delta2.getSquaredMagnitude();
      var pen = radiusA * radiusA - len;
      if( pen > 0 ){ //vertex is in the circle; project outward
        len = this.delta2.getMagnitude();
        pen = radiusA - len;
        if( len === 0 )
          this.penetration.copyScaledVectorTo( this.voronoi, pen / 1.41 );//project out by 45deg (1/square root of 2)
        else
          this.penetration.copyScaledVectorTo( this.delta2, pen / len );
        return true; //collision detected
      }
    }
    return false;
  },
  
  projectOnX : function(){
    this.penetration.setYToOrigin();
    if( this.delta.getX() < 0 ){
      this.penetration.oppositeXTo(); //project left
      return true; //collision
    }
    return false;
  },
  
  projectOnY : function(){
    this.penetration.setXToOrigin();
    if( this.delta.getY() < 0 ){
      this.penetration.oppositeYTo(); //project up
      return true; //collision
    }
    return false;
  },

  separate : function( positionA, imA , positionB, imB ){
    this.totalInverseMass = imA + imB;
    this.computeContactNormal();
    var k_slop = 0.01; // Penetration allowance
    var percent = 0.8; // Penetration percentage to correct
    // console.log( this.penetration.toString() );
    this.correction.setXY(
      ( Math.max( Math.abs( this.penetration.getX() ) - k_slop, 0 ) / this.totalInverseMass ) * percent * this.contactNormal.getX(), 
      ( Math.max( Math.abs( this.penetration.getY() ) - k_slop, 0 ) / this.totalInverseMass ) * percent * this.contactNormal.getY()
    );
 
    if(this.correction.isNotOrigin()){
      if( imA )
        positionA.addScaledVectorTo( this.correction, imA /*/ this.totalInverseMass*/ );
      if( imB )
        positionB.subtractScaledVectorFrom( this.correction, imB /*/ this.totalInverseMass*/ );
      return true;
    }
    return false;
    
  },
  
  computeImpulseVectors : function( a, b ){
    var separatingVelocity = this.computeSeparatingVelocity( a.velocity, b.velocity );
    if( separatingVelocity < 0 ){//apply collision response forces only if objects are travelling in each other
      //vel+=1/m*impulse
      //calculate separating velocity with restitution (between 0 and 1)
      //Calculate the new separating velocity
      var restitution = Math.max( a.elasticity, b.elasticity );
      separatingVelocity = separatingVelocity * restitution - separatingVelocity;
      //this.deltaVelocity = separatingVelocity * restitution - separatingVelocity;
      // Calculate the impulse to apply.
      this.impulse = separatingVelocity / this.totalInverseMass;
      // Find the amount of impulse per unit of inverse mass.
      //Vector3 impulsePerIMass = contactNormal * impulse;
      this.impulsePerInverseMass.copyScaledVectorTo( this.contactNormal, this.impulse );
      // Apply impulses: they are applied in the direction of the contact,
      // and are proportional to the inverse mass.
      a.collision( this.impulsePerInverseMass, b );
      //a.impulse.copyTo( this.impulsePerInverseMass );
      //a.velocity.addScaledVectorTo( this.impulsePerInverseMass, a.inverseMass );
      this.impulsePerInverseMass.oppositeTo();
      b.collision( this.impulsePerInverseMass, a );
      //b.impulse.copyTo( this.impulsePerInverseMass );
      //b.velocity.addScaledVectorTo( this.impulsePerInverseMass, b.inverseMass );
    }
  },
  
  computeSeparatingVelocity:function( av, bv ){
    this.relativeVelocity.copySubtractFromTo( av, bv );//relative velocity between two objects
    return this.relativeVelocity.dotProduct( this.contactNormal );//component of velocity parallel to contact normal //the dot product of the relative velocity and the normal
  },
  
  computeContactNormal:function(){
    this.contactNormal.copyTo(this.penetration);
    this.contactNormal.normalizeTo();//is now surfaceNormal //unit length vector perpendicular to the surface between the two objects || contactnormal
  }

};
