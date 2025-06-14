// main.js
const Database = require('./database');
const { calculateAllDates } = require('./calculator');

async function generateAndStoreYear(year) {
    if (isNaN(year)) {
        console.error("Lütfen geçerli bir yıl girin. Örneğin: node main.js 2034");
        return;
    }

    const db = new Database();

    try {
        await db.init();

        const exists = await db.yearExists(year);

        if (exists) {
            console.log(`✅ ${year} yılı veritabanında zaten mevcut. Kayıtlar getiriliyor...`);
            const events = await db.getEventsByYear(year);
            console.table(events);
        } else {
            console.log(`⏳ ${year} yılı veritabanında bulunamadı. Hesaplama başlıyor...`);
            const allDates = calculateAllDates(year);
            
            console.log(`Hesaplama tamamlandı. ${allDates.length} olay bulundu. Veritabanına kaydediliyor...`);
            await db.insertDates(allDates);
            
            console.log("-----------------------------------------------------");
            console.log(`✅ ${year} yılı için oluşturulan olaylar:`);
            const events = await db.getEventsByYear(year);
            console.table(events);
        }
    } catch (error) {
        console.error("Beklenmedik bir hata oluştu:", error);
    } finally {
        db.close();
    }
}

// Komut satırından gelen argümanı al
const yearArg = process.argv[2];
generateAndStoreYear(parseInt(yearArg, 10));