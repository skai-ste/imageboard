(function() {
    Vue.component("image-modal", {
        // data, methods, mounted
        template: "#image-modal-template",
        props: ["id"],
        // you can put more props after comma
        // and don't forget if props are writen with camelCase
        // then it must be kebab-case on html
        data: function() {
            return {
                // header: "sasssafriends",
                imgData: "",
                form: {
                    username: "",
                    comment: ""
                },
                comments: []
            };
        },
        mounted: function() {
            console.log("THIS.ID : ", this.id);
            var self = this;
            axios
                .get("/currentImage/" + self.id)
                .then(function(response) {
                    self.imgData = response.data;
                })
                .catch(function(err) {
                    console.log("ERROR", err);
                    self.closeModal();
                });
            axios.get("/comments/" + self.id).then(function(response) {
                self.comments = response.data;
            });
            // mounted works the same as mounted in Vue instance
            // only difference is this function runs when the component
            // mounts!
            // console.log("mounted is running!");
        },
        // methods only run when a user does something (click, mousover, etc.)
        watch: {
            id: function() {
                console.log("THIS.ID : ", this.id);
                var self = this;
                axios
                    .get("/currentImage/" + self.id)
                    .then(function(response) {
                        self.imgData = response.data;
                    })
                    .catch(function(err) {
                        console.log("ERROR", err);
                        self.closeModal();
                    });
                axios.get("/comments/" + self.id).then(function(response) {
                    self.comments = response.data;
                });
            }
        },
        methods: {
            closeModal: function() {
                // console.log("closeModal running");
                this.$emit("close");
            },

            myClick: function() {
                // console.log("myClick running!");
            },
            addComment: function() {
                // console.log("I AM ADDING COMMENT!");
                var self = this;
                console.log("THIS", this); //that our input are talking to each other
                axios
                    .post("/comments/" + self.id, this.form)
                    .then(function(response) {
                        console.log("comments.data:", response.data);
                        self.comments.unshift(response.data);
                    });
                // I making post request here
                // you gonna send information along with this
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            imageId: location.hash.slice(1),
            // imageId: location.hash.slice(1) OR currentImage: location.hash.slice(1)

            showModal: false,
            showMoreButton: true,

            images: [],
            seen: true,
            title: "",
            description: "",
            username: "",
            url: "",
            file: null
        },
        mounted: function() {
            var self = this;
            if (self.imageId.length > 0) {
                self.showModal = true;
            }
            // loadNextPage(); ///?////
            window.addEventListener("hashchange", function() {
                console.log("location.hash", location.hash.substring(1));
                self.showModal = true;
                self.imageId = location.hash.substring(1);
            });

            axios.get("/images").then(function(response) {
                self.images = response.data;
                console.log("response.data: ", response.data);
            });
        },
        methods: {
            closeModalOnParent: function() {
                console.log("closeModalOnParent running");
                this.showModal = false;
                location.hash = "";
                // history.pushstate({}, "", "/"); //deletes hash
                //here you can safely close the modal
            },
            loadNextPage: function() {
                var self = this;
                var lowestId = self.images[self.images.length - 1].id;
                console.log("SELF.IMAGES", lowestId);
                axios
                    .get("/images/" + lowestId, lowestId)
                    .then(function(response) {
                        self.images.push(...response.data);

                        var lastImage = self.images[self.images.length - 1];
                        var currentLowestId = lastImage.id;
                        var totalLowestId = lastImage.lowestId;

                        if (currentLowestId == totalLowestId) {
                            self.showMoreButton = false;
                        }

                        //because both of them are arrays. It takes both objects
                        // and push them together
                        // console.log("RESPONSE.data: ", response.data);
                    });
            },
            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ", this);

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                //you have to use method and loop through it to see what is inside
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        self.images.unshift(resp.data);
                        console.log("resp from post /upload: ", resp);
                        document.getElementById("myForm").reset();
                    })
                    .catch(function(err) {
                        console.log("err in post /upload: ", err);
                    });
            },
            handleChange: function(e) {
                // console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();

//console log:
// location.hash.slice(1)
//return image // IDEA:
