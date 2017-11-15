var renderer = (function() {
  
  function displaySearchResult(data){
  $('.result-head').html(`<h1>Results for '${user_input.toUpperCase()}' - Total results: ${data.pageInfo.totalResults}</h1>`);
  
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

  function renderResult(result, index){
  return `
  <div>
    <p>${result.snippet.title}</p>
    <img id='img-${index}' src='${result.snippet.thumbnails.default.url}' tabindex='0' aria-label='${result.snippet.title}'>
    
    <iframe type="text/html"
  src="https://www.youtube.com/embed/${result.id.videoId}?iv_load_policy=3&showinfo=0&rel=0"
  frameborder="0" class='hide-it ytplayer'></iframe>
  
    <button class='more-btn' value='${result.snippet.channelId}' aria-hidden='true'>More from uploader</button>
  </div>
  `;
}

/*** Rendering ***/
function addNext(){
  return `
    <button class='btn next-btn'>Next</button>
  `;
}
function addPrev(){
  return `
    <button class='btn prev-btn'>Prev</button>
  `;
}
function addPlayNext(){
  return `
    <button class='btn nextPlay-btn'>Next</button>
  `;
}
function addPlayPrev(){
  return `
    <button class='btn prevPlay-btn'>Prev</button>
  `;
}
  
  
  return {
    alertMessage: function() {
      alert("This is working!");
    },
    displaySearchResult: displaySearchResult,
    renderResult: renderResult,
    addNext: addNext,
    addPrev: addPrev,
    addPlayNext: addPlayNext,
    addPlayPrev: addPlayPrev
  }
}());
  
  
