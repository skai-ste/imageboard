(function() {
    Vue.component("image-modal", {
        template: "#image-modal-template",
        props: ["id"],
        data: function() {
            return {
                imgData: "",
                currentImg: "",
                form: {
                    username: "",
                    comment: ""
                },
                comments: []
            };
        },
        mounted: function() {
            var self = this;
            axios
                .get("/currentImage/" + self.id)
                .then(function(response) {
                    self.imgData = response.data;
                })
                .catch(function(err) {
                    self.closeModal();
                });
            axios.get("/comments/" + self.id).then(function(response) {
                self.comments = response.data;
            });
        },
        watch: {
            id: function() {
                var self = this;
                axios
                    .get("/currentImage/" + self.id)
                    .then(function(response) {
                        self.imgData = response.data;
                    })
                    .catch(function(err) {
                        self.closeModal();
                    });
                axios.get("/comments/" + self.id).then(function(response) {
                    self.comments = response.data;
                });
            }
        },
        methods: {
            closeModal: function() {
                this.$emit("close");
            },
            myClick: function() {},
            addComment: function() {
                var self = this;
                axios
                    .post("/comments/" + self.id, this.form)
                    .then(function(response) {
                        self.comments.unshift(response.data);
                        self.form.username = "";
                        self.form.comment = "";
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            loadPrevImage: function() {
                location.hash = "#" + this.imgData.prevId;
            },
            loadNextImage: function() {
                location.hash = "#" + this.imgData.nextId;
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            imageId: location.hash.slice(1),
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
            window.addEventListener("hashchange", function() {
                self.showModal = true;
                self.imageId = location.hash.substring(1);
            });
            axios.get("/images").then(function(response) {
                self.images = response.data;
            });
        },
        methods: {
            closeModalOnParent: function() {
                this.showModal = false;
                location.hash = "";
            },
            loadNextPage: function() {
                var self = this;
                var lowestId = self.images[self.images.length - 1].id;
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
                    });
            },
            handleClick: function(e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        self.images.unshift(resp.data);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                    })
                    .catch(function(err) {
                        console.log("err in post /upload: ", err);
                    });
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            }
        }
    });
})();
