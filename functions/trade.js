const {analyseData, decisionMaker, lastTicker} = require('./decision');
const {balance, buy, sell, mode, insertBalance, ticker} = require('./binance');



exports.trade = async (symbol, base, quote, theTime, high, low, intervalData) => {
  console.log(`////////////////////////// NEW TRADE FUNCTION`);
  let sMode = await mode(symbol);
  //console.log(sMode.result);
  console.log(sMode.mode);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if(sMode.mode === 'BUY'){
    if((Date.now()% 60000) > 5000 ) {

      data = await analyseData(symbol, theTime, intervalData); //input timestamp
      console.log(data);
      //onsole.log('GET DATA Ok');

      let decision = await decisionMaker('BUY', data);
      console.log('The final decision is ' + decision);

      if(decision === 'BUY') {
        let balanceRes = await balance(quote);
        let insertB = await insertBalance(quote , balanceRes.free)
        console.log('The balance for ' + balanceRes.asset + ' est de ' + balanceRes.free);
        console.log(insertB.rowCount === 1 ? 'Success insertion balance ' : ' Fail to insert balance');
        if ((Number(balanceRes.free)) > 5) {
          //console.log('inserting');
          let buyRes = await buy(symbol, (balanceRes.free)); // put quote order quantity
        }
        else {
          console.log('ERROR empty wallet');
        }
      }


    }
    else {
      console.log(`

        waiting 1min data

        `);
    }
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  if(sMode.mode === 'SELL') {

    /// make a realtime request to biannce for the getTicker
    let actualPrice = await ticker(symbol);
    console.log(actualPrice);

    let buyPrice = Number(sMode.result.price);
    console.log(buyPrice);

    if(actualPrice > (buyPrice + (buyPrice * high))){
        console.log('SELL High');
        let balanceRes = await balance(base);
        let insertB = await insertBalance(base , balanceRes.free)

        let sellRes = await sell(symbol, balanceRes.free, 'HIGH'); // put quote order quantity

      }
    else if(actualPrice < (buyPrice - (buyPrice * low ))){
        console.log('SELL low');

        let balanceRes = await balance(base);
        let insertB = await insertBalance(base , balanceRes.free)

        let sellRes = await sell(symbol, balanceRes.free , 'LOW'); // put quote quantity

      }
    else {
        console.log('price in the limits');
      }


  }

  console.log(`


    `);
}
