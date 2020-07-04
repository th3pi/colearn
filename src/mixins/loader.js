import firebaseENUM from "@/enums/firebase_enum"

export default {
    methods: {
        getProgress(newValue) {
            switch (newValue) {
                case firebaseENUM.INIT:
                    return 0
                case firebaseENUM.LOADING:
                    return Math.random() * 85 + 10;
                case firebaseENUM.LOADED:
                    return 100;
                case firebaseENUM.ERROR:
                    return 0
                default:
                    return 0;
            }
        }
    }
}