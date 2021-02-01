exports.tables = `
  SELECT table_name
  FROM information_schema.tables
  WHERE table_type='BASE TABLE'
  AND table_schema NOT IN ('information_schema', 'pg_catalog');
`

exports.tableName =  (table) => `
select table_schema,
       table_name
from information_schema.tables
where table_name like '%${table}%'
    and table_schema not in ('information_schema', 'pg_catalog')
    and table_type = 'BASE TABLE'
order by table_name,
       table_schema;
`


exports.tableColumn =  (table) => `
select column_name,
       data_type
from information_schema.columns
where table_name =  '${table}'
`

exports.tableColumnType =  (table, column) => `
select column_name,
       data_type
from information_schema.columns
where table_name =  '${table}' and column_name='${column}'
`


exports.createTable = (table) => {
  let query = null;
  switch (table) {
    case 'orderhist':
      query = `CREATE TABLE orderhist (
                  id SERIAL  PRIMARY KEY,
                  timestamp BIGINT,
                  symbol VARCHAR(10),
                  mode VARCHAR(4),
                  quantity NUMERIC(12, 8),
                  price NUMERIC(12, 8)
              );`
      break;
      case 'balance':
        query = `CREATE TABLE balance (
                    id SERIAL  PRIMARY KEY,
                    timestamp BIGINT,
                    symbol VARCHAR(10),
                    quantity NUMERIC(12, 8)
                );`
        break;
    default:
      console.log(`Sorry, no parameter for this table`);
  }
  return query;
}

exports.createIndexTimestamp= (table) => {
  let query = `CREATE INDEX idx_${table}_timestamp
               ON ${table}(timestamp);`
  return query;
}

/*
exports.insertOrder =  (table, timestamp, open, high, low, close, volume, quoteasset, trade, takerbuybase,takerbuyquote) => `
INSERT INTO ${table}(timestamp, open, high, low, close, volume, quoteasset, trade, takerbuybase,takerbuyquote)
VALUES ('${timestamp}','${open}',${high},${low},${close},${volume},${quoteasset},${trade},${takerbuybase},${takerbuyquote});
`

exports.lastOrder =  (table) => `
SELECT MAX(timestamp)
FROM ${table} ;
`
*/

exports.getTicker =  (table,timestamp) => `
SELECT open
FROM ${table}
WHERE  timestamp = '${timestamp}' ; 
`
