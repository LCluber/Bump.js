  var playButton     = findById('play');
  var canvas         = document.getElementById("canvas");
  var context        = canvas.getContext("2d");
  var width          = canvas.width  = window.innerWidth;
  var height         = canvas.height = window.innerHeight;
  var particles      = [];
  //create collision scenes
  var collisionScene1= new BUMP.Scene();
  var collisionScene2= new BUMP.Scene();
  collisionScene1.setIteration(3);
  collisionScene2.setIteration(3);
  //create animation frame
  var animation      = new FRAMERAT.Player(render);
  var particleQty    = 300;
  var particleWeight = 1.0;
  var floor          = [];

  var particle = {
    life : 1,
    create : function( positionX, positionY, velocityX, velocityY, size, weight, color ){
      var obj     = Object.create(this);
      obj.physics = new BUMP.Physics( positionX, positionY,
                                      velocityX, velocityY,
                                      size, size,
                                      weight,
                                      0.8,//0.9
                                      0.7,//0.8
                                      'circle'
                                    );
      obj.physics.setGravity( 0, 400 );
      obj.color = color;
      return obj;
    },

    update: function(){
      this.physics.updatePosition( TYPE6.Time.millisecondToSecond(animation.clock.delta)  );
      if(this.physics.isActive() && this.physics.position.y > height + this.physics.body.radius){
        this.physics.toggleActive();
      }
    },

    collision: function(){
      //console.log(damage);
      var dmg = this.physics.applyDamage();
      if (dmg) {
        //this.life -= damage;
        //this.color = getRandomColor();
        //this.body.setRadius(this.body.getRadius() + 1);
      }
    },

    reset: function(){
      //this.life = 1;
      this.physics.setPosition( width * 0.5, height * 0.25 );
      this.physics.reset();
      this.physics.setActive();
    },

    draw: function(){
      this.physics.draw( context, this.color, null, null );
    }
  };

  var rectangle = {
    create : function( positionX, positionY, sizeX, sizeY ){
      var obj     = Object.create(this);
      obj.physics = new BUMP.Physics( positionX, positionY,
                                      0.0, 0.0,
                                      sizeX, sizeY,
                                      0.0,
                                      0.0,
                                      0.7,
                                      'rectangle');
      return obj;
    },

    draw : function(){
      this.physics.draw( context, '#cccccc', null, null );
    }

  };

  function initFloor(){

    floor.push(rectangle.create( width * 0.5, height, width * 0.5, 200 ));
    floor.push(rectangle.create( width * 0.12, height * 0.75, 200, width * 0.5 ));
    //floor.push(rectangle.create( width * 0.9, height * 0.75, 200, width * 0.5 ));
    floor.push(particle.create( width * 0.5,
                                height * 0.86,
                                0,
                                0,
                                width * 0.1,
                                0,
                                '#cccccc'
                              ));
    for ( var i = 0 ; i < floor.length ; i++ )
      collisionScene1.addBody( floor[i].physics );

  }

  function initParticles(){
    for( var i = 0 ; i < particleQty; i++ ){
      var radius   = TYPE6.Random.float( 0, 140 ); //120
      var angle    = TYPE6.Random.float( 0, TYPE6.Trigonometry.twopi );
      var particleRadius = TYPE6.Random.integer( 3, 6 );
      particles[i] = particle.create(
                        width * 0.5,
                        height * 0.25,
                        TYPE6.Trigonometry.cosineEquation( radius, angle, 0, 0 ),
                        TYPE6.Trigonometry.sineEquation( radius, angle, 0, 0 ),
                        particleRadius,
                        particleRadius*4,
                        getRandomColor()
                     );
      collisionScene2.addBody( particles[i].physics );
    }
  }

  function resetParticles(){
    for( var i = 0 ; i < particleQty; i++ )
      particles[i].reset();
  }

  initParticles();
  initFloor();

  function draw() {

    for( var i = 0 ; i < floor.length ; i++ )
      floor[i].draw();

    for( i = 0 ; i < particleQty ; i++ )
      particles[i].draw();

  }

  function updatePositions(){
    for( var i = 0 ; i < particleQty ; i++ )
      particles[i].update();
  }

  function testCollisions(){
      collisionScene2.test();//test collisions between particles
      collisionScene2.testScene(collisionScene1);//test collisions between floor and particles
  }

  function applyDamage(){
    for( var i = 0 ; i < particleQty ; i++ ){
      particles[i].collision();
    }
  }

  function clearFrame(){
    context.clearRect( 0, 0, width, height );
  }

  function render(){
    updatePositions();
    testCollisions();
    applyDamage();
    clearFrame();
    draw();
    //animation.drawConsole( context );
    animation.newFrame();
  }

  function playAnimation(){
    var state = animation.toggle();
    if(state === 'running') {
      playButton.innerHTML = "<span class='glyphicon glyphicon-pause'></span>";
    }else if (state === 'paused') {
      playButton.innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    }
  }

  function stopAnimation () {
    animation.stop();
    clearFrame();
    resetParticles();
    playButton.innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    //animation.drawConsole( context ); //draw the console one time to show the reset
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ )
        color += letters[Math.floor(Math.random() * 16)];

    return color;
  }

  function findById( id ) {
    return document.getElementById(id);
  }
