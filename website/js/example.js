
  var canvas         = document.getElementById("canvas");
  var context        = canvas.getContext("2d");
  var width          = canvas.width  = window.innerWidth;
  var height         = canvas.height = window.innerHeight;
  var particles      = [];
  //create collision scene
  var collisionScene = BUMP.Scene.create();
  //create animation frame
  var animation      = FRAMERAT.create(render);
  var particleQty    = 400;
  var particleSize   = 6;
  var particleWeight = 1.0;
  var floor          = [];

  var particle = {
    create : function( positionX, positionY, velocityX, velocityY, size, weight, color ){
      var obj     = Object.create(this);
      obj.body    = TYPE6.Geometry.Circle.create( positionX, positionY, size * 0.5 );
      obj.physics = BUMP.Physics.create( TYPE6.Vector2D.create( velocityX, velocityY ),
                                  TYPE6.Vector2D.create( size, size ),
                                  weight,
                                  0.8,//0.9
                                  0.8//0.8
                                );
      obj.physics.setGravity( 0, 400 );
      obj.color   = color;
      return obj;
    },

    update: function(){
      this.body.position.addTo( this.physics.setPosition( animation.getDelta() ) );
    },
    
    reset: function(){
      this.body.position.setXY( width * 0.5, height * 0.25 );
      this.physics.reset();
    },
    
    draw: function(){
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(  this.body.getPositionX(),
                    this.body.getPositionY(),
                    this.body.getRadius(),
                    0,
                    TYPE6.Trigonometry.TWOPI,
                    false
                  );
      context.fill();
    }
  };
  
  var rectangle = {
    create : function( positionX, positionY, sizeX, sizeY ){
      var obj     = Object.create(this);
      obj.body    = TYPE6.Geometry.Rectangle.create( positionX, positionY, sizeX, sizeY );
      obj.physics = BUMP.Physics.create(  TYPE6.Vector2D.create(),
                                  TYPE6.Vector2D.create( sizeX, sizeY ),
                                  0.0,
                                  0.0,
                                  0.2
                                );
      return obj;
    },
    
    draw : function(){
      context.fillStyle = '#cccccc';
      context.fillRect( this.body.topLeftCorner.getX(),
                        this.body.topLeftCorner.getY(),
                        this.body.size.getX(),
                        this.body.size.getY()
                      );
    }
    
  };

  function initFloor(){

    floor.push(rectangle.create( width * 0.5, height, width * 0.5, 200 ));
    floor.push(rectangle.create( width * 0.12, height * 0.75, 200, width * 0.5 ));
    floor.push(particle.create( width * 0.5,
                                height * 0.86,
                                0,
                                0,
                                width * 0.2,
                                0,
                                '#cccccc'
                              ));
    for ( var i = 0 ; i < floor.length ; i++ )
      collisionScene.addBody( floor[i] );
    
  }

  function initParticles(){
    for( var i = 0 ; i < particleQty; i++ ){
      var radius   = TYPE6.Random.float( 0, 120 ); //120
      var angle    = TYPE6.Random.float( 0, TYPE6.Trigonometry.TWOPI );
      particles[i] = particle.create(
                        width * 0.5,
                        height * 0.25,
                        TYPE6.Trigonometry.cosineEquation( radius, angle, 0, 0 ),
                        TYPE6.Trigonometry.sineEquation( radius, angle, 0, 0 ),
                        particleSize,
                        particleWeight,
                        getRandomColor()
                     );
      collisionScene.addBody( particles[i] );
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
    collisionScene.test();
  }

  function clearFrame(){
    context.clearRect( 0, 0, width, height );
  }
  
  function render(){
    updatePositions();
    testCollisions();
    clearFrame();
    draw();
    animation.drawConsole( context );
    animation.newFrame();
  }

  function playAnimation(){
    animation.play();
  }

  function pauseAnimation () {
    animation.pause();
  }

  function stopAnimation () {
    animation.stop();
    clearFrame();
    resetParticles();
    animation.drawConsole( context ); //draw the console one time to show the reset
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ )
        color += letters[Math.floor(Math.random() * 16)];

    return color;
  }
