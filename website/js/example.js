
  var canvas         = document.getElementById("canvas");
  var context        = canvas.getContext("2d");
  var width          = canvas.width  = window.innerWidth;
  var height         = canvas.height = window.innerHeight;
  var particles      = [];
  var collisionScene = BUMP.Scene.create();
  //create animation frame
  var animation      = FRAMERAT.create(render);
  var particleQty    = 1;
  var particleSize   = 6;
  var particleWeight = 1.0;

  var particle = {
    create : function( positionX, positionY, velocityX, velocityY, size, weight, color ){
      var obj = Object.create(this);
      obj.body    = TYPE6JS.Geometry.Circle.create( positionX, positionY, size * 0.5 );
      obj.physics = BUMP.create(  TYPE6JS.Vector2D.create( velocityX, velocityY ),
                                  TYPE6JS.Vector2D.create( size, size ),
                                  weight,
                                  0.99,
                                  0.7
                                );
      obj.color   = color ? color : '#000000';
      return obj;
    },

    update: function(){
      this.body.position.addTo( this.physics.setPosition( animation.getDelta().getSecond() ) );
    },
    
    draw: function(){
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(  this.body.getPositionX(),
                    this.body.getPositionY(),
                    this.body.getRadius(),
                    0,
                    TYPE6JS.Trigonometry.TWOPI,
                    false
                  );
      context.fill();
    }
  };
  
  var rectangle = {
    create : function( positionX, positionY ){
      var obj = Object.create(this);
      obj.body    = TYPE6JS.Geometry.Rectangle.create( positionX, positionY, 500, 200 );
      obj.physics = BUMP.create(  TYPE6JS.Vector2D.create(),
                                  TYPE6JS.Vector2D.create( 500, 200 ),
                                  0.0,
                                  0.0,
                                  0.7
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

  var floor = rectangle.create( width * 0.5, height );
  // var floor = particle.create(
  //                     width * 0.5,
  //                     height * 1.2,
  //                     0,
  //                     0,
  //                     width * 0.6,
  //                     0,
  //                     '#cccccc'
  //                   );
  collisionScene.addBody( floor );

  function initParticles(){
    for( var i = 0; i < particleQty; i += 1 ){
      var radius    = TYPE6JS.Random.float( 0, 100 );
      var angle     = TYPE6JS.Random.float( 0, TYPE6JS.Trigonometry.TWOPI );
      particles[i]  = particle.create(
                        width * 0.5,
                        height * 0.25,
                        TYPE6JS.Trigonometry.cosineEquation( radius, angle, 0, 0 ),
                        TYPE6JS.Trigonometry.sineEquation( radius, angle, 0, 0 ),
                        particleSize,
                        particleWeight,
                        null
                      );
      collisionScene.addBody( particles[i] );
    }
  }
  
  initParticles();

  function draw() {
    
    floor.draw();
    
    for( var i = 0 ; i < particleQty ; i += 1 ) {
      particles[i].draw();
    }
    
  }
  
  function updatePositions(){
    for( var i = 0 ; i < particleQty ; i++ ){
      particles[i].update();
    }
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
    //writeConsole();
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
    initParticles();
    //writeConsole(); //draw the console one time to show the reset
  }
