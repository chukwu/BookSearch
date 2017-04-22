/*!
 * bookshell
 * ..
 * 
 * @author Chukwu Ifeanyi
 * @version 1.0.5
 * Copyright 2017. MIT licensed.
 */
(function($, window, document, undefined) {

    'use strict';

    $(function() {
        // API Data object
        var data = {
            key: "c26025ef50b4f78f3bb96605dfb01b8c6a0d7d84",
            q: "",
            slug: ""
        };

        //API call and templating using Mustache templating engine and jquery
        function getData(url, templateid) {
            $.getJSON(url, data, function(result) {
                var template = $('#' + templateid).html();
                Mustache.parse(template); // optional, speeds up future uses
                $('.resultbox').html('');
                $('.loader').show();
                if (templateid == 'publications') {
                    $.each(result, function(i, field) {
                        //console.log(field);
                        var rendered = Mustache.render(template, field);
                        $('.resultbox').append(rendered);
                    });
                } else if (templateid == 'critics_review') {
                    delete result.total_results;
                    $.each(result, function(i, field) {
                        console.log(field.title);
                        var rendered = Mustache.render(template, field);
                        $('.resultbox').append(rendered);
                    });
                } else {
                    $.each(result.books, function(i, field) {
                        var rendered = Mustache.render(template, field);
                        $('.resultbox').append(rendered);
                    });
                }

                setTimeout(function() { $('.loader').fadeOut(1000); }, 500);

                criticclick();
                data.q = "";
                data.slug = "";
            });
        }


        getData('http://idreambooks.com/api/publications/recent_recos.json', 'publications');

        //side panel filterer.
        $('.filterer li').click(function() {
            $('.filterer li').removeClass('active');
            $(this).addClass('active');

            var template = $(this).data('cat');
            var url = $(this).data('url');

            getData(url, template);
        });


        //filter by genre
        $('.filterergenre li').click(function() {
            $('.filterergenre li').removeClass('active');
            $(this).addClass('active');

            var template = 'publications';
            data.slug = $(this).text();
            var url = 'http://idreambooks.com/api/publications/recent_recos.json';

            getData(url, template);
        });

        //Critisms data request based on book title
        function criticclick() {
            $('.criticclick').click(function() {
                data.q = $(this).data('title');
                getData('http://idreambooks.com/api/books/reviews.json', 'critics_review');
            });
        }

        $('.searchform').submit(function() {
            data.q = $(this).find('.searchtextarea').val();
            getData('http://idreambooks.com/api/publications/recent_recos.json', 'publications');
            return false;
        });
    });

})(jQuery, window, document);