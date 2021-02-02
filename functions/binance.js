const crypto = require('crypto');
const axios = require('axios');
const {keys} = require('../env/dbId');

exports.balance = async(token) => {

  let burl = "https://api.binance.com";
  let endPoint = "/api/v3/account";
  let dataQueryString ="timestamp=" + Date.now();

  let signature = crypto.createHmac('sha256',keys['skey']).update(dataQueryString).digest('hex');
  let url = burl + endPoint + '?' + dataQueryString + '&signature=' + signature;

  //console.log(url);

  let options = {
    method: 'get',
    url: url,
    timeout: 1000,
    headers: {'X-MBX-APIKEY': keys['akey'] }
  }
  let res = null;
  try {
    res = await axios(options);
  } catch (err) {
    console.error("Error response:");
    console.error(err.response.data);    // ***
    console.error(err.response.status);  // ***
    console.error(err.response.headers); // ***
  }

  //console.log(res.data.balances);
  let myBalance = res.data.balances.find(element => element.asset === token);
  //console.log(myBalance);

  return myBalance ;


}







  /*/////////////////////////////////////////////////////////////

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
