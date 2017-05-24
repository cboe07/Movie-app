$(document).ready(function(){

	// console.log("Sanity Check");
	// All API calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images go to this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey
	// console.log(nowPlayingUrl);

	// Make AJAX request to the nowwPlayingUrl
	console.log(nowPlayingUrl);
	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);
		$('.movie-poster').click(function(){
			// Change the HTML inside the modal
			var thisMovieId = $(this).attr('movie-id');
			console.log(thisMovieId);
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				console.log(thisMovieData);
				
				// Open the modal
				$('#myModalLabel').html(thisMovieData.title);
				// $('.modal-body').html('<h3>Overview</h3>' + thisMovieData.overview);
				var thisMovieUrl2 = `${apiBaseUrl}/movie/${thisMovieId}/credits?api_key=${apiKey}`
				$.getJSON(thisMovieUrl2,(thisMovieData)=>{
					var thisMovieId = $(this).attr('movie-id');
					console.log(thisMovieData)
					var cast = [];
					for(let i =0; i<4;i++){
						// console.log(thisMovieData.cast[i].name)
						cast.push(thisMovieData.cast[i].name);
					}
					$('.modal-body').html('<h3>Overview</h3>' + thisMovieData.overview +'<h3>Cast</h3>' + cast);
					// $('.modal-body').html('<h3>Cast</h3>' + cast)
					$('#myModal').modal();
				})
				
				
			})
			
		})
	});

	$('#movie-form').submit((event)=>{
		//Don't submit
		event.preventDefault();
		var userInput = $('#search-input').val();
		$('#search-input').val('');                  // Empties search bar
		var safeUserInput = encodeURI(userInput);
		var searchUrl = apiBaseUrl + '/search/movie?query='+safeUserInput+'&api_key='+apiKey;
		console.log(searchUrl);
		$.getJSON(searchUrl,(searchMovieData)=>{
			var searchMovieHTML = getHTML(searchMovieData);
			$('#movie-grid').html(searchMovieHTML);
		})
	})

	function getHTML(data){
		var newHTML = '';
		for(let i = 0; i < data.results.length; i++){
			var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
			newHTML += '<div class="col-sm-6 col-md-3 movie-poster" movie-id='+data.results[i].id+'>';
				newHTML += `<img src="${posterUrl}">`;
			newHTML += `</div>`;
			
			}
			return newHTML;
	}

});







