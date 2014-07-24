(function ($) {
    var old = $.fn.palette,
        templateColorArray = [
            [
                [0, 68, 102, 153, 204, 238, 243, 255]
            ],
            [
                [
                    [255, 0, 0], [255, 153, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [153, 0, 255], [255, 0, 255]
                ]
            ],
            [
                [
                    [244, 204, 204], [252, 229, 205], [255, 242, 204], [217, 234, 211], [208, 224, 227], [207, 226, 243], [217, 210, 233], [234, 209, 220]
                ],
                [
                    [234, 153, 153], [249, 203, 156], [255, 229, 153], [182, 215, 168], [162, 196, 201], [159, 197, 232], [180, 167, 214], [213, 166, 189]
                ],
                [
                    [224, 102, 102], [246, 178, 107], [255, 217, 102], [147, 196, 125], [118, 165, 175], [111, 168, 220], [142, 124, 195], [194, 123, 160]
                ],
                [
                    [204, 0, 0], [230, 145, 56], [241, 194, 50], [106, 168, 79], [69, 129, 142], [61, 133, 198], [103, 78, 167], [166, 77, 121]
                ],
                [
                    [153, 0, 0], [180, 95, 6], [191, 144, 0], [56, 118, 29], [19, 79, 92], [11, 83, 148], [53, 28, 117], [116, 27, 71]
                ],
                [
                    [102, 0, 0], [120, 63, 4], [127, 96, 0], [39, 78, 19], [12, 52, 61], [7, 55, 99], [32, 18, 77], [76, 17, 48]
                ]
            ]
        ],
        Palette = function (element, options) {
            this.options = options;
            this.$element = $(element);

            this.init();
        };

    Palette.prototype = {
        constructor: Palette,

        init: function () {
            var $paletteEle = this._buildPalette();
            this.$element.append($paletteEle);
        },
        // 画取色板的html结构
        _buildPalette: function () {
            var options = this.options,
                colorArray = templateColorArray.slice(),
                $paletteContainer = $('<div />').addClass(options.paletteClass),
                $paletteTable,
                $paletteTr,
                $paletteTd,
                $paletteCell,
                isTransparent,
                i, colorStr, hexColorStr,
                tri, colorTrArray,
                tdi, colorTdArray;

            if (options.hasTransparent) {
                colorArray.unshift([['transparent']]);
            }

            for(i = 0; i < colorArray.length; i++) {
                $paletteTable = $('<table/>');
                colorTrArray = colorArray[i];

                for (tri = 0; tri < colorTrArray.length; tri++) {
                    $paletteTr = $('<tr/>');
                    colorTdArray = colorTrArray[tri];

                    for(tdi = 0; tdi < colorTdArray.length; tdi++) {
                        $paletteTd = $('<td/>');
                        $paletteCell = $('<div/>');
                        colorStr = this._buildColorStr(colorTdArray[tdi]);
                        isTransparent = (colorStr === 'transparent');
                        hexColorStr = isTransparent ? 'transparent' : Helper.getColorValueOfCss(colorStr);
                        $paletteTd.append(
                            $paletteCell
                                .attr('title', isTransparent ? '透明' : colorStr.toUpperCase())
                                .css('background-color', isTransparent ? false : colorStr)
                                .addClass(this._classNamePrefix() + hexColorStr)
                                .addClass( isTransparent ? 'transparent-color' : '')
                                .data('hexColor', isTransparent ? 'transparent' : '#' + hexColorStr)
                        );
                        this._bind($paletteCell);
                        $paletteTr.append($paletteTd);
                    }
                    $paletteTable.append($paletteTr);
                }
                $paletteContainer.append($paletteTable);
            }
            return $paletteContainer;
        },
        _bind: function ($colorCell) {
            var _this = this;
            $colorCell
                .hover(function () {
                    $colorCell.toggleClass(_this._hoverClassName);
                })
                .click(function () {
                    var hexColor = $colorCell.data('hexColor');
                    _this.options.selectHandler(hexColor);
                });
        },
        _buildColorStr: function (color) {
            if (typeof color === 'number') {
                return 'rgb(' + [color, color, color].join() + ')';
            } else if ($.isArray(color) && color.length === 3) {
                return 'rgb(' + color.join() + ')';
            } else if (color === 'transparent') {
                return 'transparent';
            } else {
                throw new Error('invaild color');
            }
        },
        _classNamePrefix: function () {
            return 'color_';
        },
        _hoverClassName: function () {
            return 'hover';
        },
        _selectedClassName: function () {
            return 'selected';
        },
        // 根据颜色来反选小方格，颜色是hexcolor，不带#
        selectSquarByColor: function (color) {
            var className = this._classNamePrefix() + color,
                selectedClass = this._selectedClassName(),
                $square = $('.' + className, this.$element);

            this.$element
                .find('.' + selectedClass)
                .removeClass(selectedClass);

            $square.addClass(selectedClass);
        }
    };

    $.fn.palette = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('palette'),
                options = $.extend({}, $.fn.palette.defaults, $this.data(), typeof option === 'object' && option);

            if (!data) $this.data('palette', (data = new Palette(this, options)));

            if (typeof option === 'string') data[option].call(this); // TODO: 调用
        });
    };

    $.fn.palette.defaults = {
        paletteClass: 'palette', //取色板的外包的class名
        hasTransparent: false,
        selectHandler: function (hexColor) {}
    };

    $.fn.palette.noConflict = function () {
        $.fn.palette = old;
        return this;
    };
}(window.jQuery));
