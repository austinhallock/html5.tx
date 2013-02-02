/**
 * Some basic tracking to see which keys are down
 * Didn't want to require jQuery for this game, so we have this :)
 * I name keys just by up, down, left, right and map WASD and the arrow keys to them
 * You can add more keys if you want, named "shoot" for example, and map to, say, the x key
 */
var Keys = {
	up: false,
	down: false,
	left: false,
	right: false
};
// WASD and the arrow keys map to up, left, down, right
var KeyMap = {
	38: 'up',
	87: 'up', // w
	40: 'down',
	83: 'down', // s
	37: 'left',
	65: 'left', // a
	39: 'right',
	68: 'right' // d
}

window.addEventListener( 'keydown', function( event ) {
	Keys[ KeyMap[ event.which ] ] = true;
} );
window.addEventListener( 'keyup', function( event ) {
	Keys[ KeyMap[ event.which ] ] = false;
} );