const express = require('express');
const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var v1 = express.Router();
v1.get("/ping", (req,res) => {
    res.status(200).json({ ping: "Successful response."});
});

const riot = require('./services/riotWebServices');
v1.get("/matches", riot.getGames);
v1.get("/matchDetails", riot.getMatchDetails);
v1.get("/summoner", riot.getSummoner);
app.use("/api/v1", v1);

app.listen(port, () => console.log(`App is now listening on port: ${port}`));