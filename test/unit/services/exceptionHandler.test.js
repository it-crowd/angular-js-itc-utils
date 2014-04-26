/*jshint camelcase:false*/
describe('ExceptionHandler', function ()
{
    'use strict';

    beforeEach(module('pl.itcrowd.services'));

    var $rootScope, $location, response, errorCallback;

    function standardErrorTest(code, message)
    {
        return function ()
        {
            beforeEach(inject(function ($http, $httpBackend)
            {
                //noinspection JSCheckFunctionSignatures
                $httpBackend.whenGET('/').respond(code, response);
                $http.get('/').error(errorCallback);
                $httpBackend.flush();
            }));
            it('should set proper error message on root scope', function ()
            {
                expect($rootScope.errorMessage).toBe(message);
            });
            it('should call error callback', function ()
            {
                //noinspection JSAccessibilityCheck
                expect(errorCallback).toHaveBeenCalledWith(response, jasmine.any(Number), jasmine.any(Function), jasmine.any(Object));
            });
            it('should redirect to /error', function ()
            {
                expect($location.path()).toBe('/error');
            });
        };
    }

    beforeEach(inject(function (_$location_, _$rootScope_)
    {
        $location = _$location_;
        $rootScope = _$rootScope_;
        $location.path('/');
        response = {mock: 'response'};
        errorCallback = jasmine.createSpy('errorCallback');
    }));

    describe('on 400 status code', standardErrorTest(400, 'Request cannot be fulfilled due to bad syntax!'));
    describe('on 401 status code', function ()
    {
        beforeEach(inject(function ($http, $httpBackend)
        {
            $rootScope.errorMessage = 'a';
            //noinspection JSValidateTypes
            $httpBackend.whenGET('/').respond(401);
            $http.get('/');
            $httpBackend.flush();
        }));
        it('should not change error message on root scope', function ()
        {
            expect($rootScope.errorMessage).toBe('a');
        });
        it('should NOT call error callback', function ()
        {
            expect(errorCallback).wasNotCalled();
        });
        it('should NOT redirect to /error', function ()
        {
            expect($location.path()).toBe('/');
        });
    });


    describe('on 403 status code', standardErrorTest(403, 'You don\'t have access to this page or resource!'));
    describe('on 404 status code', standardErrorTest(404, 'The page or resource your are looking for does not exist!'));
    describe('on 405 status code', standardErrorTest(405, 'Request method not supported!'));
    describe('on 408 status code', standardErrorTest(408, 'The server timed out waiting for the request!'));
    describe('on 412 status code', standardErrorTest(412, 'Precondition failed: [object Object]'));
    describe('on 415 status code', standardErrorTest(415, 'This media type is not supported!'));
    describe('on 503 status code', standardErrorTest(503, 'The server is currently unavailable (overloaded or down)!'));
    describe('on 505 status code', standardErrorTest(505, 'The server does not support the HTTP protocol version used in the request!'));
    describe('on 506 status code', standardErrorTest(506, 'Internal Server Error! Something went really wrong...'));

    describe('on success', function ()
    {
        var successCallback;
        beforeEach(inject(function ($http, $httpBackend)
        {
            $rootScope.errorMessage = 'a';
            successCallback = jasmine.createSpy('successCallback');
            //noinspection JSCheckFunctionSignatures
            $httpBackend.whenGET('/').respond(200, response);
            $http.get('/').success(successCallback).error(errorCallback);
            $httpBackend.flush();
        }));
        it('should not change error message on root scope', function ()
        {
            expect($rootScope.errorMessage).toBe('a');
        });
        it('should call success callback', function ()
        {
            //noinspection JSAccessibilityCheck
            expect(successCallback).toHaveBeenCalledWith(response, jasmine.any(Number), jasmine.any(Function), jasmine.any(Object));
        });
        it('should NOT call error callback', function ()
        {
            expect(errorCallback).wasNotCalled();
        });
        it('should NOT redirect to /error', function ()
        {
            expect($location.path()).toBe('/');
        });
    });

    describe('when status defined in response.config.skipDefaultInterceptors.codes', function ()
    {
        beforeEach(inject(function ($http, $httpBackend)
        {
            $rootScope.errorMessage = 'a';
            //noinspection JSCheckFunctionSignatures
            $httpBackend.whenGET('/').respond(400, response);
            $http.get('/', {skipDefaultInterceptors: {codes: [400]}}).error(errorCallback);
            $httpBackend.flush();
        }));
        it('should not change error message on root scope', function ()
        {
            expect($rootScope.errorMessage).toBe('a');
        });
        it('should invoke error callback', function ()
        {
            //noinspection JSAccessibilityCheck
            expect(errorCallback).toHaveBeenCalledWith(response, jasmine.any(Number), jasmine.any(Function), jasmine.any(Object));
        });
        it('should NOT redirect to /error', function ()
        {
            expect($location.path()).toBe('/');
        });
    });
});
