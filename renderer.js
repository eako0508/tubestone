var renderer = (function() {

	//Controllers
	//MAIN
	//displays search results, including next and previous 
  function displaySearchResult(data){
		//displays each search items 
	  const results = data.items.map((item, index) => renderResult(item, index));
	  $('.result-div').html(results);
	  
	  $('.result-div').append(`
	  	<div class='button-container s-btn-container'></div>
	  `);
	  
	  //Display next & prev button
	  /*
	  if(typeof data.prevPageToken !== 'undefined'){
	    $('.s-btn-container ').append(addPrev);
	    prev_token = data.prevPageToken;
	  } else if(typeof data.prevPageToken === 'undefined'){
	  	$('.rel-btn-container').append(addPrev);
	  	$('.prev-btn').addClass('invisibility');
	  	console.log('triggered!');
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.s-btn-container').append(addNext);
	    next_token = data.nextPageToken;
	  }
	  */
	  $('.s-btn-container ').append(addPrev);
	  $('.s-btn-container').append(addNext);
	  if(typeof data.prevPageToken !== 'undefined'){
	  	prev_token = data.prevPageToken;
	  } else {
	  	$('.prev-btn').addClass('invisibility');
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	  	next_token = data.nextPageToken;
	  } else {
	  	$('.next-btn').addClass('invisibility');
	  }
	}

	function displayRelatedVideoList(data){
		
		const result = data.items.map((item, index) => renderList(item, index));
		$('.video-related').html(result);
	  $('.video-related').append(`
	  	<div class='button-container rel-btn-container'></div>
	  `);
	  /*
	  if(typeof data.prevPageToken !== 'undefined'){
	    $('.rel-btn-container').append(addPrev);
	    sub_prev_token = data.prevPageToken;
	  } else if(typeof data.prevPageToken === 'undefined'){
	  	$('.rel-btn-container').append(addPrev).addClass('invisibility');
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.rel-btn-container').append(addNext);
	    sub_next_token = data.nextPageToken;
	  }
	  */
	  $('.rel-btn-container ').append(addPrev);
	  $('.rel-btn-container').append(addNext);
	  if(typeof data.prevPageToken !== 'undefined'){
	  	sub_prev_token = data.prevPageToken;
	  } else {
	  	$('.prev-btn').addClass('invisibility');
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	  	sub_next_token = data.nextPageToken;
	  } else {
	  	$('.next-btn').addClass('invisibility');
	  }
	  
		return;
	}

	//displays each search results
	function renderResult(result, index){
		let temp_title;
		if(result.snippet.title.length > 50){
			temp_title = result.snippet.title.substring(0,50).trim() + '...';
		} else {
			temp_title = result.snippet.title;
		}
		return `
			<div class='search-result'>
			<img class='result-img' id='img-s-${index}-${result.id.videoId}' src='${result.snippet.thumbnails.medium.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}' title='${result.snippet.title}'>
			<p id='ps-${result.id.videoId}' class='result-p'>${temp_title}</p>
			
			</div>
		`;
	}
	function renderList(result, index){
		let temp_title;
		if(result.snippet.title.length > 50){
			temp_title = result.snippet.title.substring(0,50).trim() + '...';
		} else {
			temp_title = result.snippet.title;
		}
		return `
			<div class='search-result'>
			<img class='result-img' id='img-r-${index}-${result.id.videoId}' src='${result.snippet.thumbnails.medium.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}'>
			<p id='pr-${result.id.videoId}' class='result-p'>${temp_title}</p>
			</div>
		`;
	}

/*** Rendering ***/
	function addNext(){
	  return `
	    <button class='btn page-btn next-btn'>Next</button>
	  `;
	}
	function addPrev(){
	  return `
	    <button class='btn page-btn prev-btn'>Prev</button>
	  `;
	}
	function addPlayNext(){
	  return `
	    <button class='btn page-btn nextPlay-btn'>Next</button>
	  `;
	}
	function addPlayPrev(){
	  return `
	    <button class='btn page-btn prevPlay-btn'>Prev</button>
	  `;
	}

  return {
    displaySearchResult: displaySearchResult,
    renderResult: renderResult,
    addNext: addNext,
    addPrev: addPrev,
    addPlayNext: addPlayNext,
    addPlayPrev: addPlayPrev,
		
		displayRelatedVideoList: displayRelatedVideoList
  }
}());