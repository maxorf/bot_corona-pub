const Discord = require("discord.js");
const db = require('quick.db');

module.exports = (bot, message) => {
    if(message.author.bot) return;
    if (db.get(`${message.author.id}.ticket`) === 'on') return;
    

    function embedMaker (title = "Titre", description = "Quelque chose semble causer problème :thinking:", footer = `Demandée par ${message.author.username}`, color = "68AA4A", image = undefined, thumbnail = undefined) {
        return new Discord.MessageEmbed()
          .setTitle(title)
          .setColor(color)
          .setImage(image)
          .setThumbnail(thumbnail)
          .setDescription(description)
          .setFooter(footer, `${message.author.avatarURL()}`)
          .setTimestamp();
    };
      
    function embedError (title = "<a:no:855757741796884511> | Une erreur est survenue !", description = "Quelque chose semble causer problème :thinking:") {
      return new Discord.MessageEmbed()
        .setTitle(title)
        .setColor("DE2916")
        .setDescription(description)
        .setFooter(`Demandée par ${message.author.username}`, `${message.author.avatarURL()}`)
        .setTimestamp();
    };

    const reactFilter = (reaction, user) => reaction.emoji.name === '🤝' || reaction.emoji.name === '⚠' || reaction.emoji.name === '🛒' || reaction.emoji.name === '☀️' || reaction.emoji.name === '📨';
    const ticketFilter = (reaction, user) => reaction.emoji.name === '🎫';
    const msgFilter = m => m.author.id !== '860571086671708162';

    function awaitSupportAnswer (channel) {
        channel.awaitMessages(msgFilter, {max: 1})
            .then((answer) => {

                if ( answer.first().content.toLowerCase() === '&close' ) {
                    message.author.send(embedMaker('Ticket fermé:', '**Le staff vient d\'interrompre votre liaison !**'));
                    channel.delete().catch();
                    return db.set(`${message.author.id}.ticket`, 'off');
                } else {
                    if (answer.first().attachments.first()) {
                        answer.first().channel.send(embedError(undefined, '**Veuillez ne pas envoyer de pièce jointe !**'));
                    } else {
                        message.author.send(embedMaker(`Réponse de ${answer.first().author.username}:`, `${answer.first().content}`))
                        .catch();
                    }
                }
        
            awaitSupportAnswer(channel);
            })
        
    }

    function awaitOwnerAnswer (channel) {
        message.channel.awaitMessages(msgFilter, {max: 1})
            .then((answer) => {
                    if (answer.first().attachments.first()) {
                        answer.first().channel.send(embedError(undefined, '**Veuillez ne pas envoyer de pièce jointe !**'))
                    } else {
                        channel.send(embedMaker(`Réponse de ${answer.first().author.username}:`, `${answer.first().content}`))
                        .catch();
                    }
                awaitOwnerAnswer(channel);
            })
        
    }

    function getReacts () {
        if (message.content.startsWith('&reason ')) return;
        message.react('🎫').then(() => message.awaitReactions(ticketFilter, {max: 1})).then(() => {

            getReacts();
            async function createTicket (parentId, topic) {
                if (!db.get(`${message.author.id}.ticket`)) {
                    db.set(`${message.author.id}.ticket`, 'on')
                } else {
                    db.set(`${message.author.id}.ticket`, 'on')
                }

                message.author.send(embedMaker('Ticket ouvert !', '**Vous êtes actuellement en liaison avec notre service support**, veuillez patientez, un membre du staff devrait vous prendre en charge sous peu !'))

                await bot.guilds.cache.get('855782787222339604').channels.create(`ticket-de-${message.author.username}`, {
                    type: 'text',
                    topic: topic,
                    position: 1,
                    reason: 'Ouverture de ticket pour ' + topic,
                    parent: parentId,
                    permissionOverwrites: [
                        {
                            id: message.author.id,
                            allow: ['VIEW_CHANNEL'],
                        }
                    ],
                }).then((newChannel) => {
                    newChannel.send(embedMaker(`${message.author.username} réclame de l'assistance:`, `**${message.author.username}** demande le service support pour **${topic.toLowerCase()} !**`))
                        .then(msg => {
                            msg.pin();
                            
                        })
                    awaitSupportAnswer(newChannel);
                    awaitOwnerAnswer(newChannel);
                })
            }
        
            message.channel.send(embedMaker(`Bienvenue ${message.author.username} sur notre service support !`, `**__Pour débuter, veuillez nous indiquer la raison de l'ouverture de votre ticket:__** \n > 🤝 | Collaboration \n > ⚠ | Sanction injustifiée \n > 🛒 | Achat via la boutique \n > ☀️ | Devenir staff \n > 📨 | Une toute autre chose`)).then((msg => {
                msg.react('🤝');
                msg.react('⚠');
                msg.react('🛒');
                msg.react('☀️');
                msg.react('📨').then(() => {
                    msg.awaitReactions(reactFilter, {max: 1}).then((react) => {
                        react = react.first();
                        switch (react.emoji.name) {
                            case ('🤝'):
                                msg.delete().catch();
                                createTicket('860858266728661064', 'Collaboration');
                                getReacts();
                            break;

                            case ('⚠'):
                                msg.delete().catch();
                                createTicket('860858524640346132', 'Sanction injustifiée');
                                getReacts();
                            break;

                            case ('🛒'):
                                msg.delete().catch();
                                createTicket('860858606898774056', 'Achat via la boutique');
                                getReacts();
                            break;

                            case ('☀️'):
                                msg.delete().catch();
                                createTicket('860858776701763585', 'Devenir staff');
                                getReacts();
                            break;

                            case ('📨'):
                                msg.delete().catch();
                                createTicket('860858834607013898', 'Une toute autre chose');
                                getReacts();
                            break;
                        
                            default:
                                react.users.remove(react.users.cache.find(user => user.id !== '860571086671708162')).catch();
                                react.remove();
                            break;
                        }
                    })
                })
            }))
        })
    }

    getReacts();
    
}