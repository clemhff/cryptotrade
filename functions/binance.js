const crypto = require('crypto');
const axios = require('axios');
const q = require('../toolbox/queryList');
const {dbPoolTest} = require('../toolbox/dbtest');
const { Pool, Client } = require('pg');
const {keys, connId} = require('../env/dbId');

const pool = new Pool(connId);


exports.mode = async(symbol) => {

  const saveOrder = await pool.query(q.getLastOrder(symbol));
  //console.log(saveOrder.rows[0].mode);
  console.log(saveOrder.rows.length);
  let response = {};
  if(saveOrder.rows.length === 0){
    response = {
      mode :  'BUY', // inversion warning
      result: null
    }
  }
  if(saveOrder.rows.length === 1){
    response = {
      mode : (saveOrder.rows[0].mode === 'BUY' ? 'SELL' : 'BUY'), // inversion warning
      result: saveOrder.rows[0]
    }
  }

  return response;

}



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

exports.buy = async(symbol, quantity) => {
  let timestamp = Date.now();
  let mode = 'BUY'
  let price = 0.36
  const saveOrder = await pool.query(q.insertOrder(timestamp, symbol, mode, quantity, price, ''));
  console.log((saveOrder.rowCount === 1 ? 'SUCCESS' : 'FAIL'));

}

exports.sell = async(symbol, quantity, info) => {
  let timestamp = Date.now();
  let mode = 'SELL'
  let price = 0.3402
  const saveOrder = await pool.query(q.insertOrder(timestamp, symbol, mode, quantity, price, info));
  console.log((saveOrder.rowCount === 1 ? 'SUCCESS' : 'FAIL'));

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
