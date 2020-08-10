const config = require('../config');
const axios = require('axios');

const getSummoner = (region, summonerName) => {
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
                    return summonerDetails;
                })
        })
}

const getMatches = (region, accountId, optionalParams) => {
    const url = config.matchesByAccountIdEndpoint(region, accountId, optionalParams)
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
            return searchResult;
        })
}

const getMatchDetails = (region, matchId) => {
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
                duration: data.gameDuration,
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
            return matchDetails;
        })
}

module.exports = {
    getSummoner,
    getMatches,
    getMatchDetails
}