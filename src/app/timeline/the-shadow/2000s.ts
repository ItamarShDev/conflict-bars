import { TimelineEvent } from '../types';

export const theShadow2000s: TimelineEvent[] = [
  {
    timestamp: '2002-01-01',
    conflict: {
      title: 'The Second Intifada & Rise of Nationalist Rap',
      reason: 'The Second Intifada (2000-2005) was a period of intense violence that saw the rise of a new wave of nationalist, right-wing hip-hop. The Shadow, alongside Subliminal, became a leading voice of this movement, with lyrics that were fiercely patriotic and defiant.',
    },
    songs: [
      {
        name: 'התקווה (Hatikva)',
        artist: 'Subliminal & The Shadow',
        published_date: '2002-03-15',
        lyric_sample: {
          hebrew: 'אני ראיתי כמה הם הלכו, יותר מדי מהם לא חזרו... התקווה בראשנו, אהבה בנפשנו, החלום ברוחנו אז לעד.',
          english_translation: 'I saw how many they went, too many of them did not return... The hope in our heads, the love in our souls, the dream in our spirits forever.',
        },
        links: {
          lyrics: 'https://genius.com/Subliminal-and-hatzel-hatikva-lyrics',
          song_info: 'https://en.wikipedia.org/wiki/Ha%27Or_Ve%27HaTzel',
        },
      },
      {
        name: 'בילדי (Biladi)',
        artist: 'Subliminal & The Shadow',
        published_date: '2002-06-20',
        lyric_sample: {
          hebrew: 'אמא אדמה שלי, לא שלי כל מה שהיה שלי, אפילו המדינה שלי, סכנה שלי, הפכה להיות שק חבטות.',
          english_translation: 'My mother earth, not mine is all that was mine, even my country, my danger, has become a punching bag.',
        },
        links: {
          lyrics: 'https://lyricstranslate.com/en/biladi-%D7%91%D7%99%D7%9C%D7%90%D7%93%D7%99-my-country.html',
          song_info: 'https://en.wikipedia.org/wiki/Ha%27Or_Ve%27HaTzel',
        },
      },
    ],
  },
  {
    timestamp: '2008-01-01',
    conflict: {
      title: 'Post-Intifada & Political Hardening',
      reason: 'In the years following the Second Intifada, The Shadow\'s music continued to reflect a hardline nationalist stance, cementing his image as a prominent right-wing figure. His solo work from this period is characterized by an unapologetic, aggressive tone.',
    },
    songs: [
      {
        name: 'הציוני האחרון (Hazioni Ha’acharon)',
        artist: 'The Shadow',
        lyric_sample: {
          hebrew: 'כיבוי אורות הצל נכנס מילים צלילים צרות, צרות צרורות האל קרס טילים נופלים גבולות.',
          english_translation: 'Lights out, the Shadow enters, words, sounds, troubles. Bundles of troubles, God collapsed, missiles fall, borders.',
        },
        links: {
          lyrics: 'https://genius.com/Hatzel-hazioni-haacharon-lyrics',
          song_info: 'https://en.wikipedia.org/wiki/The_Shadow_(rapper)',
        },
      },
    ],
  },
];
