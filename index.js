const {analyseData, decisionMaker} = require('./functions/decision');
const {checkTable} = require('./toolbox/databaseCheck');


///////////////////////////////////////////////////////////////////

checkTable('orderhist');
checkTable('balance');

//////////////////////////////////////////////////////////////////////////////////////

(async () => {
  data = await analyseData('adausdt', 1612010700000, 45);
  //console.log(data);
  let decision = await decisionMaker('BUY', data);
  console.log('The final decision is ' + decision);
})()

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
