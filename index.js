var program = require('commander');
var path = require('path');
var pick = require('lodash.pick');
var packageJson = require('./package.json');
var pipeHelper = require('./helpers/stdin');
var testHelper = require('./helpers/fetchTests');

program
  .version(packageJson.version)
  .option('-b, --browser <option>', 'Define test browser (defaults to "headless")', 'headless')
  .option('-s, --suite <suite>', 'Define file to run (optional)')
  .option('-t, --type <key>', 'Define subset of tests to run (optional)', 'all')
  .option('-c, --config <filePath>', 'Define config file location (defaults to "__dirname/config/scholar.js")', path.join(__dirname, 'config', 'scholar.js'))
  .option('-d, --directory <testDirectory>', 'Define test files directory (defaults to "__dirname/test/")', path.join(__dirname, 'test'))
  .parse(process.argv);

pipeHelper(function(parsedData){
  program.data = parsedData;
  var options = pick(program, ['data', 'browser', 'type', 'config']);

  testHelper(program.directory, program.suite, program.type, function(results){
    options.scenarios = results;
    require('./lib/runners')[program.browser](options)
  });
});
