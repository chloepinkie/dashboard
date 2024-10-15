const { PythonShell } = require('python-shell');

function runPythonScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    PythonShell.run(scriptPath, { args }, function (err, results) {
      if (err) reject(err);
      resolve(results);
    });
  });
}

module.exports = { runPythonScript };
