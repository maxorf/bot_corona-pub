const db = require('quick.db');

module.exports.run = (bot, message, args, embedMaker, prefix, embedError) => {

    if(!message.member.roles.cache.find(r => r.id === '861239866971914261')) return message.channel.send(embedError(undefined, 'Vous ne possédez pas le rôle nécessaire afin d\'effectuer cette action ! \n \n **Rôle requis:** <@&860568474816217113>'))
    if (message.mentions.users.first()) {

        const mentionned = message.mentions.users.first();
        let reason = '';

        if (args[1]) reason = `**Raison:** \n > ${args.slice(1).join(' ')}`;

        if (!db.get(`${message.guild.id}.${message.author.id}.warnings`)) {
            db.set(`${message.guild.id}.${message.author.id}.warnings`, 1)
          } else {
            db.add(`${message.guild.id}.${message.author.id}.warnings`, 1 );
          }

        message.channel.send(embedMaker('Membre avertit !', `<@!${mentionned.id}> possède **désormais ${db.get(`${message.guild.id}.${mentionned.id}.warnings`)} avertissements !** \n \n **Modérateur:** \n > <@!${message.author.id}> \n ${reason}`))
    
    } else {

        message.channel.send(embedError(undefined, '**Mention invalide !**'))
    }
}

module.exports.help = {
    name: "warn",
    category: 'moderation',
    description: "Ajoute un avertissement à la personne mentionnée !",
    args: true,
    usage: '<@Gentille personne>',
    cooldown: 0,
    aliases: ["warns"],
    userPerms: [],
    botPerms: [],
    deletecmd: true,
}