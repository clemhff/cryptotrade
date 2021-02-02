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
  //console.log(data);

  var macdInput = {
    values            : data,
    fastPeriod        : 12,
    slowPeriod        : 26,
    signalPeriod      : 9 ,
    SimpleMAOscillator: false,
    SimpleMASignal    : false
  }

  let macdResult = MACD.calculate(macdInput);
  macdResult = macdResult.slice(9)
  let macdHist = macdResult.map(x => x.histogram);
  //console.log(macdHist);

  var inputRSI = {
    values : data,
    period : 12
  };
  let rsiResult = RSI.calculate(inputRSI);
  rsiResult = rsiResult.slice(22)
  //console.log(rsiResult);

  return [data, macdHist, rsiResult]
}



exports.decisionMaker = async(mode, analysedData) => {
  let MACD = analysedData[1].slice() ;
  let RSI = analysedData[2].slice() ;
  let MACDlength = MACD.length-1;
  /*console.log(MACDlength);
  console.log(MACD[MACDlength]);*/

  let shortMACD = (MACD[MACDlength] - MACD[MACDlength - 1 ]) / 90 ;
  let mediumMACD =  (MACD[MACDlength] - MACD[MACDlength - 3 ]) / (3*45);
  let longMACD = (MACD[MACDlength] - MACD[MACDlength - 5 ]) / (5*45);
  /*console.log(shortMACD);
  console.log(mediumMACD);
  console.log(longMACD);*/


  let MacdUp = (MACD[MACDlength] > 0 &&  MACD[MACDlength - 1 ] > 0 && shortMACD > 0 && mediumMACD > 0 && longMACD > 0 );
  console.log('MACD indique ' + MacdUp);

  let RSIlength = RSI.length-1;
  let shortRSI = (RSI[RSIlength] - RSI[RSIlength - 1 ]) / 90 ;
  let mediumRSI =  (RSI[RSIlength] - RSI[RSIlength - 3 ]) / (3*45);
  /*console.log(shortRSI);
  console.log(mediumRSI);*/

  let RsiUp = (RSI[RSIlength] > 30 && RSI[RSIlength] < 65 && shortRSI > 0 && mediumRSI > 0);
  console.log('RSI indique ' + RsiUp);

  let finalDecision = (MacdUp === true && RsiUp === true);

  return finalDecision === true ? 'BUY' : 'DON\'T BUY' ;

}


exports.lastTicker= async(symbol, ttime) => {
  timestampNow = ttime //new Date().getTime();
  timestampNowTruncate = timestampNow + (-(timestampNow % 60000));

  const loadData = await pool.query(q.getTicker (symbol, String(timestampNowTruncate))); // get a ticker price

  return loadData.rows[0]

}
