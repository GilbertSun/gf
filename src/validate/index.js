/*globals define: true*/
define(['jquery', './item'], function ($, ValidateItem) {
    'use strict';
    var Validate = function ($form) {
        this.validateItems = $('[data-validate]', $form).map(function () {
            return new ValidateItem($(this), $(this).data('validate'));
        });
    };
    Validate.prototype.validate = function (passed, failed) {
        $.each(this.validateItems, function (i, items) {
            items.validate();
        });
    };
    Validate.prototype.addValidItem = function ($item) {
    };
    Validate.prototype.validateItem = function ($item, passed, failed) {

    };
    return Validate;
});
