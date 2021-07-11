const db = require('quick.db');
const Discord = require('discord.js');

module.exports = (bot) => {

  console.log('Bot connecté !');
  const activities = [
    `${bot.guilds.cache.get('828542028702023700').memberCount} membres !`,
    `le support.`
  ];

  let i = 0;

  setInterval(() => {
    const newActivity = activities[i];
    bot.user.setPresence({ activity: { name: newActivity, type: 'WATCHING' }, status: 'online'})
    .catch(console.error);

    if (i === 0) {
      i++;
    } else {
      i = 0;
    }
  }, 10000);


    //perms
    function Maj(str){
      return (str + ' ').charAt(0).toUpperCase() + str.substr(1);
  };
  
  bot.guilds.cache.get('828542028702023700').members.cache.forEach(member => {
    db.set(`${member.id}.ticket`, 'off');
  });
  

  const filter = m => m.author.bot === false;
  const reactFilter =  (reaction) => reaction.emoji.name === 'no' || reaction.emoji.name === 'yes';
  const reasonFilter = (reaction, user) => user.id !== '860571086671708162' && reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣' || reaction.emoji.name === '3️⃣' || reaction.emoji.name === '4️⃣' || reaction.emoji.name === '5️⃣';
  const personnalizedReasonFilter = m => m.author.bot === false && m.content.startsWith('&reason ')

  function getmessage (channel) {
    let autoMsg;
    IWantTheMsg();

      function IWantTheMsg () {
        bot.channels.cache.get(channel).awaitMessages(filter, {max: 1}).then((msg) => {

          function embedMaker (title = "Titre", description = "Quelque chose semble causer problème :thinking:", footer = `Demandée par ${msg.author.username}`, color = "68AA4A", image = undefined, thumbnail = undefined) {
            return new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setImage(image)
            .setThumbnail(thumbnail)
            .setDescription(description)
            .setFooter(footer)
            .setTimestamp();
          };
  
          function embedError (title = "<a:no:855757741796884511> | Une erreur est survenue !", description = "Quelque chose semble causer problème :thinking:", footer = `Demandée par ${msg.author.username}`) {
            return new Discord.MessageEmbed()
              .setTitle(title)
              .setColor("DE2916")
              .setDescription(description)
              .setFooter(footer)
              .setTimestamp();
          };
  
          IWantTheMsg();
          msg = msg.first();
          if (autoMsg) {
            autoMsg.delete().catch();
          }
          
          msg.channel.send(embedMaker(`Merci ${msg.author.username} d'avoir posté ta pub sur ${msg.guild.name} !`, `__**Afin de t'assurer que ta publicité soit acceptée:**__ \n > ► **Lis les règles du serveur !** \n > ► **Reviens poster ta pub dans 2 heures !** \n > ► **Si tu quitte le serveur, tes publicités seront retirées !**`))
            .then(repMsg => autoMsg = repMsg)
          msg.react(bot.guilds.cache.get('828542028702023700').emojis.cache.get('855757659784347659'));
          msg.react(bot.guilds.cache.get('828542028702023700').emojis.cache.get('855757741796884511')).then(() => {
  
            function getReacts () {
              msg.awaitReactions(reactFilter, {max: 1})
                .then(async (react) => {
  
                  if (db.get(`${msg.guild.id}.${msg.author.id}.warnings`) === null) {
                    await db.set(`${msg.guild.id}.${msg.author.id}`, { warnings: 0 });
                  };
  
                  react = react.first();
                  react.users.remove(react.users.cache.find(user => user.id !== '860571086671708162'));
                  let reactAuthor = react.users.cache.find(u => u.id !== '860571086671708162');
                  const guildMessage = react.message.channel.guild;
                  let reason = '';
                  reactAuthor = guildMessage.members.cache.find(m => m.id === reactAuthor.id);
                  
                  function getReason () {
  
                    reactAuthor.send(embedMaker('Délétion de pub:', '**Pour quelles raisons souhaitez-vous supprimer cette pub ?** \n \n __**Motifs:**__ \n > :one: ● Publicité dans le mauvais salon. \n > :two: ● Publicité sans description. \n > :three: ● Publicité interdite. \n > :four: ● Lien d\'invitation invalide. \n > :five: ● Raison personnalisée. \n \n *Annulation dans 60 secondes*')).then((reasonMsg) => {
                      reasonMsg.react('1️⃣').then(() => {
                        reasonMsg.react('2️⃣').then(() => {
                          reasonMsg.react('3️⃣').then(() => {
                            reasonMsg.react('4️⃣').then(() => {
                              reasonMsg.react('5️⃣').then(() => {
                                reasonMsg.awaitReactions(reasonFilter, {max: 1, time: 60000, errors: ['time']})
                                  .then(async (collectedReacts) => {
                                    collectedReacts = collectedReacts.first();
  
                                    function sendMsg () {
  
                                      if (!db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`)) { 
                                        db.set(`${msg.guild.id}.${reactAuthor.id}.verifs`, 1)
                                      } else {
                                        db.set(`${msg.guild.id}.${reactAuthor.id}.verifs`, (db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`) + 1));
                                      } 
  
                                      if (!db.get(`${msg.guild.id}.${msg.author.id}.warnings`)) {
                                        db.set(`${msg.guild.id}.${msg.author.id}.warnings`, 1)
                                      } else {
                                        db.add(`${msg.guild.id}.${msg.author.id}.warnings`, 1 );
                                      }
                                      
                                      
                                      msg.guild.channels.cache.get('856579528562704404').send(embedMaker('Pub supprimée !', `La pub de <@!${msg.author.id}> a été supprimée du salon <#${msg.channel.id}> pour __${reason}__ ! Il a désormais ${db.get(`${msg.guild.id}.${msg.author.id}.warnings`)} warns ! \n \n <@!${reactAuthor.id}> en est à ${db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`)} verifications !`));
                                      msg.guild.channels.cache.get('828585191483244564').send(embedMaker('Pub supprimée !', `La pub de <@!${msg.author.id}> a été supprimée du salon <#${msg.channel.id}> pour __${reason}__ ! Il a désormais ${db.get(`${msg.guild.id}.${msg.author.id}.warnings`)} warns ! \n \n <@!${reactAuthor.id}> en est à ${db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`)} verifications !`));
                                      msg.author.send(embedError('Pub refusée !', `🚨 __**Warn :**__<@!${reactAuthor.id}> vient de vous avertir pour __${reason}__. Vous avez un __Total de ${db.get(`${msg.guild.id}.${msg.author.id}.warnings`)} warns__. \n \n ➜ Si vous souhaitez contester votre __Warn__ penser bien à lire le salon <#828582119814201364> et ensuite vous pourrez et ensuite vous pourrez contacter le staff <#828584779141480458>.`))
                                      msg.delete().catch();
                                    }
          
                                    switch (collectedReacts.emoji.name) {
          
                                      case '1️⃣':
                                        reason = 'Publicité dans le mauvais salon.';
                                        sendMsg();
                                        reasonMsg.delete().catch();
                                      break;
          
                                      case '2️⃣':
                                        reason = 'Publicité sans description.';
                                        sendMsg();
                                        reasonMsg.delete().catch();
                                      break;
          
                                      case '3️⃣':
                                        reason = 'Publicité interdite.';
                                        sendMsg();
                                        reasonMsg.delete().catch();
                                      break;
          
                                      case '4️⃣':
                                        reason = 'Lien d\'invitation invalide.';
                                        sendMsg();
                                        reasonMsg.delete().catch();
                                      break;
          
                                      case '5️⃣':
                                        
                                        reasonMsg.channel.send(embedMaker('Raison personnalisée:', 'Veuillez définir une raison en répondant par `&reason [Raison]`. \n \n *Repondez par `&reason cancel` afin d\'annuler. \n Annulation dans 60 secondes.* '))
                                          .then((sendedEmbed) => reasonMsg.delete().catch() && sendedEmbed.channel.awaitMessages(personnalizedReasonFilter, {max: 1, time: 60000, errors: ['time']}))
                                            .then((collectedMsg) => {
                                              collectedMsg = collectedMsg.first();
  
                                              if (collectedMsg.content.toLowerCase() === '&reason cancel') {
                                                collectedMsg.delete().catch();
                                                sendedEmbed.delete().catch();
                                                return getReacts();
                                              } else {
                                                reason = collectedMsg.content.slice('&reason '.length);
                                                sendMsg();
                                                collectedMsg.delete().catch();
                                                sendedEmbed.delete().catch()
                                              }
                                            })
                                      break;
                                    
                                      default:
                                        getReason();
                                      break;
                                    }
                                  }).catch((err) => {
                                    reasonMsg.delete().catch();
                                    msg.channel.send(embedError(undefined, '**Temps écoule !**'))
                                    console.log(err);
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    }
  
                    if (reactAuthor.roles.cache.find(r => r.id === '861239866971914261') && react.emoji.name === 'no') {
                      getReason();
                    } else if (reactAuthor.roles.cache.find(r => r.id === '861239866971914261') && react.emoji.name === 'yes') {
                      
                      msg.reactions.cache.get('855757659784347659').remove().catch();
                      msg.reactions.cache.get('855757741796884511').remove().catch();
                      if (!db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`)) { 
                        db.set(`${msg.guild.id}.${reactAuthor.id}.verifs`, 1)
                      } else {
                        db.set(`${msg.guild.id}.${reactAuthor.id}.verifs`, (db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`) + 1));
                      }
  
                      msg.guild.channels.cache.get('856579528562704404').send(embedMaker('Pub verifiée !', `**La pub de <@!${msg.author.id}> a été validée par <@!${reactAuthor.id}> qui en est à ${db.get(`${msg.guild.id}.${reactAuthor.id}.verifs`)} vérifications de pubs !** \n [Sauter vers la pub !](${msg.url})`))
                    } else {
                      getReacts();
                    };
                  }).catch((err) => {
                    console.log(err);
                    return getReacts();
                  })
            }
          getReacts();
        });
      })
    }
  };
  getmessage('856112701829677056'); // pub premium
  getmessage('856112558741782528'); // pub booster
  getmessage('856112340713472010'); // pub staff

  getmessage('828617507915956234'); // spam pub
  getmessage('828617609829810236'); // pub rapide

  getmessage('828616906273587235'); // publicitaire
  getmessage('828617158115983372'); // informatique
  getmessage('828617394607226930'); // thème graphisme

  getmessage('856109468180807681'); // résaux
  getmessage('856109801892610098'); // vidéo/stream
  getmessage('856109617510481930'); // reacherches

  getmessage('856107855870296075'); // communautaire
  getmessage('856590036517388309'); // Gaming
  getmessage('856921153300594688'); // MultiThème
}
  