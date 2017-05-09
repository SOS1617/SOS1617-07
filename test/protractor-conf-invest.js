exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-LoadInvest.js','T02-AddInvest.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};