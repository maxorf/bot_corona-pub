const db = require('quick.db');

module.exports.run = (bot, message, args, embedMaker, prefix, embedError) => {

    if(!message.member.roles.cache.find(r => r.id === '861239866971914261')) return message.channel.send(embedError(undefined, 'Vous ne possédez pas le rôle nécessaire afin d\'effectuer cette action ! \n \n **Rôle requis:** <@&860568474816217113>'))
    if (!args[0]) {
        message.guild.members.cache.forEach(member => {
            db.set(`${message.guild.id}.${member.id}.warnings`, 0)
        });
    
        message.channel.send(embedMaker('Avertissements nettoyés !', 'Tous les avertissements ont été remis à zéro !'))
    } else if (message.mentions.users.first()) {

        const mentionned = message.mentions.users.first();
        if (db.get(`${message.guild.id}.${mentionned.id}.warnings`) === null || db.get(`${message.guild.id}.${mentionned.id}.warnings`) === 0) {
            message.channel.send(embedError(undefined, '**L\'utilisateur n\'a reçu aucun avertissement !**' ));
        } else {
            message.channel.send(embedMaker('Avertissement retiré !', `<@!${mentionned.id}> possède **désormais ${db.get(`${message.guild.id}.${mentionned.id}.warnings`) - 1} avertissements !** \n \n **Modérateur:** \n > <@!${message.author.id}>`))
            db.set(`${message.guild.id}.${mentionned.id}.warnings`, (db.get(`${message.guild.id}.${mentionned.id}.warnings`) - 1));
        }
    }
}

module.exports.help = {
    name: "rwarns",
    category: 'moderation',
    description: "Retire les avertissements de tout le monde ou retire un warn à la personne mentionnée !",
    args: false,
    usage: '<@Gentille personne>',
    cooldown: 0,
    aliases: ["rwarn"],
    userPerms: [],
    botPerms: [],
    deletecmd: true,
}