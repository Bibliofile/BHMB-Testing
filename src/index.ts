import { MessageBot as CustomBot } from './bot'
import { MessageBot, SimpleEvent } from '@bhmb/bot'
import { Storage } from './storage'
import { Api, getWorlds } from './fake-api'
import '@bhmb/ui'
import '@bhmb/messages'
import '@bhmb/console'
import './settings'
import './extensions'
import './control-panel'

(window as any)['@bhmb/bot'] = { MessageBot, SimpleEvent }

MessageBot.dependencies = { Api, getWorlds, fetch }

async function main() {
    const [info] = await getWorlds()
    const bot = (window as any).bot = new CustomBot(new Storage(`/${info.id}`), info)
    console.info('You can access the global `bot` on the console here for easier debugging. THIS IS NOT AVAILABLE ON THE BOT THAT RUNS ON THE PORTAL!!!')
    bot.addExtension('ui')
    bot.addExtension('console')
    bot.addExtension('messages')
    bot.addExtension('settings')
    bot.addExtension('extensions')
    bot.addExtension('control-panel')
    // Start on control panel page, not console page
    document.querySelectorAll<HTMLElement>('.nav-item').forEach(el => {
        if (el.textContent === 'Control Panel') el.click()
    })

    bot.start()
    await bot.world.start()
    await bot.world.getLists(true)
}
main().catch(console.log)

