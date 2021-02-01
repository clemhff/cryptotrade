const q = require('./toolbox/queryList');
const axios = require('axios');
const {dbPoolTest} = require('./toolbox/dbtest');
const { Pool, Client } = require('pg');
const {connId} = require('./env/dbId');
const {analyseData} = require('./functions/decision');


const pool = new Pool(connId);


///////////////////////////////////////////////////////////////////

const checkTable = async(table) => {
  const tableExist = await pool.query(q.tableName(table));
  if(tableExist.rows.length === 0){

    console.log('Table ' + table + ' doesn\'t exist');
    const createTable = await pool.query(q.createTable(table)); // create table
    const createIndex= await pool.query(q.createIndexTimestamp(table)); // create index
    console.log('Table ' + table + ' created');
  }
};

checkTable('orderhist');
checkTable('balance');

//////////////////////////////////////////////////////////////////////////////////////

(async () => {
  console.log(await analyseData('adausdt', 1612080000000, 45))
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
