const axios = require('axios');
const config = require('../config');
const { dataDragon } = require('./dataDragon');
const riot = require('./riotWebServices');
const smurfHunter = require('./smurfHunter');

/*
api/v1/summoner?region=NA1&summonerName=I have cute dogs
*/
const getSummoner = (req, res) => {
    const summonerName = req.query.summonerName;
    const region = req.query.region;
    riot.getSummoner(region, summonerName)
    .then(account => {
        return res.status(200).json(account);
    })
}

/*
{
api/v1/games?region=NA1&accountId=PqT1tpGQnIHGaY4Fhdoj_FefYiUI4mYMPzMHBazH7tI80hI&champion=76...
}
*/
const getMatches = (req, res) => {
    let optionalParams = { ...req.query };
    delete optionalParams.region; //region is not an optional param.
    delete optionalParams.accountId; //accountId is not an optional param.
    const region = req.query.region;
    const accountId = req.query.accountId;
    riot.getMatches(region, accountId,optionalParams).then(matches => {
        return res.status(200).json(matches);
    })
}

/*
{
api/v1/overlappingGames?region=NA1&summonerNames=T0P KINGD0M,TOP WAVE CONTROL
}
*/

const getOverlappingGames = (req,res) => {
    const summonerNames = req.query.summonerNames.split(",");
    const region = req.query.region;
    accounts = [];
    Promise.all(summonerNames.map(name => {
        return riot.getSummoner(region, name).then(account => {
            accounts.push(account.accountId);
        })
    })).then(_ => {
        return smurfHunter.getOverlappingGames(region, accounts)
        .then(overlaps => {
            return res.status(200).json(overlaps);
        })
    })
}

/*
api/v1/matchDetails?region=NA1&matchId=3473013969
*/
const getMatchDetails = (req, res) => {
    let region = req.query.region;
    let matchId = req.query.matchId;
    riot.getMatchDetails(region, matchId).then(matchDetails => {
        res.status(200).json(matchDetails);
    })
}


module.exports = {
    getMatches,
    getSummoner,
    getMatchDetails,
    getOverlappingGames
}