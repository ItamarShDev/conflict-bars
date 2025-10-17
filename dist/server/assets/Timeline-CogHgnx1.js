import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useId, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { b as api } from "./router-DpmfDipf.js";
function SubmitSongForm({
  onSuccess,
  translations: translations2
}) {
  const submitSong = useMutation(api.mutations.submitSongWithUser);
  const songs = useQuery(api.songs.getAllSongs) ?? [];
  const artists = useQuery(api.artists.getAllArtists) ?? [];
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const artistListId = useId();
  const languageListId = useId();
  const { artistOptions, languages } = useMemo(() => {
    const languageSet = /* @__PURE__ */ new Set();
    for (const song of songs) {
      if (song.language) {
        languageSet.add(song.language);
      }
    }
    const artistOptions2 = artists.map((artist) => ({
      id: artist._id,
      name: artist.name
    })).sort((a, b) => a.name.localeCompare(b.name));
    return {
      artistOptions: artistOptions2,
      languages: Array.from(languageSet).sort((a, b) => a.localeCompare(b))
    };
  }, [songs, artists]);
  const artistNameToId = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const option of artistOptions) {
      if (option.name) {
        map.set(option.name.toLowerCase(), option.id);
      }
    }
    return map;
  }, [artistOptions]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const displayName = formData.get("displayName")?.trim();
    const emailRaw = formData.get("email") ?? "";
    const email = emailRaw.trim();
    const songName = formData.get("songName")?.trim();
    const artist = formData.get("artist")?.trim();
    const publishedDate = formData.get("publishedDate")?.trim();
    const languageRaw = formData.get("language") ?? "";
    const language = languageRaw.trim();
    const lyricHebrew = (formData.get("lyricHebrew") ?? "").trim();
    const lyricEnglish = (formData.get("lyricEnglish") ?? "").trim();
    const linkLyrics = (formData.get("linkLyrics") ?? "").trim();
    const linkInfo = (formData.get("linkInfo") ?? "").trim();
    const linkYoutube = (formData.get("linkYoutube") ?? "").trim();
    if (!displayName || !songName || !artist || !publishedDate) {
      setStatus("error");
      setErrorMessage(translations2.errors.required);
      return;
    }
    const artistId = artistNameToId.get(artist.toLowerCase());
    if (!artistId) {
      setStatus("error");
      setErrorMessage(translations2.errors.required);
      return;
    }
    const lyricSample = lyricHebrew || lyricEnglish ? {
      hebrew: lyricHebrew || void 0,
      english_translation: lyricEnglish || void 0
    } : void 0;
    const links = linkLyrics || linkInfo || linkYoutube ? {
      lyrics: linkLyrics || void 0,
      song_info: linkInfo || void 0,
      youtube: linkYoutube || void 0
    } : void 0;
    try {
      await submitSong({
        userDisplayName: displayName,
        userEmail: email ? email : void 0,
        song: {
          name: songName,
          artistId,
          published_date: publishedDate,
          language: language ? language : void 0,
          lyric_sample: lyricSample,
          links
        }
      });
      setStatus("success");
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Failed to submit song", error);
      setStatus("error");
      setErrorMessage(translations2.errors.generic);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "border border-neutral-700 rounded-lg p-6 bg-neutral-900/50", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: translations2.title }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.displayName }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "displayName",
              type: "text",
              required: true,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.email }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "email",
              type: "email",
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.songName }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "songName",
              type: "text",
              required: true,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.artist }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "artist",
              type: "text",
              required: true,
              list: artistListId,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.publishedDate }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "publishedDate",
              type: "date",
              required: true,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.language }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "language",
              type: "text",
              list: languageListId,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.lyricHebrew }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              name: "lyricHebrew",
              rows: 3,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.lyricEnglish }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              name: "lyricEnglish",
              rows: 3,
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.linkLyrics }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "linkLyrics",
              type: "url",
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.linkInfo }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "linkInfo",
              type: "url",
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: translations2.fields.linkYoutube }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "linkYoutube",
              type: "url",
              className: "rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: status === "submitting",
            className: "rounded bg-emerald-500 px-4 py-2 font-semibold text-black disabled:opacity-50",
            children: status === "submitting" ? translations2.buttons.submitting : translations2.buttons.submit
          }
        ),
        status === "success" && /* @__PURE__ */ jsx("span", { className: "text-sm text-emerald-400", children: translations2.success }),
        status === "error" && errorMessage && /* @__PURE__ */ jsx("span", { className: "text-sm text-red-400", children: errorMessage })
      ] }),
      /* @__PURE__ */ jsx("datalist", { id: artistListId, children: artistOptions.map((option) => /* @__PURE__ */ jsx("option", { value: option.name }, option.id)) }),
      /* @__PURE__ */ jsx("datalist", { id: languageListId, children: languages.map((langOption) => /* @__PURE__ */ jsx("option", { value: langOption }, langOption)) })
    ] })
  ] });
}
function SubmitSongModal({
  label,
  translations: translations2
}) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 z-40 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-black shadow-lg transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        children: label
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setIsOpen(false),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              setIsOpen(false);
            }
          },
          className: "absolute inset-0 cursor-default",
          "aria-label": translations2.modalCloseAria
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: translations2.title }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsOpen(false),
              className: "rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
              "aria-label": translations2.modalCloseAria,
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          SubmitSongForm,
          {
            translations: translations2,
            onSuccess: () => {
              setIsOpen(false);
            }
          }
        )
      ] })
    ] })
  ] });
}
function HelpModal({ translations: translations2, lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const isRtl = lang === "he";
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-lg font-semibold text-white shadow-lg transition hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        onClick: () => setIsOpen(true),
        "aria-label": translations2.buttonAria,
        "aria-haspopup": "dialog",
        children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "?" })
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setIsOpen(false),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              setIsOpen(false);
            }
          },
          className: "absolute inset-0 cursor-default",
          "aria-label": translations2.close
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": descriptionId,
          dir: isRtl ? "rtl" : "ltr",
          className: "relative z-10 w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h2", { id: titleId, className: "text-lg font-semibold text-neutral-100", children: translations2.modalTitle }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsOpen(false),
                  className: "rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                  "aria-label": translations2.close,
                  children: "✕"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { id: descriptionId, className: "space-y-4 text-sm text-neutral-200", children: [
              /* @__PURE__ */ jsx("p", { children: translations2.description.intro }),
              /* @__PURE__ */ jsxs(
                "ul",
                {
                  className: `${isRtl ? "list-disc pr-6" : "list-disc pl-6"} space-y-2`,
                  children: [
                    /* @__PURE__ */ jsx("li", { children: translations2.description.columns.left }),
                    /* @__PURE__ */ jsx("li", { children: translations2.description.columns.right }),
                    /* @__PURE__ */ jsx("li", { children: translations2.description.borders })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { children: translations2.description.submissions })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsOpen(false),
                className: "rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                children: translations2.close
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
function TimelineHeader({ title, lang }) {
  return /* @__PURE__ */ jsx(
    "h1",
    {
      className: `text-center text-3xl font-bold tracking-tight ${lang === "he" ? "text-slate-900" : "text-slate-900"} dark:text-slate-100`,
      children: title
    }
  );
}
const translations = {
  en: {
    title: "Timeline",
    subtitle: "Direction is the political leaning of the artist",
    lyrics: "Lyrics",
    info: "Info",
    conflict: "Conflict",
    reason: "Reason",
    wikipedia: "Wikipedia",
    youtube: "YouTube",
    description: "Description",
    effects: "Effects",
    submitSongButton: "Submit a song",
    submitSongForm: {
      modalCloseAria: "Close submit song form",
      title: "Submit a Song",
      fields: {
        displayName: "Your name *",
        email: "Email",
        songName: "Song name *",
        artist: "Artist *",
        publishedDate: "Published date (YYYY-MM-DD) *",
        language: "Language",
        lyricHebrew: "Lyric sample (Hebrew)",
        lyricEnglish: "Lyric sample (English translation)",
        linkLyrics: "Lyrics link",
        linkInfo: "Song info link",
        linkYoutube: "YouTube link"
      },
      buttons: {
        submitting: "Submitting...",
        submit: "Submit song"
      },
      success: "Thanks! We'll review your submission soon.",
      errors: {
        required: "Please fill in all required fields.",
        generic: "Something went wrong while submitting the song. Please try again."
      }
    },
    helpModal: {
      buttonLabel: "How it works",
      buttonAria: "Open site explanation",
      modalTitle: "How to read this timeline",
      description: {
        intro: "This site visualizes key moments in the Israeli hip-hop scene alongside major conflicts.",
        columns: {
          left: "Left column: Israeli major conflicts",
          right: "Right column: Songs released in the same period"
        },
        borders: "Card borders indicate political leaning — red for left, blue for right, gray for unknown.",
        submissions: "Want to contribute? Use the Submit a Song button to share missing tracks or context."
      },
      close: "Close"
    },
    stack: {
      viewAll: "View songs",
      close: "Close",
      songsLabel: "songs"
    }
  },
  he: {
    title: "ציר זמן",
    subtitle: "בכיוון הנטייה הפוליטית",
    lyrics: "מילים",
    info: "מידע",
    conflict: "סכסוך",
    reason: "סיבה",
    wikipedia: "ויקיפדיה",
    youtube: "יוטיוב",
    description: "תיאור",
    effects: "השפעות",
    submitSongButton: "הוסף שיר",
    submitSongForm: {
      modalCloseAria: "סגור את טופס שליחת השיר",
      title: "הוסף שיר",
      fields: {
        displayName: "השם שלך *",
        email: "אימייל",
        songName: "שם השיר *",
        artist: "אמן *",
        publishedDate: "תאריך יציאה (YYYY-MM-DD) *",
        language: "שפה",
        lyricHebrew: "קטע מילים (עברית)",
        lyricEnglish: "קטע מילים (תרגום לאנגלית)",
        linkLyrics: "קישור למילים",
        linkInfo: "קישור למידע על השיר",
        linkYoutube: "קישור ליוטיוב"
      },
      buttons: {
        submitting: "שולח...",
        submit: "שלח שיר"
      },
      success: "תודה! נעבור על ההגשה שלך בקרוב.",
      errors: {
        required: "אנא מלא את כל השדות החיוניים.",
        generic: "משהו השתבש בשליחת השיר. נסה שוב בבקשה."
      }
    },
    helpModal: {
      buttonLabel: "איך זה עובד",
      buttonAria: "פתח הסבר על האתר",
      modalTitle: "איך לקרוא את הציר",
      description: {
        intro: "האתר מציג אירועים מרכזיים בסצנת ההיפ-הופ הישראלי לצד סכסוכים משמעותיים.",
        columns: {
          left: "צד שמאל: סכסוכים מרכזיים בישראל",
          right: "צד ימין: שירים שיצאו באותה תקופה"
        },
        borders: "מסגרת הכרטיס מציינת נטייה פוליטית — אדום לשמאל, כחול לימין, אפור ללא ידוע.",
        submissions: "רוצים להוסיף? לחצו על כפתור הוסף שיר ושלחו שיר או מידע שחסר."
      },
      close: "סגור"
    },
    stack: {
      viewAll: "הצג שירים",
      close: "סגור",
      songsLabel: "שירים"
    }
  }
};
function ConflictDetail({
  label,
  content
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm text-[var(--color-card-foreground)] leading-tight", children: [
    /* @__PURE__ */ jsxs("strong", { className: "text-[var(--color-card-foreground)]", children: [
      label,
      ":"
    ] }),
    " ",
    content
  ] });
}
function ConflictHeader({ title }) {
  return /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[var(--color-card-foreground)] text-sm leading-tight", children: title });
}
function ConflictIndicator() {
  return /* @__PURE__ */ jsx("div", { className: "absolute -right-1 top-1 w-1 h-1 bg-[var(--color-accent)] border border-[var(--color-background)] rounded-full shadow" });
}
function ConflictLinks({
  wikipediaUrl,
  wikipediaLabel
}) {
  if (!wikipediaUrl) return null;
  return /* @__PURE__ */ jsx("div", { className: "flex gap-1 mt-1 text-xs", children: /* @__PURE__ */ jsx(
    "a",
    {
      href: wikipediaUrl,
      target: "_blank",
      rel: "noreferrer",
      className: "text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline",
      children: wikipediaLabel
    }
  ) });
}
function ConflictReason({ reason }) {
  return /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--color-muted-foreground)] leading-tight", children: reason });
}
function ConflictTimestamp({ timestamp }) {
  return /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--color-muted-foreground)]", children: timestamp });
}
function ConflictEntry({ conflict, lang }) {
  const t = translations[lang];
  const title = lang === "he" && conflict.title_he ? conflict.title_he : conflict.title;
  const reason = lang === "he" && conflict.reason_he ? conflict.reason_he : conflict.reason;
  const description = lang === "he" && conflict.description_he ? conflict.description_he : conflict.description;
  const effects = lang === "he" && conflict.effects_he ? conflict.effects_he : conflict.effects;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `z-0 ml-2 mr-10 bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-slate-600 border rounded-md p-4 shadow-sm transition-all duration-200 hover:z-50 
                 hover:ring-2 hover:ring-[var(--color-accent)] hover:shadow-lg focus:outline-none focus:z-50 focus:ring-2 focus:ring-[var(--color-accent)] focus:shadow-lg ${lang === "he" ? "text-right" : ""}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-1 items-start h-full", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(ConflictHeader, { title }),
          /* @__PURE__ */ jsx(ConflictReason, { reason }),
          description && /* @__PURE__ */ jsx(ConflictDetail, { label: t.description, content: description }),
          effects && /* @__PURE__ */ jsx(ConflictDetail, { label: t.effects, content: effects }),
          /* @__PURE__ */ jsx(
            ConflictLinks,
            {
              wikipediaUrl: conflict.wikipedia_url,
              wikipediaLabel: t.wikipedia
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(ConflictIndicator, {}),
        /* @__PURE__ */ jsx(ConflictTimestamp, { timestamp: conflict.timestamp })
      ]
    }
  );
}
function ConflictsColumn({
  conflicts,
  index,
  lang
}) {
  const conflictItems = conflicts.filter((e) => e.type === "conflict");
  if (conflictItems.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `col-1 ml-4 row-${index + 1} ${lang === "he" ? "ml-0 mr-4" : ""}`,
      children: conflictItems.map((conflictEntry) => {
        const conflictDetails = conflictEntry.conflictEntry;
        if (!conflictDetails) {
          return null;
        }
        return /* @__PURE__ */ jsx(
          "div",
          {
            "data-conflict-id": conflictDetails.id,
            className: "mb-4",
            children: /* @__PURE__ */ jsx(ConflictEntry, { conflict: conflictDetails, lang })
          },
          conflictDetails.id
        );
      })
    }
  );
}
function SongEntry({
  song,
  lang,
  timestamp,
  leaning,
  className,
  showMarginTop = true,
  variant = "full"
}) {
  const t = translations[lang];
  const leaningColor = {
    left: "border-blue-600",
    right: "border-red-600",
    center: "border-yellow-600",
    unknown: "border-gray-600"
  };
  const songObj = song;
  const isSongObject = typeof song === "object" && song !== null;
  const hasSongIdentity = isSongObject && "name" in songObj && "artist" in songObj && !!songObj.name && !!songObj.artist;
  const isCompact = variant === "compact";
  const lyricSample = isSongObject && !isCompact && "lyric_sample" in songObj ? songObj.lyric_sample : void 0;
  const links = isSongObject && !isCompact && "links" in songObj ? songObj.links : void 0;
  const orientationClass = lang === "he" ? "ml-4 mr-auto text-right" : "mr-4 ml-auto";
  const containerClasses = [
    "relative w-full max-w-md bg-[var(--color-card-background)] border border-[var(--color-border)] rounded-md shadow-sm transition-transform duration-200",
    leaningColor[leaning],
    orientationClass,
    showMarginTop ? "mt-4" : "",
    isCompact ? "p-3 space-y-1.5" : "p-4 space-y-3",
    className ?? ""
  ].filter(Boolean).join(" ");
  const titleClass = isCompact ? "text-lg font-semibold leading-tight text-[var(--color-card-foreground)]" : "text-xl font-semibold leading-snug text-[var(--color-card-foreground)]";
  const artistClass = isCompact ? "text-[0.7rem] uppercase tracking-wide text-[var(--color-muted-foreground)]" : "text-sm text-[var(--color-muted-foreground)]";
  const lyricContent = lang === "he" ? lyricSample?.hebrew ?? lyricSample?.english_translation : lyricSample?.english_translation ?? lyricSample?.hebrew;
  return /* @__PURE__ */ jsxs("div", { className: containerClasses, children: [
    hasSongIdentity && /* @__PURE__ */ jsx(
      "div",
      {
        className: lang === "he" ? isCompact ? "flex flex-col gap-0.5 text-right" : "flex flex-col gap-1 text-right" : isCompact ? "flex flex-col gap-0.5" : "flex items-baseline gap-2",
        children: lang === "he" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: artistClass, children: songObj.artist }),
          /* @__PURE__ */ jsx("h3", { className: titleClass, children: songObj.name })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h3", { className: titleClass, children: songObj.name }),
          /* @__PURE__ */ jsx("span", { className: artistClass, children: songObj.artist })
        ] })
      }
    ),
    !isCompact && lyricSample && lyricContent && /* @__PURE__ */ jsxs(
      "p",
      {
        className: `text-sm text-[var(--color-muted-foreground)] opacity-90 ${lang === "he" ? "text-right" : ""}`,
        dir: lang === "he" && lyricSample?.hebrew ? "rtl" : "ltr",
        children: [
          '"',
          lyricContent,
          '"'
        ]
      }
    ),
    !isCompact && links && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex gap-3 text-sm ${lang === "he" ? "flex-row-reverse" : ""}`,
        children: [
          links?.lyrics && /* @__PURE__ */ jsx(
            "a",
            {
              href: links.lyrics,
              target: "_blank",
              rel: "noreferrer",
              className: "no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium",
              children: t.lyrics
            }
          ),
          links?.song_info && /* @__PURE__ */ jsx(
            "a",
            {
              href: links.song_info,
              target: "_blank",
              rel: "noreferrer",
              className: "no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium",
              children: t.info
            }
          ),
          links?.youtube && /* @__PURE__ */ jsx(
            "a",
            {
              href: links.youtube,
              target: "_blank",
              rel: "noreferrer",
              className: "no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium",
              children: t.youtube
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: [
          isCompact ? "text-[0.65rem]" : "text-xs",
          "text-[var(--color-muted-foreground)] opacity-70",
          lang === "he" ? "text-left" : ""
        ].filter(Boolean).join(" "),
        children: timestamp
      }
    )
  ] });
}
function ModalHeader({
  lang,
  year,
  viewAllLabel,
  songCountText,
  closeLabel,
  onClose
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-start justify-between ${lang === "he" ? "flex-row-reverse" : ""}`,
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm uppercase tracking-wide text-slate-200/80", children: year }),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: `mt-1 text-2xl font-semibold text-white ${lang === "he" ? "text-right" : ""}`,
              dir: lang === "he" ? "rtl" : void 0,
              children: [
                viewAllLabel,
                " ",
                songCountText
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
            children: closeLabel
          }
        )
      ]
    }
  );
}
function ExpandedModal({
  songs,
  lang,
  year,
  isExpanded,
  onClose,
  songCountText
}) {
  const t = translations[lang];
  return /* @__PURE__ */ jsx(
    "dialog",
    {
      open: isExpanded,
      className: `fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-transparent p-0 backdrop-grayscale-100 backdrop-blur-sm transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`,
      "aria-modal": "true",
      onCancel: (event) => {
        event.preventDefault();
        onClose();
      },
      onClick: (event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      },
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `mx-auto flex w-full max-w-5xl flex-col px-4 py-10 transition-all duration-500 ease-out ${isExpanded ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"}`,
          role: "document",
          style: { maxHeight: "calc(100vh - 4rem)" },
          children: [
            /* @__PURE__ */ jsx(
              ModalHeader,
              {
                lang,
                year,
                viewAllLabel: t.stack.viewAll,
                songCountText,
                closeLabel: t.stack.close,
                onClose
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "mt-8 flex-1 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2", children: songs.map((entry, idx) => /* @__PURE__ */ jsx(
              SongEntry,
              {
                song: entry.song,
                lang,
                timestamp: entry.timestamp,
                leaning: entry.leaning,
                showMarginTop: false,
                className: "ml-0 mr-0 w-full max-w-full bg-[var(--color-card-background)] text-left shadow-xl border border-[var(--color-border)]",
                variant: "full"
              },
              `${entry.song.artist}-${entry.song.name}-expanded-${idx}`
            )) }) })
          ]
        }
      )
    }
  );
}
function getSongCountText(lang, songCount, songsLabel) {
  if (lang === "he") {
    if (songCount === 1) {
      return "שיר אחד";
    }
    if (songCount === 2) {
      return "שני שירים";
    }
    return `${songCount} שירים`;
  }
  const songWord = songCount === 1 ? "song" : songsLabel;
  return `${songCount} ${songWord}`;
}
const STACK_TRANSLATE = -40;
const STACK_ROTATIONS = [-1.8, 1.2, -0.9, 1.6];
const STACK_SCALES = [0.94, 0.96, 0.92, 0.95];
function StackedCards({
  songs,
  lang,
  isExpanded,
  isOverlayVisible
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `transition-all duration-300 ease-out ${isOverlayVisible ? "pointer-events-none" : ""} ${isExpanded ? "opacity-0 scale-95" : "opacity-100 scale-100"}`,
      children: songs.map((entry, idx) => {
        const rotationKey = `${entry.song.artist}-${entry.song.name}`;
        const rotationSeed = Array.from(rotationKey).reduce(
          (accumulator, character) => accumulator + character.charCodeAt(0),
          0
        );
        const rotation = STACK_ROTATIONS[rotationSeed % STACK_ROTATIONS.length];
        const yTranslate = (idx - songs.length / 2) * STACK_TRANSLATE;
        const hoveredRotation = STACK_ROTATIONS[(rotationSeed + 1) % STACK_ROTATIONS.length];
        const rotationStyle = isExpanded ? "0deg" : `${rotation}deg`;
        const hoveredRotationStyle = isExpanded ? "0deg" : `${hoveredRotation}deg`;
        const translateStyle = isExpanded ? "0" : `${yTranslate}px`;
        const scaleStyle = isExpanded ? "1" : `${STACK_SCALES[idx % STACK_SCALES.length]}`;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `transition-transform duration-300 rotate-(--rotate) translate-y-(--translate-y) scale-(--scale) hover:rotate-(--hover-rotate)`,
            style: {
              "--rotate": rotationStyle,
              "--translate-y": translateStyle,
              "--scale": scaleStyle,
              "--hover-rotate": hoveredRotationStyle
            },
            children: /* @__PURE__ */ jsx(
              SongEntry,
              {
                song: entry.song,
                lang,
                timestamp: entry.timestamp,
                leaning: entry.leaning,
                showMarginTop: idx === 0,
                className: `${isExpanded ? "" : "pointer-events-none px-3 py-3 text-sm"} ${lang === "he" ? "ml-4 mr-auto" : "mr-4 ml-auto"}`,
                variant: "compact"
              }
            )
          },
          `${entry.song.artist}-${entry.song.name}-${idx}`
        );
      })
    }
  );
}
const OVERLAY_TRANSITION_MS = 350;
function SongStack({ songs, lang, year }) {
  const t = translations[lang];
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!isOverlayVisible) {
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOverlayVisible]);
  useEffect(() => {
    if (!isOverlayVisible) {
      return;
    }
    if (isExpanded) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setIsOverlayVisible(false);
    }, OVERLAY_TRANSITION_MS);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOverlayVisible, isExpanded]);
  const collapsedCards = useMemo(() => songs, [songs]);
  const songCount = songs.length;
  const songCountText = getSongCountText(lang, songCount, t.stack.songsLabel);
  const openStack = () => {
    if (isOverlayVisible) {
      setIsExpanded(true);
      return;
    }
    setIsOverlayVisible(true);
    requestAnimationFrame(() => {
      setIsExpanded(true);
    });
  };
  const closeStack = () => {
    setIsExpanded(false);
  };
  if (collapsedCards.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: openStack,
        className: `w-full text-left focus:outline-none ${lang === "he" ? "text-right" : ""}`,
        "aria-expanded": isExpanded,
        "aria-label": `${t.stack.viewAll} ${songCountText}`,
        children: /* @__PURE__ */ jsx(
          StackedCards,
          {
            songs: collapsedCards,
            lang,
            isExpanded,
            isOverlayVisible
          }
        )
      }
    ),
    isMounted && isOverlayVisible && /* @__PURE__ */ jsx(
      ExpandedModal,
      {
        songs,
        lang,
        year,
        isExpanded,
        onClose: closeStack,
        songCountText
      }
    )
  ] });
}
function SongsColumn({ songs, lang, year, index }) {
  const songItems = songs.filter((e) => e.type === "song");
  if (songItems.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `col-3 mr-4 mb-4 row-${index + 1} ${lang === "he" ? "mr-0 ml-4" : ""}`,
      "aria-hidden": songItems.length === 0,
      children: /* @__PURE__ */ jsx(
        SongStack,
        {
          songs: songItems.map((songEntry) => ({
            song: songEntry.song,
            timestamp: songEntry.timestamp,
            leaning: songEntry.leaning
          })),
          lang,
          year
        }
      )
    }
  );
}
function YearMarker({ year, showYear, index }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: { gridColumn: 2, gridRow: index + 1 },
      className: "h-full flex flex-col items-center gap-3 relative",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 w-px bg-slate-200 dark:bg-slate-700 left-1/2 -translate-x-1/2" }),
        showYear && /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-center text-slate-700 dark:text-slate-300 text-sm font-semibold tabular-nums",
            children: year
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-3 w-3 rounded-full bg-slate-400 border-2 border-white dark:border-zinc-900",
            "aria-hidden": true
          }
        )
      ]
    }
  );
}
function YearGroup({
  year,
  entries,
  showYear,
  index,
  lang
}) {
  const songs = entries.filter((e) => e.type === "song");
  const conflicts = entries.filter((e) => e.type === "conflict");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ConflictsColumn, { index, conflicts, lang }),
    /* @__PURE__ */ jsx(YearMarker, { index, year, showYear }),
    /* @__PURE__ */ jsx(SongsColumn, { index, songs, lang, year })
  ] });
}
function convertConvexEventToTimeline(event) {
  return {
    time: {
      start: event.start,
      end: event.end
    },
    conflict: {
      title: event.title,
      title_he: event.title_he,
      reason: event.reason,
      reason_he: event.reason_he,
      description: event.description,
      description_he: event.description_he,
      effects: event.effects,
      effects_he: event.effects_he,
      wikipedia_url: event.wikipedia_url
    }
  };
}
function convertConvexEventsToTimeline(events) {
  return events.map(convertConvexEventToTimeline);
}
function calculateConflictDuration(start, end) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : /* @__PURE__ */ new Date();
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1e3 * 3600 * 24));
}
function parseConflictsForTimeline(conflicts) {
  return conflicts.map((c, index) => {
    const startDate = new Date(c.time.start);
    const endDate = c.time.end ? new Date(c.time.end) : null;
    const duration = calculateConflictDuration(c.time.start, c.time.end);
    const year = startDate.getFullYear();
    if (!c.conflict) {
      throw new Error(`Conflict ${index} is missing conflict data`);
    }
    return {
      id: `conflict-${index}`,
      startDate,
      endDate,
      duration,
      title: c.conflict.title,
      title_he: c.conflict.title_he,
      reason: c.conflict.reason,
      reason_he: c.conflict.reason_he,
      description: c.conflict.description,
      description_he: c.conflict.description_he,
      effects: c.conflict.effects,
      effects_he: c.conflict.effects_he,
      wikipedia_url: c.conflict.wikipedia_url,
      positionIndex: 0,
      // Will be set by detectOverlappingConflicts
      totalConflicts: 1,
      // Will be set by detectOverlappingConflicts
      year,
      timestamp: c.time.end ? `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString()}` : startDate.toLocaleDateString(),
      song: {
        name: "",
        artist: "",
        published_date: c.time.start,
        language: ""
      },
      leaning: "center",
      conflict: {
        title: c.conflict.title,
        title_he: c.conflict.title_he,
        reason: c.conflict.reason,
        reason_he: c.conflict.reason_he,
        description: c.conflict.description,
        description_he: c.conflict.description_he,
        effects: c.conflict.effects,
        effects_he: c.conflict.effects_he,
        wikipedia_url: c.conflict.wikipedia_url
      }
    };
  });
}
function detectOverlappingConflicts(conflicts) {
  const sortedConflicts = [...conflicts].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
  const conflictsByYear = /* @__PURE__ */ new Map();
  sortedConflicts.forEach((conflict) => {
    if (!conflictsByYear.has(conflict.year)) {
      conflictsByYear.set(conflict.year, []);
    }
    conflictsByYear.get(conflict.year)?.push(conflict);
  });
  conflictsByYear.forEach((yearConflicts) => {
    yearConflicts.forEach((conflict, index) => {
      conflict.positionIndex = index;
      conflict.totalConflicts = yearConflicts.length;
    });
  });
  return sortedConflicts;
}
function getArtistLeaning(artist) {
  const affiliation = artist?.affiliation?.toLowerCase();
  if (!affiliation) {
    return "unknown";
  }
  if (affiliation.includes("left")) return "left";
  if (affiliation.includes("right")) return "right";
  if (affiliation.includes("center")) return "center";
  return "unknown";
}
function parseStartYear(timestamp) {
  return new Date(timestamp).getFullYear();
}
function getEntriesByYear(timeline, conflicts) {
  const songEntries = timeline.flatMap((t) => {
    const year = parseStartYear(t.published_date);
    return {
      year,
      timestamp: new Date(t.published_date).toLocaleDateString(),
      song: t,
      leaning: getArtistLeaning(t.artist_details)
    };
  }).filter((entry) => Number.isFinite(entry.year)).sort((a, b) => a.year - b.year);
  const rawConflicts = parseConflictsForTimeline(conflicts);
  const processedConflicts = detectOverlappingConflicts(rawConflicts);
  const allEntries = songEntries.map((entry) => ({
    type: "song",
    year: entry.year,
    timestamp: entry.timestamp,
    song: entry.song,
    leaning: entry.leaning,
    position: 0
  }));
  processedConflicts.forEach((conflict) => {
    allEntries.push({
      type: "conflict",
      year: conflict.year,
      timestamp: conflict.timestamp,
      song: conflict.song,
      leaning: conflict.leaning,
      conflict: conflict.conflict,
      conflictEntry: conflict,
      maxStackLevel: 0,
      // Not used in side-by-side layout
      position: 0
    });
  });
  const entriesByYear = /* @__PURE__ */ new Map();
  allEntries.forEach((entry) => {
    if (!entriesByYear.has(entry.year)) {
      entriesByYear.set(entry.year, []);
    }
    const yearEntries = entriesByYear.get(entry.year);
    if (yearEntries) {
      yearEntries.push(entry);
    }
  });
  const yearGroups = Array.from(entriesByYear.entries()).sort(
    ([a], [b]) => a - b
  );
  if (yearGroups.length === 0) {
    return yearGroups;
  }
  const years = yearGroups.map(([year]) => year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const totalSpan = Math.max(maxYear - minYear, 1);
  yearGroups.forEach(([year, entries]) => {
    const normalized = (year - minYear) / totalSpan;
    entries.forEach((entry) => {
      entry.position = normalized;
    });
  });
  return yearGroups;
}
function Timeline({
  lang = "he",
  initialData
}) {
  const t = translations[lang];
  const songs = initialData?.songs ?? [];
  const convexEvents = initialData?.events ?? [];
  const events = convertConvexEventsToTimeline(
    convexEvents ?? []
  );
  const yearGroups = getEntriesByYear(songs ?? [], events);
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(TimelineHeader, { title: t.title, lang }),
    /* @__PURE__ */ jsx(HelpModal, { translations: t.helpModal, lang }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-full mt-10 grid grid-rows-[${yearGroups.length}] grid-cols-[1fr_50px_1fr] pb-24`,
        children: yearGroups.map(([year, entries], idx) => {
          const showYear = idx === 0 || year !== yearGroups[idx - 1]?.[0];
          return /* @__PURE__ */ jsx(
            YearGroup,
            {
              index: idx,
              year,
              entries,
              showYear,
              lang
            },
            year
          );
        })
      }
    ),
    /* @__PURE__ */ jsx(
      SubmitSongModal,
      {
        label: t.submitSongButton,
        translations: t.submitSongForm
      }
    )
  ] });
}
export {
  Timeline as T
};
