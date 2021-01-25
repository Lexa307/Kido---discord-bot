const pinganswers = [
  'отвали от меня!',
  'ты тупой?',
  'ты идиот!',
  'я вырежу тебе все органы!',
  'ты не видишь то что я занята?',
  'при первой же возможности я тебя забаню!',
  'ты меня злишь!'];
const PingAnswer = (message) => {
  if (message.content.indexOf('<@!566415015519846422>') >= 0) {
    message.reply(pinganswers[Math.floor(Math.random() * (pinganswers.length))]);//
  } 
};
module.exports = PingAnswer;
