describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/salaries/');
		var salaries = element.all(by.repeater('dataUnit in data'));

		expect(salaries.count()).toBeGreaterThan(2);
	});
});