const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/planets", (req, res) => {
    let planets = [
        {
            name: "Pluto",
            color: "grey/yellow"
        },
        {
            name: "Venus",
            color: "orange"
        },
        {
            name: "Mars",
            color: "red"
        }
    ];
    console.log("i hit the planets route");
    res.json(planets);
});

app.listen(8080, () => console.log("My image board server is UP!"));
