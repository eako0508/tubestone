/**
 * 
 * add feature to remove obstructinos, such as controls or annotation, from video.
 * add buttons for play, pause, next
 * add keyboard shortcuts for easier access
 * 
 
 * mousetrap
 https://craig.is/killing/mice
 
 * add keyboard shortcut
 https://www.hongkiat.com/blog/keyboard-shortcuts-website/
 
 * add play/pause for youtube api
 https://css-tricks.com/play-button-youtube-and-vimeo-api/
 
 * thumbnail for youtube
 https://developers.google.com/youtube/v3/docs/thumbnails
  
*/


//Youtube jsapi 

var player;

function onYouTubePlayerAPIReady() {
	console.log('onYouTubePlayerAPIReady');
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady,
      'onStateChange': onStateChange
    }
  });
}
	
function onStateChange(event){
	console.log('onStateChange');
	//console.log(event);
	return;
}

function onPlayerReady(event){
	
	console.log('onPlayerReady !');
	//console.log(event);
	
	//event.target.playVideo();
	$('#test1').click(function(){
		player.loadVideoById('LSY8P6XdyIU');
	});
	
	$('.result-div').on('click', 'img', event => {
		//open video on video-section iframe-div
		let videoId = $(event.target).attr('videoId');
		//TODO 
		//inject videoId somehow
		player.loadVideoById(videoId);
		//renderer.displayVideoPage(videoId);	removed
		getRelatedVideoList(videoId, renderer.displayRelatedVideoList);
	});
	
	
	
	$('.nav-div').on('click', '#play-button', event => {
		player.playVideo();
	});
	$('.nav-div').on('click', '#pause-button', event => {
		player.pauseVideo();
	});
}
/*
playerVars: {
	'enablejsapi': 1,
	'iv_load_policy': 0,
	'showinfo': 0
}
*/

/** Global variables **/
let user_input = '';
let next_token = '';
let prev_token = '';
let query_token = '';
let playlist_input = '';
let apikey = 'AIzaSyCT2DvM71hl86EH50zbLazdwD5PPsbYZzo';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const YOUTUBE_CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';
const YOUTUBE_PLAYLISTS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3';

/** Query builder **/
function getDataFromApi(callback){
  const query = {
    part: 'snippet',
    key: apikey,
    type: 'video',
    q: user_input,
    pageToken: query_token
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  pageToken = '';
}

function getPlayListItems(input_id, callback){
  const query = {
    part: 'contentDetails',
    key: apikey,
    id: `${input_id}` //channelId
  };
  $.getJSON(YOUTUBE_CHANNELS_URL, query, callback); //gets playlistId
}
function getVideos(curr_val, callback){
  const query = {
    part: 'snippet',
    key: apikey,
    playlistId: `${curr_val}`, //playlistid
    pageToken: query_token
  };
  $.getJSON(YOUTUBE_PLAYLISTS_URL, query, callback); //gets videoId
}
function getPlaylistID(data){
  let _playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
  getVideos(_playlistId, displayPlaylists);
}





function getRelatedVideoList(videoId, callback){
	const query = {
		part: 'snippet',
		key: apikey,
		type: 'video',
		relatedToVideoId: videoId
	}
	$.getJSON(YOUTUBE_SEARCH_URL, query, callback);
	return;
}


/** Event listener **/
function watchSubmit(){
  // Confirm that separate object work
  $('.search-form').submit(event=>{
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.text-input');
    user_input = queryTarget.val();
    //queryTarget.val("");
    getDataFromApi(renderer.displaySearchResult);
  });
}
$('.result-div').on('click', '.next-btn', event => {
  query_token = next_token;
  getDataFromApi(renderer.displaySearchResult);
  next_token = '';
});
$('.result-div').on('click', '.prev-btn', event => {
  query_token = prev_token;
  getDataFromApi(renderer.displaySearchResult);
  prev_token = '';
});
$('.result-div').on('click', '.nextPlay-btn', event => {
  query_token = next_token;
  getPlayListItems(playlist_input, getPlaylistID);
  next_token = '';
});
$('.result-div').on('click', '.prevPlay-btn', event => {
  query_token = prev_token;
  getPlayListItems(playlist_input, getPlaylistID);
  next_token = '';
});
$('.result-div').on('click', '.more-btn', event => {
  const curr_val = $(event.currentTarget).attr('value');
  playlist_input = curr_val;
  getPlayListItems(playlist_input, getPlaylistID);
});

Mousetrap.bind('a b', function(){
  $('.show-key').val('*');
});





/*
$('.result-div').on('click', 'img', event => {
  $(event.currentTarget).addClass('hide-it');
  $(event.currentTarget).parent('div').find('iframe').removeClass('hide-it');
});
*/



$(".result-div").on('keypress', 'img[id^="img"]', event => {
  console.log(event);
  if(event.which === 13){
    $(event.currentTarget).addClass('hide-it');
    $(event.currentTarget).parent('div').find('iframe').removeClass('hide-it');  
  }
});








$(watchSubmit);



	    var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);











