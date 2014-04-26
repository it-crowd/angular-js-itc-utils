/*global Showdown*/
describe('$showdown', function ()
{
    'use strict';

    beforeEach(module('pl.itcrowd.services'));

    it('should be possible to inject initialized $showdown converter', inject(function ($showdown)
    {
        expect($showdown).not.toBeUndefined();
    }));

    it('should be instance of $showdown.converter', inject(function ($showdown)
    {
        expect($showdown instanceof Showdown.converter).toBeTruthy();
    }));
});
