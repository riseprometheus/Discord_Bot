exports.run = (client, message,args) =>
{
  message.channel.bulkDelete(1).then(
  message.channel.send(
    {embed : {color: 0x4dd52b,
        description:"React with ⚠ if you would like the spoiler role for this server." }}))
}
