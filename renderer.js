var renderer = (function() {

/*
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady
    }
  });
}
*/
	//MAIN
	//displays search results, including next and previous 
  function displaySearchResult(data){
		//displays search keyword
	  $('.result-head').html(`<h1>Results for '${user_input.toUpperCase()}' - Total results: ${data.pageInfo.totalResults}</h1>`);
	 
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

	//displays each search results
	function renderResult(result, index){
		return `
			<div class='search-result'>
			<img id='img-${index}' src='${result.snippet.thumbnails.default.url}' tabindex='0' aria-label='${result.snippet.title}' videoId='${result.id.videoId}'>
			<p>${result.snippet.title}</p>
			</div>
		`;
	}


	function displayVideoPage(videoid){
		displayVideo(videoid);
		return;
	}

	function displayVideo(videoid){
		$('.iframe-div').html(`
	    <iframe type="text/html" src="https://www.youtube.com/embed/${videoid}?enablejsapi=1?iv_load_policy=3&showinfo=0&rel=0" frameborder="0" class='ytplayer'></iframe>`);
	}

	function displayRelatedVideoList(videoid){

		return;
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
	displayVideoPage: displayVideoPage
  }
}());
  
  
	  /* iframe snippet 
	    <iframe type="text/html"
	  src="https://www.youtube.com/embed/${result.id.videoId}?iv_load_policy=3&showinfo=0&rel=0"
	  frameborder="0" class='hide-it ytplayer'></iframe>
	  
	    <button class='more-btn' value='${result.snippet.channelId}' aria-hidden='true'>More from uploader</button>
*/
