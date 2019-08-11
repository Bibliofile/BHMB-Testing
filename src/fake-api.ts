import { 
    WorldInfo,
    WorldApi,
    WorldLists,
    WorldOverview,
    LogEntry,
    WorldStatus
} from 'blockheads-api-interface'

export async function getWorlds(): Promise<WorldInfo[]> {
    return [{ name: "WORLD", id: "bhmb-testing"}]
}

// TODO: Fill this in with some real looking logs.
const serverLogs: LogEntry[] = []

export class Api implements WorldApi {
    name: string
    id: string
    private status: WorldStatus = 'online'
    private messageId = 0
    private queue: { id: number, message: string }[] = []
    private lists: WorldLists = {
        whitelist: [],
        blacklist: [],
        adminlist: [],
        modlist: []
    }

    constructor(info: WorldInfo) {
        this.name = info.name
        this.id = info.id
    }

    async getLists(): Promise<WorldLists> {
        return { ...this.lists }
    }

    async setLists(lists: WorldLists): Promise<void> {
        this.lists = { ...this.lists, ...lists }
    }

    async getOverview(): Promise<WorldOverview> {
        return {
            name: "WORLD",
            online: [], // TODO: It would be nice to get this from somewhere so it stays up to date.
            created: new Date(),
            credit_until: new Date(),
            last_activity: new Date(),
            link: 'https://forums.theblockheads.net/t/the-message-bot/18040',
            owner: 'BIBLIOPHILE',
            password: false,
            privacy: 'public',
            pvp: true,
            size: '1/16x',
            status: this.status,
            whitelist: false
        }
    }

    async getLogs(): Promise<LogEntry[]> {
        return serverLogs
    }

    async send(message: string): Promise<void> {
        // Messages starting with / never come from the server.
        if (!message.startsWith('/')) {
            this.addFakeMessage(`SERVER: ${message}`)
        }
    }

    async getMessages(lastId: number): Promise<{ nextId: number; log: string[]; }> {
        const log = this.queue.filter(({ id }) => lastId <= id)
            .map(({ message }) => message)

        // Don't keep too many messages around.
        this.queue = this.queue.slice(-100)
    
        return {
            nextId: this.messageId,
            log
        }
    }

    addFakeMessage(message: string) {
        this.queue.push({ message, id: this.messageId++ })
    }

    async getStatus(): Promise<WorldStatus> {
        return this.status
    }

    async start(): Promise<void> {
        this.status = 'startup'
        setTimeout(() => this.status = 'online', 1000)
    }

    async stop(): Promise<void> {
        this.status = 'stopping'
        setTimeout(() => this.status = 'offline', 1000)
    }

    async restart(): Promise<void> {
        this.stop()
        setTimeout(() => this.start(), 2000)
    }
}