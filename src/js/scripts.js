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
            $('.loader').show();
            $.getJSON(url, data, function(result) {
                var template = $('#' + templateid).html();
                Mustache.parse(template); // optional, speeds up future uses
                $('.resultbox').html('');

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

                $('.loader').fadeOut(500);

                criticclick();
                data.q = "";
                data.slug = "";

                goToByScroll('resultbox', '200', 160);

                TweenMax.staggerFrom($('.resultbox > .column'), 2, { opacity: 0, y: 100, delay: 0, ease: Back.easeInOut }, 0.2);
            });
        }

        TweenMax.staggerFrom($('.sidecontainer, .filterer > li, .filterergenre > li'), 2, { opacity: 0, y: 20, ease: Power4.easeInOut }, 0.1);
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
                return false;
            });
        }

        $('.searchicon').click(function() {
            $(this).parent().submit();
        });

        //when search is triggered
        $('.searchform').submit(function() {
            data.q = $(this).find('.searchtextarea').val();
            getData('http://idreambooks.com/api/publications/recent_recos.json', 'publications');
            return false;
        });

        //scroll to result div
        function goToByScroll(id, dur, offset) {
            // Remove "link" from the ID
            id = id.replace("link", "");
            // Scroll
            $('html,body').animate({
                scrollTop: $("." + id).offset().top - offset
            }, dur);
        }


    });

})(jQuery, window, document);