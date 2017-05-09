describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('https://sos1617-07.herokuapp.com/#!/investEducationStats/');
		var investEducationStat = element.all(by.repeater('dataUnit in data'));

		expect(investEducationStat.count()).toBeGreaterThan(1);
	});
});