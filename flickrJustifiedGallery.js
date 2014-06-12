/*
 * Flickr Justified Gallery - v0.0.1
 * http://github.com/kladd/flickr-justified-gallery/
 *
 * flickrJustifiedGallery.js
 */
(function($) {
    $.fn.flickrJustifiedGallery = function (arg) {
        var defaults = {
            flickrApiKey: "",
            flickrUserID: "",
            flickrGroupID: "",
            flickrApiMethod: "flickr.groups.pools.getPhotos",
            // flickrApiMethod: "flickr.people.getPublicPhotos",
            flickrApiUrl: "https://api.flickr.com/services/rest/?jsoncallback=?",
            flickrPerPage: "15",
            justifiedGallerySettings: undefined
        };

        function checkSettings(settings) {
            if (settings.flickrApiKey == "")
                throw 'flickrApiKey must be defined';

            if (settings.flickrUserID == "")
                throw 'flickrUserID must be defined';
        }

        return this.each(function (index, gallery) {
            var settings = $.extend({}, defaults, arg);
            var $gallery = $(gallery);

            checkSettings(settings);

            var flickrData = {
                method: settings.flickrApiMethod,
                api_key: settings.flickrApiKey,
                user_id: settings.flickrUserID,
                group_id: settings.flickrGroupID,
                per_page: settings.flickrPerPage,
                format: "json"
            };

            var flickrRequest = $.getJSON(
                    settings.flickrApiUrl,
                    flickrData);

            flickrRequest.done(function(response) {
                for (var i = 0; i < settings.flickrPerPage; i++) {
                    var photo = response.photos.photo[i];
                    var baseUrl = "http://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret;
                    var title = (photo.title == "") ? "Untitled" : photo.title;
                    var html = '<a href="'+baseUrl+'_b.jpg"><img alt="' + title + '" src="'+baseUrl+'_b.jpg" /></a>';
                    $gallery.append(html);
                }
                $gallery.justifiedGallery(settings.justifiedGallerySettings);
            });

            flickrRequest.fail(function(jqXhr, textStatus) {
                throw "flickrApiRequest: " + textStatus;
            });
        });
    }
}(jQuery));
