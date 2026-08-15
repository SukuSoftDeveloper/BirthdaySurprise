/**
 * Personalize the birthday website here!
 * Change these values before sharing with your friend.
 */
const BIRTHDAY_CONFIG = {
  friendName: 'My Amazing Best Friend',

  page1: {
    greeting: 'Hey Bestie! ??',
    subtitle: 'Someone made something special for your birthday...'
  },

  page2: {
    title: 'Our Memories ??',
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
      'Dear Best Friend,',
      'Happy Birthday! ??',
      'You mean the world to me...'
    ],
    letterMessages: [
      '?? You are the most amazing person I know. Your smile lights up every room, and your kindness touches everyone around you.',
      '?? Thank you for being my partner in crime, my shoulder to cry on, and my biggest cheerleader. Life is infinitely better with you in it.',
      '?? On your special day, I want you to know ù you deserve all the happiness, love, and magic this world has to offer.',
      '?? Here\'s to another year of adventures, laughter, late-night talks, and creating memories that\'ll last forever!'
    ]
  },

  page4: {
    balloonMessages: [
      'You are loved! ??',
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
      '?? May all your dreams come true',
      '?? Stay strong, stay beautiful',
      '?? Chase every goal fearlessly',
      '?? Always remember ù you are loved',
      '?? Let\'s celebrate YOU today!'
    ],
    quote: '"Friendship is the only cement that will ever hold the world together."',
    signature: 'ù With all my love, Your Best Friend ??'
  },

  music: 'assets/music/birthday-song.mp3',
  musicTracks: {
    celebration: 'built-in',
    song: 'assets/music/birthday-song.mp3'
  }
};

if (typeof module !== 'undefined') module.exports = BIRTHDAY_CONFIG;
