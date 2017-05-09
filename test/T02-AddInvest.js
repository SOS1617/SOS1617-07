describe('Add investEducationStat', function () {
	it('should add a new investEducationStat', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/investEducationStats/');

		element.all(by.repeater('dataUnit in data')).then(function (initialStat){
				browser.driver.sleep(2000);
	
				element(by.model('newData.country')).sendKeys('Andorra');
				element(by.model('newData.year')).sendKeys('2020');
				element(by.model("newData['investEducationStat']")).sendKeys('20');
				element(by.model("newData['healthExpenditureStat']")).sendKeys('21');
				element(by.model("newData['militaryExpenditureStat']")).sendKeys('22');
			
				
				element(by.buttonText('add')).click().then(function (){

					element.all(by.repeater('dataUnit in data')).then(function (investEducationStat){
						expect(investEducationStat.length).toEqual(initialStat.length);
					});
				
				});
			
		});
	});
	
});