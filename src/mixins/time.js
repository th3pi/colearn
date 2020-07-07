export default {
    methods: {
        getTimeDifference(date) {
            let now = new Date();
            let difference = (now - date) / 1000;
            if (difference < 60) {
                return difference.toFixed(0) + " second(s) ago";
            }
            if (difference > 60 && difference < 60 * 60) {
                return (difference / 60).toFixed(0) + " minute(s) ago";
            }
            if (difference > 60 * 60 && difference < 60 * 60 * 24) {
                return (difference / (60 * 60)).toFixed(0) + " hour(s) ago";
            }
            if (difference > 60 * 60 * 24) {
                return (difference / (60 * 60)).toFixed(0) + " days(s) ago";
            }
        },
    }
}