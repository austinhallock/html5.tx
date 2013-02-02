var Presentation = {
	tryCode: function( id ) {
		// Yeah, yeah, I'm using eval...
		var code = document.getElementById( 'code-' + id ).innerText;
		console.log( code );
		eval( code );
	}
};

var tries = document.querySelectorAll( '.try' );
for( var i = 0, j = tries.length; i < j; i++ )
{
	if( typeof tries[i] === 'undefined' )
		continue;
	tries[i].onclick = function() {
		Presentation.tryCode( this.id );
	}
}


var resumes = document.querySelectorAll( '.resume' );
for( var i = 0, j = resumes.length; i < j; i++ )
{
	if( typeof resumes[i] === 'undefined' )
		continue;
	resumes[i].onclick = function() {
		Game.paused = false;
	}
}
