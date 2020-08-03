const summonerByNameEndpoint = (region, name) => {
    if(!region || !name)  
    {
        throw new Error("Region and name must be specified");
    }
    return `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`
}

const summonerDetailsByIdEndpoint = (region, summonerId) => {
    if(!region || !name)  
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
    riotKey: "RGAPI-e072bcfb-78b1-4230-95ee-c3577ee84022",
    regionOptions: [
        'NA1'
    ],
    summonerByNameEndpoint,
    summonerDetailsByIdEndpoint,
    matchesByAccountIdEndpoint,
    matchDetailsByIdEndpoint
}
