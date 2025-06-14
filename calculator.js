// calculator.js
const { format, addDays, getDay, startOfWeek, endOfWeek, lastDayOfMonth, setDate, setMonth } = require('date-fns');
const moment = require('moment-hijri');

// Tarihi YYYY-MM-DD formatına çeviren yardımcı fonksiyon
const formatDateISO = (date) => format(date, 'yyyy-MM-dd');

// Kategori sabitleri
const CATEGORIES = {
    RESMI: 'Resmi Tatil',
    OKUL: 'Okul Tatili',
    BELIRLI: 'Belirli Gün ve Hafta'
};

/**
 * Dini bayramları (Ramazan ve Kurban) verilen Gregorian yılı için hesaplar.
 * @param {number} year - Hesaplama yapılacak yıl.
 * @returns {Array} - Dini bayramların listesi.
 */
function getIslamicHolidays(year) {
    const holidays = [];
    // Hicri yılı bulmak için Miladi yıldan 579 veya 578 çıkarılır.
    // Daha doğru bir yaklaşım, belirli bir İslami ayın o Miladi yıldaki başlangıcını bulmaktır.
    // moment-hijri, Miladi yıla göre Hicri tarihleri bulabilir.

    // Ramazan Bayramı (1 Şevval)
    // Önce o Miladi yıl içindeki 1 Ramazan'ı bulup, sonra Şevval'e geçmek daha doğru olabilir
    // Ancak doğrudan Şevval'i de deneyebiliriz.
    // moment-hijri'de aylar 0'dan başlar (Ramazan=8, Şevval=9, Zilhicce=11)

    // Yılın başında ve sonunda farklı Hicri yıllara denk gelebilir.
    // Bu yüzden Miladi yılın ortasındaki bir Hicri tarihi referans alıp,
    // o Hicri yılın Şevval ve Zilhicce'sini bulmak daha güvenli olabilir.
    // Örneğin, Miladi yılın ortası (Haziran) hangi Hicri yıla denk geliyor?
    const midYearHijri = moment(`${year}-06-15`, 'YYYY-MM-DD').iYear();

    // Ramazan Bayramı (1 Şevval)
    const ramadanBayramStart = moment().iYear(midYearHijri).iMonth(9).iDate(1).toDate(); // Şevval = 9
    const arefeRamazan = addDays(ramadanBayramStart, -1);
    holidays.push({ name: 'Ramazan Bayramı Arefesi', startDate: formatDateISO(arefeRamazan), endDate: formatDateISO(arefeRamazan), category: CATEGORIES.RESMI });
    holidays.push({ name: 'Ramazan Bayramı', startDate: formatDateISO(ramadanBayramStart), endDate: formatDateISO(addDays(ramadanBayramStart, 2)), category: CATEGORIES.RESMI });

    // Kurban Bayramı (10 Zilhicce)
    const kurbanBayramStart = moment().iYear(midYearHijri).iMonth(11).iDate(10).toDate(); // Zilhicce = 11
    const arefeKurban = addDays(kurbanBayramStart, -1);
    holidays.push({ name: 'Kurban Bayramı Arefesi', startDate: formatDateISO(arefeKurban), endDate: formatDateISO(arefeKurban), category: CATEGORIES.RESMI });
    holidays.push({ name: 'Kurban Bayramı', startDate: formatDateISO(kurbanBayramStart), endDate: formatDateISO(addDays(kurbanBayramStart, 3)), category: CATEGORIES.RESMI });

    // Bazen bir sonraki Hicri yılın bayramı da o Miladi yıla denk gelebilir.
    // Veya bir önceki Hicri yılın bayramı. Bunu kontrol etmek için:
    // Ramazan Bayramı (bir sonraki Hicri yıl)
    const ramadanBayramStartNextHijri = moment().iYear(midYearHijri + 1).iMonth(9).iDate(1).toDate();
    if (ramadanBayramStartNextHijri.getFullYear() === year) {
        const arefeRamazanNext = addDays(ramadanBayramStartNextHijri, -1);
        holidays.push({ name: 'Ramazan Bayramı Arefesi (Sonraki Hicri Yıl)', startDate: formatDateISO(arefeRamazanNext), endDate: formatDateISO(arefeRamazanNext), category: CATEGORIES.RESMI });
        holidays.push({ name: 'Ramazan Bayramı (Sonraki Hicri Yıl)', startDate: formatDateISO(ramadanBayramStartNextHijri), endDate: formatDateISO(addDays(ramadanBayramStartNextHijri, 2)), category: CATEGORIES.RESMI });
    }
     // Kurban Bayramı (bir sonraki Hicri yıl)
    const kurbanBayramStartNextHijri = moment().iYear(midYearHijri + 1).iMonth(11).iDate(10).toDate();
    if (kurbanBayramStartNextHijri.getFullYear() === year) {
        const arefeKurbanNext = addDays(kurbanBayramStartNextHijri, -1);
        holidays.push({ name: 'Kurban Bayramı Arefesi (Sonraki Hicri Yıl)', startDate: formatDateISO(arefeKurbanNext), endDate: formatDateISO(arefeKurbanNext), category: CATEGORIES.RESMI });
        holidays.push({ name: 'Kurban Bayramı (Sonraki Hicri Yıl)', startDate: formatDateISO(kurbanBayramStartNextHijri), endDate: formatDateISO(addDays(kurbanBayramStartNextHijri, 3)), category: CATEGORIES.RESMI });
    }

    // Ramazan Bayramı (bir önceki Hicri yıl)
    const ramadanBayramStartPrevHijri = moment().iYear(midYearHijri - 1).iMonth(9).iDate(1).toDate();
    if (ramadanBayramStartPrevHijri.getFullYear() === year) {
        const arefeRamazanPrev = addDays(ramadanBayramStartPrevHijri, -1);
        holidays.push({ name: 'Ramazan Bayramı Arefesi (Önceki Hicri Yıl)', startDate: formatDateISO(arefeRamazanPrev), endDate: formatDateISO(arefeRamazanPrev), category: CATEGORIES.RESMI });
        holidays.push({ name: 'Ramazan Bayramı (Önceki Hicri Yıl)', startDate: formatDateISO(ramadanBayramStartPrevHijri), endDate: formatDateISO(addDays(ramadanBayramStartPrevHijri, 2)), category: CATEGORIES.RESMI });
    }
    // Kurban Bayramı (bir önceki Hicri yıl)
    const kurbanBayramStartPrevHijri = moment().iYear(midYearHijri - 1).iMonth(11).iDate(10).toDate();
    if (kurbanBayramStartPrevHijri.getFullYear() === year) {
        const arefeKurbanPrev = addDays(kurbanBayramStartPrevHijri, -1);
        holidays.push({ name: 'Kurban Bayramı Arefesi (Önceki Hicri Yıl)', startDate: formatDateISO(arefeKurbanPrev), endDate: formatDateISO(arefeKurbanPrev), category: CATEGORIES.RESMI });
        holidays.push({ name: 'Kurban Bayramı (Önceki Hicri Yıl)', startDate: formatDateISO(kurbanBayramStartPrevHijri), endDate: formatDateISO(addDays(kurbanBayramStartPrevHijri, 3)), category: CATEGORIES.RESMI });
    }
    
    // Yinelenenleri kaldır (startDate ve name'e göre)
    const uniqueHolidays = holidays.filter((holiday, index, self) =>
        index === self.findIndex((t) => (
            t.startDate === holiday.startDate && t.name === holiday.name
        ))
    );

    return uniqueHolidays;
}

/**
 * Belirli bir ayın n'inci haftasının başlangıç ve bitişini bulur.
 * (Örn: Ocak ayının 2. haftası)
 * @param {number} year Yıl
 * @param {number} month Ay (0-11)
 * @param {number} weekNumber Hafta numarası (1'den başlar)
 * @returns {object} { startDate, endDate }
 */
function getNthWeekOfMonth(year, month, weekNumber) {
    let date = new Date(year, month, 1);
    // Ayın ilk pazartesisini bul
    while (getDay(date) !== 1) { // 1 = Pazartesi
        date = addDays(date, 1);
    }
    const firstMonday = date;
    const targetMonday = addDays(firstMonday, (weekNumber - 1) * 7);
    return {
        startDate: formatDateISO(targetMonday),
        endDate: formatDateISO(addDays(targetMonday, 6))
    };
}

/**
 * Bir ayın belirli bir gününün n'inci tekrarını bulur.
 * (Örn: Eylül'ün 2. Pazartesi'si)
 * @param {number} year Yıl
 * @param {number} month Ay (0-11)
 * @param {number} dayOfWeek Gün (0=Pazar, 1=Pzt, ...)
 * @param {number} n Kaçıncı tekrar (1'den başlar)
 * @returns {Date}
 */
function getNthDayOfMonth(year, month, dayOfWeek, n) {
    let count = 0;
    let date = new Date(year, month, 1);
    while (count < n) {
        if (getDay(date) === dayOfWeek) {
            count++;
        }
        if (count < n) {
           date = addDays(date, 1);
        }
    }
    return date;
}


/**
 * Verilen yıl için tüm önemli günleri hesaplar.
 * @param {number} year - Hesaplama yapılacak yıl.
 * @returns {Array} - Tüm olayların listesi.
 */
function calculateAllDates(year) {
    let allEvents = [];

    // --- 1. RESMİ TATİLLER ---
    const fixedHolidays = [
        { name: 'Yılbaşı', date: new Date(year, 0, 1) },
        { name: 'Ulusal Egemenlik ve Çocuk Bayramı', date: new Date(year, 3, 23) },
        { name: 'Emek ve Dayanışma Günü', date: new Date(year, 4, 1) },
        { name: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', date: new Date(year, 4, 19) },
        { name: 'Demokrasi ve Milli Birlik Günü', date: new Date(year, 6, 15) },
        { name: 'Zafer Bayramı', date: new Date(year, 7, 30) },
        { name: 'Cumhuriyet Bayramı', date: new Date(year, 9, 29) }, // 29 Ekim (tam gün)
    ];
    fixedHolidays.forEach(h => allEvents.push({ name: h.name, startDate: formatDateISO(h.date), endDate: formatDateISO(h.date), category: CATEGORIES.RESMI }));
    
    // Dini bayramları ekle
    allEvents.push(...getIslamicHolidays(year));

    // --- 2. OKUL TATİLLERİ (Mevcut MEB sistemine göre TAHMİNİ) ---
    // Bu bölüm MEB'in duyurularına göre değişebilir, bu kod mevcut örüntüyü takip eder.
    
    // Yarıyıl Tatili (Ocak 3. haftası başlar, 2 hafta sürer)
    const semiFinalStart = getNthDayOfMonth(year, 0, 1, 4); // Ocak 4. Pazartesi
    allEvents.push({ name: 'Yarıyıl Tatili', startDate: formatDateISO(semiFinalStart), endDate: formatDateISO(addDays(semiFinalStart, 13)), category: CATEGORIES.OKUL });

    // İkinci Ara Tatil (Nisan 2. haftası)
    const secondMidTermStart = getNthDayOfMonth(year, 3, 1, 2); // Nisan 2. Pazartesi
    allEvents.push({ name: 'İkinci Ara Tatil', startDate: formatDateISO(secondMidTermStart), endDate: formatDateISO(addDays(secondMidTermStart, 4)), category: CATEGORIES.OKUL });
    
    // Yaz Tatili (Haziran 2. Cuma'sı sonrası)
    const schoolEnd = getNthDayOfMonth(year, 5, 5, 2); // Haziran 2. Cuma
    allEvents.push({ name: 'Yaz Tatili Başlangıcı', startDate: formatDateISO(addDays(schoolEnd, 1)), endDate: formatDateISO(addDays(schoolEnd, 1)), category: CATEGORIES.OKUL });

    // Okul Başlangıcı (Eylül 2. Pazartesi)
    const schoolStart = getNthDayOfMonth(year, 8, 1, 2);
    allEvents.push({ name: 'Okulların Açılması', startDate: formatDateISO(schoolStart), endDate: formatDateISO(schoolStart), category: CATEGORIES.OKUL });

    // Birinci Ara Tatil (Kasım 2. haftası)
    const firstMidTermStart = getNthDayOfMonth(year, 10, 1, 2); // Kasım 2. Pazartesi
    allEvents.push({ name: 'Birinci Ara Tatil', startDate: formatDateISO(firstMidTermStart), endDate: formatDateISO(addDays(firstMidTermStart, 4)), category: CATEGORIES.OKUL });


    // --- 3. BELİRLİ GÜNLER VE HAFTALAR ---
    const belirliGunler = [
        // Haftalar
        { name: 'Enerji Tasarrufu Haftası', ...getNthWeekOfMonth(year, 0, 2) },
        { name: 'Yeşilay Haftası', startDate: formatDateISO(new Date(year, 2, 1)), endDate: formatDateISO(new Date(year, 2, 7)) },
        { name: 'Bilim ve Teknoloji Haftası', startDate: formatDateISO(new Date(year, 2, 8)), endDate: formatDateISO(new Date(year, 2, 14)) },
        { name: 'Tüketiciyi Koruma Haftası', startDate: formatDateISO(new Date(year, 2, 15)), endDate: formatDateISO(new Date(year, 2, 21)) },
        { name: 'Orman Haftası', startDate: formatDateISO(new Date(year, 2, 21)), endDate: formatDateISO(new Date(year, 2, 26)) },
        { name: 'Kütüphaneler Haftası', startDate: formatDateISO(startOfWeek(lastDayOfMonth(new Date(year, 2, 1)), { weekStartsOn: 1 })), endDate: formatDateISO(endOfWeek(lastDayOfMonth(new Date(year, 2, 1)), { weekStartsOn: 1 })) },
        { name: 'Turizm Haftası', startDate: formatDateISO(new Date(year, 3, 15)), endDate: formatDateISO(new Date(year, 3, 22)) },
        { name: 'Engelliler Haftası', startDate: formatDateISO(new Date(year, 4, 10)), endDate: formatDateISO(new Date(year, 4, 16)) },
        { name: 'Müzeler Haftası', startDate: formatDateISO(new Date(year, 4, 18)), endDate: formatDateISO(new Date(year, 4, 24)) },
        { name: 'İlköğretim Haftası', ...getNthWeekOfMonth(year, 8, 3) },
        { name: 'Kızılay Haftası', startDate: formatDateISO(new Date(year, 9, 29)), endDate: formatDateISO(new Date(year, 10, 4)) },
        { name: 'Öğretmenler Günü', startDate: formatDateISO(new Date(year, 10, 24)), endDate: formatDateISO(new Date(year, 10, 24)) },
        { name: 'İnsan Hakları ve Demokrasi Haftası', startDate: formatDateISO(startOfWeek(new Date(year, 11, 10), { weekStartsOn: 1 })), endDate: formatDateISO(endOfWeek(new Date(year, 11, 10), { weekStartsOn: 1 })) },
        { name: 'Tutum, Yatırım ve Türk Malları Haftası', startDate: formatDateISO(new Date(year, 11, 12)), endDate: formatDateISO(new Date(year, 11, 18)) },

        // Tek Günler
        { name: '8 Mart Dünya Kadınlar Günü', startDate: formatDateISO(new Date(year, 2, 8)), endDate: formatDateISO(new Date(year, 2, 8))},
        { name: 'İstiklâl Marşı\'nın Kabulü', startDate: formatDateISO(new Date(year, 2, 12)), endDate: formatDateISO(new Date(year, 2, 12))},
        { name: '18 Mart Şehitler Günü', startDate: formatDateISO(new Date(year, 2, 18)), endDate: formatDateISO(new Date(year, 2, 18))},
    ];

    belirliGunler.forEach(g => allEvents.push({ ...g, category: CATEGORIES.BELIRLI }));

    // Tüm olaylara yıl bilgisini ekle
    return allEvents.map(e => ({ ...e, year }));
}

module.exports = { calculateAllDates };
