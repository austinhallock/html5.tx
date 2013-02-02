var Player = {
	state: 'stand', // for animations
	landed: false,
	jumping: false,
	
	// For the walking animation
	walkStance: 1, // walk stage 1 or 2 if walking
	walkStanceChanged: 0,
	
	width: Math.round( 100 * spriteSheet.width / 6 ) / 100,
	// How wide we want to make the collision object
	// We have to do this because the sprite actually has some extra space around it...
	collideWidth: 0.6 * Math.round( 100 * spriteSheet.width / 6 ) / 100,
	height: Math.round( 100 * spriteSheet.height / 3 ) / 100,
	
	// If the player collides with an object, we store information about it here (and reuse this object)
	// The reason we reuse this object is so we're not creating more unused memory that the garbage collector has to clean
	collision: {},
	previousCollision: {},
	
	// Starting positions
	x: 20,
	y: 0,
	
	// Starting velocities
	velocity: {
		x: 0,
		y: 0
	},
	
	// Velocity when the left/right keys are down
	WALK_VELOCITY: 20,
	// Velocity when the jump key is down
	JUMP_VELOCITY: -30,
	
	acceleration: {
		x: 0,
		y: Game.GRAVITY
	},
	
	start: function() {
		// Don't really need to do anything, but put stuff related to the player on the game start here..
	},
	
	getState: function() {
		if( this.bouncing && this.velocity.x > 0 )
			this.state = 'jumpRight';
		else if( this.bouncing && this.velocity.x < 0 )
			this.state = 'jumpLeft';
		else if( this.bouncing || this.jumping )
			this.state = 'jump';
		else if( this.velocity.x > 0 && this.velocity.y > 0 )
			this.state = 'fallRight';
		else if( this.velocity.x < 0 && this.velocity.y > 0 )
			this.state = 'fallLeft';
			
		else if( this.velocity.x > 0 && this.velocity.y < 0 )
			this.state = 'upRight';
		else if( this.velocity.x < 0 && this.velocity.y < 0 )
			this.state = 'upLeft';
			
		else if( this.velocity.x > 0 )
		{
			if( Game.lastTime - this.walkStanceChanged > 200 )
			{
				this.walkStance = ( this.walkStance == 1 ) ? 2 : 1;
				this.walkStanceChanged = Game.lastTime;
			}
			this.state = 'walkRight' + this.walkStance;
		}
		else if( this.velocity.x < 0 )
		{
			if( Game.lastTime - this.walkStanceChanged > 200 )
			{
				this.walkStance = ( this.walkStance == 1 ) ? 2 : 1;
				this.walkStanceChanged = Game.lastTime;
			}
			this.state = 'walkLeft' + this.walkStance;
		}
		
		else if( this.velocity.y < 0 )
			this.state = 'up';
		else if( this.velocity.y > 0 )
			this.state = 'fall';
		
		else
			this.state = 'stand';
	},
	
	/**
	 * Checks if the player collides with any objects (boxes) we have
	 * If the is a collision, we return true and information about
	 * the collision is stored in this.
	 * otherwise, we return false 
	 * @param x - the player's future x position
	 * @param y - the palyer's future y position
	 * 
	 * If you want to get more advanced, you would calculate if the player collided between the previous position and the current one
	 */
	checkCollisions: function( x, y ) {
		// Check for collisions with all boxes
		for( var i = 0, j = Game.boxes.length; i < j; i++ )
		{
			// See if there is a collision (returns which side if so)
			var collisionSide = Game.boxes[i].checkCollidesWithPlayer( x, y );

			// Only count collisions if the player is still moving
			if( collisionSide )
			{
				// Store the previous collision (we reference it to change back the background color)
				if( this.collision.object && this.collision.object.id != Game.boxes[i].id )
				{
					this.previousCollision.side = this.collision.side;
					this.previousCollision.object = this.collision.object;
					// To make sure the associated action with the collision with this object is called just once
					this.collision.called = false;
				}
				
				// What side of the box we collided with
				this.collision.side = collisionSide;
				// The box that was collided with
				this.collision.object = Game.boxes[i];
				
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Called every time in the game loop (~16ms), moves the player around
	 * @param {int} dt - the number of ms since the last call 
	 */
	move: function( dt ) {
		dt /= 100;
				
		// Left / right movement
		if( Keys.right && !this.bouncing )
			this.velocity.x = this.WALK_VELOCITY * Game.SCALE.x;
		else if( Keys.left && !this.bouncing )
			this.velocity.x = -1 * this.WALK_VELOCITY * Game.SCALE.x;
		else
			this.velocity.x = 0;
			
		// Jump
		if( Keys.up && ( this.landed || this.bouncing ) )
		{
			this.jumping = true; // for jump animation
			var _this = this;
			// 100 ms after the jump starts, we'll stop the jump animation (bending his knees) then actually jump (move up)
			setTimeout( function() {
				_this.jumping = false;
				_this.velocity.y = _this.JUMP_VELOCITY * Game.SCALE.y;
				_this.bouncing = false;
				_this.landed = false;
			}, 100 )
		}
			
		this.getState();
		
		
		// See if the player collided with any of the objects
		var newX = this.x + this.velocity.x * dt; // Where we want to move the player (x direction)
		var newY = this.y + this.velocity.y * dt; // Where we want to move the player (y direction)
		var collision = this.checkCollisions( newX, newY);
		
		// Horizontal movement
		// hitting the left side of the canvas
		if( newX + this.width <= 0 )
		{
			this.velocity.x = 0;
			this.x = 0;
		}
		// hitting the right side of the canvas
		else if( newX > window.innerWidth + Game.xOffset )
		{
			this.velocity.x = 0;
			this.x = Game.canvas.width - this.width;
		}
		// Collides with a box
		else if( collision && ( this.collision.side === 'left' || this.collision.side === 'right' ) )
		{
			this.velocity.x = 0;
			if( this.collision.side === 'left' )
				this.x = this.collision.object.left - this.collideWidth;
			else
				this.x = this.collision.object.right;
		}
		else
		{
			this.x = newX;
			// Update where the 'camera' is looking (only once he hits the halfway point)
			var newXOffset = newxOffset = this.x - ( window.innerWidth / 2 ) > 0;
			if( newXOffset )
				Game.xOffset = this.x - ( window.innerWidth / 2 );
		}
			
		
		// Vertical movement
		// hitting top of page & going up
		if( this.top <= 0 && this.velocity.y < 0 )
		{
			this.velocity.y = 0;
			this.y = 0;
		}
		// if still 'falling', but outside of bounds of page OR the player collides with an object's top
		else if( this.bottom >= Game.canvas.height && this.velocity.y >= 0 )
		{				
			this.velocity.y = 0;
			this.y = Game.canvas.height - this.height; // bottom of page
			this.landed = true;
		}
		else if( collision && this.collision.side === 'top' )
		{
			this.velocity.y = 0;
			this.y = this.collision.object.top - this.height;
			
			// For the purpose of this game, when a box is collided with, we switch to that slide
			var landedElement = document.getElementById( this.collision.object.id );
			if( landedElement )
			{
				if( ( !this.previousCollision.object || this.previousCollision.object.id != this.collision.object.id ) && !this.collision.called)
				{
					this.collision.called = true;
					// Make the previous box color gray again
					if( this.previousCollision.object )
						this.previousCollision.object.background = 'rgba( 100, 100, 100, 0.8 )';

					// Make the color of this box blue
					this.collision.object.background = '#00659C';
					// Hide previous slide
					document.querySelector( '.show' ).className = 'slide';
					// Show the one we landed on
					landedElement.className = 'slide show';
				}
			}
				
			this.landed = true;
		}
		else // below top of page, above bottom, or on the ground and jumping
		{
			// Jumping / Falling, update the position
			this.landed = false;

			this.velocity.y += this.acceleration.y * Game.SCALE.y * dt;
			if( this.velocity.y > Game.MAX_VELOCITY )
				this.velocity.y = Game.MAX_VELOCITY;
			
			this.y = newY;
		}
		
		// Bounding box stuff
		this.top = this.y
		this.bottom = this.height + this.top;
		this.left = this.x;
		this.right = this.x + this.collideWidth;
	},
	
	/**
	 * Draw the player sprite on the canvas 
	 */
	draw: function() {
		var sprite = sprites[ this.state ];
		
		// Actually draw the player sprite on the canvas
		// Parameters are: img, sx (x coordinate for clipping), sy (y coordinate for clipping), swidth (width of clipped image), sheight (height of clipped image), x, y, width, height		
		Game.ctx.drawImage( spriteSheet, sprite.x, sprite.y, this.width, this.height, this.x - Game.xOffset, this.y, this.width, this.height );
	}
};