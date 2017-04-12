/**
 * Created by amaia.nazabal on 3/16/17.
 */

var app = app || {};

(function ($) {
    'use strict';

    var MAX_HISTORY = 5;

    app.AddEvent = _.extend({}, Backbone.Events);

    
    if (typeof (Storage) !== 'undefined') {

        var server_modal = $('#serverModal');
        var client_modal = $('#clientModal');

        server_modal.on('hidden.bs.modal', function () {
            var title_selector = $('#key-server');
            var value_selector = $('#value-server');
            var tags_selector = $('#tags-server');

            if (title_selector.val() !== '') {
                var model = {
                    title: title_selector,
                    url: value_selector.val(),
                    tags: tags_selector.val()
                };

                localStorage.setItem('_server_cache', JSON.stringify(model));

                title_selector.val('');
                value_selector.val('');
                tags_selector.val('');

                if (app.DEBUG)
                    console.debug("DEBUG: server cache stored.")
            }
        });

        client_modal.on('hidden.bs.modal', function () {
            var title_selector = $('#key-client');
            var value_selector = $('#value-client');
            var tags_selector = $('#tags-client');

            if (title_selector.val() !== '') {
                var model = {
                    title: title_selector.val(),
                    url: value_selector.val(),
                    tags: tags_selector.val()
                };

                localStorage.setItem('_client_cache', JSON.stringify(model));

                title_selector.val('');
                value_selector.val('');
                tags_selector.val('');

                if (app.DEBUG)
                    console.debug("DEBUG: client cache stored.")
            }
        });


        server_modal.on('show.bs.modal', function () {

            if (localStorage.hasOwnProperty('_server_cache')) {
                var model = JSON.parse(localStorage.getItem('_server_cache'));

                $('#key-server').val(model.title);
                $('#value-server').val(model.url);
                $('#tags-server').val(model.tags);

                localStorage.removeItem('_server_cache');

                if (app.DEBUG)
                    console.debug("DEBUG: server cache restored.")
            }
        });

        client_modal.on('show.bs.modal', function () {

            if (localStorage.hasOwnProperty('_client_cache')) {
                var model = JSON.parse(localStorage.getItem('_client_cache'));

                $('#key-client').val(model.title);
                $('#value-client').val(model.url);
                $('#tags-client').val(model.tags);

                localStorage.removeItem('_client_cache');

                if (app.DEBUG)
                    console.debug("DEBUG: client cache restored.")
            }
        });

        app.ClientCollection.on('add', function (e) {
            if (e.attributes.titre !== '' && typeof e.attributes.title !== 'undefined') {
                localStorage.setItem(e.attributes.title, JSON.stringify(e.attributes));

            }
        }, this);

        app.ClientCollection.on('remove', function (e) {
            localStorage.removeItem(e.attributes.title);

        }, this);

        app.AddEvent.on('client-add', function (model) {
            if (sessionStorage.getItem('user')) {
                var date = new Date();
                var datestring ="<div class='date'>Le <span class='date_date'>"+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "</span>à  <span class='heure'>"+
                    date.getHours() + ":" + date.getMinutes()+"</span>";

                var datehistory = "Le "+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "+
                    date.getHours() + ":" + date.getMinutes()+"";

                sessionStorage.setItem('_cache_last_bookmark_client', JSON.stringify(model));
                sessionStorage.setItem('_cache_last_modification', datestring);

                var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes')) || [];
                if (history.length === 5)
                    history.shift();

                history.push({'date': datehistory, 'action': 'Nouveau bookmark ajouté côté client: ' + model.title});
                sessionStorage.setItem('_cache_last_five_changes', JSON.stringify(history));
            }
        });

        app.AddEvent.on('client-remove', function (title) {

            if (sessionStorage.getItem('user')) {
                var date = new Date();
                var datestring ="<div class='date'>Le <span class='date_date'>"+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "</span>à  <span class='heure'>"+
                    date.getHours() + ":" + date.getMinutes()+"</span>";
                var datehistory = "Le "+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "+
                    date.getHours() + ":" + date.getMinutes()+"";
                sessionStorage.setItem('_cache_last_modification', datestring);

                var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes')) || [];

                if (history.length === MAX_HISTORY)
                    history.shift();

                history.push({'date': datehistory, 'action': 'Bookmark suprimé côté client: ' + title});
                sessionStorage.setItem('_cache_last_five_changes', JSON.stringify(history));
            }
        });

        app.AddEvent.on('server-add', function (model) {
            if (sessionStorage.getItem('user')) {
                var date = new Date();
                var datestring ="<div class='date'>Le <span class='date_date'>"+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "</span>à  <span class='heure'>"+
                    date.getHours() + ":" + date.getMinutes()+"</span>";
                var datehistory = "Le "+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "+
                    date.getHours() + ":" + date.getMinutes()+"";
                sessionStorage.setItem('_cache_last_modification', datestring);
                sessionStorage.setItem('_cache_last_bookmark_server', JSON.stringify(model));

                var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes')) || [];

                if (history.length === MAX_HISTORY)
                    history.shift();

                history.push({'date': datehistory, 'action': 'Nouveau bookmark ajouté côté serveur: ' + model.title});
                sessionStorage.setItem('_cache_last_five_changes', JSON.stringify(history));
            }
        });
        
        app.AddEvent.on('clean-all', function () {
            var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes')) || [];
            var date = new Date();
            var datehistory = "Le "+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "+
                date.getHours() + ":" + date.getMinutes()+"";

            if (history.length === MAX_HISTORY)
                history.shift();

            history.push({'date': datehistory, 'action': 'Tous les bookmarks ont été suprimés'});
            sessionStorage.setItem('_cache_last_five_changes', JSON.stringify(history));
        });

        app.AddEvent.on('server-remove', function (title) {

            if (sessionStorage.getItem('user')) {
                var date = new Date();
                var datestring ="<div class='date'>Le <span class='date_date'>"+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "</span>à  <span class='heure'>"+
                    date.getHours() + ":" + date.getMinutes()+"</span>";
                var datehistory = "Le "+ date.getDate()  + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "+
                    date.getHours() + ":" + date.getMinutes()+"";
                sessionStorage.setItem('_cache_last_modification', datestring);

                var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes')) || [];

                if (history.length === MAX_HISTORY)
                    history.shift();

                history.push({'date': datehistory, 'action': 'Bookmark suprimé côté serveur: ' + title});
                sessionStorage.setItem('_cache_last_five_changes', JSON.stringify(history));
            }
        });

        var all_bookmarks = [];

        for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                var element = JSON.parse(localStorage.getItem(key));

                var bookmark = new app.Model({
                    title: element.title,
                    url: element.url,
                    tags: element.tags
                });

                all_bookmarks.push(bookmark);
            }
        }

        app.ClientCollection.set(all_bookmarks);

    }

})(jQuery);