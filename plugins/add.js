let handler = async (m, { conn, args }) => {
  let users = args
    .join(' ')
    .split(',')
    .map(v => v.replace(/\D/g, '') + '@s.whatsapp.net')
    .filter(v => v.length > 20)

  if (!users.length) return

  await conn.groupAdd(m.chat, users)
}

handler.command = /^(add|\+)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

module.exports = handler




















