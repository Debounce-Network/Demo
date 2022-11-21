import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import '@openzeppelin/hardhat-upgrades'
import { removeConsoleLog } from 'hardhat-preprocessor'

const getNetworkAccount = (): { mnemonic: string; initialIndex: number } => {
    try {
        return { mnemonic: require('./secrets.json').mnemonic, initialIndex: 0 }
    } catch (e) {
        return { mnemonic: 'test test test test test test test test test test test junk', initialIndex: 0 }
    }
}

export default {
    preprocess: {
        eachLine: removeConsoleLog((hre) => {
            return !hre.network.name.includes('hardhat')
        })
    },
    solidity: {
        version: '0.8.9',
        settings: {
            evmVersion: 'london',
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        hardhat: {
            forking: {
                url: 'https://dev-rpc.debounce.network/'
            },
            accounts: getNetworkAccount(),
            gasPrice: 35e9,
            timeout: 3000000
        },
        debounce: {
            url: 'https://dev-rpc.debounce.network/',
            networkId: 3306,
            accounts: getNetworkAccount(),
            gas: 'auto',
            gasPrice: 'auto'
        },
        matic: {
            url: 'https://polygon-rpc.com',
            networkId: 137,
            accounts: getNetworkAccount(),
            gasPrice: 'auto',
            timeout: 200000000
        },
        aurora: {
            url: 'https://mainnet.aurora.dev',
            networkId: 1313161554,
            accounts: getNetworkAccount(),
            gasPrice: 'auto',
            timeout: 200000000
        },
        auroraTest: {
            url: 'https://testnet.aurora.dev',
            networkId: 1313161555,
            accounts: getNetworkAccount(),
            gasPrice: 'auto',
            timeout: 200000000
        }
    },
    mocha: {
        timeout: 400000000
    }
}
