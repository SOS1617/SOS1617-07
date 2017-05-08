exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-LoadSalaries.js','T02-AddSalaries.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};