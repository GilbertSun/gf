/*globals define: true*/
define(['jquery'], function ($) {
    var validate = {
        required: function (value) {
            if (value === '') return false;
            else return true;
        },
        email: function (value) {
            return true;
        },
        phone: function (value) {
            return true;
        },
        date: function (value) {
            return true;
        }
    };
    var ValidateItem = function ($item, type) {
        this.$item = $item;
        this.validateFun = validate[type];
    };
    ValidateItem.prototype.getValue = function () {
        return this.$item.val();
    };
    ValidateItem.prototype.validate = function (passed, failed) {
        var isValidated = this.validateFun(this.getValue());
        console.log(isValidated);
        return isValidated;
    };
    return ValidateItem;
});
