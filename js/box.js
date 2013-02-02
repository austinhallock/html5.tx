// Any boxes on the screen that can be walked on
var Box = ( function() {
	
	// Text goes inside the box, this is just like your standard css padding...
	Box.PADDING = 15;
	
	function Box( id, x, y, width, height )
	{
		this.id = id;
		
		// See if there's a DOM element for this id, and grab it's title tag for the box text
		var ele = document.getElementById( id );
		if( ele )
		{
			this.text = ele.getAttribute( 'data-title' );
			var fontSize = 12 * Game.SCALE.y;
			Game.ctx.font = fontSize + 'px ptserif, georgia, serif';
			// We'll also override the box width to be the right width to fit the text
			var size = Game.ctx.measureText( this.text );
			this.width = size.width + Box.PADDING * 2;
		}
		
		this.x = x;
		this.y = y;
		this.width = this.width || width;
		this.height = height;
		
		// Corners
		this.left = x;
		this.right = x + this.width;
		this.top = y;
		this.bottom = y + this.height;
		
		// Background color of box
		this.background = 'rgba( 100, 100, 100, 0.8 )';
	}
	
	/**
	 * Checks if this box collides with the player
	 * @param {int} x - the player's future x position
	 * @param {int} y - the player's future y position
	 * @return {truthy} - the string side if a collision, false otherwise 
	 */
	Box.prototype.checkCollidesWithPlayer = function( x, y ) {
		var playerLeft = x;
		var playerRight = x + Player.collideWidth;
		var playerTop = y;
		var playerBottom = y + Player.height;
		// Collision with the left side of the box
		if( playerRight >= this.left && playerLeft <= this.left && Player.velocity.x > 0 &&
		( ( playerBottom > this.top && playerBottom < this.bottom ) || ( playerTop > this.top && playerTop < this.bottom ) ) )
			return 'left';
		// Collision with the right side of the box
		else if( playerRight >= this.right && playerLeft <= this.right && Player.velocity.x < 0 && 
		( ( playerBottom > this.top && playerBottom < this.bottom ) || ( playerTop > this.top && playerTop < this.bottom ) ) )
			return 'right';
		// Collision with the top side of the box
		else if( playerBottom >= this.top && playerTop <= this.top && Player.velocity.y >= 0 && 
		( ( playerRight > this.left && playerRight < this.right ) || ( playerLeft > this.left && playerLeft < this.right ) ) )
			return 'top';
		// Collision with the top side of the box
		else if( playerBottom >= this.bottom && playerTop <= this.bottom && Player.velocity.y >= 0 && 
		( ( playerRight > this.left && playerRight < this.right ) || ( playerLeft > this.left && playerLeft < this.right ) ) )
			return 'bottom';
			
		// No collision
		return false;
	};
	
	/**
	 * Draws the box onto the game canvas 
	 */
	Box.prototype.draw = function() {
		Game.ctx.fillStyle = this.background;
		Game.ctx.fillRect( this.x - Game.xOffset, this.y, this.width, this.height );
		
		if( typeof this.text !== 'undefined' )
		{
			var fontSize = 12 * Game.SCALE.y;
			Game.ctx.font = fontSize + 'px ptserif, georgia, serif';
			Game.ctx.fillStyle = '#fff';
			Game.ctx.fillText( this.text, this.left - Game.xOffset + Box.PADDING, this.top + fontSize + Box.PADDING );
		}
	}
	
	return Box;
	
} )();