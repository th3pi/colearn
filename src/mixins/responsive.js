export default {
    methods: {
        /**
         * Responsive width adjustment mixins. Returns a width based on curent viewport width. Arguments expet values with units included
         * @param {Boolean} show Boolean whether to show this element. Useful when element intially should have 0 width
         * @param {Sting} sm Small breakpoint - 0 >= and <= 450
         * @param {String} md Medium breakpoint 450 >= and <= 1250
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
        getFontSize(show = true, sm, md, lg) {
            if (show) {
                switch (this.$mq) {
                    case "sm":
                        return {
                            'font-size': sm
                        };
                    case "md":
                        console.log(this.$mq);

                        return {
                            'font-size': md
                        };
                    case "lg":
                        return {
                            'font-size': lg
                        }
                }
            }
        }
    },
}