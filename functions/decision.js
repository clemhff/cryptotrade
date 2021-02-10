const RSI = require('technicalindicators').RSI;
const MACD = require('technicalindicators').MACD;
const q = require('../toolbox/queryList');
const {dbPoolTest} = require('../toolbox/dbtest');
const { Pool, Client } = require('pg');
const {connId} = require('../env/dbId');

const pool = new Pool(connId);



const selectData = async(symbol, ttime, interval, lengthReg) => {
  let timestampNow = ttime //new Date().getTime();
  let timestampNowTruncate = timestampNow + (-(timestampNow % 60000));
  resData = [];
  for(let i = 0 ; i < (lengthReg*interval) ; i += interval) {
    const loadData = await pool.query(q.getTicker (symbol, String(timestampNowTruncate-(i*60000)))); // get a ticker price
    resData.unshift(Number(loadData.rows[0].open));
    //console.log(timestampNowTruncate-(i*60000));
    //console.log(loadData.rows);
  }
  return resData;
}

const reglin = async(data) => {
  let lengthReg = data.length;
  console.log(lengthReg);
  let coef = 0;
  for (let i = 0; i < lengthReg-1; i++) {
    let diff = Number(data[lengthReg - 1 - i]) -  Number(data[lengthReg - 2 - i]) ;
    //console.log(data[lengthReg - 1 - i]);
    //console.log(data[lengthReg - 2 - i]);
    //console.log(diff);
    coef = coef + diff;

  }
  return coef/(lengthReg-2) ;
}


exports.analyseData = async(symbol, ttime, interval) => {
  const data40 = await selectData(symbol, ttime, interval, 40);
  const reg40 = await reglin(data40);
  console.log(reg40);

  const data30 = await selectData(symbol, ttime, interval, 30);
  const reg30 = await reglin(data30);
  console.log(reg30);

  const data15 = await selectData(symbol, ttime, interval, 15);
  const reg15 = await reglin(data15);
  console.log(reg15);


  return [data40, reg40, reg30, reg15]
}



exports.decisionMaker = async(mode, data) => {
  let finalDecision = '';

  if(mode === 'BUY') {
    //console.log(data[0]);
    let lastTicker = data[0][39];
    console.log(lastTicker*0.0025);

    let reg40onTen = ((data[1] * 10) >= (lastTicker * 0.001) );
    console.log(reg40onTen);
    let reg30onTen = ((data[2] * 10) >= (lastTicker * 0.002) ) ;
    console.log(reg30onTen);
    let reg15onTen = ((data[3]* 10) >= (lastTicker * 0.003) ) ;
    console.log(reg15onTen);

    finalDecision = (reg40onTen === true && reg30onTen === true ) ? 'BUY' : 'DON\'T BUY';
  }

  if(mode === 'SELL') {

    let lastTicker = data[0][39];

    //console.log(data[1]);
    let reg30onTen = ((data[2] * 10) < (lastTicker  * 0.0005) ) ;
    console.log(reg30onTen);
    let reg15onTen = ((data[3]* 10) < (lastTicker  * (-0.0015)) ) ;
    console.log(reg15onTen);
    let highLow = (data[0][39] < (data[0][38] * 0.995) );
    console.log(highLow);

    if(highLow === true){
      finalDecision = 'HIGH LOW';
    }
    else {
      if(reg15onTen === true){
        finalDecision = '15 REG MIN';
      }
      else {
        if(reg30onTen === true){
          finalDecision = '30 REG MIN';
        }
        else {
          finalDecision = 'DON\'T SELL';
        }
      }

    }



  }


  return finalDecision ;

}




exports.lastTicker= async(symbol, ttime) => {
  timestampNow = ttime //new Date().getTime();
  timestampNowTruncate = timestampNow + (-(timestampNow % 60000));

  const loadData = await pool.query(q.getTicker (symbol, String(timestampNowTruncate))); // get a ticker price

  return loadData.rows[0]

}
