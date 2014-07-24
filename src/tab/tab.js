/**
 * @file JavaScript for Tab Component
 * @version 0.0.1
 * @author GilbertSun <szb4321@gmail.com>
 */
void function () {
    'use strict';

    var Tab = function (element, options) {
        var $nav = this.$nav = $(element);
        options = this.options = $.extend({}, Tab.DEFAULT, options);

        var $contentContainer = this.$contentContainer = $(options.target).length ? $(options.target) : $nav.siblings('[data-role=tab-content]');

        if ($contentContainer.length === 0) throw new Error('can not find tab content');

        this.$navItems = $(options.navSelector, $nav);
        this.$contents = $(options.contentSelector, $contentContainer);

        this.bindTab();
    };
    Tab.DEFAULT = {
        target: null, // 请填写目标内容的选择器或DOM,jQuery对象 或者在data-tab-targe指定，如果dom结构正确，不必填
        delay: 0,
        navSelector: '> *',
        contentSelector: '> *',
        activeClass: 'active',
        trigger: 'hover' // click || hover
    };
    Tab.prototype.bindTab = function() {
        var _this = this;
        var trigger = this.options.trigger === 'hover' ? 'mouseenter' : this.options.trigger + '.qbt';
        var $navItems = this.$navItems;
        var $contents = this.$contents;

        $navItems.on(trigger, function () {
            var $this = $(this);
            var $previous = $navItems.filter('.' + _this.options.activeClass);
            if ($(this).hasClass(_this.options.activeClass)) return;

            var e = $.Event('show.qbt.tab', {
                relatedTarget: $previous
            });
            $this.trigger(e);
            if (e.isDefaultPrevented()) return;
            var changeHandler = function () {
                _this.clearItemStatus($navItems);
                _this.clearItemStatus($contents);

                _this.activeTab($navItems.index($this));
            };
            if (_this.options.delay && _this.options.trigger === 'hover') {
                $this.stop(true).delay(_this.options.delay).queue(function (next) {
                    changeHandler();
                    next();
                });
                $this.one('mouseleave.qbt', function () {
                    $(this).stop(true);
                });
            } else {
                changeHandler();
            }
        });
    };
    Tab.prototype.activeTab = function (index) {
        var activeClass = this.options.activeClass;

        this.$navItems.eq(index).addClass(activeClass).trigger({
            type: 'shown.qbt.tab'
        });
        this.$contents.eq(index).addClass(activeClass);


    };
    Tab.prototype.clearItemStatus = function ($elements) {
        $elements.removeClass(this.options.activeClass);
    };

    $.fn.tab = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $(this).data('qbt.tab');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('qbt.tab', (data = new Tab(this, options)));
        });
    };

    $(window).on('load', function () {
        $('[data-toggle="tab"]').each(function () {
            var $tab = $(this);
            var data = $tab.data();

            $tab.tab(data);
        });
    });
}();
