const { ethers } = require('ethers')

const signer = new ethers.Wallet('PRIVATE_KEY', new ethers.providers.JsonRpcProvider('https://dev-rpc.debounce.network'))
const demo = new ethers.Contract('0x0EB32f0Ab3797117148B0Dd0C996ED61f9c9b91A', 'CONTRACT_ABI', signer)

exports.handler = async function(event) {
    const targetEvent = event?.request?.body?.matchReasons[1] || null
    const eventName = targetEvent?.signature || null
    if (!eventName) {
        console.log('!eventName')
        return
    }
    try {
        if (eventName.toLowerCase().indexOf('clear') !== -1) { // clear
            const account = targetEvent?.params?.account || null
            
            if (!account) {
                console.log('!sender')
                return
            }
            
            const tx = await demo.clear(account)
            const result = await tx.wait()
            if (result.status !== 1) console.log(`[clear]error!:${account}`)
            else console.log(`[clear]success!:${account}`)
        } else {
            const account = targetEvent?.params?.account || null
            const message = targetEvent?.params?.message || null
            
            if (!account || !message) {
                console.log(`!account or !message`)
                return
            }
            
            const tx = await demo.write(account, message)
            const result = await tx.wait()
            if (result.status !== 1) console.log(`[write]error!: ${account}`)
            else console.log(`[write]success: ${account},${message}`)
        }
    } catch (e) {
        console.log('error!', e)
    }
    return null
}
