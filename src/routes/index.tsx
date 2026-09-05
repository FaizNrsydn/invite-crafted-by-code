import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesForm } from "@/components/invitation/WishesForm";
import {
  ACCOUNTS,
  CALENDAR_URL,
  COUPLE,
  EVENT,
  FAMILY,
  MAPS_URL,
  QURAN,
} from "@/components/invitation/data";
import garden from "@/assets/garden.jpg";
import wisteria from "@/assets/wisteria.png";
import mountains from "@/assets/mountains.jpg";
import archway from "@/assets/archway.jpg";
import pines from "@/assets/pines.png";
import seal from "@/assets/seal.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harish & Fadhilah — Undangan Pernikahan 18 September 2026" },
      {
        name: "description",
        content:
          "Undangan digital pernikahan Harish Triyadi & Fadhilah Rubabb. Akad nikah Jumat, 18 September 2026 di Sindanglaut, Cirebon.",
      },
      { property: "og:title", content: "The Wedding of Harish & Fadhilah" },
      {
        property: "og:description",
        content:
          "Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

/* Ganti dengan lagu latar pilihan mempelai (letakkan file di /public). */
const MUSIC_SRC = "/music.mp3";

function Butterfly({ style }: { style: React.CSSProperties }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={style}>
      <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
        <path
          d="M13 11C10 3 4 1 2 5c-2 4 3 8 11 6Z"
          fill="currentColor"
          opacity=".55"
        />
        <path
          d="M13 11c3-8 9-10 11-6 2 4-3 8-11 6Z"
          fill="currentColor"
          opacity=".4"
        />
        <path d="M13 10v8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = useMemo(() => {
    const diff = Math.max(0, EVENT.target.getTime() - now);
    const s = Math.floor(diff / 1000);
    return [
      { v: Math.floor(s / 86400), l: "HARI" },
      { v: Math.floor((s % 86400) / 3600), l: "JAM" },
      { v: Math.floor((s % 3600) / 60), l: "MNT" },
      { v: s % 60, l: "DTK" },
    ];
  }, [now]);

  return (
    <div className="flex items-center justify-center gap-1">
      {parts.map((p, i) => (
        <div key={p.l} className="flex items-end">
          <div className="w-[62px] text-center">
            <div className="font-display text-4xl font-semibold tabular-nums text-sage-deep">
              {String(p.v).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] tracking-[0.22em] text-muted-foreground">
              {p.l}
            </div>
          </div>
          {i < parts.length - 1 && (
            <span className="pb-6 text-3xl text-sage">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const open = useCallback(() => {
    setOpened(true);
    document.body.style.overflow = "";
    const a = audioRef.current;
    if (a) {
      a.volume = 0.6;
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
    setTimeout(() => window.scrollTo({ top: 0 }), 60);
  }, []);

  useEffect(() => {
    if (!opened) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => showToast("Musik latar belum tersedia."));
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [showToast]);

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        el.remove();
      }
      showToast("Nomor rekening berhasil disalin!");
    },
    [showToast],
  );

  return (
    <div className="flex min-h-screen justify-center bg-muted">
      <main className="paper relative w-full max-w-[480px] overflow-hidden shadow-[0_0_60px_oklch(0.3_0.03_130/0.18)]">
        <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" />

        {/* ============ SCENE 1 — Sampul pintu & wax seal ============ */}
        <section
          className={`fixed inset-0 z-50 mx-auto flex max-w-[480px] transition-opacity duration-700 ${opened ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          aria-hidden={opened}
        >
          {[0, 1].map((side) => (
            <div
              key={side}
              className="relative h-full w-1/2 transition-transform duration-[1300ms] ease-[cubic-bezier(.76,0,.24,1)]"
              style={{
                background:
                  side === 0
                    ? "linear-gradient(100deg, var(--sage-deep), var(--sage) 70%)"
                    : "linear-gradient(260deg, var(--sage-deep), var(--sage) 70%)",
                transform: opened
                  ? `translateX(${side === 0 ? "-100%" : "100%"})`
                  : "none",
                boxShadow: "inset 0 0 80px oklch(0.3 0.04 150 / 0.35)",
              }}
            />
          ))}

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-opacity duration-500 ${opened ? "opacity-0" : "opacity-100"
              }`}
          >
            <p className="font-display text-xs tracking-[0.42em] text-primary-foreground/85">
              THE WEDDING OF
            </p>
            <h1 className="mt-3 font-script text-4xl leading-tight text-primary-foreground drop-shadow-sm">
              {COUPLE.groom.short} &amp; {COUPLE.bride.short}
            </h1>
            <p className="mt-2 font-display text-sm tracking-[0.24em] text-primary-foreground/85">
              {EVENT.dateLabel.toUpperCase()}
            </p>

            <button
              onClick={open}
              className="group mt-12 flex flex-col items-center"
              aria-label="Buka undangan"
            >
              <img
                src={seal}
                alt=""
                width={512}
                height={512}
                className="h-28 w-28 [animation:sealPulse_3.2s_ease-in-out_infinite]"
              />
              <span className="mt-7 rounded-full border border-primary-foreground/60 px-7 py-2 font-display text-xs tracking-[0.3em] text-primary-foreground transition-colors group-hover:bg-primary-foreground/15">
                BUKA UNDANGAN
              </span>
            </button>
          </div>
        </section>

        {/* ============ SCENE 2 — Banner taman watercolor ============ */}
        <section className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden pt-16">
          <div className="relative z-10 px-8 text-center">
            {opened && (
              <>
                <p
                  className="font-display text-[11px] tracking-[0.4em] text-muted-foreground opacity-0 [animation:softFade_1.2s_ease-out_.3s_forwards]"
                >
                  TOGETHER WITH OUR FAMILIES
                </p>
                <p className="mt-4 font-display text-lg italic tracking-wide text-sage-deep opacity-0 [animation:riseIn_1.2s_ease-out_.9s_forwards]">
                  You&apos;re Invited
                </p>
                <h2 className="mt-6 font-script text-[42px] leading-[1.15] text-foreground opacity-0 [animation:riseIn_1.3s_ease-out_1.5s_forwards]">
                  {COUPLE.groom.short}
                  <span className="mx-2 font-display text-2xl italic text-sage">
                    &amp;
                  </span>
                  {COUPLE.bride.short}
                </h2>
                <p className="mt-5 font-display text-sm tracking-[0.32em] text-muted-foreground opacity-0 [animation:riseIn_1.2s_ease-out_2.1s_forwards]">
                  18 . 09 . 2026
                </p>
              </>
            )}
          </div>

          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-x-0 -top-6 h-24 bg-gradient-to-b from-background to-transparent" />
            <Butterfly
              style={{
                top: "-70px",
                left: "16%",
                color: "var(--wisteria)",
                animation: "flutter 11s ease-in-out infinite",
              }}
            />
            <Butterfly
              style={{
                top: "-140px",
                right: "18%",
                color: "var(--sage-deep)",
                animation: "flutter 14s ease-in-out infinite 1.5s",
              }}
            />
            <img
              src={garden}
              alt="Ilustrasi cat air taman dengan gazebo dan bunga wisteria"
              width={1024}
              height={1024}
              className="w-full [animation:swayLeaf_9s_ease-in-out_infinite] origin-bottom"
            />
          </div>
        </section>

        {/* ============ SCENE 3 — Mempelai & akad nikah ============ */}
        <section className="relative overflow-hidden pb-14">
          <img
            src={wisteria}
            alt=""
            width={1024}
            height={512}
            loading="lazy"
            className="pointer-events-none absolute inset-x-0 top-0 w-full opacity-95"
          />
          <img
            src={mountains}
            alt=""
            width={1024}
            height={1024}
            loading="lazy"
            className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-70"
          />

          <div className="relative z-10 px-8 pt-40 text-center">
            <Reveal>
              <p className="font-display text-lg italic text-sage-deep">
                Assalamu&apos;alaikum Wr. Wb.
              </p>
              <p className="mx-auto mt-4 max-w-[300px] font-display text-sm leading-relaxed text-muted-foreground">
                Dengan memohon rahmat dan ridho Allah SWT, kami mengundang
                Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada
                pernikahan kami.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-12">
              <h3 className="font-script text-4xl text-foreground">
                {COUPLE.groom.name}
              </h3>
              <p className="mt-2 font-display text-xs tracking-wide text-muted-foreground">
                {COUPLE.groom.parents}
              </p>
            </Reveal>

            <Reveal delay={200} className="my-7">
              <span className="font-script text-3xl text-sage">&amp;</span>
            </Reveal>

            <Reveal delay={260}>
              <h3 className="font-script text-4xl text-foreground">
                {COUPLE.bride.name}
              </h3>
              <p className="mt-2 font-display text-xs tracking-wide text-muted-foreground">
                {COUPLE.bride.parents}
              </p>
            </Reveal>

            <Reveal delay={160} className="mt-14">
              <div className="rounded-2xl border border-border/70 bg-card/75 px-6 py-7 backdrop-blur-[2px]">
                <p className="font-display text-xl italic text-sage-deep">
                  {EVENT.title}
                </p>
                <p className="mt-3 font-display text-base font-semibold tracking-wide">
                  {EVENT.day}, {EVENT.dateLabel}
                </p>
                <p className="font-display text-sm text-muted-foreground">
                  {EVENT.timeLabel}
                </p>
                <div className="mx-auto my-5 h-px w-16 bg-border" />
                <p className="font-display text-sm font-semibold">
                  {EVENT.venue}
                </p>
                <p className="mt-1 font-display text-sm leading-relaxed text-muted-foreground">
                  {EVENT.address}
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-primary px-5 py-2.5 font-display text-xs tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    LIHAT LOKASI
                  </a>
                  <a
                    href={CALENDAR_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-primary px-5 py-2.5 font-display text-xs tracking-[0.22em] text-sage-deep transition-colors hover:bg-accent"
                  >
                    SIMPAN TANGGAL
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ SCENE 4 — Gerbang batu & QS Ar-Rum 21 ============ */}
        <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden py-16">
          <img
            src={archway}
            alt=""
            width={720}
            height={1024}
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative z-10 mx-auto w-full max-w-[430px] px-6 text-center">
            <Reveal>
              <div className="rounded-2xl border border-border/75 bg-card/85 px-6 py-8 shadow-sm backdrop-blur-md">
                <p className="font-display text-base sm:text-lg font-medium italic leading-relaxed text-foreground">
                  &ldquo;{QURAN.text}&rdquo;
                </p>
                <div className="mx-auto my-5 h-px w-16 bg-sage/50" />
                <p className="font-display text-xs font-semibold tracking-[0.25em] text-sage-deep">
                  {QURAN.source}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ SCENE 5 — Countdown ============ */}
        <section className="relative px-6 py-20">
          <Reveal>
            <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-2xl border border-border/70 bg-card/70 px-2 py-8 backdrop-blur-[2px]">
              <img
                src={pines}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                className="pointer-events-none absolute -left-6 bottom-0 z-0 w-20 opacity-60"
              />
              <img
                src={pines}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                className="pointer-events-none absolute -right-6 bottom-0 z-0 w-20 -scale-x-100 opacity-60"
              />
              <p className="relative z-10 mb-6 text-center font-display text-xs tracking-[0.34em] text-muted-foreground">
                MENUJU HARI BAHAGIA
              </p>
              <div className="relative z-10">
                <Countdown />
              </div>
            </div>

          </Reveal>
        </section>

        {/* ============ SCENE 6 — Kado digital & turut mengundang ============ */}
        <section className="relative pb-24">
          <Reveal>
            <div className="rounded-b-[140px] bg-cocoa px-8 pb-20 pt-14 text-center">
              <h4 className="font-script text-3xl text-gold">Kado Digital</h4>
              <p className="mx-auto mt-3 max-w-[280px] font-display text-sm leading-relaxed text-cocoa-foreground/85">
                Jika berkenan memberikan hadiah personal, bisa dikirim melalui
                rekening berikut.
              </p>

              <div className="mt-7 space-y-4">
                {ACCOUNTS.map((acc) => (
                  <div
                    key={acc.number}
                    className="rounded-xl bg-card px-5 py-4 text-left"
                  >
                    <p className="font-display text-xl font-semibold tracking-[0.06em] text-foreground">
                      {acc.number}
                    </p>
                    <p className="font-display text-sm text-muted-foreground">
                      a.n. {acc.holder} / {acc.bank}
                    </p>
                    <button
                      onClick={() => copy(acc.number)}
                      className="mt-3 w-full rounded-full bg-primary px-4 py-2 font-display text-[11px] tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      SALIN NOMOR REKENING
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-14 px-8 text-center">
            <div>
              <h4 className="font-script text-3xl text-sage-deep">
                Hormat Kami
              </h4>
              <ul className="mt-4 space-y-1.5 font-display text-base">
                {FAMILY.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* ============ FORM KESAN & PESAN (BUKU TAMU) ============ */}
          <Reveal className="mt-12 px-6">
            <WishesForm onNotify={showToast} />
          </Reveal>

          <Reveal className="mt-14 px-8 text-center">
            <div>
              <p className="font-display text-sm italic text-muted-foreground">
                Wassalamu&apos;alaikum Wr. Wb.
              </p>
              <p className="mt-10 font-script text-2xl text-sage">
                Save The Date
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---- Floating audio toggle ---- */}
        {opened && (
          <button
            onClick={toggleMusic}
            aria-label={playing ? "Jeda musik" : "Putar musik"}
            className="fixed bottom-6 right-[max(1.5rem,calc(50vw-240px+1.5rem))] z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          >
            <span className={playing ? "animate-spin [animation-duration:4s]" : ""}>
              {playing ? "❚❚" : "♫"}
            </span>
          </button>
        )}

        {/* ---- Toast ---- */}
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-cocoa px-5 py-2.5 font-display text-sm text-cocoa-foreground shadow-lg transition-all duration-300 ${toast ? "opacity-100" : "translate-y-3 opacity-0"
            }`}
        >
          {toast ?? ""}
        </div>
      </main>
    </div>
  );
}
