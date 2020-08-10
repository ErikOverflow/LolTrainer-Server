const summonerByNameEndpoint = (region, name) => {
    if(!region || !name)  
    {
        throw new Error("Region and name must be specified");
    }
    return `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`
}

const matchHistoryUrl = (region, gameId) => {
    if(!region || !gameId)  
    {
        throw new Error("Region and gameId must be specified");
    }
    const regionUrl = "na";
    return `https://matchhistory.${regionUrl}.leagueoflegends.com/en/#match-details/${region}/${gameId}`
}

const summonerDetailsByIdEndpoint = (region, summonerId) => {
    if(!region || !summonerId)  
    {
        throw new Error("Region and summonerId must be specified");
    }
    return `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`
}

/*
optional parms should be a in query parameters:
    champion: 76,
    queue: 420,
    beginTime: 100000,
    endTime: 110000,
    beginIndex: 0,
    endIndex: 100
*/
const matchesByAccountIdEndpoint = (region, accountId, optionalParms) => {
    if(!region || !accountId)  
    {
        throw new Error("Region and AccountID must be specified");
    }
    let url = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`;
    let queryParms = [];
    for(key in optionalParms){
        queryParms.push(`${key}=${optionalParms[key]}`)
    }
    if(queryParms.length > 0){
        url = `${url}?${queryParms.join('&')}`;
    }
    return url;
}

const matchDetailsByIdEndpoint = (region, matchId) => {
    if(!region || !matchId)  
    {
        throw new Error("Region and MatchId must be specified");
    }
    let url = `https://${region}.api.riotgames.com/lol/match/v4/matches/${matchId}`;
    return url;
}

module.exports = {
    riotKey: "",
    regionOptions: [
        'NA1'
    ],
    summonerByNameEndpoint,
    summonerDetailsByIdEndpoint,
    matchesByAccountIdEndpoint,
    matchDetailsByIdEndpoint,
    matchHistoryUrl
}
