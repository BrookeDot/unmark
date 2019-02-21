/*!
    Action Scripts
    A set of functions used to show interactions.
*/

(function ($) {

    // Rebuild the dom after pjax call
    unmark.updateDom = function () {

        var label_class = $('div.marks').data('label-class'),
            body = $('body');

        // Change Body Class for Label Colors
        body.removeClass().addClass(label_class);

        // Update Body Height ... just in case
        unmark.page_setup($('body').height());

    };

    // Collapse Marks Info Sidebar
    // Hides the marks info and re-displays the default sidebar
    unmark.sidebar_collapse = function () {
        /*
        if (Modernizr.mq('only screen and (max-width: 480px)')) {
            $('.mark-actions').hide();
            $('.sidebar-content').animate({right: '-85%'}, 600, function () {
                $(this).hide();
            });
        }
        */
        $('.mark').removeClass('view-inactive').removeClass('view-active');
        $('[id^=mark-] h2').attr('contenteditable',false).removeClass('editable'); // 1.6
        //unmark.sidebar_expand(true);
        unmark.sidebar_mark_info.fadeOut(400, function () {
            //unmark.sidebar_default.fadeIn(400);
        });
        if (Modernizr.mq('only screen and (max-width: 768px)')) {
          $('.sidebar-content').removeClass('active');
          $('#unmark-wrapper').removeClass('sidebar-active');
        } else {
          $('.sidebar-content').removeClass('active');
        }
    };

    // Expands or Compresses the Info Sidebar
    unmark.sidebar_expand = function (compress) {

        var expBtn = unmark.sidebar_content.find('a[data-action="sidebar_expand"] i');

        if (compress === true) {
            return unmark.sidebar_content.animate({ width: '340px' }, 300, function () {
                expBtn.removeClass('icon-heading_collapse').addClass('icon-heading_expand');
                unmark.sidebar_content.removeClass('wide');
            });
        }

        if (expBtn.hasClass('icon-heading_collapse')) {
            unmark.sidebar_content.animate({ width: '340px' }, 300, function () {
                expBtn.removeClass('icon-heading_collapse').addClass('icon-heading_expand');
                unmark.sidebar_content.removeClass('wide');
            });
        } else {
            unmark.sidebar_content.animate({ width: '340px' }, 300, function () {
                expBtn.removeClass('icon-heading_expand').addClass('icon-heading_collapse');
                unmark.sidebar_content.addClass('wide');
            });
        }

    };

    // Hides the left navigation
    unmark.hideNavigation = function () {
      return;
        if (Modernizr.mq('only screen and (min-width: 768px)')) { $('.mark-actions').hide(); $('.branding').fadeOut(); }
        ///===///===///===///===///===///===///
        //unmark.nav_panel.stop().animate({ left: -285 }, 400);
        //unmark.main_panel.stop().animate({ left: 80 }, 200, function () {
        unmark.main_panel.stop( function () {
            $('.nav-panel').hide();
            $('.menu-item').removeClass('active-menu');
            $('.navigation-pane-links').show();
            $('.menu-activator i').removeClass('icon-menu_close').addClass('icon-menu_open');
        });
    };

    // Function for interacting and animating the left navigation
    // This handles both the top level and secondary level
    unmark.interact_nav = function (e, elem_ckd) {

        // Set variables
        var panel_to_show = elem_ckd.data('panel'),
            panel_name = panel_to_show.replace(/^#/, ''),
            panel_width = parseInt(elem_ckd.attr('rel')),
            panel_animate = panel_width + 80,
            elem_parent = elem_ckd.parent(),
            panel_position = parseInt(unmark.nav_panel.css('left'));

        // For Any Nav Click, Return Sidebar
        //unmark.sidebar_collapse();

        // If all links pannel - allow click default
        if (panel_to_show.match(/\//)) {
        //    unmark.hideNavigation();
        //    return true;
        }

        // Otherwise prevent click default
        e.preventDefault();

        // In Case... hide the mark actions
        //$('.mark-actions').hide();

        // If tap/click on open menu, hide menu
        /*if (elem_parent.hasClass('active-menu')) {
            $('.menu-item').removeClass('active-menu');
          //  return unmark.hideNavigation();
        }*/

        // Add / Remove Class for current navigation
        $('.menu-item').removeClass('active-menu');
        $('.navigation-content').find("[data-menu='" + panel_name + "']").addClass('active-menu');

        // Check for close action on and open panel
        if (panel_to_show === "#panel-menu") {
            if (panel_position > 0) {
            //    return unmark.hideNavigation();
            }
        }

        //$('.menu-activator i').removeClass('icon-menu_open').addClass('icon-menu_close');

        // Check which panel to show
        if (Modernizr.mq('only screen and (min-width: 480px)')) {
            //unmark.nav_panel.animate({ left: 80 }, { duration: 200, queue: false });
            //unmark.main_panel.animate({ left: panel_animate }, { duration: 200, queue: false });
            //unmark.nav_panel.animate({ width: panel_width, }, 200);
            //unmark.nav_panel.find('.nav-panel').animate({ width: panel_width, }, 200);
        }
        else {
            //unmark.nav_panel.animate({ left: 64 }, { duration: 200, queue: false });
            //unmark.main_panel.animate({ left: 280 }, { duration: 200, queue: false });
            //unmark.nav_panel.animate({ width: 216, }, 200);
            //unmark.nav_panel.find('.nav-panel').animate({ width: 216, }, 200);
        }

        // Fade in Logo
        $('.branding').fadeIn();

        //$.pjax(e,'.main-content');
        $.pjax({ url: elem_ckd.attr('href'), container: '.main-content' });

        if (panel_to_show === "#panel-menu"){
            $('.navigation-pane-links').show();
            $('.nav-panel').hide();
        } else {
            $('.navigation-pane-links').hide();
            $('.nav-panel').not(panel_to_show).hide();
            $(panel_to_show).show();
        }
    };

    // Pagination on Scroll
    unmark.scrollPaginate = function (cont) {
        var url, page, i, template, output = '', next_page, mark_count,
            next_page = window.unmark_current_page + 1,
            total_pages = window.unmark_total_pages;

        if (cont.scrollTop() + cont.innerHeight() >= cont[0].scrollHeight) {

            if (next_page <= total_pages) {

                template = Hogan.compile(unmark.template.marks);
                url = window.location.pathname;
                unmark.ajax(url+'/'+next_page, 'post', '', function (res) {
                    if (res.marks) {
                        mark_count = Object.keys(res.marks).length;
                        for (i = 1; i < mark_count; i++) {
                            res.marks[i]['prettyurl'] = unmark.prettyLink(res.marks[i]['url']);
                            output += template.render(res.marks[i]);
                        }
                        unmark.main_content.find('.marks_list').append(output);
                        window.unmark_current_page = next_page;
                    }
                });
            }
        }
    };

    // Update the count in the sidebar and graph upon mark archive/unarchive
    unmark.updateCounts = function () {
        unmark.getData('stats', function (res) {

            var archived = res.stats.archived,
                saved = res.stats.saved,
                marks = res.stats.marks;

            // First update sidebar count
            $('.na-today').text(archived.today);
            $('.ns-year').text(marks['ages ago']);

        });
    };

    // Simple Ajax method to get a list of results from API
    unmark.getData = function (what, caller) {
        unmark.ajax('/marks/get/'+what, 'post', '', caller);
    };

    // Simple Close Windows
    unmark.close_window = function (nosave) {
        if (nosave) { return window.close(); } // Don't save anything, just close it.
        var notes = $('.mark-added-note').find('textarea').val(),
            id = $('.mark-added-note').find('textarea').data('id');
        unmark.saveNotes(id, notes);
        window.close();
    };

    // Simple function for hiding Elements the user wants gone
    // TO DO : Hook this up to a cookie so they are gone for good
    unmark.dismiss_this = function (btn) {
        btn.parent().parent().fadeOut();
    };

    // Page Set Up
    unmark.page_setup = function (height) {
        unmark.main_content.height(height);
        unmark.sidebar_content.height(height);
        $('.nav-panel').height(height);
        $('body').height(height);
    };

    // Show or Hide the Overlay
    unmark.overlay = function (show) {
        if (show === true) {
            unmark.mainpanels.addClass('blurme');
            var overlay = $('<div id="unmark-overlay"></div>');
            overlay.appendTo(document.body);
            $('#unmark-overlay').fadeIn(200);
        } else {
            //$('#unmark-overlay').removeClass('active');
            //$('.hiddenform').hide();
            unmark.mainpanels.removeClass('blurme');
            $('#unmark-overlay').fadeOut(400);
            $('.hiddenform').fadeOut(300);
            setTimeout(function() {
              $('#unmark-overlay').remove();
              $('.hiddenform').hide();
            }, 500);
            $('#helperforms input').val('');
        }
    };

}(window.jQuery));
