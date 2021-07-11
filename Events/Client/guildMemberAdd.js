const { MessageEmbed, MessageAttachment } = require("discord.js");
const img = new MessageAttachment('./img/wlc.png');

module.exports = (bot, member) => {

    const welEmbed = new MessageEmbed()
        .setThumbnail(member.user.displayAvatarURL())
        .setTitle(`Ho ! ${member.displayName} nous a rejoint !`)
        .setColor("68AA4A")
        .setDescription(`Salut <@!${member.id}>, bienvenue à **coronα' թub !** passe un bon moment parmi nous en espérant que tu n'attrapes pas le covid-19!! n'oublie pas d'aller faire un tour au <#828582119814201364> et au <#828583672051138612> .`)
        .attachFiles(img)
        .setImage('attachment://wlc.png')
        .setTimestamp()
        .setFooter('Espérons que tu te plaises parmis nous !', member.user.displayAvatarURL());

    const welChannel = member.guild.channels.cache.get('828575474573246464');
    if (welChannel === undefined) return
    welChannel.send(welEmbed).catch();
}