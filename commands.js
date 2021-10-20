const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const queue = new Map();
let test;

module.exports = function() {
    this.roll = function(message, args){
        console.log(`${message.member.nickname} used **roll**`);
        let number = Math.floor(Math.random() * 6 + 1);
        message.channel.send(`@${message.member.nickname} your number is ${number}`)
    },
    this.ping = function(message, args){
        console.log(`${message.member.nickname} used **PING**`);
        message.channel.send('Wassup my N');
    },
    this.play = async function(message,args, cmd){
        const voiceChannel = message.member.voice.channel;

        console.log(`${message.member.nickname} used **PLAY**`);

        if(!voiceChannel) return message.channel.send('You must be in a channel to play music faggot');
        if(!args.length) return message.channel.send('You need to put a song you autistic fuck');



        if(cmd === 'play'){
            if(!args.length) return message.channel.send("Need a song to play you fuck");
            let song = {};

            const server_queue = queue.get(message.guild.id);
            test = server_queue;

            if(ytdl.validateURL(args[0])){
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
            }else{
                const video_finder = async (query) => {
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if(video){
                    song = {title: video.title, url: video.url }
                }else{
                    message.channel.send('Error finding the video, I might be braindead')
                }
            }

            if(!server_queue){

                const queue_const = {
                    voice_channel: voiceChannel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_const);
                queue_const.songs.push(song);
    
                try{
                    const connection = await voiceChannel.join();
                    queue_const.connection = connection;
                    video_player(message.guild,queue_const.songs[0])
                }catch(err){
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting lol im fucking slow');
                    throw err;
                }
            }else{
                server_queue.songs.push(song);
                return message.channel.send(`:thumbsup: **${song.title}** added to queue`);
            }
        }

        else if(cmd === 'skip') skip_song(message, server_queue);            
        
    },
    this.leave = async function(message, args){
        const voiceChannel = message.member.voice.channel;
        if(!message.member.voice.channel) return message.channel.send('You need to be in the channel to skip you fucking homo');
        if(test){
            test.songs = [];
            test.connection.dispatcher.end();
        }

        try{
            await voiceChannel.leave();
        }catch(err){
            message.reply('I am not in a channel you inbred N')
        }
        await message.reply('Fuck you :middle_finger:');
        console.log(`${message.member.nickname} used **LEAVE**`);
    },
    this.skip = function(message,args){
        skip_song(message);
        console.log(`${message.member.nickname} used **SKIP**`);
    },
    this.invalidCommand = function(message, args){
        message.channel.send("This command doesn't exist you fucking retard");
        console.log(`${message.member.nickname} used **INVALID COMMAND**`);
    }
}

const video_player = async(guild, song) =>{
    const song_queue = queue.get(guild.id);

    if(!song){
        song_queue.voice_channel.leave();
        console.log("Bot has left the channel")
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, {filter: 'audioonly'});
    song_queue.connection.play(stream, {seek: 0, volume: 0.5})
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild,song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`:notes: Now playing **${song.title}**`)
}

const skip_song = (message) =>{
    if(!message.member.voice.channel) return message.channel.send('You need to be in the channel to skip you fucking homo');
    if(!test){
        return message.channel.send("There is nothing to skip idiot");
    }

    try{
        test.connection.dispatcher.end();
    }catch(err){
        message.reply('Nothing to skip retard');
    }
}