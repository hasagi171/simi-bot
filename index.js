const { create } = require('@open-wa/wa-automate')
const msgHandler = require('./msgHandler')
const fs = require('fs-extra')

const serverOption = {
    headless: true,
    cacheEnabled: false,
    useChrome: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async (client) => {
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
        })
        // listening on message
        client.onMessage((message) => {
            msgHandler(client, message)
        })

       client.onGlobalParicipantsChanged(async (heuh) => {
            await welcome(client, heuh)
            //left(client, heuh)
            })
        
        client.onAddedToGroup((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 255) { 
                client.sendText(chat.id, `BOT TIDAK BISA DIMASUKAN KEDALAM GROUP !`).then(() => client.leaveGroup(chat.id))
                client.deleteChat(chat.id)
            } else {
                client.sendText(chat.groupMetadata.id, `Terimakasih Telah mengundang BOT *${chat.contact.name}*. Harap DAftarkan Grup ke owner BOT wa.me/6285156842288`)
            }
        })

        // listening on Incoming Call
        client.onIncomingCall((call) => {
            client.sendText(call.peerJid, '*Telfon Simi auto Block Ya*')
            client.contactBlock(call.peerJid)
        })
    }

create('session', serverOption)
    .then(async (client) => startServer(client))
    .catch((error) => console.log(error))
