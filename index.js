const RSI = require('technicalindicators').RSI;
const MACD = require('technicalindicators').MACD;
const q = require('./toolbox/queryList');
const axios = require('axios');
const {dbPoolTest} = require('./toolbox/dbtest');
const { Pool, Client } = require('pg');
const {connId} = require('./env/dbId');

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


////////////////////////////////////////////////////////////////////////////////
