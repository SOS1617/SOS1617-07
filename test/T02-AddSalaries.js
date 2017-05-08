describe('Add salary', function () {
	it('should add a new salary', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/salaries/');

		element.all(by.repeater('salary in salaries')).then(function (initialSalaries){
				browser.driver.sleep(2000);
	
				element(by.model('newData.country')).sendKeys('Andorra');
				element(by.model('newData.year')).sendKeys('2014');
				element(by.model('newData.eslmale')).sendKeys('20');
				element(by.model('newData.eslfemale')).sendKeys('30');
				element(by.model('newData.esltotal')).sendKeys('25');
				element(by.model('newData.eslobjective')).sendKeys('20');
				
				element(by.buttonText('add')).click().then(function (){

					element.all(by.repeater('salary in salaries')).then(function (salaries){
						expect(salaries.length).toEqual(initialSalaries.length+1);
					});
				
				});
			
		});
	});
	
});