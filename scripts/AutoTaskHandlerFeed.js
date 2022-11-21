const { ethers } = require('ethers')
const axios = require('axios')


// get your data
const getNewsFeeds = async () => {}

const signer = new ethers.Wallet('PRIVATE_KEY', new ethers.providers.JsonRpcProvider('https://dev-rpc.debounce.network'))
const demo = new ethers.Contract('0x0EB32f0Ab3797117148B0Dd0C996ED61f9c9b91A', 'CONTRACT_ABI', signer)

exports.handler = async function(_) {
    let results = await getNewsFeeds()
    results = results.length <= 10 ? results : results.slice(0,10)
    results.reverse()
    for(const data of results){
        try {
            const tx = await demo.write("0xFABB0ac9d68B0B445fB7357272Ff202C5651694a", `${data?.title}&url=${data?.url}`)
            const result = await tx.wait()
            if (result.status !== 1) console.log(`[write]fail!`)
            else console.log(`[write]success:${data?.title}`)
        } catch (e) {
            console.log('error!', e)
        }
    }
   
    return null
}
