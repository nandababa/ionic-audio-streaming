angular.module('starter.services', [])
.factory('streamService', function($http, $q){

    var streamUrl = 'http://icecast.24hourkirtan.fm:8000/128k.mp3';
    var metadataUrl = 'http://icecast.24hourkirtan.fm:8000/status-json.xsl';
    var contentRegex = /<body>(.*)<\/body>/;
    var itunesSearchUrl = 'https://itunes.apple.com/search?term=';
    var resolutionRegex = /100x100/;

    var service = {
      getStreamInfo: getStreamInfo
    };
    return service;
    // ***************************************************************************
    function getStreamInfo() {
      return $http.get(metadataUrl).then(function(response) {
        console.log(response);
        return response.data.icestats.source[0];
      });
    }

    function getCover(title) {
      return $http.get(itunesSearchUrl + title).then(function(response) {
        var item = response.data.results[0];
        if (!item || !item.artworkUrl100) {
          return null;
        }
        return item.artworkUrl100.replace(resolutionRegex, '500x500');
      });
    }

    function parseShoutcastResponse(html) {
      var content = html.match(contentRegex)[1];
      var parts = content.split(',');
      if (parts.length < 7 || !parts[6]) {
        return null;
      }
      return parts[6];
    }
});
