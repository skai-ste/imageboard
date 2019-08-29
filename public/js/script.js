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
                }
            };
        },
        mounted: function() {
            console.log("this in component: ", this);
            console.log("THIS.ID : ", this.id);
            var self = this;
            axios.get("/currentImage/" + self.id).then(function(response) {
                self.imgData = response.data;
                console.log("RESPONSE.data: ", response.data);
            });
            // mounted works the same as mounted in Vue instance
            // only difference is this function runs when the component
            // mounts!
            // console.log("mounted is running!");
        },
        // methods only run when a user does something (click, mousover, etc.)
        methods: {
            closeModal: function() {
                // console.log("closeModal running");
                this.$emit("close");
            },

            myClick: function() {
                console.log("myClick running!");
            },
            addComment: function() {
                console.log("I AM ADDING COMMENT!");
                // I makeing post requist here
                // you gonna send information along with this
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            imageId: "",
            showModal: false,

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
            axios.get("/images").then(function(response) {
                self.images = response.data;
                console.log("response.data: ", response.data);
            });
        },
        methods: {
            closeModalOnParent: function() {
                console.log("closeModalOnParent running");
                this.showModal = false;
                //here you can safely close the modal
            },
            showModalMethod: function(id) {
                // this is the Vue instance
                console.log("showModalMethod running!"); //after you click on imgae it whould print that you clicked clicking
                this.showModal = true;
                this.imageId = id;
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
                var me = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        me.images.unshift(resp.data);
                        console.log("resp from post /upload: ", resp);
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
