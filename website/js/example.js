
  var canvas         = document.getElementById("canvas");
  var context        = canvas.getContext("2d");
  var width          = canvas.width = window.innerWidth;
  var height         = canvas.height = window.innerHeight;
  var particles      = [];
  var collision      = BUMP.Collision.create();
  //create animation frame
  var animation      = FRAMERAT.create(render);
  var particleQty    = 300;
  var particleSize   = 6;
  var particleWeight = 1.0;

  var particle = {
    create : function( positionX, positionY, velocityX, velocityY, size, weight, color ){
      var obj = Object.create(this);
      obj.form    = TYPE6JS.Geometry.Circle.create( positionX, positionY, size * 0.5 );
      obj.physics = BUMP.create(  TYPE6JS.Vector2D.create( velocityX, velocityY ),
                                  TYPE6JS.Vector2D.create( size, size ),
                                  weight,
                                  0.99,
                                  0.7,
                                  'circle'
                                );
      obj.color  = color ? color : '#000000';
      return obj;
    },

    update: function(){
      this.form.position.addTo( this.physics.setPosition( animation.getDelta().getSecond() ) );
    },
    
    draw: function(){
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(  this.form.getPositionX(),
                    this.form.getPositionY(),
                    this.form.getRadius(),
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
      obj.form    = TYPE6JS.Geometry.Rectangle.create( positionX, positionY, 500, 200 );
      obj.physics = BUMP.create(  TYPE6JS.Vector2D.create(),
                                  TYPE6JS.Vector2D.create( 500, 200 ),
                                  0.0,
                                  0.0,
                                  0.7,
                                  'aabb'
                                );
      return obj;
    },
    
    draw : function(){
      context.fillStyle = '#cccccc';
      context.fillRect( this.form.topLeftCorner.getX(),
                        this.form.topLeftCorner.getY(),
                        this.form.size.getX(),
                        this.form.size.getY()
                      );
    }
    
  };

  var floorAABB   = rectangle.create( width * 0.5, height );
  var floorCircle = particle.create(
                      width * 0.5,
                      height * 1.2,
                      0,
                      0,
                      width * 0.6,
                      0,
                      '#cccccc'
                    );

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
    }
  }
  
  initParticles();

  function draw() {
    
    floor.draw();
    
    for( var i = 0 ; i < particleQty ; i += 1 ) {
      //var p = particles[i];
      particles[i].draw();
    }
    
  }
  
  function updatePositions(){
    for( var i = 0 ; i < particleQty ; i++ ){
      //var p1 = particles[i];
      particles[i].update();
    }
  }
  
  function testCollisions(){
    for( var i = 0 ; i < particleQty ; i++ ){
      var p1 = particles[i];
      for( var j = 0 ; j < particleQty ; j++ ){
        var p2 = particles[j];
        if (i != j )
          collision.test( p1.form.getPosition(), p1.physics, p2.form.getPosition(), p2.physics );
      }
      collision.test( p1.form.getPosition(), p1.physics, floor.form.getPosition(), floor.physics );
    }
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
