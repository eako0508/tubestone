var renderer = (function() {

	//Controllers
	//MAIN
	//displays search results, including next and previous 
  function displaySearchResult(data){
		//displays search keyword
	  //$('.result-head').html(`<h1>Results for '${user_input.toUpperCase()}' - Total results: ${data.pageInfo.totalResults}</h1>`);
	 
		//displays each search items 
	  const results = data.items.map((item, index) => renderResult(item, index));
	  $('.result-div').html(results);
	  
	  //Display next & prev button
	  if(typeof data.prevPageToken !== 'undefined'){
	    $('.result-div').append(addPrev);
	    prev_token = data.prevPageToken;
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.result-div').append(addNext);
	    next_token = data.nextPageToken;
	  }
	}

	function displayRelatedVideoList(data){
		const result = data.items.map((item, index) => renderList(item, index));
		$('.video-related').html(result);
		/*
		sub_query_toekn = data.nextPageToken;
		console.log(sub_query_toekn);
		*/
		if(typeof data.prevPageToken !== 'undefined'){
	    $('.video-related').append(addPrev);
	    sub_prev_token = data.prevPageToken;
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.video-related').append(addNext);
	    sub_next_token = data.nextPageToken;
	  }
		
		return;
	}

	//displays each search results
	function renderResult(result, index){
		return `
			<div class='search-result'>
			<img id='img-${index}' src='${result.snippet.thumbnails.default.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}'>
			<p>${result.snippet.title}</p>
			</div>
		`;
	}
	function renderList(result, index){
		return `
			<img id='img-${index}' src='${result.snippet.thumbnails.default.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}'>
			<p>${result.snippet.title}</p>
		`;
	}

/*** Rendering ***/
	function addNext(){
	  return `
	    <button class='btn next-btn search-btn'>Next</button>
	  `;
	}
	function addPrev(){
	  return `
	    <button class='btn prev-btn search-btn'>Prev</button>
	  `;
	}
	function addPlayNext(){
	  return `
	    <button class='btn nextPlay-btn search-btn'>Next</button>
	  `;
	}
	function addPlayPrev(){
	  return `
	    <button class='btn prevPlay-btn search-btn'>Prev</button>
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
  
  
	  /* iframe snippet 
	    <iframe type="text/html"
	  src="https://www.youtube.com/embed/${result.id.videoId}?iv_load_policy=3&showinfo=0&rel=0"
	  frameborder="0" class='hide-it ytplayer'></iframe>
	  
	    <button class='more-btn' value='${result.snippet.channelId}' aria-hidden='true'>More from uploader</button>
*/
