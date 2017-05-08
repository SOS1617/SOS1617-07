describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/salaries/');
		var salaries = element.all(by.repeater('salary in salaries'));

		expect(salaries.count()).toBeGreaterThan(2);
	});
});