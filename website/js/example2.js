// var canvas2       = document.getElementById("canvas2");
// var context2       = canvas2.getContext("2d");
// var width2         = canvas2.width2 = window.innerWidth;
// var height2        = canvas2.height2 = window.innerHeight;
// var collisionScene3= new BUMP.Scene();
//
// var circle = new BUMP.Physics(  width2 * 0.5, height2 * 0.5,
//                                 0.0, 0.0,
//                                 160, 160,
//                                 0,
//                                 0.8,//0.9
//                                 0.7,//0.8
//                                 'circle'
//                               );
//
// var circle2 = new BUMP.Physics( 0.0, 0.0,
//                                 0.0, 0.0,
//                                 40, 40,
//                                 1,
//                                 0.8,//0.9
//                                 0.7,//0.8
//                                 'circle'
//                               );
//
// collisionScene3.addBody( circle2 );
// collisionScene3.addBody( circle );
//
// circle.draw(context2,'#66FF66','#000000',1);
//
// document.body.addEventListener("mousemove", function(event) {
//   context2.clearRect(0, 0, width2, height2);
//   circle2.setPosition(event.clientX, event.clientY);
//
//   var fillStyle = "#66FF66";
//   // var distance = circle.position.getDistance(circle2.position);
//   // if( distance <= circle.radius + circle2.radius ){
//     fillStyle = "#FF6666";
//   //}
//   collisionScene3.test();
//   circle.draw(context2, fillStyle, '#000000', 1);
//   circle2.draw(context2,'#333333','#000000',1);
//
// });
