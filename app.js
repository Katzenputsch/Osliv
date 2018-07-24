const Discord = require("discord.js");
const bot = new Discord.Client();
const PREFIX = ">";
const request = require("request");
const fs = require("fs");
const utf8 = require("utf8");

var euServer;
var naServer;

var nichtMehrWarnen = [];
var derKanal;
var suchende = [];
var suchSpieler = [];
var nachrichten = [];
var gesamtSpieler = 0;
var euSpieler = [];

//var five = require("johnny-five");

//var blabla = "";

bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
//    durchschnittspunkte();
    setInterval(function(){
        bot.user.setActivity("EU: online: " + gesamtSpieler + "→ Ø score: " + avegINT);
    }, 180000);
    derKanal = bot.channels.get("310892763417673729");
    derKanal.send("Bot crashed or was restarted. Suspicious matches might repeat, check _**Match ID's**_ to determine wether match was already reported here.");
    //derKanal2 = bot.channels.find("name","staff");
});

//var board = new five.Board(
//    {
//        port: "Com3"
//    }
//);

//var piezo;


//board.on("ready", function(){
//    var temperature = new five.Thermometer({
//        controller: "TMP36",
//        pin: "A0"
//      });
//    
//    piezo = new five.Piezo(3);
//    
//    board.repl.inject({
//        piezo: piezo
//    });
//    
//      temperature.on("change", function() {
//        if(this.celsius > 30){
//            blabla = this.celsius + "°C Vilso roasting ਉ_ਉ";
//        }else{
//            blabla = this.celsius + "°C | " + this.fahrenheit + "°F in here";
//        }
//      });
//});

//setTimeout(function(){
//    piezo.play({
//      tempo: 1500, // Beats per minute, default 150
//      song: [ // An array of notes that comprise the tune
//        [ "c4", 6 ], // Each element is an array in which 
//                 // [0] is the note to play and 
//                 //[1] is the duration in "beats" (tempo, above)
//        [ "e4", 7 ],
//        [ "g4", 8 ],
//        [ null, 9 ] // null indicates "no tone" for the beats indicated
//      ]
//  });
//}, 6000);

//setInterval(function(){
//    bot.user.setActivity(blabla);
//}, 240000);

request("http://www.teamball.io/info", function(error, response, body){
    if(error){
        console.log(error);
    }else{
        parseHtml(body);
    }
});

setInterval(function(){
    request("http://www.teamball.io/info", function(error, response, body){
        if(error){
            console.log(error);
        }else{
            parseHtml(body);
        }
    });
}, 60000);

var cooldown = 0;

var parseHtml = function(html){
    
    euSpieler = [];
    
    obj = JSON.parse(html);

    euServer = obj.servers[0];
    // if(obj.servers[0].name == "Adelita"){
    //     euServer = obj.servers[0];
    //     naServer = obj.servers[1];
    // }else{
    //     euServer = obj.servers[1];
    //     naServer = obj.servers[0];
    // }
    checkForSusp();
    checkForWanted();
    dingsbums();
    
    gesamtSpieler = euServer.playerNum;
    
}

var avegINT = 0;

function welcherRank(rank){
    switch(rank){
        case 1:
            return "Noob";
        break;
        case 2:
            return "Rookie";
        break;
        case 3:
            return "Amateur";
        break;
        case 4:
            return "Semi Pro";
        break;
        case 5:
            return "Pro";
        break;
        case 6:
            return "Master";
        break;
        case 7:
            return "Master Chief";
        break;
        case 8:
            return "Elite";
        break;
        case 9:
            return "World Class";
        break;
        case 10:
            return "Elite";
        break;
    }
}

function dingsbums(){
    var aveg = 0;
    var gesamt = 0;
    var wieviele = 0;
    
    for(i=0;i<euServer.players.length;i++){
        gesamt += euServer.players[i].score;
        wieviele += 1;
        
        var player = {
            userName: euServer.players[i].userName,
            matchesWon: euServer.players[i].matchesWon,
            matchesLost: euServer.players[i].matchesLost,
            draws: euServer.players[i].draws,
            score: euServer.players[i].score,
            gewonnenP: Math.round((euServer.players[i].matchesWon/euServer.players[i].matches)*100),
            country: euServer.players[i].country,
            rank: welcherRank(euServer.players[i].rank)
        }
        euSpieler.push(player);
    }
    
    
    aveg = (gesamt/wieviele);
    avegINT = Math.round(aveg);
    euSpieler.sort(compare);
//     console.log(euSpieler);
}

//function durchschnittspunkte(){
//    var wieviele = 0;
//    var gesamt = 0;
//    var durchschnitt = 0;
//    var durchschnittInt = 0;
//    fs.readdir(__dirname + "/../../german/discord-bot/teamball/players", (err, files) => {
//        if(err) throw err;
//  
//        for(const file of files){
//          fs.readFile(__dirname + "/../../german/discord-bot/teamball/players/" + file + "/info.json", "utf8", function(err, data){
//            if(err) throw err;
//  
//            var objekt = JSON.parse(data);
//  
//            if(objekt.score < 15000 && objekt.score > 0){
//                wieviele ++;
//                gesamt += objekt.score;
//            }
//          });
//        }
//        setTimeout(function(){
//            durchschnitt = (gesamt/wieviele);
//            durchschnittInt = Math.round(durchschnitt);
//            bot.user.setActivity("average tb score: " + durchschnittInt);
//            console.log(durchschnitt);
//        }, 120000);
//      });
//}

function checkForWanted(){
    for(i = 0; i < euServer.players.length; i++){
        if(euServer.players[i].guid){
            var guidDrin = (suchSpieler.indexOf(euServer.players[i].guid));
            if(guidDrin >= 0){
                suchende[guidDrin].sendMessage("`" + euServer.players[i].guid + "` detected on Teamball.io `EU` server! Username: `" + euServer.players[i].userName + "` | Flag: :flag_" + euServer.players[i].country + ":");
                suchende.splice(guidDrin, 1);
                suchSpieler.splice(guidDrin, 1);
            }
        }
    }

    // for(i = 0; i < naServer.players.length; i++){
    //     if(naServer.players[i].guid){
    //         var guidDrin = (suchSpieler.indexOf(naServer.players[i].guid));
    //         if(guidDrin >= 0){
    //             suchende[guidDrin].sendMessage("`" + naServer.players[i].guid + "` detected on Teamball.io `NA` server! Username: `" + naServer.players[i].userName + "` | Flag: :flag_" + naServer.players[i].country + ":");
    //             suchende.splice(guidDrin, 1);
    //             suchSpieler.splice(guidDrin, 1);
    //         }
    //     }
    // }
}

function checkForSusp(){
    if(euServer.matches[9]){
        for(i = 0; i < 9; i++){
            if(euServer.matches[i].goals[0].length + euServer.matches[i].goals[1].length >= 12 && nichtMehrWarnen.indexOf(euServer.matches[i]._id) > -1 == false && euServer.matches[i].teamSize == 1){
//                                    
//                    
//                    
//                    
//                    piezo.play({
//      tempo: 1000, // Beats per minute, default 150
//      song: [ // An array of notes that comprise the tune
//        [ "c4", 1 ], // Each element is an array in which 
//                 // [0] is the note to play and 
//                 //[1] is the duration in "beats" (tempo, above)
//        [ "e4", 2 ],
//        [ "g4", 3 ],
//        [ null, 4 ] // null indicates "no tone" for the beats indicated
//      ]
//  });
//                    
//                    
//                    
//                    
                if(derKanal != null){
                    
                    nichtMehrWarnen.push(euServer.matches[i]._id);
                    
                    var blamenge1 = euServer.matches[i].goals[0].length + euServer.matches[i].goals[1].length;
                    
                    derKanal.send("`suspicious 1v1 match` detected on `EU` server between \"`" + euServer.matches[i].players[0].userName + "`\" guid: `" + euServer.matches[i].players[0].guid + "` and \"`" + euServer.matches[i].players[1].userName + "`\" guid: `" + euServer.matches[i].players[1].guid + "` | `" + blamenge1 + "` goals counted | **Match ID:** `" + euServer.matches[i]._id + "`.");
                }
            }

            if(euServer.matches[i].goals[0].length + euServer.matches[i].goals[1].length < 1 && nichtMehrWarnen.indexOf(euServer.matches[i]._id) > -1 == false && euServer.matches[i].teamSize == 1 && euServer.matches[i].winner != 2){
//                                    
//                    
//                    
//                    
//                    piezo.play({
//      tempo: 1500, // Beats per minute, default 150
//      song: [ // An array of notes that comprise the tune
//        [ "c4", 1 ], // Each element is an array in which 
//                 // [0] is the note to play and 
//                 //[1] is the duration in "beats" (tempo, above)
//        [ "e4", 2 ],
//        [ "g4", 3 ],
//        [ null, 4 ] // null indicates "no tone" for the beats indicated
//      ]
//  });
//                    
//                    
//                    
//                    
//                    
                if(derKanal != null){
                    
                    nichtMehrWarnen.push(euServer.matches[i]._id);
                    
                    derKanal.send("1v1 `0-0 win` detected on `EU` server. Players: \"`" + euServer.matches[i].players[0].userName + "`\" guid: `" + euServer.matches[i].players[0].guid + "` and \"`" + euServer.matches[i].players[1].userName + "`\" guid: `" + euServer.matches[i].players[1].guid + " | ` **Match ID:** `" + euServer.matches[i]._id + "`");
                }
            }
        }
    }

    // if(naServer.matches[9]){
    //     for(i = 0; i < 9; i++){
    //         if(naServer.matches[i].goals[0].length + naServer.matches[i].goals[1].length >= 12 && nichtMehrWarnen.indexOf(naServer.matches[i]._id) > -1 == false && naServer.matches[i].teamSize == 1){
    //             if(derKanal != null){
    //                 nichtMehrWarnen.push(naServer.matches[i]._id);
                    
    //                 var blamenge2 = naServer.matches[i].goals[0].length + naServer.matches[i].goals[1].length;
                    
    //                 derKanal.send("`suspicious 1v1 match` detected on `NA` server between \"`" + naServer.matches[i].players[0].userName + "`\" guid: `" + naServer.matches[i].players[0].guid + "` and \"`" + naServer.matches[i].players[1].userName + "`\" guid: `" + naServer.matches[i].players[1].guid + "` | `" + blamenge2 + "` goals counted.");
    //             }
    //         }

    //         if(naServer.matches[i].goals[0].length + naServer.matches[i].goals[1].length < 1 && nichtMehrWarnen.indexOf(naServer.matches[i]._id) > -1 == false && naServer.matches[i].teamSize == 1 && naServer.matches[i].winner != 2){
    //             if(derKanal != null){
    //                 nichtMehrWarnen.push(naServer.matches[i]._id);
                    
    //                 derKanal.send("1v1 `0-0 win` detected on `NA` server. Players: \"`" + naServer.matches[i].players[0].userName + "`\" guid: `" + naServer.matches[i].players[0].guid + "` and \"`" + naServer.matches[i].players[1].userName + "`\" guid: `" + naServer.matches[i].players[1].guid + "`");
    //             }
    //         }
    //     }
    // }
}

function compare(a,b) {
    if (a.score > b.score)
    return -1;
    if (a.score < b.score)
    return 1;
    return 0;
  }

bot.on("message", (message) => {
    if(message.channel.id == "310892763417673729"){
        nachrichten.push(message.author.username + " | " + message.content);
        console.log(message.author.username + " | " + message.content);
    }
    if(message.author.equals(bot.user)) return;
    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    var datetime = new Date();
    fs.appendFile("meinLog.txt", "DATUM/UHRZEIT: " + datetime + " | USER: " + message.author.username + " | MESSAGE: " + message.content + "\r\n", "utf8", function(err){
        if (err) throw err;
    });

    switch(args[0]){
        case "online":
            if(message.guild === null) return;
            
            if(message.author.warteZeit){
                if(message.author.warteZeit > 0){
                    message.reply("cooldown: **" + message.author.warteZeit + "** second/s remaining");
                }else{
                    console.log(message.author.username);
                    for(i=0;i<euSpieler.length;i++){
                        if(i < 1){
//                             message.channel.send(":crown: :flag_" + euSpieler[i].country + ":  **Username: " + euSpieler[i].userName + "**" + " `Score: " + euSpieler[i].score + "` __Wins : " + euSpieler[i].gewonnenP + " %__ **" + euSpieler[i].rank + "**");
//                                message.channel.send(":dark_sunglasses: :flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName +  "**```" + "Rank: " + euSpieler[i].rank + "\n"  + "Score: " + euSpieler[i].score + "\n" + "Wins in %: " + euSpieler[i].gewonnenP + " %```");
                               message.channel.send("`" + i + "` :blobcoolthonk: :flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName + "**");
                        }else{
//                             message.channel.send(":flag_" + euSpieler[i].country + ": **Username: " + euSpieler[i].userName + "**" + " `Score: " + euSpieler[i].score + "` __Wins : " + euSpieler[i].gewonnenP + " %__ **" + euSpieler[i].rank + "**");
//                                message.channel.send(":flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName +  "**```" + "Rank: " + euSpieler[i].rank + "\n"  + "Score: " + euSpieler[i].score + "\n" + "Wins in %: " + euSpieler[i].gewonnenP + " %```");
                               message.channel.send("`" + i + "` :flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName + "**");
                        }
                    }
                    message.channel.send("`write >info <number of player> for more info about the player`");
                    message.author.warteZeit = 120;
                    message.author["warteInter"] = new setInterval(function(){
                        if(message.author.warteZeit > 0){
                         message.author.warteZeit -= 1;   
                        }else{
                         clearInterval(message.author.warteInter);   
                        }
                    }, 1000);
                }
            }else{
                
                console.log(message.author.username);
                    for(i=0;i<euSpieler.length;i++){
                        if(i < 1){
//                             message.channel.send(":crown: :flag_" + euSpieler[i].country + ":  **Username: " + euSpieler[i].userName + "**" + " `Score: " + euSpieler[i].score + "` __Wins : " + euSpieler[i].gewonnenP + " %__ **" + euSpieler[i].rank + "**");
//                                message.channel.send(":dark_sunglasses: :flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName +  "**```" + "Rank: " + euSpieler[i].rank + "\n"  + "Score: " + euSpieler[i].score + "\n" + "Wins in %: " + euSpieler[i].gewonnenP + " %```");
                               message.channel.send("`" + i + "` :blobcoolthonk: :flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName + "**");
                        }else{
//                             message.channel.send(":flag_" + euSpieler[i].country + ": **Username: " + euSpieler[i].userName + "**" + " `Score: " + euSpieler[i].score + "` __Wins : " + euSpieler[i].gewonnenP + " %__ **" + euSpieler[i].rank + "**");
//                                message.channel.send(":flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName +  "**```" + "Rank: " + euSpieler[i].rank + "\n"  + "Score: " + euSpieler[i].score + "\n" + "Wins in %: " + euSpieler[i].gewonnenP + " %```");
                               message.channel.send("`" + i + "` :flag_" + euSpieler[i].country + ": **" + euSpieler[i].userName + "**");
                        }
                    }
                    message.channel.send("`write >info <number of player> for more info about the player`");
                
                message.author["warteZeit"] = 120;
                
                message.author["warteInter"] = new setInterval(function(){
                        if(message.author.warteZeit > 0){
                         message.author.warteZeit -= 1;   
                        }else{
                         clearInterval(message.author.warteInter);   
                        }
                    }, 1000);
                
            }
            
//             console.log(message.author.username);
//             for(i=0;i<euSpieler.length;i++){
//                 if(i < 1){
//                     message.channel.send(":crown: :flag_" + euSpieler[i].country + ":  Username: `" + euSpieler[i].userName + "`" + " Score: `" + euSpieler[i].score + "` Wins % : `" + euSpieler[i].gewonnenP + "`");
//                 }else{
//                     message.channel.send(":flag_" + euSpieler[i].country + ": Username: `" + euSpieler[i].userName + "`" + " Score: `" + euSpieler[i].score + "` Wins % : `" + euSpieler[i].gewonnenP + "`");
//                 }
//             }
        break;
        case "info":
            if(args[1]){
                if(isNaN(args[1])){
                    message.channel.send("correct use: `write >info <number of player> for more info about the player`"); 
                }else if(!euSpieler[args[1]]){
                 message.channel.send("correct use: `write >info <number of player> for more info about the player`");    
                }else{
                    message.channel.send(":dark_sunglasses: :flag_" + euSpieler[args[1]].country + ": **" + euSpieler[args[1]].userName +  "**```" + "Rank: " + euSpieler[args[1]].rank + "\n"  + "Score: " + euSpieler[args[1]].score + "\n" + "Wins in %: " + euSpieler[args[1]].gewonnenP + " %```");
                }
            }else{
             message.channel.send("correct use: `write >info <number of player> for more info about the player`"); 
            }
        break;
        case "lesen":
            message.reply(nachrichten);
        break;
        case "senden":
            var nachricht = "";
            if(args.length > 1){
                for(i=1;i<args.length;i++){
                    nachricht += args[i] + " ";
                }
            }
            bot.channels.get('310892763417673729').sendMessage(nachricht);
        break;
        case "hier":
        if(message.author.id == "293718922371399681" || message.author.id == "311955689188753410"){
            derKanal = message.channel;
        }else{
            message.reply("you are not authorized to use this command");
        }
        break;
        case "wanted":
        if(message.guild === null){
            message.reply("this command sir, doesnt work in DM since i cant check your roles!");
        }else{
            if(message.member.roles.find("name", "Teamball.io Player")){
                //ist Teamball Player
                if(args[1]){
                    if(args[1].length != 36){
                        message.reply("incorrect guid format");
                    }else{
                        suchende.push(message.author);
                        suchSpieler.push(args[1]);
                        message.reply("added this guid to my wanted list");
                    }
                }else{
                    message.reply("correct use: >wanted <player guid>");
                }
            }else{
                //ist nicht Teamball Player
                message.reply("this is a command for Teamball.io players only");
            }
        }
        break;
            
//        case "temp":
//            message.channel.send(blabla);
//        break;
    }
});
//1
