// iterate the data dragon folder for languages
//For each language, build out a champions map, items map, summoner map
const version = '10.15.1'
var fs = require('fs');

dataDragon = {
    en_US: {}
};
for(language in dataDragon){
    const championObj = JSON.parse(fs.readFileSync(`C:/Users/ErikR/Desktop/datadragon/${version}/data/${language}/champion.json`, 'utf8'));
    const championById = championObj.data;
    const championByKey = {};
    for (let id in championById){
        const champ = championById[id];
        championByKey[champ.key] = champ;
    }

    dataDragon[language].championById = championById;
    dataDragon[language].championByKey = championByKey;
}

module.exports = {
    dataDragon
}
