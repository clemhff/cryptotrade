const RSI = require('technicalindicators').RSI;
const MACD = require('technicalindicators').MACD;
const q = require('../toolbox/queryList');
const {dbPoolTest} = require('../toolbox/dbtest');
const { Pool, Client } = require('pg');
const {connId} = require('../env/dbId');
const {predict} = require('./pred_func');

const pool = new Pool(connId);


function extractProp(arr, prop) {
  let result = [];
  for (var i = 0; i < arr.length; i++) {
    result.push(arr[i][prop])
  }
  return result;
}


const selectData = async(symbol, ttime, interval, lengthReg) => {
  let timestampNow = ttime //new Date().getTime();
  let timestampNowTruncate = timestampNow + (-(timestampNow % 60000));
  resData = [];
  for(let i = 0 ; i < (lengthReg*interval) ; i += interval) {
    const loadData = await pool.query(q.getTicker (symbol, String(timestampNowTruncate-(i*60000)))); // get a ticker price
    //console.log(loadData.rows);
    resData.push(loadData.rows[0]);
    //console.log(timestampNowTruncate-(i*60000));
    //console.log(loadData.rows);
  }

  let open = extractProp(resData, 'open');
  let close = extractProp(resData, 'close');
  let high = extractProp(resData, 'high');
  let low = extractProp(resData, 'low');
  let volume = extractProp(resData, 'volume');
  let trade = extractProp(resData, 'trade');

  let dataFormatted = [...open, ...close, ...high, ...low, ...volume, ...trade]

  //console.log(dataFormatted.length)
  //console.log(resData);

  return dataFormatted;
}


exports.analyseData = async(symbol, ttime, interval) => {
  const data10 = await selectData(symbol, ttime, interval, 10);
  return data10
}



exports.decisionMaker = async(mode, data) => {
  let finalDecision = '';

  if(mode === 'BUY') {

    let prediction= await predict(data);
    console.log(prediction.json.sup);


    finalDecision = (prediction.json.sup > 0.9) ? 'BUY' : 'DON\'T BUY';
  }

  if(mode === 'SELL') {
    finalDecision = 'SELL'
  }


  return finalDecision ;

}
