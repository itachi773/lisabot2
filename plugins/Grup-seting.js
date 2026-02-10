module.exports = async (conn, data) => {
  const { m, from, args, command, isAdmin, isBotAdmin } = data

  if (!isAdmin) {
    return conn.sendMessage(from, { text: '❌ Solo admins pueden usar este comando' })
  }

  if (!isBotAdmin) {
    return conn.sendMessage(from, { text: '❌ Necesito ser admin para hacer esto' })
  }

  if (!args[0]) {
    return conn.sendMessage(from, {
      text: `❌ Uso correcto:\n\n• .${command} open\n• .${command} close`
    })
  }

  if (args[0] === 'open') {
    await conn.groupSettingUpdate(from, 'not_announcement')
    return conn.sendMessage(from, { text: '✅ Grupo abierto, todos pueden escribir' })
  }

  if (args[0] === 'close') {
    await conn.groupSettingUpdate(from, 'announcement')
    return conn.sendMessage(from, { text: '🔒 Grupo cerrado, solo admins escriben' })
  }

  return conn.sendMessage(from, { text: '❌ Opción inválida: usa open o close' })
}

module.exports.command = ['group']

