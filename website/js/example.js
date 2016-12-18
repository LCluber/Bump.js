
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
      obj.body    = TYPE6JS.Geometry.Circle.create( positionX, positionY, size * 0.5 );
      obj.physics = BUMP.Physics.create(  TYPE6JS.Vector2D.create( velocityX, velocityY ),
                                  TYPE6JS.Vector2D.create( size, size ),
                                  weight,
                                  0.9,
                                  0.8
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
    create : function( positionX, positionY, sizeX, sizeY ){
      var obj     = Object.create(this);
      obj.body    = TYPE6JS.Geometry.Rectangle.create( positionX, positionY, sizeX, sizeY );
      obj.physics = BUMP.Physics.create(  TYPE6JS.Vector2D.create(),
                                  TYPE6JS.Vector2D.create( sizeX, sizeY ),
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
      var radius   = TYPE6JS.Random.float( 0, 120 );
      var angle    = TYPE6JS.Random.float( 0, TYPE6JS.Trigonometry.TWOPI );
      particles[i] = particle.create(
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
    writeConsole();
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
    writeConsole(); //draw the console one time to show the reset
  }
  
  function write(text, posX, posY){
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.fillText( text, posX, posY );
  }
  
  function writeConsole(){
    context.font = "20px Georgia";
    write('Elapsed time : '     + animation.getTotalTime(0) + ' seconds', 20, 40);
    write('Frame number : '     + animation.getFrameNumber(), 20, 70);
    write('Frame Per Second : ' + animation.getFramePerSecond(30, 0), 20, 100);
    write('Frame duration : '   + animation.getRoundedDelta(30, 0).getMillisecond() + ' ms', 20, 130);
  }
