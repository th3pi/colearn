export default {
    methods: {
        /**
         * Responsive width adjustment mixin. Returns a width based on curent viewport width. Arguments expect values with units included
         * @param {Boolean} show Boolean whether to show this element. Useful when element intially should have 0 width
         * @param {String} sm Small breakpoint - 0 >= and <= 470
         * @param {String} md Medium breakpoint 470 >= and <= 1250
         * @param {String} lg Large breakpoint 1250 >= to Infinity and beyond
         */
        getWidth(show = true, sm, md, lg) {
            if (show) {
                switch (this.$mq) {
                    case "sm":
                        return {
                            width: sm
                        };
                    case "md":
                        return {
                            width: md
                        };
                    case "lg":
                        return {
                            width: lg
                        };
                }
            }
        },
        /**
         * Responsive font-size adjustment mixin. Returns a font-size based on curent viewport width. Arguments expect values with units included
         * @param {Boolean} show Boolean whether to show this element. Useful when element intially should have 0 width
         * @param {String} sm Small breakpoint - 0 >= and <= 470
         * @param {String} md Medium breakpoint 470 >= and <= 1250
         * @param {String} lg Large breakpoint 1250 >= to Infinity and beyond
         */
        getFontSize(show = true, sm, md, lg) {
            if (show) {
                switch (this.$mq) {
                    case "sm":
                        return {
                            'font-size': sm
                        };
                    case "md":
                        return {
                            'font-size': md
                        };
                    case "lg":
                        return {
                            'font-size': lg
                        }
                }
            }
        },
        /**
         * Responsive adjustment mixin. Returns a css parameter based on curent viewport width.
         * @param {String} unit The unit of the css parameter to be returned. Default is px (pixels)
         * @param {String} sm Small breakpoint - 0 >= and <= 470
         * @param {String} md Medium breakpoint 470 >= and <= 1250
         * @param {String} lg Large breakpoint 1250 >= to Infinity and beyond
         */
        getResponsiveSize(unit = 'px', sm, md, lg) {
            switch (this.$mq) {
                case "sm":
                    return {
                        'font-size': '' + sm + unit
                    };
                case "md":
                    return {
                        'font-size': '' + md + unit
                    };
                case "lg":
                    return {
                        'font-size': '' + lg + unit
                    }
            }
        }
    },
}