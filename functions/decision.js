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
    //console.log(loadData.rows);
    resData.unshift(Number(loadData.rows[0].close));
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

const movingAverage = async(data, length, before) => {
    let lengthReg = data.length + before ;
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum = sum + data[lengthReg - i - 1]
      //console.log(data[lengthReg - i - 1]);
    }
    return sum/length
}


exports.analyseData = async(symbol, ttime, interval) => {
  const data40 = await selectData(symbol, ttime, interval, 40);

  const data15 = await selectData(symbol, ttime, interval, 15);
  const reg15 = await reglin(data15);
  console.log(reg15);

  const  ma7 = await movingAverage(data40, 7 , 0);
  console.log(ma7);

  const  ma7m1 = await movingAverage(data40, 7 , -1);
  console.log(ma7m1);

  const  ma7m2 = await movingAverage(data40, 7 , -2);
  console.log(ma7m2);

  const  ma7m5 = await movingAverage(data40, 7 , -5);
  console.log(ma7m5);

  const  ma25 = await movingAverage(data40, 25 , 0);
  console.log(ma25);

  const  ma25m1 = await movingAverage(data40, 25 , -1);
  console.log(ma25m1);

  const  ma25m2 = await movingAverage(data40, 25 , -3);
  console.log(ma25m2);

  const  ma25m5 = await movingAverage(data40, 25 , -5);
  console.log(ma25m5);



  return [data40, reg15, ma7, ma7m1, ma7m2 ,ma7m5, ma25, ma25m1, ma25m2, ma25m5]
}



exports.decisionMaker = async(mode, data) => {
  let finalDecision = '';

  if(mode === 'BUY') {
    //console.log(data[0]);
    let lastTicker = data[0][39];

    let reg15onTen = ((data[3]* 10) >= (lastTicker * 0.003) ) ;
    //console.log(reg15onTen);

    let seeDown = data[4] - data[5] < 0 // moyenne mobile descend
    console.log('seeDown is ' + seeDown);
    let seeUp = data[2] - data[3] > (lastTicker * 0.002)
    console.log('seeUp is ' + seeUp);

    finalDecision = (seeDown === true && seeUp === true ) ? 'BUY' : 'DON\'T BUY';
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
