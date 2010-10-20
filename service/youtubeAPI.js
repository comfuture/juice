__TOP__.namespace('service');

(function($) {

	/**
	 * Javascript youtube search function
	 * 
	 * @param {String} source
	 * @param {Object} context
	 */
	__TOP__.service.youtubeAPI = function(options) {
		var _this = this;

		//option setting
		this.varname = options.varname;
		this.movieElementID = options.movieElementID;
		this.searchBtnID = options.searchBtnID;
		this.preBtnID = options.preBtnID;
		this.nextBtnID = options.nextBtnID;
		this.moviesetBtnID = options.moviesetBtnID;

		this.MAX_RESULTS_LIST = 12;
		this.VIDEO_LIST_CSS_CLASS = 'videolist';
		this.PREVIOUS_PAGE_BUTTON = 'previousPageButton';
		this.NEXT_PAGE_BUTTON = 'nextPageButton';
		this.STANDARD_FEED_URL_TOP_RATED = 'http://gdata.youtube.com/feeds/api/standardfeeds/top_rated?';
		this.STANDARD_FEED_URL_MOST_VIEWED = 'http://gdata.youtube.com/feeds/api/standardfeeds/most_viewed?';
		this.STANDARD_FEED_URL_MOST_POPULAR = 'http://gdata.youtube.com/feeds/api/standardfeeds/recently_featured?';
		this.STANDARD_FEED_URL_RECENTLY_FEATURED = 'http://gdata.youtube.com/feeds/api/videos?';
		this.VIDEO_FEED_URL = 'http://gdata.youtube.com/feeds/api/videos?';

		this.QUERY_URL_MAP = {
			'top_rated' : this.STANDARD_FEED_URL_TOP_RATED,
			'most_viewed' : this.STANDARD_FEED_URL_MOST_VIEWED,
			'most_popular' : this.STANDARD_FEED_URL_MOST_POPULAR,
			'recently_featured' : this.STANDARD_FEED_URL_RECENTLY_FEATURED,
			'search' : this.VIDEO_FEED_URL
		};

		this.nextPage = 2;
		this.previousPage = 0;
		this.previoussearch_tb = '';
		this.previousQueryType = 'search';
		this.jsonFeed_ = null;

		this.ytplayer = document.getElementById("ytPlayer");

		this.appendScriptTag = function(scriptSrc, scriptId, scriptCallback) {
			var oldScriptTag = $('#' + scriptId);

			if (oldScriptTag) oldScriptTag.remove();

			var script = $('<script type="text/javascript"></script>')
							.attr('id', scriptId)
							.attr('src', scriptSrc + '&v=2&alt=jsonc&callback=' + scriptCallback);

			$('head')[0].appendChild(script[0]);
		};

		this.listVideos = function(queryType, search_tb, page) {

			this.previoussearch_tb = search_tb; 
			this.previousQueryType = queryType; 

			var queryUrl = this.QUERY_URL_MAP[queryType];

			if (queryUrl) {
				queryUrl += 'max-results=' + this.MAX_RESULTS_LIST + '&format=5&start-index=' + (((page - 1) * this.MAX_RESULTS_LIST) + 1);

				if (search_tb != '') queryUrl += '&q=' + encodeURI(search_tb);

				this.appendScriptTag(queryUrl, 'searchResultsVideoListScript', this.varname + '.listVideosCallback');
				this.updateNavigation(page);
			} else {
				alert('Unknown feed type specified');
			}
		};

		this.listVideosCallback = function(jsonc) {
			this.jsonFeed_ = jsonc.data;

			var div = document.getElementById(this.VIDEO_LIST_CSS_CLASS);
			console.log(jsonc.data.totalItems);
			var total = number_format(jsonc.data.totalItems);
			var ite = eval(jsonc.data.itemsPerPage);
			var start =  eval(jsonc.data.startIndex);
			var end = eval( start + ite - 1);

			var html = '<span>Results '+start+' - '+end+' of '+total+'</span>';

			document.getElementById('videosinfo').innerHTML = html;

			$('#videos').remove();

			var items = jsonc.data.items || [];
			var html = ['<ul id="videos" class="videos">'];

			for (var i = 0; i < items.length; i++) {
				var title = jsonc.data.items[i].title;
				var uploader = jsonc.data.items[i].uploader;
				var uploaded = jsonc.data.items[i].uploaded;
				var duration = jsonc.data.items[i].duration;
				var viewCount = jsonc.data.items[i].viewCount;
				var thumbnailUrl = jsonc.data.items[i].thumbnail.sqDefault;
				var vid = jsonc.data.items[i].id;

				html.push('<li><a href="javascript:' + this.varname + '.setMovieData(\''+vid+'\', \'' + title + '\', \'' + uploader + '\', \'' + uploaded + '\', \'' + duration + '\', \'' + viewCount + '\');">');
				html.push('<img src="',thumbnailUrl,'" width="100" height="70"></a>');
				html.push('<br/>', title.substr(0,45), '</li>');
			}

			html.push('</ul><br style="clear: left;"/>');

			document.getElementById(this.VIDEO_LIST_CSS_CLASS).innerHTML = html.join('');
		};

		this.updateNavigation = function(page) {

			this.nextPage = page + 1;
			this.previousPage = page - 1;

			document.getElementById(this.NEXT_PAGE_BUTTON).style.display = 'inline';
			document.getElementById(this.PREVIOUS_PAGE_BUTTON).style.display = 'inline';

			if (this.previousPage < 1) {
				document.getElementById(this.PREVIOUS_PAGE_BUTTON).disabled = true;
			} else {
				document.getElementById(this.PREVIOUS_PAGE_BUTTON).disabled = false;
			}

			document.getElementById(this.NEXT_PAGE_BUTTON).disabled = false;
		};

		this.setMovieData = function(vid, title, uploader, uploaded, duration, viewCount){
			this.ytplayer.loadVideoById(vid);

			document.getElementById('data_title').innerHTML = title;
			document.getElementById('data_uploader').innerHTML = uploader;
			document.getElementById('data_uploaded').innerHTML = uploaded;
			document.getElementById('data_duration').innerHTML = duration;		
			document.getElementById('data_viewCount').innerHTML = viewCount;
			document.getElementById('youtube_movieID').value = vid;
		};

		this.setMovieTag = function(){
			var videoID = document.getElementById('youtube_movieID').value;
			
			var movieHtml = '<object type="application/x-shockwave-flash" id="ytPlayer" data="http://www.youtube.com/v/' + videoID + '?&amp;enablejsapi=1&amp;playerapiid=ytplayer" width="640px" height="385px"><param name="allowScriptAccess" value="always"><param name="movie" value="http://www.youtube.com/v/' + videoID + '?&amp;enablejsapi=1&amp;playerapiid=ytplayer"/></object>';
			
			document.getElementById(this.movieElementID).innerHTML = movieHtml;
		};

		this.init = function(){
			//youtube search button
			$('#' + _this.searchBtnID).click(function(e){
				_this.listVideos('search', document.getElementById('search_tb').value, 1);
				return false;
			});

			//previous button
			$('#' + _this.preBtnID).click(function(e){
				_this.listVideos(_this.previousQueryType, _this.previoussearch_tb, _this.previousPage);
			});

			//next button
			$('#' + _this.nextBtnID).click(function(e){
				_this.listVideos(_this.previousQueryType, _this.previoussearch_tb, _this.nextPage);
			});

			$('#' + _this.moviesetBtnID).click(function(e){
				_this.setMovieTag();
			});
		};

		this.init();
	};
})(jQuery);

function number_format(numstr) {
	var numstr = String(numstr);
	var re0 = /(\d+)(\d{3})($|\..*)/;

	if (re0.test(numstr))
		return numstr.replace(re0, function(str,p1,p2,p3) { return number_format(p1) + "," + p2 + p3; });
	else
		return numstr;
}
