import { MessageBot, World } from '@bhmb/bot'
import { UIExtensionExports } from '@bhmb/ui'
import { ConsoleExtensionExports } from '@bhmb/console'

import html from './control-panel.html'

function random(limit: number) {
    return Math.floor(Math.random() * limit)
}

function getRandomIp() {
    return `${random(256)}.${random(256)}.${random(256)}.${random(256)}`
}

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890: !@#$%^&*(){}[]|'
function getRandomName() {
    return Array.from({ length: random(13) + 3 })
        .map(() => alpha[random(alpha.length)])
        .join('')
}

function findParent(className: string, element: HTMLElement | null): HTMLElement {
    while (element && !element.classList.contains(className)) element = element.parentElement
    if (element) return element
    throw new Error('No root member found.')
}

function getName(target: HTMLElement) {
    return findParent('box', target).querySelector('.name')!.textContent!
}

MessageBot.registerExtension('control-panel', ex => {
    const world = ex.bot.world as World & { _api: import('./fake-api').Api }
    const ui = ex.bot.getExports('ui') as UIExtensionExports
    const { log } = ex.bot.getExports('console') as ConsoleExtensionExports
    ui.notify('Use the Control Panel tab to make stuff happen in the server.')

    const tab = ui.addTab('Control Panel')
    tab.innerHTML = html

    const template = tab.querySelector('template')!
    const container = tab.querySelector('.messages-container') as HTMLElement

    tab.querySelector('.is-adding-message')!.addEventListener('click', event => {
        const name = ((event as MouseEvent).ctrlKey && prompt('Enter a name') || getRandomName())
            .toUpperCase()
            .split('')
            .filter(char => alpha.includes(char))
            .join('')
        const ip = getRandomIp()
        const id = 'a'.repeat(32)
        const player = world.getPlayer(name)
        world._api.addFakeMessage(`WORLD - Player Connected ${name} | ${ip} | ${id}`)

        ui.buildTemplate(template, container, [
            { selector: '.name', text: name },
            { selector: 'select', value: player.isAdmin ? 'admin' : player.isMod ? 'mod' : 'player' }
        ])
    })

    container.addEventListener('click', event => {
        const target = event.target as HTMLElement
        if (target.dataset.do === 'delete') {
            world._api.addFakeMessage(`WORLD - Player Disconnected ${getName(target)}`)
            findParent('box', target).remove()
            event.stopPropagation()
        }
    })

    container.addEventListener('keydown', event => {
        const target = event.target as HTMLElement
        if (target instanceof HTMLInputElement && event.code == 'Enter') {
            const text = target.value
            target.value = ''
            world._api.addFakeMessage(`${getName(target)}: ${text}`)
            event.stopPropagation()
        }
    })

    container.addEventListener('change', async event => {
        const target = event.target as HTMLElement
        if (target instanceof HTMLSelectElement) {
            const name = getName(target)
            let lists = await world.getLists()
            lists = {
                ...lists,
                adminlist: lists.adminlist.filter(n => n !== name),
                modlist: lists.modlist.filter(n => n !== name),
            }
            switch (target.value) {
                case 'admin':
                    world.setLists({ ...lists, adminlist: lists.adminlist.concat(getName(target)) })
                    break
                case 'mod':
                    world.setLists({ ...lists, modlist: lists.modlist.concat(getName(target))})
                    break
                case 'player':
                    world.setLists(lists)
                    break
            }
            log(`Made ${name} into a ${target.value}`)
            event.stopPropagation()
        }
    })
})
