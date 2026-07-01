export interface Track {
  id: number;
  title: string;
  cover: string;
  genres: string[];
  audioSrc: string | null;
}

const cover = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?w=600&h=600&fit=crop&q=80`;

export const tracks: Track[] = [
  {
    id: 1,
    title: "Graven Road Home",
    cover: cover("photo-1511671782779-c97d3d27a1d4"),
    genres: ["Trap soul", "Country"],
    audioSrc: null,
  },
  {
    id: 2,
    title: "Neon In The Night",
    cover: cover("photo-1493225457124-a3eb161ffa5f"),
    genres: ["Pop", "Rock"],
    audioSrc: null,
  },
  {
    id: 3,
    title: "Midnight In Shoreditch",
    cover: cover("photo-1470225620780-dba8ba36b745"),
    genres: ["Jazz", "UK Garage", "Ambient"],
    audioSrc: null,
  },
  {
    id: 4,
    title: "Anima Trionfante",
    cover: cover("photo-1459749411175-04bf5292ceea"),
    genres: ["Opera", "Afrobeats"],
    audioSrc: null,
  },
  {
    id: 5,
    title: "Afterglow",
    cover: cover("photo-1514525253161-7a46d19cd819"),
    genres: ["Alternative R&B", "Reggaeton"],
    audioSrc: null,
  },
  {
    id: 6,
    title: "Space In Between",
    cover: cover("photo-1483412033650-1015ddeb83d1"),
    genres: ["Trap soul", "Reggaeton"],
    audioSrc: null,
  },
  {
    id: 7,
    title: "Questa Notte",
    cover: cover("photo-1501386761578-eac5c94b800a"),
    genres: ["Italo disco", "Multilingual"],
    audioSrc: null,
  },
  {
    id: 8,
    title: "Nossa Noite",
    cover: cover("photo-1458560871784-56d23406c091"),
    genres: ["Brazilian Pop", "Multilingual"],
    audioSrc: null,
  },
  {
    id: 9,
    title: "Fault Line",
    cover: cover("photo-1487215078519-e21cc028cb29"),
    genres: ["Indie Rock", "Fusion"],
    audioSrc: null,
  },
];
