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
let main_videoId = '';
let player_state;

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
	player_state = event.data;
	console.log('state = '+player_state);
	return;
}

function onPlayerReady(event){
	
	console.log('onPlayerReady !');
	//console.log(event);
	
	//event.target.playVideo();
	$('.result-div').on('click', 'img', event => {
		main_videoId = $(event.target).attr('videoId');
		player.loadVideoById(main_videoId);
		getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
	});
		
	$('.video-related').on('click', 'img', event => {
		//open video on video-section iframe-div
		main_videoId = $(event.target).attr('videoId');
		player.loadVideoById(main_videoId);
		getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
	});
	
	$('.nav-div').on('click', '#play-button', event => {
		if(player_state == 2){	//playing
  		player.playVideo();
  	} else if(player_state == 1){
  		player.pauseVideo();
  	}
	});
									/** M O U S E  T R A P **/
	//Play & pause
	Mousetrap.bind('w', function(){
  	if(player_state == 2){	//playing
  		player.playVideo();
  	} else if(player_state == 1){
  		player.pauseVideo();
  	}
	});
	//Fullscreen
	Mousetrap.bind('f', function(){
  	let elem = $('#video')[0];
  	if(elem.webkitRequestFullscreen){
  		elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  	}
  	if(document.webkitExitFullscreen){
  		document.webkitExitFullscreen();
  	}
  	return;
	});
	Mousetrap.bind('e', function(){
		player.seekTo(player.getCurrentTime()+5, true);
	});
	Mousetrap.bind('q', function(){
		player.seekTo(player.getCurrentTime()-5, true);
	});
	Mousetrap.bind('r', function(){
		player.seekTo(0, true);
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

let sub_query_token = '';
let sub_next_token = '';
let sub_prev_token = '';

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
		relatedToVideoId: videoId,
		pageToken: sub_query_token
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
		/** Primary search **/
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

		/** Related search **/
$('.video-related').on('click', '.next-btn', event => {
  sub_query_token = sub_next_token;
  getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
  sub_next_token = '';
});
$('.video-related').on('click', '.prev-btn', event => {
  sub_query_token = sub_prev_token;
  getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
  sub_prev_token = '';
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











