
PHYSICS.Collision = {

  delta : TYPE6JS.Vector2D.create(),
	penetration : TYPE6JS.Vector2D.create(),
	vertex : TYPE6JS.Vector2D.create(),
	relativeVelocity : TYPE6JS.Vector2D.create(),
	separatingVelocity : 0,
	newSeparatingVelocity : 0,

	deltaVelocity : 0,
	totalInverseMass : 0,
	impulse : 0,
	impulsePerInverseMass : TYPE6JS.Vector2D.create(),

	hit : 0,

  create : function( config ){
    var _this = Object.create(this);
    _this.config = config;

    return _this;
  },

  aabbVSaabb:function(){
		this.hit=1;
		if(this.penetration.x<this.penetration.y){ //project on x axis
			this.penetration.y=0;
			if(this.delta.x<0)
        this.penetration.x=-this.penetration.x; //project left
		}else{ //project on y axis
			this.penetration.x=0;
			if(this.delta.y<0)
        this.penetration.y=-this.penetration.y; //project up
		}
	},

	circleVScircle:function(r){
		var len=this.delta.magnitude(),
		pen=r-len;
		if(pen>0){//penetration detected
			this.hit=1;
			this.penetration.copyTo(this.delta);
			//distance vector is normalized and scaled by penetration depth
			this.penetration.scaleBy(pen/len);
		}
	},

	circleVSaabb:function(apos,ahs,bpos,bhs){
		//determine grid/voronoi region of circle center
		var oH=0,oV=0,dx=this.delta.getX(),dy=this.delta.getY();
		if(dx<-bhs.getX())
      oH=-1;//circle is on left side of tile
		else if(bhs.getX()<dx)
      oH=1;//circle is on right side of tile
		if(dy<-bhs.getY())
      oV=-1;//circle is on bottom side of tile
		else if(bhs.getY()<dy)
      oV=1;//circle is on top side of tile

		if(oH===0){
			this.hit=1;
			if(oV===0){//circle is in the aabb
				if(this.penetration.x<this.penetration.y){ //penetration in x is smaller; project on x
					this.penetration.y=0;
					if(dx<0)
            this.penetration.x=-this.penetration.x; //project left
				}else{ //penetration in y is smaller; project on y
					this.penetration.x=0;
					if(dy<0)
            this.penetration.y=-this.penetration.y; //project up
				}

			}else{ //project on y axis
				this.penetration.x=0;
				if(dy<0)
          this.penetration.y=-this.penetration.y; //project up
			}

		}else if(oV===0){ //project on x axis
			this.hit=1;
			this.penetration.y=0;
			if(dx<0)
        this.penetration.x=-this.penetration.x; //project left
		}else{//possible diagonal collision
			//this.voronoi.init(oH,oV);
			this.vertex.init(oH,oV);
			this.vertex.componentProduct(bhs);
			this.vertex.add(bpos);//get diag vertex position
			//calc vert->circle vector
			this.delta.initV(apos);
			this.delta.subtract(this.vertex);
			var len=this.delta.magnitude(),
			pen=ahs.x-len;
			if(pen>0){//vertex is in the circle; project outward
				this.hit=1;
				if(len===0){
					//project out by 45deg (1/square root of 2)
					this.penetration.init(oH,oV);
					this.penetration.scale(pen/1.41,0);
				}else{
					this.penetration.initV(this.delta);
					this.penetration.scale(pen/len,0);
				}
			}
		}
	}

};


// ROOSTR.Collision = function(){
// 	this.delta=new ROOSTR.Vector3();
// 	this.penetration=new ROOSTR.Vector3();
// 	this.vertex=new ROOSTR.Vector3();
// 	this.relativeVelocity=new ROOSTR.Vector3();
// 	this.separatingVelocity=0;
// 	this.newSeparatingVelocity=0;
//
// 	this.deltaVelocity=0;
// 	this.totalInverseMass=0;
// 	this.impulse=0;
// 	this.impulsePerInverseMass=new ROOSTR.Vector3();
//
// 	this.hit=0;
// }
// ROOSTR.Collision.prototype={
// 	cellTest:function(a,b){
// 		/*for(var i=0,k=-1;i<4;i++){
// 			if(k!=a[i]){
// 				for(var j=0;j<4;j++)
// 					if(a[i]==b[j])return 1;
// 				k=a[i];
// 			}
// 		}*/
// 		return 1;
// 	},
// 	test:function(a,b){
// 		if(a.life&&b.life&&!b.god.get()){
// 			//if(a.onScreen()){
// 				if(this.cellTest(a.cells,b.cells)){
// 					if(this.preTest(a.position,a.halfSize,b.position,b.halfSize)){
// 						this.hit=0;
// 						if(a.shape==1){//aabb
// 							if(b.shape==1)this.aabbVSaabb();//vs aabb
// 							//else //vs triangle
// 						}else if(a.shape==2){//circle
// 							if(b.shape==2)
// 								this.circleVScircle(a.halfSize.x+b.halfSize.x);// vs circle
// 							else if(b.shape==1)
// 								this.circleVSaabb(a.position,a.halfSize,b.position,b.halfSize);//vs aabb
// 							//else //vs triangle
// 						}
// 						if(this.hit){
// 							//console.log('in');
// 							if(a.grab)
// 								a.collision();
// 							else{
// 								a.position.add(this.penetration);
// 								//for(var i=0;i<4;i++)
// 									//a.fram[i].add(this.penetration);
// 								a.collision(b.damage);
// 								b.collision(a.damage);
// 								if(a.life && b.life){
// 									//calculate impulse vector
// 									this.separatingVel(a.velocity,b.velocity);
// 									if(this.separatingVelocity<0){//apply collision response forces only if the object is travelling into
// 										//vel+=1/m*impulse
// 										//calculate separating velocity with restitution (between 0 and 1)
// 										//Calculate the new separating velocity
// 										this.newSeparatingVelocity=this.separatingVelocity*a.elasticity;
// 										//real deltaVelocity = newSepVelocity - separatingVelocity
// 										this.deltaVelocity=this.newSeparatingVelocity-this.separatingVelocity;
// 										this.totalInverseMass=a.inverseMass+b.inverseMass;
// 										// Calculate the impulse to apply.
// 										this.impulse=this.deltaVelocity/this.totalInverseMass;
// 										// Find the amount of impulse per unit of inverse mass.
// 										//Vector3 impulsePerIMass = contactNormal * impulse;
// 										this.impulsePerInverseMass.copy(this.penetration);
// 										this.impulsePerInverseMass.scale(this.impulse);
// 										// Apply impulses: they are applied in the direction of the contact,
// 										// and are proportional to the inverse mass.
// 										a.applyImpulse(this.impulsePerInverseMass);
// 										this.impulsePerInverseMass.scale(-1);
// 										b.applyImpulse(this.impulsePerInverseMass);
// 									}
// 								}
// 							}
// 						}
// 					}
// 				}
// 			//}
// 		}
// 	},
// 	preTest:function(apos,ahs,bpos,bhs){
// 		/*
// 		var dx=this.position.X-foe.position.X,//delta between a and b centers on x axis
// 		px=(this.halfSize.X+foe.halfSize.X)-Math.abs(dx);//penetration depth on x axis
// 		if(px>0){ //possible penetration on x axis
// 		var dy=this.position.Y-foe.position.Y,//delta between a and b centers on y axis
// 		py=(this.halfSize.Y+foe.halfSize.Y)-Math.abs(dy);//penetration depth on y axis
// 		if(py>0){ //objects may be colliding
// 		*/
// 		//this.delta.copy(apos);
// 		this.delta = apos.subtractRV(bpos);//delta between a and b centers on each axis
// 		this.penetration.copy(this.delta);
// 		this.penetration.absolute();
// 		this.penetration.scale(-1);
// 		this.penetration.add(ahs);
// 		this.penetration.add(bhs);//penetration depth on each axis
// 		if(this.penetration.x>0&&this.penetration.y>0&&this.penetration.z>0)
// 			return 1; //objects may be colliding
// 	},
// 	separatingVel:function(av,bv){
// 		this.penetration.normalize();//is now surfaceNormal //unit length vector perpendicular to the surface between the two objects || contactnormal
// 		//this.relativeVelocity.copy(av);
// 		this.relativeVelocity = av.subtractRV(bv);//relative velocity between one another
// 		this.separatingVelocity=this.relativeVelocity.dot(this.penetration);//component of velocity parallel to collision normal //the dot product of the relative velocity and the normal
// 	},
// 	aabbVSaabb:function(){
// 		this.hit=1;
// 		if(this.penetration.x<this.penetration.y){ //project on x axis
// 			this.penetration.y=0;
// 			if(this.delta.x<0)this.penetration.x=-this.penetration.x; //project left
// 		}else{ //project on y axis
// 			this.penetration.x=0;
// 			if(this.delta.y<0)this.penetration.y=-this.penetration.y; //project up
// 		}
// 	},
// 	circleVScircle:function(r){
// 		var len=this.delta.magnitude(),
// 		pen=r-len;
// 		if(pen>0){//penetration detected
// 			this.hit=1;
// 			this.penetration.copy(this.delta);
// 			//distance vector is normalized and scaled by penetration depth
// 			this.penetration.scale(pen/len);
// 		}
// 	},
// 	circleVSaabb:function(apos,ahs,bpos,bhs){
// 		//determine grid/voronoi region of circle center
// 		var oH=0,oV=0,dx=this.delta.x,dy=this.delta.y;
// 		if(dx<-bhs.X)oH=-1;//circle is on left side of tile
// 		else if(bhs.X<dx)oH=1;//circle is on right side of tile
// 		if(dy<-bhs.Y)oV=-1;//circle is on bottom side of tile
// 		else if(bhs.Y<dy)oV=1;//circle is on top side of tile
//
// 		if(oH==0){
// 			this.hit=1;
// 			if(oV==0){//circle is in the aabb
// 				if(this.penetration.x<this.penetration.y){ //penetration in x is smaller; project on x
// 					this.penetration.y=0;
// 					if(dx<0)this.penetration.x=-this.penetration.x; //project left
// 				}else{ //penetration in y is smaller; project on y
// 					this.penetration.x=0;
// 					if(dy<0)this.penetration.y=-this.penetration.y; //project up
// 				}
//
// 			}else{ //project on y axis
// 				this.penetration.x=0;
// 				if(dy<0)this.penetration.y=-this.penetration.y; //project up
// 			}
//
// 		}else if(oV==0){ //project on x axis
// 			this.hit=1;
// 			this.penetration.y=0;
// 			if(dx<0)this.penetration.x=-this.penetration.x; //project left
// 		}else{//possible diagonal collision
// 			//this.voronoi.init(oH,oV);
// 			this.vertex.init(oH,oV);
// 			this.vertex.componentProduct(bhs);
// 			this.vertex.add(bpos);//get diag vertex position
// 			//calc vert->circle vector
// 			this.delta.initV(apos);
// 			this.delta.subtract(this.vertex);
// 			var len=this.delta.magnitude(),
// 			pen=ahs.x-len;
// 			if(pen>0){//vertex is in the circle; project outward
// 				this.hit=1;
// 				if(len==0){
// 					//project out by 45deg (1/square root of 2)
// 					this.penetration.init(oH,oV);
// 					this.penetration.scale(pen/1.41,0);
// 				}else{
// 					this.penetration.initV(this.delta);
// 					this.penetration.scale(pen/len,0);
// 				}
// 			}
// 		}
// 	}
// };
