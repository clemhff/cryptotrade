const { exec } = require('child_process')
const {path} = require('../env/dbId');

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error)
      resolve({"out":stdout.slice(0, -1), "err": stderr.slice(0, -1)})
    });
  })
}

function list(X) {
  let arg = String(X[0])
  for (var i = 1; i < X.length; i++) {
    arg = arg + ',' + String(X[i])
  }
  return arg;
}


exports.predict = async (X) => {
  const result = await run(' cd python && ' + path['conda'] + ' test.py ' + list(X) );
  let split = result.out.split('\n');
  let json = JSON.parse(split[1]);
  result.json = json;
  return result ;
}
