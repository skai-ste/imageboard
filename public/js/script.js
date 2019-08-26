console.log("sanity check!!!");

(function() {
    new Vue({
        el: "#main",
        data: {
            name: "Sassafras", // these properties are reactive
            seen: true,
            planets: [],
            myClassName: "highlight"
        },
        mounted: function() {
            console.log("my vue has mounted!");
            console.log("Planet is: ", this.planets);
            var me = this;
            axios.get("/planets").then(function(response) {
                console.log("this.planets in then", this.planets);
                console.log("me.planets in then", me.planets);
                console.log("This is my response!", response.data);
                me.planets = response.data;
            });
        },
        methods: {
            myFunction: function(planetName) {
                console.log("myFunction is runing!", planetName);
            },
            myNextMethod: function() {
                console.log("another method");
            }
        }
    });
})();
