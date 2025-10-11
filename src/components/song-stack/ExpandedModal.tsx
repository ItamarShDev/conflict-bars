import type { Song } from "@/app/timeline/types";
import { translations } from "@/components/timeline/translations";
import { SongEntry } from "../timeline/SongEntry";
import { ModalHeader } from "./ModalHeader";

type SongStackItem = {
  song: Song;
  timestamp: string;
  leaning: "left" | "right" | "center" | "unknown";
};

type ExpandedModalProps = {
  songs: SongStackItem[];
  lang: "en" | "he";
  year: number;
  isExpanded: boolean;
  onClose: () => void;
  songCountText: string;
};

export function ExpandedModal({
  songs,
  lang,
  year,
  isExpanded,
  onClose,
  songCountText,
}: ExpandedModalProps) {
  const t = translations[lang];
  return (
    <dialog
      open={isExpanded}
      className={`fixed inset-0 z-50 h-screen w-full bg-transparent p-0 backdrop:bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
    >
      <div
        className={`mx-auto w-full max-w-5xl px-4 py-10 transition-all duration-500 ease-out ${isExpanded ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"}`}
        role="document"
      >
        <ModalHeader
          lang={lang}
          year={year}
          viewAllLabel={t.stack.viewAll}
          songCountText={songCountText}
          closeLabel={t.stack.close}
          onClose={onClose}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {songs.map((entry, idx) => (
            <SongEntry
              key={`${entry.song.artist}-${entry.song.name}-expanded-${idx}`}
              song={entry.song}
              lang={lang}
              timestamp={entry.timestamp}
              leaning={entry.leaning}
              showMarginTop={false}
              className="ml-0 mr-0 w-full max-w-full bg-[var(--color-card-background)] text-left shadow-xl border border-[var(--color-border)]"
              variant="full"
            />
          ))}
        </div>
      </div>
    </dialog>
  );
}
