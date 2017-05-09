describe('Add birthRate', function () {
	it('should add a new birthRate', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/birthRateStats/');

		element.all(by.repeater('dataUnit in data')).then(function (initialStat){
				browser.driver.sleep(2000);
	
				element(by.model('newData.country')).sendKeys('Andorra');
				element(by.model('newData.year')).sendKeys('2020');
				element(by.model("newData['birthRate']")).sendKeys('20');
				element(by.model("newData['lifeExpectancy']")).sendKeys('30');
				element(by.model("newData['mortalityRate']")).sendKeys('25');
			
				
				element(by.buttonText('add')).click().then(function (){

					element.all(by.repeater('dataUnit in data')).then(function (birthRate){
						expect(birthRate.length).toEqual(initialStat.length);
					});
				
				});
			
		});
	});
	
});