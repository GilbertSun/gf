/*globals define: true*/
define(['jquery'], function ($) {
    'use strict';
    var Validate = function ($form) {
        this.validateItems = $('[data-validate]', $form).map(function () {

        });
    };

    Validate.prototype.validate = function (passed, failed) {
    };
    Validate.prototype.addValidItem = function ($item) {
    };
    Validate.prototype.validateItem = function ($item, passed, failed) {

    };
    return Validate;
});
