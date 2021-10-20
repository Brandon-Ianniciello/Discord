const Discord = require('discord.js');
require('./commands.js')();
const bot = new Discord.Client();
const token = 'ODE0MTcyOTgyMzM5MTc0NDEy.YDZ_rQ.6QfSXwlr_jt_Fy2ijp6oceAXN1I';
const prefix = '#';


bot.once('ready', () => {
    console.log('WE LIVE, LETS FKG GOOO');
});


bot.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    let args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
        ping(message, args);
        return;
    }else if(command === 'play'){
        play(message,args, command);
        return;
    }else if(command === 'leave'){
        leave(message, args);
    }
    else if(command === 'skip'){
        skip(message, args);
    }else if(command === 'roll'){
        roll(message,args);
    }
    else{
        invalidCommand(message, args);
    }
});

bot.login(token);
