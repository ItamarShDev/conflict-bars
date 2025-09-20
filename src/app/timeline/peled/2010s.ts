import { TimelineEvent } from '../types';

// Peled — 2010s
export const peled2010s: TimelineEvent[] = [
  {
    timestamp: '2010–2014',
    conflict: {
      title: 'Aftermath of Gaza conflicts; domestic protests',
      reason:
        'Period marked by recurring Gaza escalations and the 2011 social justice protests in Israel. Capture tracks reflecting social critique and conflict ambience.'
    },
    songs: [
      // Add entries as: { name, artist: 'Peled', date, language, lyric_sample: { original, english_translation }, links: { lyrics, song_info, youtube } }
    ]
  },
  {
    timestamp: '2015–2019',
    conflict: {
      title: 'Wave of violence; Great March of Return',
      reason:
        'Knife attacks (2015–2016) and Gaza border protests (2018–2019) shaped public discourse. Include tracks with direct/indirect references to polarization, security, and identity.'
    },
    songs: [
      {
        name: 'שירת הסטיקר 2019 (Sticker Song 2019)',
        artist: 'Hadag Nahash (feat. Peled and others)',
        published_date: '2019-03-15',
        language: 'Hebrew',
        lyric_sample: {
          hebrew: 'אין ערבים אין פיגועים',
          english_translation: 'No Arabs, no terror attacks.'
        },
        links: {
          lyrics: 'https://hadagnahash.bandcamp.com/track/2019',
          song_info: 'https://he.wikipedia.org/wiki/%D7%A9%D7%99%D7%A8%D7%AA_%D7%94%D7%A1%D7%98%D7%99%D7%A7%D7%A8'
        }
      }
    ]
  }
];
