import React from 'react';
import moment from 'moment';

export let getISOWeekDates = function(isoWeekNum = 1, year = new Date().getFullYear()) {
    let d = moment().isoWeek(1).startOf('isoWeek').add(isoWeekNum - 1, 'weeks');
    let finalMonth = d.format('MMMM');
    let tempMonth = '';

    for (var dates=[], i=0; i < 7; i++) {
        if (d.format('MMMM') !== finalMonth) {
            tempMonth = d.format('MMMM');
        }

        dates.push(d.valueOf());
        d.add(1, 'day');
    }

    if (tempMonth !== '') {
        return [dates, finalMonth + ' - ' + tempMonth + d.format(' YYYY')];
    }

    return [dates, finalMonth + d.format(' YYYY')];
    
};