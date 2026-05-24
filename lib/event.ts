export const event = {
  couple: "Beyza & Batuhan",
  tagline: "Birlikte yeni bir hikayeye başlıyoruz",
  dateLabel: "17 Ekim 2026",
  timeLabel: "16.00",
  venue: "Beykoz Nikah Dairesi",
  address: "Beykoz, İstanbul",
  targetDate: "2026-10-17T16:00:00+03:00",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Beykoz%20Nikah%20Dairesi",
  mapsEmbed: "https://www.google.com/maps?q=Beykoz%20Nikah%20Dairesi&output=embed"
} as const;

export const siteConfig = {
  title: "Beyza & Batuhan | Nikah Davetiyesi",
  description: "Beyza ve Batuhan'ın 17 Ekim 2026 tarihli nikah davetine zarif ve sinematik bir davetiye.",
  ogImage: "/photos/9.jpeg"
} as const;

export const images = [
  {
    src: "/photos/1.jpeg",
    alt: "Beyza ve Batuhan fotoğrafı",
    ratio: "portrait"
  },
  {
    src: "/photos/2.jpeg",
    alt: "Beyza ve Batuhan romantik kare",
    ratio: "square"
  },
  {
    src: "/photos/3.jpeg",
    alt: "Beyza ve Batuhan portre",
    ratio: "portrait"
  },
  {
    src: "/photos/6.jpeg",
    alt: "Beyza ve Batuhan anı",
    ratio: "wide"
  },
  {
    src: "/photos/7.jpeg",
    alt: "Beyza ve Batuhan yakın plan",
    ratio: "portrait"
  },
  {
    src: "/photos/9.jpeg",
    alt: "Beyza ve Batuhan sinematik kare",
    ratio: "wide"
  }
] as const;

export const music = {
  title: "Dilerim Ki",
  artist: "Dolu Kadehi Ters Tut",
  youtubeVideoId: "aDju79MtUR8",
  youtubeUrl: "https://www.youtube.com/watch?v=aDju79MtUR8"
} as const;
