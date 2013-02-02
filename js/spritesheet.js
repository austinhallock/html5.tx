/**
 * Here we're generating an object that has the x, y offsets of each sprite animation in the spritesheet
 */
var spriteSheetImage = new Image(); // src is set on dom load
spriteSheetImage.width = window.innerWidth / 5;
spriteSheetImage.height = spriteSheetImage.width / 2;
var spriteSheet = { width: spriteSheetImage.width, height: spriteSheetImage.height };
spriteSheet.width = spriteSheet.width - ( spriteSheet.width % 6 ); // Make multiple of six to floor() everything
spriteSheet.height = spriteSheet.height - ( spriteSheet.height % 3 ); // Make multiple of three to floor() everything
var sprites = {
	fall: { x: 0, y: 0 },
	jump: { x: spriteSheet.width * ( 1 / 6 ), y: 0 },
	up: { x: spriteSheet.width * ( 2 / 6 ), y: 0 },
	upLeft: { x: spriteSheet.width * ( 3 / 6 ), y: 0 },
	upRight: { x: spriteSheet.width * ( 4 / 6 ), y: 0 },
	somethingRight: { x: spriteSheet.width * ( 5 / 6 ), y: 0 },
	somethingLeft: { x: 0, y: spriteSheet.height * ( 1 / 3 ) },
	right: { x: spriteSheet.width * ( 1 / 6 ), y: spriteSheet.height * ( 1 / 3 ) },
	left: { x: spriteSheet.width * ( 2 / 6 ), y: spriteSheet.height * ( 1 / 3 ) },
	jumpLeft: { x: spriteSheet.width * ( 3 / 6 ), y: spriteSheet.height * ( 1 / 3 ) },
	jumpRight: { x: spriteSheet.width * ( 4 / 6 ), y: spriteSheet.height * ( 1 / 3 ) },
	fallRight: { x: spriteSheet.width * ( 5 / 6 ), y: spriteSheet.height * ( 1 / 3 ) },
	fallLeft: { x: 0, y: spriteSheet.height * ( 2 / 3 ) },
	walkRight1: { x: spriteSheet.width * ( 1 / 6 ), y: spriteSheet.height * ( 2 / 3 ) },
	walkRight2: { x: spriteSheet.width * ( 2 / 6 ), y: spriteSheet.height * ( 2 / 3 ) },
	walkLeft1: { x: spriteSheet.width * ( 3 / 6 ), y: spriteSheet.height * ( 2 / 3 ) },
	walkLeft2: { x: spriteSheet.width * ( 4 / 6 ), y: spriteSheet.height * ( 2 / 3 ) },
	stand: { x: spriteSheet.width * ( 5 / 6 ), y: spriteSheet.height * ( 2 / 3 ) }
};