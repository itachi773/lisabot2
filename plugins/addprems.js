let handler = async (m, { conn }) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat

  if (!who) throw 'Etiquete a un usuario para hacerlo premium'

  let user = global.DATABASE.data.users[who]
  if (!user) throw 'Usuario no encontrado en la base de datos'

  user.premium = true
  user.premiumTime = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 días

  let nomor = who.split('@')[0]
  m.reply(
    `*Usuario agregado como Premium ✅*\n\n` +
    `*Número:* wa.me/${nomor}\n` +
    `*Expira:* 30 días`
  )
}

handler.help = ['addprems @usuario']
handler.tags = ['owner']
handler.command = /^addprems$/i
handler.rowner = true

module.exports = handler

