describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/birthRateStats/');
		var birthRate = element.all(by.repeater('dataUnit in data'));

		expect(birthRate.count()).toBeGreaterThan(1);
	});
});