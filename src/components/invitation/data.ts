export const COUPLE = {
  groom: {
    name: "Harish Triyadi",
    short: "Harish",
    parents: "Putra dari Bapak Iwan Triyadi & Ibu Sumaryani",
  },
  bride: {
    name: "Fadhilah Rubabb",
    short: "Fadhilah",
    parents: "Putri dari Bapak Santoso & Ibu Siti Asiah",
  },
};

export const EVENT = {
  title: "Akad Nikah",
  day: "Jumat",
  dateLabel: "18 September 2026",
  timeLabel: "Pukul 14:00 WIB - Selesai",
  venue: "Kediaman Mempelai Wanita",
  address:
    "Blok Wage RT 001 RW 004 No. 30, Desa Sindanglaut, Kec. Lemahabang, Kab. Cirebon",
  /* 18 Sep 2026 14:00 WIB (UTC+7) */
  target: new Date("2026-09-18T14:00:00+07:00"),
};

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Desa+Sindanglaut+Lemahabang+Cirebon";

export const CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" +
  encodeURIComponent("Akad Nikah Harish Triyadi & Fadhilah Rubabb") +
  "&dates=20260918T070000Z/20260918T100000Z" +
  "&details=" +
  encodeURIComponent("Mohon doa restu atas pernikahan kami.") +
  "&location=" +
  encodeURIComponent(`${EVENT.venue}, ${EVENT.address}`);

export const QURAN = {
  text:
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri agar kamu memperoleh ketenangan hati padanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang...",
  source: "QS. Ar-Rum: 21",
};

export const ACCOUNTS = [
  { bank: "BCA", number: "3041210069", holder: "Fadhilah Rubbab" },
  { bank: "BCA", number: "7745382151", holder: "Harish Triyadi" },
];

export const FAMILY = ["Iwan Triyadi", "Sumaryani", "Abdul Wahab", "Siti Asiah"];
