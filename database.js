// database.js
const sqlite3 = require('sqlite3').verbose();
const DB_FILE = 'meb_calendar.sqlite';

class Database {
    constructor() {
        this.db = new sqlite3.Database(DB_FILE, (err) => {
            if (err) {
                console.error("Veritabanı bağlantı hatası:", err.message);
                throw err;
            }
            console.log('SQLite veritabanına başarıyla bağlanıldı.');
        });
    }

    // Tabloyu oluşturur (eğer yoksa)
    init() {
        return new Promise((resolve, reject) => {
            const sql = `
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                category TEXT NOT NULL,
                name TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL
            );`;
            this.db.run(sql, (err) => {
                if (err) reject(err);
                console.log("'events' tablosu hazır.");
                resolve();
            });
        });
    }

    // Belirtilen yılın veritabanında olup olmadığını kontrol eder
    yearExists(year) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(id) as count FROM events WHERE year = ?';
            this.db.get(sql, [year], (err, row) => {
                if (err) reject(err);
                resolve(row.count > 0);
            });
        });
    }

    // Hesaplanan tarihleri toplu olarak veritabanına ekler
    insertDates(dates) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO events (year, category, name, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
            const stmt = this.db.prepare(sql);

            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION');
                dates.forEach(dateInfo => {
                    stmt.run(dateInfo.year, dateInfo.category, dateInfo.name, dateInfo.startDate, dateInfo.endDate);
                });
                this.db.run('COMMIT', (err) => {
                    if (err) reject(err);
                    stmt.finalize();
                    console.log(`${dates.length} adet kayıt başarıyla eklendi.`);
                    resolve();
                });
            });
        });
    }

    // Belirtilen yıla ait tüm kayıtları getirir
    getEventsByYear(year) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM events WHERE year = ? ORDER BY start_date';
            this.db.all(sql, [year], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
    
    // Veritabanı bağlantısını kapatır
    close() {
        this.db.close((err) => {
            if (err) console.error("Veritabanı kapatma hatası:", err.message);
            console.log('Veritabanı bağlantısı kapatıldı.');
        });
    }
}

module.exports = Database;