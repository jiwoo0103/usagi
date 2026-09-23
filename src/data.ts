export type VoiceClip = {
  id: string;
  characterId: string;
  episode: number;
  title: string;
  romanized: string;
  duration: number;
  video: string;
  thumbnail: string;
  language: "KR" | "JP";
};

export type CharacterDefinition = {
  id: string;
  name: string;
  latinName: string;
  color: string;
  image?: string;
  logo?: string;
  available: boolean;
};

export const characters: CharacterDefinition[] = [
  {
    id: "usagi",
    name: "우사기",
    latinName: "USAGI",
    color: "#f7bd28",
    image: "/characters/usagi-main.png",
    logo: "/logos/usagi-logo.png",
    available: true,
  },
];

export const voiceClips: VoiceClip[] = [
  {
    id: "kr-ep20-iyahaha",
    characterId: "usagi",
    episode: 20,
    title: "이야하하",
    romanized: "iyahaha",
    duration: 2.65,
    video: "/media/usagi/kr/ep20_iyahaha_closeup_hold_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep20_iyahaha.webp",
    language: "KR",
  },
  {
    id: "kr-ep35-iyattha",
    characterId: "usagi",
    episode: 35,
    title: "이얏하",
    romanized: "iyattha",
    duration: 2.676,
    video: "/media/usagi/kr/ep35_iyattha_32-36_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep35_iyattha.webp",
    language: "KR",
  },
  {
    id: "kr-ep55-yahaha",
    characterId: "usagi",
    episode: 55,
    title: "야하하",
    romanized: "yahaha",
    duration: 0.967267,
    video: "/media/usagi/kr/ep55_yahaha_34.55-35.50_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep55_yahaha.webp",
    language: "KR",
  },
  {
    id: "kr-ep13-eating",
    characterId: "usagi",
    episode: 13,
    title: "먹는 소리",
    romanized: "eating",
    duration: 3,
    video: "/media/usagi/kr/ep13_eating_22-25_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep13_eating.webp",
    language: "KR",
  },
  {
    id: "kr-ep66-uyaiha",
    characterId: "usagi",
    episode: 66,
    title: "우야이하",
    romanized: "uyaiha",
    duration: 3,
    video: "/media/usagi/kr/ep66_uyaiha_09-12_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep66_uyaiha.webp",
    language: "KR",
  },
  {
    id: "kr-ep66-shouting",
    characterId: "usagi",
    episode: 66,
    title: "소리 지르기",
    romanized: "shouting",
    duration: 3.48,
    video: "/media/usagi/kr/ep66_shouting_15.52-19_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep66_shouting.webp",
    language: "KR",
  },
  {
    id: "kr-ep66-ulla",
    characterId: "usagi",
    episode: 66,
    title: "울라",
    romanized: "ulla",
    duration: 1,
    video: "/media/usagi/kr/ep66_ulla_56-57_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep66_ulla.webp",
    language: "KR",
  },
  {
    id: "kr-ep27-purururu",
    characterId: "usagi",
    episode: 27,
    title: "푸루루루",
    romanized: "purururu",
    duration: 0.82,
    video: "/media/usagi/kr/ep27_purururu_16.58-17.40_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep27_purururu.webp",
    language: "KR",
  },
  {
    id: "kr-ep148-pajama-usagi-song",
    characterId: "usagi",
    episode: 148,
    title: "파자마 파티스",
    romanized: "pajama_usagi_song",
    duration: 8.4,
    video: "/media/usagi/kr/ep148_pajama_usagi_song_38.40-46.80_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep148_pajama_usagi_song.webp",
    language: "KR",
  },
  {
    id: "kr-ep104-uung",
    characterId: "usagi",
    episode: 104,
    title: "우웅",
    romanized: "uung",
    duration: 2.0,
    video: "/media/usagi/kr/ep104_uung_10.20-12.20_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep104_uung.webp",
    language: "KR",
  },
  {
    id: "kr-ep104-bread-ulla-x3",
    characterId: "usagi",
    episode: 104,
    title: "울라 울라 울라",
    romanized: "bread_ulla_x3",
    duration: 3.36,
    video: "/media/usagi/kr/ep104_bread_ulla_x3_freeze-corrected_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep104_bread_ulla_x3.webp",
    language: "KR",
  },
  {
    id: "kr-ep104-eating",
    characterId: "usagi",
    episode: 104,
    title: "빵 먹는 소리",
    romanized: "eating",
    duration: 1.234567,
    video: "/media/usagi/kr/ep104_eating_bite-end_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep104_eating.webp",
    language: "KR",
  },
  {
    id: "kr-ep104-haa-x2",
    characterId: "usagi",
    episode: 104,
    title: "하아 하아",
    romanized: "haa_x2",
    duration: 1.5,
    video: "/media/usagi/kr/ep104_haa_x2_38.55-40.05_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep104_haa_x2.webp",
    language: "KR",
  },
  {
    id: "kr-ep104-ulla-yaha-yaha",
    characterId: "usagi",
    episode: 104,
    title: "울라 야하 야하",
    romanized: "ulla_yaha_yaha",
    duration: 3.19,
    video: "/media/usagi/kr/ep104_ulla_yaha_yaha_53.66-56.85_KR.mp4",
    thumbnail: "/thumbnails/usagi/kr/ep104_ulla_yaha_yaha.webp",
    language: "KR",
  },
];

export function formatDuration(duration: number) {
  return `0:${Math.ceil(duration).toString().padStart(2, "0")}`;
}
