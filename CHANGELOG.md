Version 0.5.4 (October 13th 2018)
-----------------------------
 * Bump.js published on NPM at @lcluber/bumpjs.
 * Updated README.md with NPM installation procedure.

Version 0.5.3 (July 23th 2018)
------------------------------
 * lighter ES6 library.

Version 0.5.2 (July 22th 2018)
------------------------------
 * Library exported as ES6 and IIFE modules instead of UMD.
 * BUMP namespace becomes Bump

Version 0.5.1 (July 4th 2018)
------------------------------
 * Documentation automatically generated in /doc folder
 * Typedoc and grunt-typedoc added in devDependencies
 * New "typedoc" task in Gruntfile.js
 * Typescript upgraded to version 2.9.2
 * INSTALL.md becomes NOTICE.md and RELEASE_NOTES.md becomes CHANGELOG.md

Version 0.5.0 (April 13th 2018)
------------------------------
 * Now written in Typescript. And can be used as a module.

Version 0.4.1 (March 11th 2017)
------------------------------
 * Added setVelocity() method to physics class.
 * Added getVelocityX() and getVelocityY() methods to physics class.
 * optimized applyVelocity() method in physics class.

Version 0.4.0 (March 5th 2017)
------------------------------
 * Included the body directly into the physics class. Holding the TYPE6.Geometry mask for collision tests.
 * Added drawBody() method to draw the collision mask of an object.
 * setPosition() method in Physics class becomes updatePosition(). setPosition now sets the position directly without computing forces and velocity.
 * Added setActive(), setInactive(), toggleActive() and isActive() methods to physics class. this allows to set inactive bodies as inactive in the collision scene. In order for them to not be checked for collision.
 * Added missing getters for every parameters in Physics class.

Version 0.3.0 (March 2nd 2017)
------------------------------
 * Added damage handling. Physics class can hold damage information to apply to another object on collision.
 * Added a Penetration Resolution correction in collision.js to improve the engine behavior.
 * Added setIteration() and getIteration() methods to Scene class. This allows to iterate several times through all collisions and improve greatly the engine behavior.

Version 0.2.5 (February 21th 2017)
------------------------------
 * Type6.js dependency is built separately into the dist/dependencies/ folder instead of being directly inserted into the distribution Bump.js and Bump.min.js files

Version 0.2.4 (February 11th 2017)
------------------------------
 * Added testScene() method to test collisions between 2 collision scenes
 * Updated documentation

Version 0.2.3 (January 30th 2017)
------------------------------
 * Updated Type6.js dependency to version 0.2.3

Version 0.2.2 (January 18th 2017)
------------------------------
 * Fix damping setter on Physics.create() method

Version 0.2.1 (January 14th 2017)
------------------------------
 * Added setGravity() method

Version 0.2.0 (December 22th 2016)
------------------------------
 * Updated for open source release on GitHub
 * Code reworked
 * Dedicated website
 * Documentation
 * Examples

Version 0.1.0 (December 1st 2011)
-----------------------------
 * initial version
