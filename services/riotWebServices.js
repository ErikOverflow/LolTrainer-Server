const axios = require('axios');
const config = require('../config');
const { dataDragon } = require('./dataDragon');

/*
api/v1/summoner?region=NA1&summonerName=I have cute dogs
*/
const getSummoner = (req, res) => {
    const summonerName = req.query.summonerName;
    const region = req.query.region;
    const url = config.summonerByNameEndpoint(region, summonerName);
    const wsconfig = {
        headers: {
            'X-Riot-Token': config.riotKey
        }
    }
    return axios.get(url, wsconfig)
        .then(result => {
            let summonerDetails = {
                ...result.data
            };
            const detailsUrl = config.summonerDetailsByIdEndpoint(region, summonerDetails.id);
            return axios.get(detailsUrl, wsconfig)
                .then(result => {
                    summonerDetails = {
                        ...summonerDetails,
                        ...result.data
                    };
                    return res.status(200).json(summonerDetails);
                })
        })

}

/*
{
api/v1/games?region=NA1&accountId=PqT1tpGQnIHGaY4Fhdoj_FefYiUI4mYMPzMHBazH7tI80hI&champion=76...
}
*/
const getGames = (req, res) => {
    let optionalParms = { ...req.query };
    delete optionalParms.region; //region is not an optional param.
    delete optionalParms.accountId; //accountId is not an optional param.
    const region = req.query.region;
    const accountId = req.query.accountId;
    const url = config.matchesByAccountIdEndpoint(region, accountId, optionalParms)
    const wsconfig = {
        headers: {
            'X-Riot-Token': config.riotKey
        }
    }
    return axios.get(url, wsconfig)
        .then(result => {
            let matches = [];
            result.data.matches.forEach(match => {
                const champDetail = dataDragon['en_US'].championByKey[match.champion];
                match.championName = champDetail.name;
                match.championTitle = champDetail.title;
                matches.push(match);
            });
            searchResult = {
                beginIndex: result.data.beginIndex,
                endIndex: result.data.endIndex,
                matches
            };
            return res.status(200).json(searchResult);
        })
}

/*
api/v1/matchDetails?region=NA1&matchId=3473013969
*/
const getMatchDetails = (req, res) => {
    let region = req.query.region;
    let matchId = req.query.matchId;
    const url = config.matchDetailsByIdEndpoint(region, matchId);
    const wsconfig = {
        headers: {
            'X-Riot-Token': config.riotKey
        }
    }
    return axios.get(url, wsconfig)
        .then(result => {
            const data = result.data;
            let matchDetails = {
                queue: data.queueId,
                duration: data.duration,
                startTime: data.gameCreation,
                redTeam: [],
                blueTeam: []
            }
            let participantLookup = {};
            data.participantIdentities.forEach(p => {
                participantLookup[p.participantId] = p.player;
            });
            data.participants.forEach(p => {
                let participant = {
                    champ: dataDragon['en_US'].championByKey[p.championId].name,
                    kills: p.stats.kills,
                    deaths: p.stats.deaths,
                    assists: p.stats.assists,
                    player: participantLookup[p.participantId]
                }
                if (p.teamId === 100) {
                    matchDetails.blueTeam.push(participant);
                } else {
                    matchDetails.redTeam.push(participant);
                }
            });
            return res.status(200).json(matchDetails);
        })
}


module.exports = {
    getGames,
    getSummoner,
    getMatchDetails
}