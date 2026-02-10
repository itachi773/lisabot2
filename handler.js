const fs = require('fs')
const path = require('path')

global.plugins = {}

const pluginsPath = path.join(__dirname, 'plugins')

// cargar plugins
for (const file of fs.readdirSync(pluginsPath)) {
  if (!file.endsWith('.js')) continue
  try {
    const plugin = require(path.join(pluginsPath, file))
    global.plugins[file] = plugin
  } catch (e) {
    console.log('❌ Error cargando plugin:', file, e)
  }
}

module.exports = async (conn, m) => {
  try {
    const msg = m.message
    if (!msg) return

    const from = m.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? m.key.participant : from

    // texto normalizado
    const body =
      msg.conversation ||
      msg.extendedTextMessage?.text ||
      msg.imageMessage?.caption ||
      msg.videoMessage?.caption ||
      ''

    // ejecutar plugins BEFORE (antilink, autolevel, etc)
    for (let name in global.plugins) {
      const plugin = global.plugins[name]
      if (typeof plugin.before === 'function') {
        const stop = await plugin.before(m, { conn, isGroup, sender })
        if (stop) return
      }
    }

    const prefix = global.prefix || '.'
    if (!body.startsWith(prefix)) return

    const args = body.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase() || ''
    const text = args.join(' ')

    // recorrer plugins de comandos
    for (let name in global.plugins) {
      const plugin = global.plugins[name]
      if (!plugin || !plugin.command) continue

      let isMatch = false

      if (typeof plugin.command === 'string') {
        isMatch = plugin.command === command
      } else if (plugin.command instanceof RegExp) {
        isMatch = plugin.command.test(command)
      } else if (Array.isArray(plugin.command)) {
        isMatch = plugin.command.includes(command)
      }

      if (!isMatch) continue

      // validaciones básicas
      if (plugin.group && !isGroup) return
      if (plugin.private && isGroup) return

      await plugin(m, {
        conn,
        args,
        text,
        command,
        usedPrefix: prefix,
        sender,
        isGroup
      })
      break
    }
  } catch (e) {
    console.error('❌ Handler error:', e)
  }
}


