const { MessageEmbed, MessageAttachment } = require("discord.js");
const img = new MessageAttachment('./img/leave.jpg');

module.exports = (bot, member,) => {
    
    
    function convertTtD (timestamp) {
        let date = new Date(timestamp);
        let minutes = "0" + date.getMinutes();
        return date.getHours() + ":" + minutes.substr(-2) + " le " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }

    const leaveEmbed = new MessageEmbed()
        .setThumbnail(member.user.displayAvatarURL())
        .setTitle(`Ho ! ${member.displayName} nous a quitté !`)
        .setColor("DE2916")
        .setDescription(`**<@!${member.id}>** vient de quitter le serveur. Merci de vérifier si on avait fait un partenariat avec lui ou un échange du pub. Si on en a fait un merci d'enlever sa pub et de quitter son serveur. Quand c'est fait merci de mettre une réaction sous ce message. Merci le staff !`)
        .attachFiles(img)
        .setImage('attachment://leave.jpg')
        .setFooter(`Avait rejoint à ${convertTtD(member.joinedTimestamp)}`, member.user.displayAvatarURL());

    const leaveChannel = member.guild.channels.cache.get('842748744789131294');
    if (leaveChannel === undefined) return
    leaveChannel.send(leaveEmbed).catch();
}