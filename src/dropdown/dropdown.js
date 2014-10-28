/**
 * @file JavaScript for Dropdown Component
 * @version 0.0.1
 * @author GilbertSun <szb4321@gmail.com>
 * @refer Bootstrap
 */

void function ($) {
    'use strict';
    /* DROPDOWN CLASS DEFINITION
    * ========================= */

    var toggle = '[data-toggle=dropdown]',
        Dropdown = function (element, options) {
            var $el = $(element),
                $parent = getParent($el),
                $dropdownMenu = $parent.children(options.dropdownMenuClass);

            if (options.triggerEvent === 'click') {
                $el.bind(options.triggerEvent, this.toggle);
                $dropdownMenu.mouseleave(function () {
                    $el.parent().removeClass('open');
                    return false;
                });
            } else if (options.triggerEvent === 'hover') {
                $parent
                    .hover(function () {
                        $(this).addClass('open');
                    }, function () {
                        $(this).removeClass('open');
                    })
                    .find(options.triggerClassName)
                    .click(function (e) {
                        e.stopPropagation();
                    });
            }
            $('html').add($dropdownMenu).bind('click.dropdown.data-api', function () {
                $el.parent().removeClass('open');
            });

            if (options.stickShowMenu) {
                $dropdownMenu.unbind('click').click(function (e) {
                    e.stopPropagation();
                });
            }
            if (options.preventScroll) {
                $dropdownMenu.bind('mousewheel DOMMouseScroll', function (e) {
                    var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                    if (delta > 0 && $(this).scrollTop() <= 0)
                        return false;
                    if (delta < 0 && $(this).scrollTop() >= this.scrollHeight - $(this).outerHeight(true))
                        return false;

                    return true;
                });
            }
        };

    Dropdown.prototype = {

        constructor: Dropdown,

        toggle: function () {
            var $this = $(this),
                $parent, isActive;

            $parent = getParent($this);
            if ($this.is('.disabled, :disabled') || $parent.is('.disabled, :disabled')) return;


            isActive = $parent.hasClass('open');

            clearMenus($parent);

            if (!isActive) {
                if ('ontouchstart' in document.documentElement) {
                    // if mobile we we use a backdrop because click events don't delegate
                    $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus);
                }
                $parent.toggleClass('open');
            }

            $this.focus();

            return false;
        },

        keydown: function (e) {
            var $this, $items, $parent, isActive, index;

            if (!/(38|40|27)/.test(e.keyCode)) return;

            $this = $(this);

            e.preventDefault();
            e.stopPropagation();

            if ($this.is('.disabled, :disabled')) return;

            $parent = getParent($this);

            isActive = $parent.hasClass('open');

            if (!isActive || (isActive && e.keyCode === 27)) {
                if (e.which === 27) $parent.find(toggle).focus();
                return $this.click();
            }

            $items = $('[role=menu] li:not(.divider):visible a', $parent);

            if (!$items.length) return;

            index = $items.index($items.filter(':focus'));

            if (e.keyCode === 38 && index > 0) index--;                                        // up
            if (e.keyCode === 40 && index < $items.length - 1) index++;                        // down
            if (!~index) index = 0;

            $items
                .eq(index)
                .focus();
        }

    };

    function clearMenus($parent) {
        $('.dropdown-backdrop').remove();
        /*$(toggle).each(function () {
            getParent($(this)).removeClass('open');
        });*/
        $parent.removeClass('open');
    }

    function getParent($this) {
        var selector = $this.attr('data-target'),
            $parent;

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        $parent = selector && $(selector);

        if (!$parent || !$parent.length) $parent = $this.parent();

        return $parent;
    }


    /* DROPDOWN PLUGIN DEFINITION
    * ========================== */

    var old = $.fn.dropdown;

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('dropdown'),
                options = $.extend({}, $.fn.dropdown.defaults, $this.data(), typeof option === 'object' && option);
            if (!data) $this.data('dropdown', (data = new Dropdown(this, options)));
            if (typeof option === 'string') data[option].call($this);
        });
    };

    $.fn.dropdown.defaults = {
        triggerEvent: 'click',
        stickShowMenu: false,
        dropdownMenuClass: '.dropdown-menu',
        triggerClassName: '.dropdown-toggle',
        preventScroll: false
    };

    $.fn.dropdown.Constructor = Dropdown;


    /* DROPDOWN NO CONFLICT
    * ==================== */

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old;
        return this;
    };
}(window.jQuery);
