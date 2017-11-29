/**
 		** Objectives **
 * add feature to remove obstructinos, such as controls or annotation, from video (done)
 * add buttons for play, pause, next (in progress)
 		- play/pause key added
 * add keyboard shortcuts for easier access (in progress)
 		- w: play/pause video
 		- q: 5 seconds before
 		- e: 5 seconds ahead
 		- f: full screen 
 * add percentage skip with 1234 on keyboard (done)
 		- 1 2 3 4 5 keys that skips 1/6
 * disable youtube iframe for keyboard shortcut 
 		because above keys doens't work after clicking youtube video.
 * show/hide
 
 
 		** Related Resources **
 		
 * mousetrap
 https://craig.is/killing/mice
 
 * add keyboard shortcut
 https://www.hongkiat.com/blog/keyboard-shortcuts-website/
 
 * add play/pause for youtube api
 https://css-tricks.com/play-button-youtube-and-vimeo-api/
 
 * thumbnail for youtube
 https://developers.google.com/youtube/v3/docs/thumbnails
  
*/


									/** I F R A M E  P L A Y E R **/

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
		
		
    $('html, body').animate({ scrollTop: $('.iframe-div').offset().top - 20});
		
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
			//key: w
	
	Mousetrap.bind('w', function(){
  	if(player_state == 2){	//playing
  		player.playVideo();
  	} else if(player_state == 1){ //paused
  		player.pauseVideo();
  	}
	});
	/*
	document.addEventListener('keydown', function(e){
		switch(e.keyCode){
			case 87:	//ascii for 'W'
				e.preventDefault();
				if(player_state == 2){	//playing
		  		player.playVideo();
		  	} else if(player_state == 1){	//paused
		  		player.pauseVideo();
		  	}
		  	break;
		}
	}, false);
	*/
			//Fullscreen 
			//key: f
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
			//Skip 5 seconds 
			//key: e, q
	Mousetrap.bind('e', function(){
		player.seekTo(player.getCurrentTime()+5, true);
	});
	Mousetrap.bind('q', function(){
		player.seekTo(player.getCurrentTime()-5, true);
	});
			//Skip percentage with 
			//key: 1 2 3 4 5
	Mousetrap.bind('1', function(){
		player.seekTo(player.getDuration()/6, true);
	});
	Mousetrap.bind('2', function(){
		player.seekTo(player.getDuration()/6*2, true);
	});
	Mousetrap.bind('3', function(){
		player.seekTo(player.getDuration()/6*3, true);
	});
	Mousetrap.bind('4', function(){
		player.seekTo(player.getDuration()/6*4, true);
	});
	Mousetrap.bind('5', function(){
		player.seekTo(player.getDuration()/6*5, true);
	});
			//replay video 
			//key: r
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

									/** GLOBAL VARIABLES **/
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
const YOUTUBE_CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';
const YOUTUBE_PLAYLISTS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

//const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
//const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3';

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
		pageToken: sub_query_token,
		maxResults: 10
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
$('#top').on('click', function(){
	$('html, body').animate({ scrollTop: $('.search-section').offset().top});
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


								/**	Iframe Async API Load sequence	**/
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);











