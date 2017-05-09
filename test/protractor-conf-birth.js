exports.config = {   
    seleniumAddress: 'http://localhost:9515',

    specs: ['T01-LoadBirth.js','T02-AddBirth.js'],

    capabilities: {
        'browserName': 'phantomjs'
      }
};