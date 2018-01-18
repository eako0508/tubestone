
									/** I F R A M E  P L A Y E R **/

var player;
let main_videoId = '';
let player_state;

function onYouTubePlayerAPIReady() {
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
	player_state = event.data;
	return;
}

function toggleHide(){
	if($('.result-div').hasClass('hide')){
		//result-div has hide, meaning related videos are displayed at this moment
		//it must have 'show result video btn' on the page.
		//this function will trigger to display result-div and show view related-btn
  	$('.result-div').removeClass('hide');
  	$('.video-related').addClass('hide');
  } else {
  	
  	//when it's showing search results
  	$('.result-div').addClass('hide');
  	$('.video-related').removeClass('hide');
  }
}

function onPlayerReady(event){
	
	$('.result-div').on('click', 'img', event => {
		main_videoId = $(event.target).attr('videoId');
		const vid_title = $(event.target).attr('title');
		$('#current_title').text(vid_title);
		player.loadVideoById(main_videoId);
		getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
		
		if($('.iframez').hasClass('invisibility')){
			$('.filler1').fadeOut(1000);
			$('.iframez').removeClass('invisibility').hide().fadeIn(1000);
			$('.header-div').removeClass('hide').hide().fadeIn(1000);
		}
	});
	
	$('.video-related').on('click', 'img', event => {
		//open video on video-section iframe-div
		main_videoId = $(event.target).attr('videoId');
		player.loadVideoById(main_videoId);
		getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
		//$('html, body').animate({ scrollTop: 0});
	});
	
	$('.nav-div').on('click', '#play-button', event => {
		if(player_state == 2){	//playing
  		player.playVideo();
  	} else if(player_state == 1){
  		player.pauseVideo();
  	}
	});
	
	$('.nav-div').on('click', '#fullscreen', event => {
		let elem = $('#video')[0];
  	if(elem.webkitRequestFullscreen){
  		elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  	}
  	if(document.webkitExitFullscreen){
  		document.webkitExitFullscreen();
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
	/*
			Skip 5 10 seconds with 1 2 3 4
			key: 
				1: -10 sec
				2: - 5 sec
				3: + 5 sec
				4: +10 sec
	*/
	Mousetrap.bind('1', function(){
		player.seekTo(player.getCurrentTime()-10, true);
	});
	Mousetrap.bind('2', function(){
		player.seekTo(player.getCurrentTime()-5, true);
	});
	Mousetrap.bind('3', function(){
		player.seekTo(player.getCurrentTime()+5, true);
	});
	Mousetrap.bind('4', function(){
		player.seekTo(player.getCurrentTime()+10, true);
	});
	
	Mousetrap.bind('q', function(){
		let curr_vol = player.getVolume();
		player.unMute();
		if(curr_vol > 95){
			player.setVolume(100);
		} else{
			player.setVolume(curr_vol+5);
		}
	});
	
	Mousetrap.bind('a', function(){
		let curr_vol = player.getVolume();
		if(curr_vol < 5){
			player.mute();
		} else{
			player.unMute();
			player.setVolume(curr_vol-5);
		}
	});
		
	Mousetrap.bind('z', function(){
		if(player.isMuted()){
			player.unMute();
		} else{
			player.mute();
		}
	});
	
			//replay video 
			//key: r
	Mousetrap.bind('r', function(){
		player.seekTo(0, true);
	});
	
			//toggle search results
			//key: t
	Mousetrap.bind('t', function(){
		toggleHide();
	});
}


									/** GLOBAL VARIABLES FOR API**/
									

									
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

				/** Query builder **/
function getDataFromApi(callback){
  const query = {
    part: 'snippet',
    key: apikey,
    type: 'video',
    q: user_input,
    pageToken: query_token,
    maxResults: 30
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
		maxResults: 30
	}
	$.getJSON(YOUTUBE_SEARCH_URL, query, callback);
	return;
}




																/** Event listener **/

function watchSubmit(){
	// Confirm that separate object work
  $('.search-form').submit(event=>{
  	event.preventDefault();
  	document.activeElement.blur();
    const queryTarget = $(event.currentTarget).find('.text-input');
    user_input = queryTarget.val();
    getDataFromApi(renderer.displaySearchResult);
    $('.result-div').removeClass('hide');
    let window_width = $(window).width();
    if(window_width<=600){
    	$('.iframez').hide();
    }
    if(!$('.curtain').hasClass('hide')){
    	$('.curtain').addClass('hide');
    }
  }); 
}

$('.toggle-result').on('click', event =>{
	toggleHide();
});

$('video').on('click', event => {
	$('.time-nav-btn').focus();
	
});





		/** Primary search **/
$('.result-div').on('click', '.next-btn', event => {
  query_token = next_token;
  getDataFromApi(renderer.displaySearchResult);
  next_token = '';
  $('html, body').animate({ scrollTop: 0});
});
$('.result-div').on('click', '.prev-btn', event => {
  query_token = prev_token;
  getDataFromApi(renderer.displaySearchResult);
  prev_token = '';
  $('html, body').animate({ scrollTop: 0});
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
$('.top-btn').on('click', function(){
	$('html, body').animate({ scrollTop: 0});
});

		/** Related search **/
$('.video-related').on('click', '.next-btn', event => {
  sub_query_token = sub_next_token;
  getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
  sub_next_token = '';
  $('html, body').animate({ scrollTop: 0});
});
$('.video-related').on('click', '.prev-btn', event => {
  sub_query_token = sub_prev_token;
  getRelatedVideoList(main_videoId, renderer.displayRelatedVideoList);
  sub_prev_token = '';
  $('html, body').animate({ scrollTop: 0});
});

$(".result-div").on('keypress', 'img[id^="img"]', event => {
  if(event.which === 13){
    $(event.currentTarget).addClass('hide-it');
    $(event.currentTarget).parent('div').find('iframe').removeClass('hide-it');  
  }
});
$('.toggle-btn').on('click', event => {
	toggleHide();
});
$('.bottom-btn').on('click', event => {
	let dh = $(document).height();
	$('html, body').animate({ scrollTop: dh});
	console.log('bottom toggled');
})
/*
function triggerInst(){
	var lightbox = lity();
	lightbox('.instruction-list');
	return;
}
$(triggerInst);
*/


								/**	Iframe Async API Load sequence	**/
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


$(window).resize(function(){
	let vh = $('#video').height();
	$('.dummy').height(vh);
});



$(watchSubmit);
