/**
 * Personalize the birthday website here!
 * Change these values before sharing with your friend.
 */
const BIRTHDAY_CONFIG = {
  friendName: 'My Amazing Friend',

  page1: {
    greeting: 'Hello, Birthday Girl! 🎂✨',
    subtitle: 'There’s a little surprise waiting inside. Tap the gift to find out! 🎁'
  },

  page2: {
    title: 'A Little Collection of Her ✨',
    subtitle: 'Every moment with you is a treasure',
    photos: [
      { src: 'assets/images/photo1.jpg', caption: 'Best day ever! ??' },
      { src: 'assets/images/photo2.jpg', caption: 'Laughing together ??' },
      { src: 'assets/images/photo3.jpg', caption: 'Adventures! ??' },
      { src: 'assets/images/photo4.jpg', caption: 'Forever friends ??' },
      { src: 'assets/images/photo5.jpg', caption: 'Unforgettable ?' },
      { src: 'assets/images/photo6.jpg', caption: 'My favorite person ??' }
    ]
  },

  page3: {
  typewriterMessages: [
    'Hey Sravya! 🎂',
    'Happy Birthday to you! ✨',
    'Keep smiling, keep dreaming, and keep being you. 🌷'
  ],
    letterMessages: [
      '?? You are the most amazing person I know. Your smile lights up every room, and your kindness touches everyone around you.',
      '?? Thank you for being my partner in crime, my shoulder to cry on, and my biggest cheerleader. Life is infinitely better with you in it.',
      '?? On your special day, I want you to know � you deserve all the happiness, love, and magic this world has to offer.',
      '?? Here\'s to another year of adventures, laughter, late-night talks, and creating memories that\'ll last forever!'
    ]
  },

  page4: {
    balloonMessages: [
      '🎈 Keep that smile, it suits you 😊',
      'Best friend forever! ??',
      'Stay awesome! ?',
      'You glow differently! ?',
      'Party time! ??',
      'Birthday queen! ??'
    ],
    scratchGift: '?? Your Birthday Gift:<br>Unlimited Hugs & Pizza Nights! ??'
  },

  page5: {
    wishes: [
      '🌈 May the things you dream about slowly become reality.',
      '✨ May you always have reasons to smile.',
      '🌷 May you keep your kind heart and your beautiful way of seeing the little things.',
      '🎯 I hope you find people who understand you, support you, and genuinely want to see you do wel',
      '😄 And obviously... I hope you get plenty of Chicken Biryani too. No birthday is complete without that! 🍗🍚'
    ],
    quote: '"Happy Birthday once again Sravya🌷"',
    signature: '— Just a friend wishing you well ✨'
  },

  music: 'assets/music/birthday-song.mp3',
  musicTracks: {
    celebration: 'built-in',
    song: 'assets/music/birthday-song.mp3'
  }
};

if (typeof module !== 'undefined') module.exports = BIRTHDAY_CONFIG;
