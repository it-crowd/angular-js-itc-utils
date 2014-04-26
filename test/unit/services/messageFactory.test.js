describe('MessageFactory', function ()
{
    'use strict';

    beforeEach(module('pl.itcrowd.services'));

    var subscriber;
    var SAMPLE_MESSAGE = 'message';
    var SAMPLE_TYPE = 'info';

    beforeEach(function ()
    {
        subscriber = jasmine.createSpy('subscriber');
    });

    describe('subscribe, notify', function ()
    {
        describe('when add subscriber and call notify function', function ()
        {
            it('should invoke subscriber function', inject(function (MessageFactory)
            {
                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.notify(SAMPLE_TYPE, SAMPLE_MESSAGE);

                expect(subscriber).toHaveBeenCalledWith(SAMPLE_MESSAGE, SAMPLE_TYPE);
            }));
        });
        describe('when add subscriber and call notify function without given type', function ()
        {
            it('should NOT invoke subscriber function', inject(function (MessageFactory)
            {
                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.notify(undefined, SAMPLE_MESSAGE);

                expect(subscriber).not.toHaveBeenCalled();
            }));
        });
    });

    describe('clean', function ()
    {
        describe('when call clean function', function ()
        {
            it('should clean subscribers and NOT invoke subscriber function', inject(function (MessageFactory)
            {
                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.clean();

                MessageFactory.notify(SAMPLE_TYPE, SAMPLE_MESSAGE);

                expect(subscriber).not.toHaveBeenCalled();
            }));
        });
    });

    describe('info', function ()
    {
        describe('when call info function', function ()
        {
            it('should invoke subscriber function with info type', inject(function (MessageFactory)
            {
                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.info(SAMPLE_MESSAGE);

                expect(subscriber).toHaveBeenCalledWith(SAMPLE_MESSAGE, SAMPLE_TYPE);
            }));
        });
    });

    describe('warn', function ()
    {
        describe('when call warn function', function ()
        {
            it('should invoke subscriber function with warn type', inject(function (MessageFactory)
            {
                SAMPLE_TYPE = 'warn';

                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.warn(SAMPLE_MESSAGE);

                expect(subscriber).toHaveBeenCalledWith(SAMPLE_MESSAGE, SAMPLE_TYPE);
            }));
        });
    });

    describe('error', function ()
    {
        describe('when call error function', function ()
        {
            it('should invoke subscriber function with error type', inject(function (MessageFactory)
            {
                SAMPLE_TYPE = 'error';

                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.error(SAMPLE_MESSAGE);

                expect(subscriber).toHaveBeenCalledWith(SAMPLE_MESSAGE, SAMPLE_TYPE);
            }));
        });
    });

    describe('success', function ()
    {
        describe('when call success function', function ()
        {
            it('should invoke subscriber function with success type', inject(function (MessageFactory)
            {
                SAMPLE_TYPE = 'success';

                MessageFactory.subscribe(subscriber, SAMPLE_TYPE);

                MessageFactory.success(SAMPLE_MESSAGE);

                expect(subscriber).toHaveBeenCalledWith(SAMPLE_MESSAGE, SAMPLE_TYPE);
            }));
        });
    });

});
