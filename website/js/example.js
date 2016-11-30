
  var canvas    = document.getElementById("canvas");
  var context   = canvas.getContext("2d");
  var width     = canvas.width = window.innerWidth;
  var height    = canvas.height = window.innerHeight;
  var particles = [];
  var collision = BUMP.Collision.create();
  console.log(collision);
  //create animation frame
  var animation = FRAMERAT.create(render);
  
  var particleQty = 200;

  var particle = {
    create : function( positionX, positionY, velocityX, velocityY ){
      var obj = Object.create(this);
      obj.circle = TYPE6JS.Geometry.Circle.create( positionX, positionY, 6 );
      obj.physics = BUMP.create(  TYPE6JS.Vector2D.create(velocityX, velocityY),
                                  TYPE6JS.Vector2D.create(),
                                  1.0,
                                  0.99,
                                  0.8,
                                  'circle'
                                );
      return obj;
    },

    update: function(){
      this.circle.position.addTo(this.physics.setPosition( animation.getDelta().getSecond() ));
    },
    
    draw: function(){
      context.beginPath();
      context.arc(  this.circle.getPositionX(),
                    this.circle.getPositionY(),
                    this.circle.getRadius(),
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
      obj.aabb = TYPE6JS.Geometry.Rectangle.create( positionX, positionY, 500, 200 );
      obj.physics = BUMP.create(  TYPE6JS.Vector2D.create(),
                                  TYPE6JS.Vector2D.create(),
                                  0.0,
                                  0.0,
                                  0.8,
                                  'aabb'
                                );
      return obj;
    },
    
    draw : function(){
      context.fillStyle = '#cccccc';
      context.fillRect( this.aabb.topLeftCorner.getX(),
                        this.aabb.topLeftCorner.getY(),
                        this.aabb.size.getX(),
                        this.aabb.size.getY()
                      );
    }
    
  };

  var floor = rectangle.create( width * 0.5, height * 0.8 );

  function initParticles(){
    for (var i = 0; i < particleQty; i += 1) {
      var radius    = TYPE6JS.Random.float(0, 400);
      var angle     = TYPE6JS.Random.float(0, TYPE6JS.Trigonometry.TWOPI);
      particles[i]  = particle.create(
                        width * 0.5,
                        height * 0.5,
                        TYPE6JS.Trigonometry.cosineEquation( radius, angle, 0, 0 ),
                        TYPE6JS.Trigonometry.sineEquation( radius, angle, 0, 0 )
                      );
    }
  }
  
  initParticles();

  function draw() {
    
    floor.draw();
    
    context.fillStyle = "#000000";
    for( var i = 0; i < particleQty; i += 1 ) {
      var p = particles[i];
      p.update();
      p.draw();
    }
    
  }

  function clearFrame(){
    context.clearRect( 0, 0, width, height );
  }
  

  function render(){
    for( var i = 0 ; i < particleQty ; i++ ){
      if ( collision.test( particles[i].circle.getPosition(), particles[i].physics, floor.aabb.getPosition(), floor.physics ))
        collision.computeImpulseVectors( particles[i].physics, floor.physics );
      
      for( var j = 0 ; j < particleQty ; j++ ){
        if (i != j && collision.test( particles[i].circle.getPosition(), particles[i].physics, particles[i].circle.getPosition(), particles[j].physics ))
          collision.computeImpulseVectors( particles[i].physics, particles[j].physics );
      }
    }
      
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
