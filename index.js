const {analyseData, decisionMaker, lastTicker} = require('./functions/decision');
const {checkTable} = require('./toolbox/databaseCheck');
const {balance, buy, sell, mode} = require('./functions/binance');

///////////////////////////////////////////////////////////////////

checkTable('orderhist');
checkTable('balance');

//////////////////////////////////////////////////////////////////////////////////////

(async (symbol, token, theTime) => {
  let sMode = await mode(symbol);
  //console.log(sMode.result);
  console.log(sMode.mode);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if(sMode.mode === 'BUY'){

    data = await analyseData(symbol, theTime, 45); //input timestamp
    //console.log(data[0][data[1].length-1]);
    //console.log(data[0]);
    let decision = await decisionMaker('BUY', data);
    console.log('The final decision is ' + decision);

    if(decision === 'BUY') {
      let balanceRes = await balance('USDT');
      console.log(typeof balanceRes.free);

      if ((Number(balanceRes.free) + 6) > 5) {
        console.log('inserting');
        let buyRes = await buy(symbol, (balanceRes.free + 10)); // put quote order quantity
      }

    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }
  if(sMode.mode === 'SELL') {

    theLastTicker = await lastTicker(symbol, theTime);

    buyPrice = Number(sMode.result.price);
    actualPrice = Number(theLastTicker.open);
    console.log(buyPrice);
    console.log(actualPrice);

    if(actualPrice > (buyPrice + (buyPrice * 0.01))){
      let balanceRes = await balance(token);
      let sellRes = await sell('symbol', balanceRes.free, 'HIGH'); // put quote order quantity
    }
    if(actualPrice < (buyPrice - (buyPrice * 0.01))){
      let balanceRes = await balance(token);
      let sellRes = await sell('symbol', balanceRes.free, 'LOW'); // put quote order quantity
    }
  }


})('adausdt', 'ADA', 1612010700000)

/*////////////////////////////////////////////////////////////////////////////////

//Global Modules
const crypto = require('crypto');


var burl = "https://api.binance.com";
var endPoint = "/api/v3/order";
var dataQueryString = "symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=0.003&price=6200&recvWindow=20000&timestamp=" + Date.now();

var keys = {
    "akey" : '',
    "skey" : ''
}

var signature = crypto.createHmac('sha256',keys['skey']).update(dataQueryString).digest('hex');

var url = burl + endPoint + '?' + dataQueryString + '&signature=' + signature;

options = {
  method: 'post',
  url: url,
  timeout: 1000,
  headers: {'X-MBX-APIKEY': keys['akey'] }
}

axios(options)
*/
