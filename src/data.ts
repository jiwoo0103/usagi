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
  {
    id: "chiikawa",
    name: "치이카와",
    latinName: "CHIIKAWA",
    color: "#f4a8b8",
    logo: "/logos/chiikawa-logo.png",
    available: false,
  },
  {
    id: "hachiware",
    name: "하치와레",
    latinName: "HACHIWARE",
    color: "#78b8dc",
    logo: "/logos/hachiware-logo.png",
    available: false,
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
];

export function formatDuration(duration: number) {
  return `0:${Math.ceil(duration).toString().padStart(2, "0")}`;
}
