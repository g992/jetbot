const fs = require("fs")
require('dotenv').config();
const Binance = require('node-binance-api')

let config, binance

const converter = {
    "binance-usdt-m": "Binance USDT Futures",
    "long": "LONG",
    "short": "SHORT",
    "percent": "%",
    "usdt": "$",
    "rsi_5min": "RSI 5m",
    "rsi_15min": "RSI 15m",
    "rsi_30min": "RSI 30m",
    "rsi_1h": "RSI 1H",
    "rsi_2h": "RSI 2H",
    "bollinger_bands_lower_5min": "Under BB 5m",
    "bollinger_bands_lower_15min": "Under BB 15m",
    "bollinger_bands_lower_30min": "Under BB 30m",
    "bollinger_bands_lower_1h": "Under BB 1H",
    "bollinger_bands_lower_2h": "Under BB 2H",
    "bollinger_bands_upper_5min": "Over BB 5m",
    "bollinger_bands_upper_15min": "Over BB 15m",
    "bollinger_bands_upper_30min": "Over BB 30m",
    "bollinger_bands_upper_1h": "Over BB 1H",
    "bollinger_bands_upper_2h": "Over BB 2H",
}

function getConfig(){
    try {
        console.log("Reading config...")
        const configContent = fs.readFileSync("config.jbc.json", "utf8");
        config = JSON.parse(configContent)

        console.log("Current config:")
        let configResCheck = `Bot name: ${config.name}\n` +
                               `Exchange: ${converter[config.exchange]}\n` +
                               `Pairs: ${config.pairs}\n` +
                               `Type: ${converter[config.algo]}\n` +
                               `Deposit: ${config.deposit}${converter[config.depositType]}\n` +
                               `Leverage: ${config.leverage}\n` +
                               `Filters: `

        const keys = Object.keys(config.filters)
        for(const key in keys){
            const filter = config.filters[keys[key]]['type']
            configResCheck += converter[filter] + ',  '
        }

        console.log(configResCheck)
        return true
    } catch (e){
        console.log("Error when reading config, exit")
        console.log(e)
        return false
    }
}

async function initBinance(){
    console.log("Binance initializing...")
    try {
        binance = new Binance().options({
            APIKEY: process.env.API_KEY,
            APISECRET: process.env.API_SECRET
        });
        console.log("Binance init success")
        return true
    } catch (e){
        console.log("Binance init error.")
        return false
    }
}

async function getBinanceAccountInfo(){
    try{
        console.log("Checking Binance Futures Account")
        const balances = await binance.futuresBalance({'recvWindow': 100000})
        for(const coin in balances){
            const asset = balances[coin]['asset']
            const balance = balances[coin]['balance']
            console.log(asset, balance)
        }
        return true

    } catch (e) {
        console.log("Binance Futures Account check error")
        return false
    }
}

async function main(){
    while (true){
        console.log("JetBot started.")

        const check_cfg = getConfig()
        if(!check_cfg) break

        const init_binance = await initBinance()
        if(!init_binance) break

        const check_binAcc = await getBinanceAccountInfo()
        if(!check_binAcc) break

        break;
    }
}

main()

