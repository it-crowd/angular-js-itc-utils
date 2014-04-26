describe('AsyncQueue', function ()
{
    'use strict';

    beforeEach(module('pl.itcrowd.services'));

    describe('add', function ()
    {
        describe('when only param is callback', function ()
        {
            describe('and default timeout is > 0', function ()
            {
                beforeEach(inject(function (AsyncQueue)
                {
                    AsyncQueue.configure({timeout: 1});
                }));
                describe('queue is empty', function ()
                {
                    var callback;
                    beforeEach(inject(function (AsyncQueue)
                    {
                        callback = jasmine.createSpy('callback');
                        AsyncQueue.add(callback);
                    }));
                    describe('on $timeout.flush', function ()
                    {
                        beforeEach(inject(function ($timeout)
                        {
                            $timeout.flush();
                        }));
                        it('should invoke callback on timeout', function ()
                        {
                            expect(callback).toHaveBeenCalled();
                        });
                    });

                });
                describe('and different callback exists in queue', function ()
                {
                    var callbackA , callbackB;
                    beforeEach(inject(function (AsyncQueue)
                    {
                        callbackA = jasmine.createSpy('callbackA');
                        callbackB = jasmine.createSpy('callbackB');
                        AsyncQueue.add(callbackA);
                        AsyncQueue.add(callbackB);
                    }));
                    it('should invoke callbackA and callbackB on timeout', inject(function ($timeout)
                    {
                        $timeout.flush();
                        expect(callbackA).toHaveBeenCalled();
                        expect(callbackB).toHaveBeenCalled();
                    }));
                });
                describe('and callback already exists in queue', function ()
                {
                    var callback;
                    beforeEach(inject(function (AsyncQueue)
                    {
                        callback = jasmine.createSpy('callback');
                        AsyncQueue.configure({timeout: 100});
                        AsyncQueue.add(callback);
                        AsyncQueue.add(callback);
                    }));
                    it('should invoke callback only once on timeout', inject(function ($timeout)
                    {
                        $timeout.flush();
                        expect(callback).toHaveBeenCalled();
                        expect(callback.calls.length).toBe(1);
                    }));
                });
                describe('and callback already fired before adding it again', function ()
                {
                    var callback;
                    beforeEach(inject(function ($timeout, AsyncQueue)
                    {
                        callback = jasmine.createSpy('callback');
                        AsyncQueue.add(callback);
                        $timeout.flush();
                        expect(callback).toHaveBeenCalled();
                        callback.reset();
                        AsyncQueue.add(callback);
                        $timeout.flush();
                    }));
                    it('should invoke callback on timeout again', function ()
                    {
                        expect(callback).toHaveBeenCalled();
                    });
                });
                describe('and another callback already fired before adding new one', function ()
                {
                    var callbackA, callbackB;
                    beforeEach(inject(function ($timeout, AsyncQueue)
                    {
                        callbackA = jasmine.createSpy('callback');
                        AsyncQueue.add(callbackA);
                        $timeout.flush();
                        callbackB = jasmine.createSpy('callback');
                        AsyncQueue.add(callbackB);
                        $timeout.flush();
                    }));
                    it('should invoke callback on timeout again', function ()
                    {
                        expect(callbackA).toHaveBeenCalled();
                        expect(callbackA.calls.length).toBe(1);
                        expect(callbackB).toHaveBeenCalled();
                        expect(callbackB.calls.length).toBe(1);
                    });
                });
            });
            describe('and default timeout is 0', function ()
            {
                describe('and queue is empty', function ()
                {
                    var callback;
                    beforeEach(inject(function ($timeout, AsyncQueue)
                    {
                        callback = jasmine.createSpy('callback');
                        AsyncQueue.add(callback);
                    }));
                    it('should invoke callback immediately', function ()
                    {
                        expect(callback).toHaveBeenCalled();
                    });
                });
            });
            describe('', function ()
            {
                var $timeoutMock, callback;
                beforeEach(module(function ($provide)
                {
                    $timeoutMock = jasmine.createSpy('$timeoutMock');
                    $provide.value('$timeout', $timeoutMock);
                }));
                beforeEach(inject(function (AsyncQueue)
                {
                    callback = jasmine.createSpy('callback');
                    AsyncQueue.add(callback);
                }));
                it('should NOT create timeout', function ()
                {
                    expect($timeoutMock).not.toHaveBeenCalled();
                });
                it('should invoke callback immediately', function ()
                {
                    expect(callback).toHaveBeenCalledWith();
                });
            });
        });
        describe('when non-existent queueId specified', function ()
        {
            var $logMock, $timeoutMock;
            beforeEach(module(function ($provide)
            {
                $logMock = jasmine.createSpyObj('$logMock', ['warn']);
                $timeoutMock = jasmine.createSpy('$timeoutMock');
                $timeoutMock.andReturn({then: jasmine.createSpy('promise.then')});
                $provide.value('$timeout', $timeoutMock);
                $provide.value('$log', $logMock);
            }));
            beforeEach(inject(function (AsyncQueue)
            {
                AsyncQueue.configure({timeout: 1234});
                AsyncQueue.add(jasmine.createSpy('callback'), {queueId: 'non-existent'});
            }));
            it('should log warning', function ()
            {
                expect($logMock.warn).toHaveBeenCalledWith('No queue `non-existent` defined');
            });
            it('should add to queue with default queue config', function ()
            {
                expect($timeoutMock).toHaveBeenCalledWith(jasmine.any(Function), 1234);
            });
        });
        describe('when existing queueId specified', function ()
        {
            var $timeoutMock;
            beforeEach(module(function ($provide)
            {
                $timeoutMock = jasmine.createSpy('$timeoutMock');
                $timeoutMock.andReturn({then: jasmine.createSpy('promise.then')});
                $provide.value('$timeout', $timeoutMock);
            }));
            beforeEach(inject(function (AsyncQueue)
            {
                AsyncQueue.configure({timeout: 1}, 'a');
                AsyncQueue.add(jasmine.createSpy('callback'), {queueId: 'a'});
            }));
            it('should add to queue with config corresponding to queueId', function ()
            {
                expect($timeoutMock).toHaveBeenCalledWith(jasmine.any(Function), 1);
            });
        });
        describe('when timeout provided', function ()
        {
            var $timeoutMock;
            beforeEach(module(function ($provide)
            {
                $timeoutMock = jasmine.createSpy('$timeoutMock');
                $timeoutMock.andReturn({then: jasmine.createSpy('promise.then')});
                $provide.value('$timeout', $timeoutMock);
            }));
            beforeEach(inject(function (AsyncQueue)
            {
                AsyncQueue.add(jasmine.createSpy('callback'), {timeout: 1});
            }));
            it('should add to queue with timeout from options', function ()
            {
                expect($timeoutMock).toHaveBeenCalledWith(jasmine.any(Function), 1);
            });
        });
        describe('when groupingId provided', function ()
        {
            beforeEach(inject(function (AsyncQueue)
            {
                AsyncQueue.configure({timeout: 1});
            }));
            describe('and item with given grouping id exists in queue on flush', function ()
            {
                var callbackA, callbackB;
                beforeEach(inject(function ($timeout, AsyncQueue)
                {
                    var options = {groupingId: 'a'};
                    callbackA = jasmine.createSpy('callbackA');
                    AsyncQueue.add(callbackA, options);
                    callbackB = jasmine.createSpy('callbackB');
                    AsyncQueue.add(callbackB, options);
                    $timeout.flush();
                }));
                it('should call only the latter callback', function ()
                {
                    expect(callbackA).not.toHaveBeenCalled();
                    expect(callbackB).toHaveBeenCalled();
                });
            });
            describe('and item with different grouping id exists', function ()
            {
                var callbackA, callbackB;
                beforeEach(inject(function ($timeout, AsyncQueue)
                {
                    callbackA = jasmine.createSpy('callbackA');
                    AsyncQueue.add(callbackA, {groupingId: 'a'});
                    callbackB = jasmine.createSpy('callbackB');
                    AsyncQueue.add(callbackB, {groupingId: 'b'});
                    $timeout.flush();
                }));
                it('should call both callbacks', function ()
                {
                    expect(callbackA).toHaveBeenCalled();
                    expect(callbackB).toHaveBeenCalled();
                });
            });
            describe('and item with NO grouping id exists', function ()
            {
                var callbackA, callbackB;
                beforeEach(inject(function ($timeout, AsyncQueue)
                {
                    callbackA = jasmine.createSpy('callbackA');
                    AsyncQueue.add(callbackA);
                    callbackB = jasmine.createSpy('callbackB');
                    AsyncQueue.add(callbackB, {groupingId: 'b'});
                    $timeout.flush();
                }));
                it('should call both callbacks', function ()
                {
                    expect(callbackA).toHaveBeenCalled();
                    expect(callbackB).toHaveBeenCalled();
                });
            });
            describe('and item with given grouping id fired before adding new item', function ()
            {
                var callbackA, callbackB;
                beforeEach(inject(function ($timeout, AsyncQueue)
                {
                    callbackA = jasmine.createSpy('callbackA');
                    AsyncQueue.add(callbackA, {groupingId: 'a'});
                    $timeout.flush();
                    callbackB = jasmine.createSpy('callbackB');
                    AsyncQueue.add(callbackB, {groupingId: 'b'});
                    $timeout.flush();
                }));
                it('should call both callbacks but each once', function ()
                {
                    expect(callbackA).toHaveBeenCalled();
                    expect(callbackB).toHaveBeenCalled();
                    expect(callbackA.calls.length).toBe(1);
                    expect(callbackB.calls.length).toBe(1);
                });
            });
        });
    });

    describe('configure', function ()
    {
        var $timeoutMock;
        beforeEach(module(function ($provide)
        {
            $timeoutMock = jasmine.createSpy('$timeoutMock');
            $timeoutMock.andReturn({then: jasmine.createSpy('promise.then')});
            $provide.value('$timeout', $timeoutMock);
        }));
        describe('when no queue id set', function ()
        {
            beforeEach(inject(function (AsyncQueue)
            {
                AsyncQueue.configure({timeout: 500});
            }));
            describe('and add without queueId called', function ()
            {
                beforeEach(inject(function (AsyncQueue)
                {
                    AsyncQueue.add(jasmine.createSpy('callback'));
                }));
                it('should create timeout with new config', function ()
                {
                    expect($timeoutMock).toHaveBeenCalledWith(jasmine.any(Function), 500);
                });
            });
        });
        describe('when queue id is set', function ()
        {
            beforeEach(inject(function (AsyncQueue)
            {
                AsyncQueue.configure({timeout: 500}, 'form');
            }));
            describe('and add without queueId called', function ()
            {
                var callback;
                beforeEach(inject(function (AsyncQueue)
                {
                    callback = jasmine.createSpy('callback');
                    AsyncQueue.add(callback);
                }));
                it('should create timeout with new config', function ()
                {
                    expect(callback).toHaveBeenCalled();
                });
                it('should $timeout should NOT be called', function ()
                {
                    expect($timeoutMock).not.toHaveBeenCalled();
                });
            });
            describe('and add with that queueId called', function ()
            {
                beforeEach(inject(function (AsyncQueue)
                {
                    AsyncQueue.add(jasmine.createSpy('callback'), {queueId: 'form'});
                }));
                it('should create timeout with new config', function ()
                {
                    expect($timeoutMock).toHaveBeenCalledWith(jasmine.any(Function), 500);
                });
            });
        });
    });
});
