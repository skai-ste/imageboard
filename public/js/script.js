console.log("sanity check!!!");

(function() {
    new Vue({
        el: "#main",
        data: {
            images: [],
            seen: true,
            title: "",
            description: "",
            username: "",
            file: null
        },
        mounted: function() {
            console.log("my vue has mounted!");
            var me = this;
            axios.get("/images").then(function(response) {
                console.log("this.images in then", this.images);
                console.log("me.images in then", me.images);
                console.log("This is my response!", response.data);
                me.images = response.images;
            });
        },
        methods: {
            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ", this);

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                //you have to use method and loop through it to see what is inside

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from post /upload: ", resp);
                    })
                    .catch(function(err) {
                        console.log("err in post /upload: ", err);
                    });
            },
            handleChange: function(e) {
                // console.log("handleChange is running!!!!");
                // console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
        // methods: {
        //     myFunction: function(planetName) {
        //         console.log("myFunction is runing!", planetName);
        //     },
        //     myNextMethod: function() {
        //         console.log("another method");
        //     }
        // }
    });
})();
