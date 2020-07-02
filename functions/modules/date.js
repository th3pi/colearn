class CustomDate {
    constructor(date) {
        this.date = date;
    }
    getCurrentDate() {
        let options = {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "America/New_York"
        };
        return this.date.toLocaleTimeString("en-us", options);
    }
}

module.exports = CustomDate;