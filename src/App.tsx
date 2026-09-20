import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  characters,
  voiceClips,
  type CharacterDefinition,
  type VoiceClip,
} from "./data";

type ViewName = "main" | "dictionary";
type BubbleState = "hidden" | "visible" | "leaving";

type PreparedVoiceClip = {
  clip: VoiceClip;
  source: string;
};

const PRELOAD_QUEUE_SIZE = 5;
const RECENT_HISTORY_SIZE = 10;
const PRELOAD_CONCURRENCY = 2;
const PRELOAD_CACHE_SIZE = 15;

function getViewFromUrl(): ViewName {
  return new URLSearchParams(window.location.search).get("view") === "dictionary"
    ? "dictionary"
    : "main";
}

type CharacterSwitcherProps = {
  activeCharacter: CharacterDefinition;
  open: boolean;
  onToggle: () => void;
  onSelect: (character: CharacterDefinition) => void;
};

function CharacterSwitcher({ activeCharacter, open, onToggle, onSelect }: CharacterSwitcherProps) {
  return (
    <div className="character-switcher">
      <button
        className="brand-button"
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
      >
        {activeCharacter.logo ? (
          <img className="brand-logo" src={activeCharacter.logo} alt="" />
        ) : (
          <span className="brand-color" style={{ backgroundColor: activeCharacter.color }} />
        )}
        <span>{activeCharacter.latinName}</span>
        <span className="brand-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="character-popover" role="listbox" aria-label="캐릭터 선택">
          <p className="popover-label">캐릭터</p>
          {characters.map((character) => (
            <button
              key={character.id}
              type="button"
              role="option"
              aria-selected={character.id === activeCharacter.id}
              className="character-option"
              disabled={!character.available}
              onClick={() => onSelect(character)}
            >
              {character.logo ? (
                <img className="character-logo" src={character.logo} alt="" />
              ) : (
                <span className="character-color" style={{ backgroundColor: character.color }} />
              )}
              <span>
                <strong>{character.name}</strong>
                <small>{character.latinName}</small>
              </span>
              <em>{character.available ? "선택됨" : "준비 중"}</em>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type HeaderProps = {
  activeCharacter: CharacterDefinition;
  currentView: ViewName;
  characterMenuOpen: boolean;
  navOpen: boolean;
  onToggleCharacters: () => void;
  onToggleNav: () => void;
  onNavigate: (view: ViewName) => void;
  onSelectCharacter: (character: CharacterDefinition) => void;
};

function Header({
  activeCharacter,
  currentView,
  characterMenuOpen,
  navOpen,
  onToggleCharacters,
  onToggleNav,
  onNavigate,
  onSelectCharacter,
}: HeaderProps) {
  return (
    <header className="topbar">
      <CharacterSwitcher
        activeCharacter={activeCharacter}
        open={characterMenuOpen}
        onToggle={onToggleCharacters}
        onSelect={onSelectCharacter}
      />
      <div className="nav-wrap">
        <button
          type="button"
          className="menu-button"
          aria-label="메뉴 열기"
          aria-expanded={navOpen}
          onClick={onToggleNav}
        >
          <span />
          <span />
          <span />
        </button>
        {navOpen && (
          <nav className="nav-popover" aria-label="주요 메뉴">
            <button
              type="button"
              className={currentView === "dictionary" ? "active" : ""}
              onClick={() => onNavigate("dictionary")}
            >
              <span aria-hidden="true">▦</span>
              보이스 아카이브
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

type VideoBubbleProps = {
  clip: VoiceClip | null;
  state: BubbleState;
  slot: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onPlaying: () => void;
  onEnded: () => void;
};

function VideoBubble({ clip, state, slot, videoRef, onPlaying, onEnded }: VideoBubbleProps) {
  return (
    <aside
      className={`video-bubble bubble-slot-${slot} ${state}`}
      aria-live="polite"
      aria-label={clip ? `${clip.title} 영상` : "재생 영상"}
    >
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        onPlaying={onPlaying}
        onEnded={onEnded}
      />
    </aside>
  );
}

type MainViewProps = {
  character: CharacterDefinition;
  clips: VoiceClip[];
};

function MainView({ character, clips }: MainViewProps) {
  const [currentClip, setCurrentClip] = useState<VoiceClip | null>(null);
  const [bubbleState, setBubbleState] = useState<BubbleState>("hidden");
  const [bubbleSlot, setBubbleSlot] = useState(0);
  const [pressToken, setPressToken] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);
  const preparedQueue = useRef<PreparedVoiceClip[]>([]);
  const recentClipIds = useRef<string[]>([]);
  const pendingClipIds = useRef(new Set<string>());
  const activePreloads = useRef(0);
  const currentClipId = useRef<string | null>(null);
  const preloadCache = useRef(new Map<string, { source: string; lastUsed: number }>());
  const fillQueue = useRef<() => void>(() => undefined);

  useEffect(() => () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => {
    let disposed = false;
    const queueTarget = Math.min(PRELOAD_QUEUE_SIZE, clips.length);

    preparedQueue.current = [];
    recentClipIds.current = [];
    pendingClipIds.current.clear();
    activePreloads.current = 0;
    currentClipId.current = null;

    const trimCache = () => {
      const protectedIds = new Set([
        ...preparedQueue.current.map(({ clip }) => clip.id),
        ...pendingClipIds.current,
      ]);
      if (currentClipId.current) protectedIds.add(currentClipId.current);

      const removable = [...preloadCache.current.entries()]
        .filter(([id]) => !protectedIds.has(id))
        .sort(([, a], [, b]) => a.lastUsed - b.lastUsed);

      while (preloadCache.current.size > PRELOAD_CACHE_SIZE && removable.length > 0) {
        const [id, cached] = removable.shift()!;
        URL.revokeObjectURL(cached.source);
        preloadCache.current.delete(id);
      }
    };

    const chooseNextClip = () => {
      const reserved = new Set([
        ...preparedQueue.current.map(({ clip }) => clip.id),
        ...pendingClipIds.current,
      ]);

      let candidates = clips.filter(
        (clip) => !reserved.has(clip.id) && !recentClipIds.current.includes(clip.id),
      );

      while (candidates.length === 0 && recentClipIds.current.length > 0) {
        recentClipIds.current.shift();
        candidates = clips.filter(
          (clip) => !reserved.has(clip.id) && !recentClipIds.current.includes(clip.id),
        );
      }

      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const scheduleFill = () => {
      if (disposed || queueTarget === 0) return;

      while (
        activePreloads.current < PRELOAD_CONCURRENCY
        && preparedQueue.current.length + pendingClipIds.current.size < queueTarget
      ) {
        const clip = chooseNextClip();
        if (!clip) break;

        const cached = preloadCache.current.get(clip.id);
        if (cached) {
          cached.lastUsed = Date.now();
          preparedQueue.current.push({ clip, source: cached.source });
          continue;
        }

        pendingClipIds.current.add(clip.id);
        activePreloads.current += 1;

        void fetch(clip.video)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to preload ${clip.video}`);
            return response.blob();
          })
          .then((blob) => {
            if (disposed) return;
            const source = URL.createObjectURL(blob);
            preloadCache.current.set(clip.id, { source, lastUsed: Date.now() });
            preparedQueue.current.push({ clip, source });
            trimCache();
          })
          .catch(() => {
            if (!disposed) preparedQueue.current.push({ clip, source: clip.video });
          })
          .finally(() => {
            pendingClipIds.current.delete(clip.id);
            activePreloads.current = Math.max(0, activePreloads.current - 1);
            scheduleFill();
          });
      }
    };

    fillQueue.current = scheduleFill;
    scheduleFill();

    return () => {
      disposed = true;
      fillQueue.current = () => undefined;
      for (const { source } of preloadCache.current.values()) URL.revokeObjectURL(source);
      preloadCache.current.clear();
      preparedQueue.current = [];
      pendingClipIds.current.clear();
    };
  }, [clips]);

  const finishPlayback = useCallback(() => {
    setBubbleState("leaving");
    hideTimer.current = window.setTimeout(() => setBubbleState("hidden"), 320);
  }, []);

  const showPlayingVideo = useCallback(() => {
    setBubbleState("visible");
  }, []);

  const playRandomClip = useCallback(() => {
    if (clips.length === 0) return;
    if (hideTimer.current) window.clearTimeout(hideTimer.current);

    let eligibleIndex = preparedQueue.current.findIndex(
      ({ clip }) => !recentClipIds.current.includes(clip.id),
    );

    while (eligibleIndex < 0 && recentClipIds.current.length > 0) {
      recentClipIds.current.shift();
      eligibleIndex = preparedQueue.current.findIndex(
        ({ clip }) => !recentClipIds.current.includes(clip.id),
      );
    }

    const prepared = eligibleIndex >= 0
      ? preparedQueue.current.splice(eligibleIndex, 1)[0]
      : null;
    const fallbackCandidates = clips.filter(
      (clip) => !recentClipIds.current.includes(clip.id),
    );
    const fallbackClip = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)]
      ?? clips[Math.floor(Math.random() * clips.length)];
    const clip = prepared?.clip ?? fallbackClip;
    const source = prepared?.source ?? clip.video;

    currentClipId.current = clip.id;
    recentClipIds.current.push(clip.id);
    if (recentClipIds.current.length > RECENT_HISTORY_SIZE) recentClipIds.current.shift();

    const video = videoRef.current;
    setBubbleState("hidden");
    if (video) {
      video.pause();
      video.src = source;
      video.currentTime = 0;
      video.load();
      void video.play().catch(() => {
        setBubbleState("hidden");
      });
    }

    setCurrentClip(clip);
    setBubbleSlot((previous) => (previous + 1 + Math.floor(Math.random() * 5)) % 6);
    setPressToken((value) => value + 1);
    fillQueue.current();
  }, [clips]);

  return (
    <main className="main-view">
      <button
        type="button"
        className="usagi-button"
        aria-label={`${character.name}를 눌러 랜덤 목소리 재생`}
        onClick={playRandomClip}
      >
        <span className="scene-float">
          <span key={pressToken} className={pressToken > 0 ? "character-pop active" : "character-pop"}>
            <img
              className="character-image"
              src={character.image}
              alt={`${character.name} 캐릭터`}
              draggable={false}
            />
          </span>
        </span>
      </button>

      <VideoBubble
        clip={currentClip}
        state={bubbleState}
        slot={bubbleSlot}
        videoRef={videoRef}
        onPlaying={showPlayingVideo}
        onEnded={finishPlayback}
      />
    </main>
  );
}

type DictionaryViewProps = {
  character: CharacterDefinition;
  clips: VoiceClip[];
  onBack: () => void;
};

function DictionaryView({ character, clips, onBack }: DictionaryViewProps) {
  const [expanded, setExpanded] = useState<{
    clip: VoiceClip;
    origin: { left: number; top: number; width: number };
  } | null>(null);
  const [expandedOpen, setExpandedOpen] = useState(false);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);
  const closeTimer = useRef<number | null>(null);

  const closeExpanded = useCallback(() => {
    setExpandedOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setExpanded(null), 300);
  }, []);

  const playClip = (clip: VoiceClip, event: React.MouseEvent<HTMLButtonElement>) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    const thumbnail = event.currentTarget.querySelector(".thumbnail-wrap");
    const rect = (thumbnail ?? event.currentTarget).getBoundingClientRect();
    setExpandedOpen(false);
    setExpanded({
      clip,
      origin: { left: rect.left, top: rect.top, width: rect.width },
    });
  };

  useEffect(() => {
    if (!expanded) return;
    const animationFrame = window.requestAnimationFrame(() => setExpandedOpen(true));
    const video = expandedVideoRef.current;
    if (!video) return () => window.cancelAnimationFrame(animationFrame);
    video.currentTime = 0;
    void video.play().catch(() => undefined);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [expanded]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && expanded) closeExpanded();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeExpanded, expanded]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  return (
    <main className="dictionary-view">
      <section className="dictionary-heading">
        <button type="button" className="back-button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          돌아가기
        </button>
        <div className="title-line">
          <div>
            <p className="eyebrow">{character.latinName} VOICE ARCHIVE</p>
            <h1>{character.name} 보이스 아카이브 <span aria-hidden="true">♥</span></h1>
          </div>
          <div className="filter-chips" aria-label="언어 필터">
            <button type="button" className="active">전체</button>
            <button type="button">한국어</button>
          </div>
        </div>
      </section>

      <section className="dictionary-layout">
        <div className="clip-grid" aria-label={`${character.name} 목소리 목록`}>
          {clips.map((clip) => (
              <button
                type="button"
                key={clip.id}
                className="clip-card"
                aria-label={`${clip.episode}화 영상 재생`}
                onClick={(event) => playClip(clip, event)}
              >
                <span className="thumbnail-wrap">
                  <img src={clip.thumbnail} alt="" />
                </span>
                <span className="clip-info">
                  <strong>{clip.episode}화</strong>
                </span>
              </button>
          ))}
        </div>
      </section>

      {expanded && (
        <div
          className={`dictionary-video-overlay ${expandedOpen ? "open" : ""}`}
          role="dialog"
          aria-label={`${expanded.clip.episode}화 영상`}
          onClick={closeExpanded}
        >
          <div
            className="expanded-video"
            style={{
              "--origin-left": `${expanded.origin.left}px`,
              "--origin-top": `${expanded.origin.top}px`,
              "--origin-width": `${expanded.origin.width}px`,
            } as React.CSSProperties}
            onClick={(event) => event.stopPropagation()}
          >
            <video
              ref={expandedVideoRef}
              src={expanded.clip.video}
              poster={expanded.clip.thumbnail}
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
              onClick={() => {
                const video = expandedVideoRef.current;
                if (!video) return;
                video.currentTime = 0;
                void video.play().catch(() => undefined);
              }}
              onEnded={closeExpanded}
            />
            <button type="button" className="expanded-close" aria-label="영상 닫기" onClick={closeExpanded}>
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<ViewName>(getViewFromUrl);
  const [navOpen, setNavOpen] = useState(false);
  const [characterMenuOpen, setCharacterMenuOpen] = useState(false);
  const [activeCharacterId, setActiveCharacterId] = useState(characters[0].id);
  const activeCharacter = characters.find((character) => character.id === activeCharacterId) ?? characters[0];
  const clips = useMemo(
    () => voiceClips.filter((clip) => clip.characterId === activeCharacter.id),
    [activeCharacter.id],
  );
  useEffect(() => {
    const handlePopState = () => setView(getViewFromUrl());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextView: ViewName) => {
    const url = nextView === "dictionary" ? "?view=dictionary" : window.location.pathname;
    window.history.pushState(null, "", url);
    setView(nextView);
    setNavOpen(false);
    setCharacterMenuOpen(false);
  };

  return (
    <div className={`app-shell ${view === "dictionary" ? "dictionary-mode" : "main-mode"}`}>
      <Header
        activeCharacter={activeCharacter}
        currentView={view}
        characterMenuOpen={characterMenuOpen}
        navOpen={navOpen}
        onToggleCharacters={() => {
          setCharacterMenuOpen((open) => !open);
          setNavOpen(false);
        }}
        onToggleNav={() => {
          setNavOpen((open) => !open);
          setCharacterMenuOpen(false);
        }}
        onNavigate={navigate}
        onSelectCharacter={(character) => {
          if (!character.available) return;
          setActiveCharacterId(character.id);
          setCharacterMenuOpen(false);
        }}
      />
      {view === "main" ? (
        <MainView character={activeCharacter} clips={clips} />
      ) : (
        <DictionaryView
          key={activeCharacter.id}
          character={activeCharacter}
          clips={clips}
          onBack={() => navigate("main")}
        />
      )}
    </div>
  );
}
