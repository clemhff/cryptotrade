const RSI = require('technicalindicators').RSI;
const MACD = require('technicalindicators').MACD;
const q = require('../toolbox/queryList');
const {dbPoolTest} = require('../toolbox/dbtest');
const { Pool, Client } = require('pg');
const {connId} = require('../env/dbId');

const pool = new Pool(connId);





exports.analyseData = async(symbol, ttime, interval) => {
  timestampNow = ttime //new Date().getTime();
  timestampNowTruncate = timestampNow + (-(timestampNow % 60000));
  data = [];
  for(let i = 0 ; i < (50*interval) ; i += interval) {
    const loadData = await pool.query(q.getTicker (symbol, String(timestampNowTruncate-(i*60000)))); // get a ticker price
    data.unshift(Number(loadData.rows[0].open));
    //console.log(timestampNowTruncate-(i*60000));
    //console.log(loadData.rows);
  }
  console.log(data);

  var macdInput = {
    values            : data,
    fastPeriod        : 12,
    slowPeriod        : 26,
    signalPeriod      : 9 ,
    SimpleMAOscillator: false,
    SimpleMASignal    : false
  }

  let macdResult = MACD.calculate(macdInput);
  //macdResult = macdResult.slice(12)
  let macdHist = macdResult.map(x => x.histogram);
  //console.log(macdHist);

  var inputRSI = {
    values : data,
    period : 12
  };
  let rsiResult = RSI.calculate(inputRSI);
  //console.log(rsiResult);

  return [data, macdHist, rsiResult]
}
