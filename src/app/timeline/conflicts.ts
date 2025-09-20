import { EventsTimeline } from './types';

export const israeliConflicts: EventsTimeline[] = [
    {
        time: { start: '1990-01-17', end: '1991-02-28' },
        conflict: {
            title: 'Gulf War (Scud Missile Attacks)',
            reason: 'Iraq launched Scud missiles at Israel during the Gulf War coalition campaign against Iraq'
        }
    },
    {
        time: { start: '1991-03-01', end: '1993-09-13' },
        conflict: {
            title: 'First Intifada (Continuation)',
            reason: 'Palestinian uprising against Israeli occupation continued from late 1980s'
        }
    },
    {
        time: { start: '1993-09-13', end: '2000-09-28' },
        conflict: {
            title: 'Oslo Peace Process Period',
            reason: 'Period of relative calm following Oslo Accords with ongoing peace negotiations'
        }
    },
    {
        time: { start: '2000-09-28', end: '2005-02-08' },
        conflict: {
            title: 'Second Intifada (Al-Aqsa Intifada)',
            reason: 'Palestinian uprising triggered by Ariel Sharon\'s visit to Temple Mount'
        }
    },
    {
        time: { start: '2005-02-09', end: '2006-01-01' },
        conflict: {
            title: 'Israeli Disengagement from Gaza',
            reason: 'Israel unilaterally withdrew from Gaza Strip settlements'
        }
    },
    {
        time: { start: '2006-07-12', end: '2006-08-14' },
        conflict: {
            title: '2006 Lebanon War (Second Lebanon War)',
            reason: 'Hezbollah cross-border raid and rocket attacks led to Israeli military operation'
        }
    },
    {
        time: { start: '2008-12-27', end: '2009-01-18' },
        conflict: {
            title: 'Operation Cast Lead (Gaza War)',
            reason: 'Israeli military operation in response to Hamas rocket fire from Gaza'
        }
    },
    {
        time: { start: '2012-11-14', end: '2012-11-21' },
        conflict: {
            title: 'Operation Pillar of Defense',
            reason: 'Israeli operation against Hamas in response to rocket attacks from Gaza'
        }
    },
    {
        time: { start: '2014-07-08', end: '2014-08-26' },
        conflict: {
            title: 'Operation Protective Edge (2014 Gaza War)',
            reason: 'Israeli operation against Hamas following rocket attacks and tunnel discoveries'
        }
    },
    {
        time: { start: '2018-03-30', end: '2019-12-31' },
        conflict: {
            title: 'Great March of Return',
            reason: 'Palestinian protests along Gaza-Israel border leading to violent clashes'
        }
    },
    {
        time: { start: '2021-05-10', end: '2021-05-21' },
        conflict: {
            title: 'Operation Guardian of the Walls',
            reason: 'Israeli operation against Hamas following rocket barrages and Jerusalem tensions'
        }
    },
    {
        time: { start: '2023-10-07' },
        conflict: {
            title: 'Operation Swords of Iron (2023 Israel-Hamas War)',
            reason: 'Hamas attack on Israel led to major Israeli military operation in Gaza'
        }
    }
];
