
  var canvas    = document.getElementById("canvas");
  var context   = canvas.getContext("2d");
  var width     = canvas.width = window.innerWidth;
  var height    = canvas.height = window.innerHeight;
  var particles = [];
  var collision = BUMP.Collision.create();
  //create animation frame
  var animation = FRAMERAT.create(render);
  
  var particleQty = 200;

  var particle = {
    create : function( positionX, positionY, velocityX, velocityY ){
      var obj = Object.create(this);
      obj.circle = TYPE6JS.Geometry.Circle.create( positionX, positionY, 3 );
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
  
  var rectangle = TYPE6JS.Geometry.Rectangle.create(
              (width - 500) * 0.5, (height - 400) * 0.5,
              500, 400
            );

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

  function draw() {
    
    drawRectangle(rectangle, "#cccccc");
    
    context.fillStyle = "#000000";
    for( var i = 0; i < particleQty; i += 1 ) {
      var p = particles[i];
      p.update();
      p.circle.clampTo(rectangle);
      p.draw();
    }
    
  }

  function clearFrame(){
    context.clearRect( 0, 0, width, height );
  }
  
  function drawRectangle(rectangle, color){
    context.fillStyle = color;
    context.fillRect(rectangle.topLeftCorner.getX(), rectangle.topLeftCorner.getY(), rectangle.size.getX(), rectangle.size.getY());
  }

  function render(){
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
    //writeConsole(); //draw the console one time to show the reset
  }
