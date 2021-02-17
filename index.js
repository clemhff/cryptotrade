const {trade} = require('./functions/trade');
const {checkTable} = require('./toolbox/databaseCheck');
const {predict} = require('./functions/pred_func');
const {analyseData, decisionMaker, lastTicker} = require('./functions/decision');
////
///////////////////////////////////////////////////////////////////

checkTable('orderhist');
checkTable('balance');


setInterval(function(){
    (async () => {
      let myTrade = await trade('adausdt', 'ADA', 'USDT', Date.now(), 0.006, 0.004, 1);
    })()

}, 3000);




//////////////////////////////////////////////////////////////////////////////////////
/*
Date.now()
1612010700000
*/

/*/// for test
let X_array = [
  0.04259,0.04259,0.04256,0.04249,
  0.04248,0.04247,0.04249,0.04249,
  0.04249,0.04249,0.04261,0.0426,
  0.04256,0.04256,0.04248,0.04248,
  0.04247,0.04249,0.04249,0.04249,
  0.04265,0.04264,0.04256,0.04259,
  0.04248,0.04248,0.0425,0.04249,
  0.04249,0.04249,0.04251,0.04255,
  0.04256,0.04249,0.04248,0.04247,
  0.04247,0.04249,0.04249,0.04249,
  186451.7,147515.6,6301.0,66973.9,
  0.0,710.7,28685.0,0.0,
  19854.8,0.0,32.0,41.0,
  2.0,23.0,0.0,2.0,
  8.0,0.0,1.0,0.0
];

(async (X) => {
  let data = await analyseData('adausdt', 1612010700000, 1);
  console.log(data);
  let decision = await decisionMaker('BUY', data);
  console.log('The final decision is ' + decision);
})(X_array)*/
