describe('testing factory', function() {
	var passPromise, mockDataSourceSvc, rootScope, Test_factoryObj;

	beforeEach(function() {
		module('dictionary_factory');

		module(function($provide) {
			$provide.factory('dataSourceSvc', function($q) {
				var getAllItems = jasmine.createSpy('getAllItems').andCallFake(function() {
					var items = [];
					if (passPromise) {
						return $q.when(items);
					} else {
						return $q.reject('something went wrong');
					}
				});

				return {
					getAllItems: getAllItems
				};
			});
		});

		inject(function($rootScope, dataSourceSvc, Test_factory) {
			rootScope = $rootScope;
			mockDataSourceSvc = dataSourceSvc;
			Test_factoryObj = Test_factory;
		});
	});

	it('should resolve promise', function() {
		passPromise = true;

		var items;
		Test_factoryObj.getData().then(function(data) {
			items = data;
		});
		rootScope.$digest();

		expect(mockDataSourceSvc.getAllItems).toHaveBeenCalled();
		expect(items).toEqual([]);
	});

	it('should reject promise', function() {
		passPromise = false;

		var error;
		Test_factoryObj.getData().then(null, function(e) {
			error = e;
		});
		rootScope.$digest();

		expect(mockDataSourceSvc.getAllItems).toHaveBeenCalled();
		expect(error).toEqual('something went wrong');
	});
});