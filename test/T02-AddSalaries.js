describe('Add salary', function () {
	it('should add a new salary', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/salaries/');

		element.all(by.repeater('dataUnit in data')).then(function (initialSalaries){
				browser.driver.sleep(2000);
	
				element(by.model('newData.country')).sendKeys('Andorra');
				element(by.model('newData.year')).sendKeys('2020');
				element(by.model("newData['minimumSalary']")).sendKeys('20');
				element(by.model("newData['averageSalary']")).sendKeys('30');
				element(by.model("newData['riskOfPoverty']")).sendKeys('25');
			
				
				element(by.buttonText('add')).click().then(function (){

					element.all(by.repeater('dataUnit in data')).then(function (salaries){
						expect(salaries.length).toEqual(initialSalaries.length);
					});
				
				});
			
		});
	});
	
});