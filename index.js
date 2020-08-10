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

const processes = require('./services/processes');
v1.get("/matches", processes.getMatches);
v1.get("/matchDetails", processes.getMatchDetails);
v1.get("/summoner", processes.getSummoner);

const smurfHunt = require('./services/smurfHunter');
v1.get("/overlappingGames", processes.getOverlappingGames);
app.use("/api/v1", v1);

app.listen(port, () => console.log(`App is now listening on port: ${port}`));