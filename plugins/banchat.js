let handler = async (m) => {
  global.DATABASE._data.chats[m.chat].isBanned = true
  m.reply('Done!')
}

handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat$/i
handler.owner = true
handler.fail = null

module.exports = handler

