/*jshint camelcase:false*/
describe('paginationSupport', function ()
{
    'use strict';

    var SAMPLE_TOTAL_COUNT = 5, scope, testFun, refresh;

    beforeEach(module('pl.itcrowd.services'));

    describe('default AsyncQueue', function ()
    {
        beforeEach(inject(function ($rootScope, _$timeout_, paginationSupport)
        {
            scope = $rootScope.$new();
            scope.filter = {firstResult: 0, maxResults: 1, sortField: 'ID', sortDir: 'ASC'};

            testFun = jasmine.createSpy('testFun');

            refresh = paginationSupport(scope, function (callback)
            {
                if (null != callback) {
                    callback(SAMPLE_TOTAL_COUNT);
                }
                testFun();
            });
        }));

        describe('refresh, modelListener, pageAwareModelListener', function ()
        {
            describe('when firstResult is changed', function ()
            {
                it('should be called refresh function', function ()
                {
                    scope.$digest();
                    scope.filter.firstResult = 15;
                    scope.$digest();

                    expect(testFun).toHaveBeenCalled();
                });
            });

            describe('when sortDir is changed', function ()
            {
                it('should be called refresh function', function ()
                {
                    scope.$digest();
                    scope.filter.sortDir = 'DESC';
                    scope.$digest();
                    expect(testFun).toHaveBeenCalled();
                });
            });
        });

        describe('isPaginationNeeded', function ()
        {
            describe('when resultCount is greater than maxResults', function ()
            {
                it('should pagination be needed', function ()
                {
                    refresh();

                    expect(scope.isPaginationNeeded()).toBe(true);

                });
            });

            describe('when resultCount is less than maxResults', function ()
            {
                it('should pagination NOT be needed', function ()
                {
                    scope.filter.maxResults = 10;

                    scope.$digest();

                    refresh();

                    expect(scope.isPaginationNeeded()).toBe(false);

                });
            });
        });
    });

    describe('setDefaultConfig 300', function ()
    {
        beforeEach(module(function (paginationSupportProvider)
        {
            //noinspection JSUnresolvedFunction
            paginationSupportProvider.setDefaultConfig({maxResults: 300});
        }));
        beforeEach(inject(function ($rootScope, _$timeout_, paginationSupport)
        {
            scope = $rootScope.$new();
            scope.filter = {firstResult: 0};
            paginationSupport(scope, function (callback)
            {
                if (null != callback) {
                    callback(SAMPLE_TOTAL_COUNT);
                }
            });
        }));
        it('should set scope.filter.maxResults to 300', function ()
        {
            expect(scope.filter.maxResults).toBe(300);
        });
    });

});

describe('paginationSupport', function ()
{
    'use strict';

    var SAMPLE_TOTAL_COUNT = 5, $timeout, scope, daoMock, refresh;

    beforeEach(module('pl.itcrowd.services'));

    beforeEach(inject(function ($rootScope, _$timeout_, paginationSupport)
    {
        $timeout = _$timeout_;
        scope = $rootScope.$new();
        scope.filter = {firstResult: 0, maxResults: 1, sortField: 'ID', sortDir: 'ASC'};

        daoMock = jasmine.createSpy('daoMock');

        refresh = paginationSupport(scope, function (callback)
        {
            if (null != callback) {
                callback(SAMPLE_TOTAL_COUNT);
            }
            daoMock();
        }, {timeout: 500});
    }));

    describe('refresh called multiple times fast', function ()
    {
        beforeEach(function ()
        {
            refresh();
            refresh();
            refresh();
            $timeout.flush();
        });
        it('should invoke real refresh function only once (queue)', function ()
        {
            expect(daoMock.calls.length).toBe(1);
        });
        describe('then timeout.flush and refresh called again', function ()
        {
            beforeEach(function ()
            {
                refresh();
                $timeout.flush();
            });
            it('should invoke real refresh function twice (queue)', function ()
            {
                expect(daoMock.calls.length).toBe(2);
            });
        });
    });
});
