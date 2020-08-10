const riot = require('./riotWebServices');
const timeWindow = 60*60*1000;
const config = require('../config');

const getOverlappingGames = (region, accountIds) => {
    matchLists = {};
    return Promise.all(accountIds.map(accountId => {
        return riot.getMatches(region, accountId, {startIndex:0, endIndex:100}).then(matches => {
            const matchTimes = [];
            matches.matches.map(match => {
                const matchTime = {
                    region,
                    startTime: match.timestamp,
                    gameId: match.gameId
                }
                matchTimes.push(matchTime);
            });
            matchLists[accountId] = {
                matchTimes: matchTimes
            }
        })
    })).then(_ => {
        //use array of matches for account 1, compare to account 2 and 3
        //use array of matches for account 2, compare to account 3
        const potentialOverlaps = [];
        for ( i=0; i< accountIds.length; i++){
            const currentAccount = accountIds[i];
            const otherAccounts = accountIds.splice(i+1);
            for(j=0; j<otherAccounts.length; j++){
                //compare current match times to other match times
                const otherAccount = otherAccounts[j];
                let k=0;
                let l=0;
                while(k < matchLists[currentAccount].matchTimes.length){
                    const currentMatch = matchLists[currentAccount].matchTimes[k];
                    let otherMatch = matchLists[otherAccount].matchTimes[l];
                    while(l < matchLists[otherAccount].matchTimes.length && currentMatch.startTime < otherMatch.startTime){
                        otherMatch = matchLists[otherAccount].matchTimes[l];
                        if(Math.abs(currentMatch.startTime - otherMatch.startTime) < timeWindow){
                            potentialOverlaps.push([currentMatch, otherMatch]);
                        }
                        l++;
                    }
                    k++;
                }
            }
        }
        return potentialOverlaps;
    })
    .then(potentialOverlaps => {
        let definiteOverlaps = [];
        return Promise.all(potentialOverlaps.map(potentialOverlap => {
            return riot.getMatchDetails(region, potentialOverlap[0].gameId)
            .then(match1 => {
                return riot.getMatchDetails(region, potentialOverlap[1].gameId)
                .then(match2 => {
                    if(match1.startTime > match2.startTime){
                        //match 2 started first
                        if(match2.startTime + match2.duration*1000 > match1.startTime){
                            //match 2 ended after match 1 started
                            potentialOverlap[0].duration = `${match1.duration/60} minutes`;
                            potentialOverlap[1].duration = `${match2.duration/60} minutes`;
                            definiteOverlaps.push({
                                infraction: potentialOverlap
                            });
                        }
                    }else{
                        //match 1 started first
                        if(match1.startTime + match1.duration*1000 > match2.startTime){
                            //match 1 ended after match 2 started
                            potentialOverlap[0].duration = `${match1.duration/60} minutes`;
                            potentialOverlap[1].duration = `${match2.duration/60} minutes`;
                            definiteOverlaps.push({
                                infraction: potentialOverlap
                            });
                        }
                    }
                    return Promise.resolve('ok');
                })
            })
            
        }))
        .then(_=> {
            definiteOverlaps.forEach(infraction => {
                infraction.infraction.forEach(game => {
                    game.url = config.matchHistoryUrl(game.region, game.gameId);
                    game.startDate = new Date(game.startTime);
                })
            })
            return definiteOverlaps;
        })
    })
}



module.exports = {
    getOverlappingGames
}