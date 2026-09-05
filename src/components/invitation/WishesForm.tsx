import { useState, useEffect, useCallback, type FormEvent } from "react";
import { SPREADSHEET_URL } from "./data";

interface WishItem {
  id: string;
  name: string;
  attendance: string;
  message: string;
  createdAt: string;
}

export function WishesForm({
  onNotify,
}: {
  onNotify?: (msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingWishes, setLoadingWishes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  // Fungsi untuk mengambil seluruh ucapan dari Google Spreadsheet
  const loadWishesFromSheet = useCallback(async () => {
    if (!SPREADSHEET_URL || SPREADSHEET_URL.trim() === "") return;
    try {
      setLoadingWishes(true);
      const res = await fetch(SPREADSHEET_URL);
      const resData = await res.json();
      if (resData && Array.isArray(resData.data)) {
        setWishes(resData.data);
      }
    } catch (err) {
      console.warn("Belum dapat memuat pesan dari spreadsheet:", err);
    } finally {
      setLoadingWishes(false);
    }
  }, []);

  useEffect(() => {
    // Bersihkan data test lama dari localStorage
    try {
      localStorage.removeItem("wedding_wishes");
    } catch {
      // ignore
    }

    loadWishesFromSheet();
  }, [loadWishesFromSheet]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      onNotify?.("Mohon lengkapi nama dan pesan Anda");
      return;
    }

    setLoading(true);

    const timeLabel = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const newWish: WishItem = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      attendance,
      message: message.trim(),
      createdAt: timeLabel,
    };

    try {
      if (SPREADSHEET_URL && SPREADSHEET_URL.trim() !== "") {
        const formData = new URLSearchParams();
        formData.append("timestamp", timeLabel);
        formData.append("nama", name.trim());
        formData.append("kehadiran", attendance);
        formData.append("pesan", message.trim());

        await fetch(SPREADSHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });
      }

      // Tampilkan langsung di daftar secara instan untuk tamu yang baru mengirim
      setWishes((prev) => [newWish, ...prev]);
      setName("");
      setMessage("");
      setSubmitted(true);
      onNotify?.("Kesan & pesan berhasil dikirim!");

      // Sinkronkan ulang dari spreadsheet setelah 3 detik
      setTimeout(() => {
        loadWishesFromSheet();
      }, 3000);
    } catch (err) {
      console.error(err);
      onNotify?.("Gagal mengirim, mohon coba lagi nanti");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left">
      <div className="rounded-2xl border border-border/75 bg-card/85 p-6 shadow-sm backdrop-blur-md">
        <div className="text-center">
          <h4 className="font-script text-3xl text-sage-deep">
            Kesan &amp; Pesan
          </h4>
          <p className="mt-1 font-display text-xs tracking-wide text-muted-foreground">
            Sampaikan doa, kesan, dan pesan bahagia untuk kedua mempelai
          </p>
        </div>

        {submitted && (
          <div className="mt-4 rounded-xl bg-primary/10 border border-primary/20 p-3.5 text-center text-xs font-display text-sage-deep">
            ✨ Terima kasih banyak atas doa dan pesan hangat yang telah Anda kirimkan!
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="guest-name"
              className="block font-display text-xs uppercase tracking-wider text-muted-foreground"
            >
              Nama Anda <span className="text-destructive">*</span>
            </label>
            <input
              id="guest-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="mt-1.5 w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 font-display text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="guest-attendance"
              className="block font-display text-xs uppercase tracking-wider text-muted-foreground"
            >
              Konfirmasi Kehadiran
            </label>
            <select
              id="guest-attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background/80 px-4 py-2.5 font-display text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Hadir">Hadir</option>
              <option value="Belum Pasti">Belum Pasti / Ragu-ragu</option>
              <option value="Tidak Hadir">Tidak Hadir (Kirim Doa)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="guest-message"
              className="block font-display text-xs uppercase tracking-wider text-muted-foreground"
            >
              Kesan, Pesan &amp; Doa Restu <span className="text-destructive">*</span>
            </label>
            <textarea
              id="guest-message"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan dan doa Anda..."
              className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background/80 px-4 py-2.5 font-display text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-2.5 font-display text-xs tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "MENGIRIM..." : "KIRIM PESAN"}
          </button>
        </form>

        {/* List Ucapan yang masuk dari Google Spreadsheet */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">
              Ucapan &amp; Doa ({wishes.length})
            </p>
            {loadingWishes && (
              <span className="font-display text-[11px] text-muted-foreground animate-pulse">
                Memuat data...
              </span>
            )}
          </div>

          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {wishes.length === 0 && !loadingWishes ? (
              <div className="rounded-xl border border-dashed border-border/80 p-4 text-center">
                <p className="font-display text-xs text-muted-foreground">
                  Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                </p>
              </div>
            ) : (
              wishes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/40 bg-background/60 p-3.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-display text-[10px] ${
                        item.attendance === "Hadir"
                          ? "bg-primary/15 text-sage-deep"
                          : item.attendance === "Tidak Hadir"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.attendance}
                    </span>
                  </div>
                  {item.createdAt && (
                    <span className="block text-[10px] text-muted-foreground/80 font-display">
                      {item.createdAt}
                    </span>
                  )}
                  <p className="mt-1.5 font-display text-xs leading-relaxed text-muted-foreground">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
