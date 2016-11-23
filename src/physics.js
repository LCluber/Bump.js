/**
* @namespace
*/
var PHYSICS = {

  /**
  * @author Ludovic Cluber <http://www.lcluber.com/contact>
  * @file physics engine library.
  * @version 0.2.0
  * @copyright (c) 2011 Ludovic Cluber

  * @license
  * MIT License
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */

  revision : '0.2.0',
  options :{
    space : '3D'
  },


  position     : TYPE6JS.Vector3D.create(),
  gravity      : TYPE6JS.Vector3D.create(),
  force        : TYPE6JS.Vector3D.create(),
  resultingAcc : TYPE6JS.Vector3D.create(),
  velocity     : TYPE6JS.Vector3D.create(),
  thrust       : TYPE6JS.Vector3D.create(),
  direction    : TYPE6JS.Vector3D.create(),

//fram=[new Vect(.0,.0),new Vect(.0,.0),new Vect(.0,.0),new Vect(.0,.0)];

  damping : 0.9,
  mass : 1.0,
  inverseMass : 1.0,
  elasticity : -1,//-e
  shape : 1,

  size : TYPE6JS.Vector3D.create(),
  halfSize : TYPE6JS.Vector3D.create(),
  cells : [0,0,0,0],
//margin=[-halfSize.y,ROOSTR.Screen.size.x+halfSize.x,ROOSTR.Screen.size.y+halfSize.y,-halfSize.x];

  impulsePerInverseMass : TYPE6JS.Vector3D.create(),

  /**
  * Create a new physics class.
  * @since 0.2.0
  * @method
  * @param {array} config An array of actions describing the state machine. [{ name: 'action',    from: 'status1',    to: 'status2' }]
  * @returns {fsm}  The new finite state machine
  */
  create : function( velocity,
                     throttle,
                     size,
                     mass,
                     damping,
                     elasticity,
                     shape ){
    var _this = Object.create(this);
    _this.velocity    = velocity;
    _this.throttle    = throttle;
    _this.size        = size;
    _this.mass        = mass;
    _this.inverseMass = !mass?0:1/mass;
    _this.elasticity  = -elasticity;
    _this.shape       = shape;
    return _this;
  },

  /**
  * setPosition a new physics class.
  * @since 0.2.0
  * @method
  * @param {array} config An array of actions describing the state machine. [{ name: 'action',    from: 'status1',    to: 'status2' }]
  * @returns {fsm}  The new finite state machine
  */
  setPosition : function( direction, time ){
    //var p=0;
    //add new force
    if(direction.isNotNull()){
      this.direction.copy(direction);
      this.direction.normalize();
      this.direction.multiply(this.thrust);
      this.force.add(this.direction);
    }
    //init
    this.position.zero();
    this.resultingAcc.copy(this.gravity);

    if(this.force.isNotNull()){
      this.resultingAcc.addScaledVector(this.force,this.inverseMass);
      this.force.zero();
    }
    if(this.resultingAcc.isNotNull())
      this.velocity.addScaledVector(this.resultingAcc,time);

    if(this.velocity.isNotNull()){
      this.velocity.scale(Math.pow(this.damping,time),0);
      //this.velocity.scale(this.damping,0);// use if damping just solves numerical problems and other drag forces are applied
      this.position.addScaledVector(this.velocity,time);
      //p=1;
    }

    return this.position;
		/*if(LEVEL.scaledVel.c0()){
			this.position.add(LEVEL.scaledVel);
			for(var i=0;i<4;i++)this.fram[i].add(LEVEL.scaledVel);
			p=1;
		}*/
		//if(p)
			//this.newCells();
	},

};



                        //velocity throttle size mass damping elasticity shape
// ROOSTR.physics = function (/*velocityX,velocityY,velocityZ,*/
//                         throttleX,throttleY,throttleZ,
//                         sizeX,sizeY,sizeZ,
//                         mass,damping,elasticity,shape){
//
//     this.position = new ROOSTR.Vector3();
// 	this.gravity = new ROOSTR.Vector3();
// 	this.force = new ROOSTR.Vector3();
// 	this.resultingAcc = new ROOSTR.Vector3();
// 	this.velocity = new ROOSTR.Vector3(/*velocityX,velocityY,velocityZ*/);
// 	this.thrust = new ROOSTR.Vector3(throttleX,throttleY,throttleZ);
//     this.direction = new ROOSTR.Vector3();
//
// 	//this.fram=[new Vect(.0,.0),new Vect(.0,.0),new Vect(.0,.0),new Vect(.0,.0)];
//
//     this.damping = damping;
// 	this.mass=mass;
// 	this.inverseMass=!mass?0:1/mass;
// 	this.elasticity=-elasticity;//-e
// 	this.shape=shape;
//
// 	this.size=new ROOSTR.Vector3(sizeX, sizeY, sizeZ);
// 	this.halfSize=new ROOSTR.Vector3(sizeX>>1, sizeY>>1, sizeZ>>1);
// 	this.cells=[0,0,0,0];
// 	//this.margin=[-this.halfSize.y,ROOSTR.Screen.size.x+this.halfSize.x,ROOSTR.Screen.size.y+this.halfSize.y,-this.halfSize.x];
//
// 	this.impulsePerInverseMass=new ROOSTR.Vector3();
//
// 	//this.initFram();
// }
// ROOSTR.physics.prototype={
// 	computePosition:function(direction,time){
// 		//var p=0;
//         //add new force
//         if(direction.notNull()){
//             this.direction.copy(direction);
//             this.direction.normalize();
//             this.direction.multiply(this.thrust);
//             this.force.add(this.direction);
//         }
//         //init
//         this.position.zero();
// 		this.resultingAcc.copy(this.gravity);
//
//         if(this.force.notNull()){
// 			this.resultingAcc.addScaledVector(this.force,this.inverseMass);
// 			this.force.zero();
// 		}
// 		if(this.resultingAcc.notNull())
// 			this.velocity.addScaledVector(this.resultingAcc,time);
//
// 		if(this.velocity.notNull()){
// 			this.velocity.scale(Math.pow(this.damping,time),0);
// 			//this.velocity.scale(this.damping,0);// use if damping just solves numerical problems and other drag forces are applied
//             this.position.addScaledVector(this.velocity,time);
//
// 			//p=1;
// 		}
//
//         return this.position;
// 		/*if(LEVEL.scaledVel.c0()){
// 			this.position.add(LEVEL.scaledVel);
// 			for(var i=0;i<4;i++)this.fram[i].add(LEVEL.scaledVel);
// 			p=1;
// 		}*/
// 		//if(p)
// 			//this.newCells();
// 	},
// 	newCells:function(){
// 		for(var i=0;i<4;i++)
// 			this.cells[i]=Math.floor((this.fram[i].X-SCREEN.margin[3])/SCREEN.cellSize.X) +Math.floor((this.fram[i].Y-SCREEN.margin[0])/SCREEN.cellSize.Y)*SCREEN.nbCell.X;
// 	},
// 	addScaledVector:function(v){
// 		//this.position.addScaledVector(v,ROOSTR.frames.second);
// 		//for(var i=0;i<4;i++)
// 			//this.fram[i].addScaledVector(v,ROOSTR.second);
// 		//if(this.cameras.length>0){
// 			/*for(var i=0;i<this.cameras.length;i++){
// 				CAM.list[this.cameras[i]].position.addScaledVector(v,ROOSTR.second);
// 				CAM.list[this.cameras[i]].target.addScaledVector(v,ROOSTR.second);
// 			}*/
// 		//}
// 	},
// 	initFram:function(){
// 		var pxmh=this.position.X-this.halfSize.X,
// 		pxph=this.position.X+this.halfSize.X,
// 		pymh=this.position.Y-this.halfSize.Y,
// 		pyph=this.position.Y+this.halfSize.Y;
// 		this.fram[0].init(pxmh,pymh);
// 		this.fram[1].init(pxph,pymh);
// 		this.fram[2].init(pxph,pyph);
// 		this.fram[3].init(pxmh,pyph);
// 	},
// 	onScreen:function(){
// 		if(this.position.x>this.margin[3]&&this.position.x<this.margin[1]&&this.position.y>this.margin[0]&&this.position.y<this.margin[2])return 1;
// 	},
// 	applyImpulse:function(ipim){
// 		if(this.life&&this.inverseMass){
// 			this.impulsePerInverseMass.copy(ipim);
// 			this.impulsePerInverseMass.scale(this.inverseMass,0);
// 			this.velocity.add(this.impulsePerInverseMass);//add impulse vector to velocity
// 		}
// 	},
// 	setHalfSize:function(){
// 		this.halfSize.initV(this.size);
// 		this.halfSize.scale(0.5,0);
// 	},
// 	delPhysics:function(){
// 		delete this.position;
// 		delete this.gravity;
// 		delete this.force;
// 		delete this.resultingAcc;
// 		delete this.velocity;
// 		delete this.throttle;
// 		delete this.fram[0];
// 		delete this.fram[1];
// 		delete this.fram[2];
// 		delete this.fram[3];
// 		delete this.fram;
//
// 		delete this.size;
// 		delete this.halfSize;
// 		delete this.cells;
// 		delete this.margin;
//
// 		delete this.impulsePerInverseMass;
// 	}
// };
