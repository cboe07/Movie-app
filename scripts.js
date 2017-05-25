// Wait until the DOM is loaded...
$(document).ready(function(){
	// console.log("Sanity Check");
	// All API calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images go to this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey
	// console.log(nowPlayingUrl);

	var buttonsHTML = '';
	buttonsHTML += '<button id="all-genres" class="genre-buttons">All Movies</button>';
	for(let i=0; i<genreArray.length; i++){
		buttonsHTML += `<button class="genre-buttons">${genreArray[i].name}</button>`;
	}
	$('#genre-buttons').html(buttonsHTML);

	// Make AJAX request to the nowPlayingUrl
	console.log(nowPlayingUrl);
	$.getJSON(nowPlayingUrl,function(nowPlayingData){
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);
		getModal();
		// $('.movie-poster').click(function(){
			// Change the HTML inside the modal
			// var thisMovieId = $(this).attr('movie-id');
			// console.log(thisMovieId);
			// var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			// $.getJSON(thisMovieUrl,function(thisMovieData){
				// console.log(thisMovieData);
				// console.log(thisMovieData.genres[0].name)
				// var genreList = [];
				// for(let i =0; i<3;i++){
				// 	genreList.push(thisMovieData.genres[i].name);
				// }
				// genre = genreList.join(', ');
				
				// Open the modal
				// $('#myModalLabel').html(thisMovieData.title);
				// $('.modal-body').html('<h3>Overview</h3>' + thisMovieData.overview);
				// var thisMovieUrl2 = `${apiBaseUrl}/movie/${thisMovieId}/credits?api_key=${apiKey}`
				// $.getJSON(thisMovieUrl2,function(thisMovieData2){
				// 	var thisMovieId = $(this).attr('movie-id');
				// 	console.log(thisMovieData2)
				// 	var castList = [];
				// 	for(let i =0; i<4;i++){
				// 		// console.log(thisMovieData.cast[i].name)
				// 		castList.push(thisMovieData2.cast[i].name);
				// 	}
				// 	cast = castList.join(', ');
				// 	$('.modal-body').html('<em>' + '\"'+thisMovieData.tagline+'\"' + '</em>'+ '<h4>Overview</h4>' + thisMovieData.overview +'<h4>Cast</h4>' + cast + '<h4>Genres</h4>' + genre);
				// 	$('.modal-footer').html(thisMovieData.runtime + ' minutes');
				// 	$('#myModal').modal();
				// })
				
				
			// })
			
		// });
		$grid = $('#movie-grid').isotope({
			itemSelector: '.movie-poster'
		});

		$('.genre-buttons').click(function(){
			//console.dir(this.innerText);
			$grid.isotope({filter: '.'+this.innerText})
		})
		
		$('#all-genres').click(function(){
			$grid.isotope({ filter: ''});
		});

		$grid.imagesLoaded().progress(function(){
			$grid.isotope('layout');
		});

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
		for(let i = 0; i<data.results.length; i++){

			// Set up a var for the genre ids for THIS movie
			var thisMovieGenres = data.results[i].genre_ids
			var movieGenreClassList = " ";

			// Loop through all known genres
			for(let j = 0; j<genreArray.length; j++){
				// The genre we are on (genreArray[j]), check to see if THIS movie 
				if(thisMovieGenres.indexOf(genreArray[j].id) > -1){
					// HIT! This genre_id is in THIS movie's genre_id list
					// So we need to add the name tot he class list
					movieGenreClassList += genreArray[j].name + " ";
				}
				// console.log(genreArray[j].id);
			}
			// console.log(movieGenreClassList);
			var posterUrl = imageBaseUrl + 'w300' + data.results[i].poster_path;
			newHTML += '<div class="col-md-2 movie-poster '+movieGenreClassList+'" movie-id='+data.results[i].id+'>';
				newHTML += `<img src="${posterUrl}">`;
			newHTML += `</div>`;
			
		}
		return newHTML;
	}

	function getModal(info){
		var modalHTML = '';
		$('.movie-poster').click(function(){
			// Change the HTML insite the modal
			var thisMovieId = $(this).attr('movie-id'); // get movie-id attribute and set it to thisMovieId
			// console.log(thisMovieId);
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				// console.log(thisMovieData);
				$('#myModalLabel').html(thisMovieData.title);
				var thisMovieUrl2 = `${apiBaseUrl}/movie/${thisMovieId}/credits?api_key=${apiKey}`
				$.getJSON(thisMovieUrl2,function(thisMovieData2){
					var thisMovieId = $(this).attr('movie-id');
					console.log(thisMovieData2)
					var castList = [];
					for(let i =0; i<4;i++){
						// console.log(thisMovieData.cast[i].name)
						castList.push(thisMovieData2.cast[i].name);
					}

					cast = castList.join(', ');
					var newHTML = '';
					newHTML += '<div class="modal-info">';
						newHTML += '<em>' + '\"' + thisMovieData.tagline + '\"' + '</em>';
					newHTML += '</div>';
					newHTML += '<br/>'
					newHTML += '<div class="modal-info">';
						newHTML += "<strong>Overview:</strong><br />" + thisMovieData.overview;
					newHTML += '</div>';
					newHTML += '<br/>'
					newHTML += '<div class="modal-info">';
						newHTML += "<strong>Cast:</strong><br />";
						newHTML += '<div>'+castList[0]+'</div>';
						newHTML += '<div>'+castList[1]+'</div>';
						newHTML += '<div>'+castList[2]+'</div>';
						newHTML += '<div>'+castList[3]+'</div>';
					newHTML += '</div>';
					newHTML += '<br/>'
					newHTML += '<div class="modal-info">';
						newHTML += "<strong>Release Date:</strong><br />" + thisMovieData.release_date;
					newHTML += '</div>';
					newHTML += '<br/>'
					newHTML += '<div class="modal-info">';
						newHTML += "<strong>Runtime:</strong><br />" + thisMovieData.runtime + " minutes";
					newHTML += '</div>';
					newHTML += '<br/>'
					newHTML += '<div class="modal-info">';
						newHTML += "<a href='" + thisMovieData.homepage + "' target='_blank'>" + thisMovieData.homepage + "</a>";
					newHTML += '</div>';
					$('.modal-body').html(newHTML);
					// Open the modal
					$('#myModal').modal();
				})
			})
		})
	}

});







