const db = require('quick.db');

module.exports.run = (bot, message, args, embedMaker, prefix, embedError) => {

    if(!message.member.roles.cache.find(r => r.id === '861239866971914261')) return message.channel.send(embedError(undefined, 'Vous ne possédez pas le rôle nécessaire afin d\'effectuer cette action ! \n \n **Rôle requis:** <@&860568474816217113>'))
    if (message.mentions.users.first()) {

        const mentionned = message.mentions.users.first();
        let warns;

        if (!db.get(`${message.guild.id}.${message.author.id}.warnings`)) {
            warns = 0;
          } else {
            warns = db.get(`${message.guild.id}.${message.author.id}.warnings`);
          }

        message.channel.send(embedMaker(`Avertissements de ${mentionned.username}:`, `<@!${mentionned.id}> possède **${warns} avertissements !**`))
    
    } else {
        message.channel.send(embedError(undefined, '**Mention invalide !**'))
    }
}

module.exports.help = {
    name: "seewarns",
    category: 'moderation',
    description: "Vous permet de vérifier les avertissments la personne mentionnée !",
    args: true,
    usage: '<@Gentille personne>',
    cooldown: 0,
    aliases: ["seewarn"],
    userPerms: [],
    botPerms: [],
    deletecmd: true,
}