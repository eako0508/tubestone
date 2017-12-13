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
	  
	  $('.result-div').append(`
	  	<div class='button-container s-btn-container'></div>
	  `);
	  
	  //Display next & prev button
	  if(typeof data.prevPageToken !== 'undefined'){
	    $('.s-btn-container ').append(addPrev);
	    prev_token = data.prevPageToken;
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.s-btn-container').append(addNext);
	    next_token = data.nextPageToken;
	  }
	  /*
	  //Display next & prev button
	  if(typeof data.prevPageToken !== 'undefined'){
	    $('.result-div').append(addPrev);
	    prev_token = data.prevPageToken;
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.result-div').append(addNext);
	    next_token = data.nextPageToken;
	  }
	  */
	  
	}

	function displayRelatedVideoList(data){
		
		const result = data.items.map((item, index) => renderList(item, index));
		$('.video-related').html(result);
		/*
		sub_query_toekn = data.nextPageToken;
		console.log(sub_query_toekn);
		*/
		
	  $('.video-related').append(`
	  	<div class='button-container rel-btn-container'></div>
	  `);
	  if(typeof data.prevPageToken !== 'undefined'){
	    $('.rel-btn-container').append(addPrev);
	    sub_prev_token = data.prevPageToken;
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.rel-btn-container').append(addNext);
	    sub_next_token = data.nextPageToken;
	  }
	  /*
		if(typeof data.prevPageToken !== 'undefined'){
	    $('.video-related').append(addPrev);
	    sub_prev_token = data.prevPageToken;
	  }
	  if(typeof data.nextPageToken !== 'undefined'){
	    $('.video-related').append(addNext);
	    sub_next_token = data.nextPageToken;
	  }
		*/
		return;
	}

	//displays each search results
	function renderResult(result, index){
		let temp_title;
		if(result.snippet.title.length > 70){
			temp_title = result.snippet.title.substring(0,65).trim() + '...';
		} else {
			temp_title = result.snippet.title;
		}
		
		
		//<p id='p-${result.id.videoId}'>${temp_title}</p>
		return `
			<div class='search-result'>
			<img class='result-img' id='img-${index}' src='${result.snippet.thumbnails.medium.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}'>
			<p id='p-${result.id.videoId}' class='result-p'>${temp_title}</p>
			
			</div>
		`;
	}
	function renderList(result, index){
		//console.log(result.snippet.title.length);
		return `
			<div class='search-result'>
			<img class='result-img' id='img-${index}' src='${result.snippet.thumbnails.medium.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}'>
			<p id='p-${result.id.videoId}' class='result-p'>${result.snippet.title}</p>
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