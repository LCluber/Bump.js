window.onload = function() {
  var canvas    = document.getElementById("canvas");
  var context   = canvas.getContext("2d");
  var width     = canvas.width = window.innerWidth;
  var height    = canvas.height = window.innerHeight;
  var particles = [];

  var particle = {
    position: {},
    velocity: {},
    create : function( positionX, positionY, velocityX, velocityY ){
      var obj = Object.create(this);
      obj.init();
      obj.position.setXY( positionX, positionY );
      obj.velocity.setXY( velocityX, velocityY );
      return obj;
    },
    init: function(){
      this.position = TYPE6JS.Vector2D.create();
      this.velocity = TYPE6JS.Vector2D.create();
    },
    update: function(){
      this.position.addTo(this.velocity);
    }
  };

	for (var i = 0; i < 200; i += 1) {
    var radius    = TYPE6JS.Random.float(0, 3);
    var angle     = TYPE6JS.Random.float(0, TYPE6JS.Trigonometry.TWOPI);
    particles[i]  = particle.create(
                      width * 0.5,
                      height * 0.5,
                      TYPE6JS.Trigonometry.cosineEquation( radius, angle, 0, 0 ),
                      TYPE6JS.Trigonometry.sineEquation( radius, angle, 0, 0 )
                    );
  }

  update();

  function update() {
    context.clearRect(0, 0, width, height);
    for(var i = 0; i < 200; i += 1) {
      var p = particles[i];
      p.update();
      context.beginPath();
      context.arc(p.position.getX(), p.position.getY(), 3, 0, TYPE6JS.Trigonometry.TWOPI, false);
      context.fill();
    }
    requestAnimationFrame(update);
  }


};
