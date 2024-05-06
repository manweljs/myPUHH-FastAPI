import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

const timeout = 60000;
export const GetNomorDokumen = async (username: string, password: string) => {
    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto('https://sipuhh.phl.menlhk.go.id/auth/login');

        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });

        // Type into search box
        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);
        await page.click('.btn.btn-success');

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: timeout })
        console.log('login success')

        // Tunggu elemen <h2> muncul di halaman
        await page.waitForSelector('h2');

        // Ambil teks dari <h2> untuk verifikasi
        const welcomeText = await page.evaluate(() => {
            const h2 = document.querySelector('h2');
            return h2 ? h2.innerText : '';
        });

        console.log('Teks Selamat Datang:', welcomeText);
        if (welcomeText === 'Selamat Datang di Aplikasi SI-PUHH') {
            console.log('Login berhasil, melanjutkan ke proses selanjutnya.');
            // Lanjutkan ke langkah selanjutnya
        } else {
            console.log('Login gagal atau teks selamat datang tidak sesuai.');
            return NextResponse.json({ error: 'Login gagal atau teks selamat datang tidak sesuai.' });
            // Handle kesalahan login atau teks yang tidak sesuai
        }

        await page.goto('https://sipuhh.phl.menlhk.go.id/a_new_dkb_enc', { waitUntil: 'networkidle0', timeout: timeout });

        // Tunggu elemen <h2> dengan teks spesifik muncul
        await page.waitForSelector('header[role="heading"] h2');

        // Ambil teks dari elemen <h2> di dalam header dan verifikasi
        const headerText = await page.evaluate(() => {
            const h2 = document.querySelector('header[role="heading"] h2') as HTMLHeadingElement;
            return h2 ? h2.innerText.trim() : null;
        });

        console.log('Header Text:', headerText);

        // Cek jika teks header adalah 'DKB TPK Hutan'
        if (headerText === 'DKB TPK Hutan') {
            console.log('Berada di halaman yang benar, melanjutkan proses.');
            // Lanjutkan dengan proses selanjutnya
        } else {
            console.log('Tidak di halaman yang benar, menghentikan proses.');
            return NextResponse.json({ error: 'Tidak di halaman yang benar, menghentikan proses.' });
            // Mungkin lakukan error handling atau retry
        }

        await page.waitForSelector('#dt_basic2');  // Pastikan tabel sudah ada
        console.log('Tabel ditemukan, melanjutkan ke mengubah mencari select dropdown');

        await page.waitForSelector('select[name="dt_basic2_length"]');

        console.log('Select ditemukan, melanjutkan ke mengubah dropdown');
        console.log('Mengubah dropdown menjadi 100 menggunakan .evaluate()');

        await page.evaluate(() => {
            const select = document.querySelector('select[name="dt_basic2_length"]') as HTMLSelectElement;
            select.value = '100';  // Mengubah nilai
            select.dispatchEvent(new Event('change'));  // Memicu event 'change'
        });

        console.log('Dropdown telah diubah, menunggu perubahan pada tabel.');
        await page.screenshot({ path: 'after_change_dropdown.png' });

        await page.waitForNetworkIdle({ timeout: timeout });
        console.log('Perubahan pada tabel telah terdeteksi, melanjutkan untuk mengambil data.');

        await page.screenshot({ path: 'after_change_dropdown_loading.png' });

        console.log('Parsing data dari tabel.')

        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#dt_basic2 > tbody > tr'));
            return rows.map(row => {
                const cells = row.querySelectorAll('td:not(:has(table))'); // Mengabaikan sel yang memiliki tabel di dalamnya
                let obj: { [key: string]: string } = {}; // Define obj as an object with string keys and string or string[] values
                cells.forEach((cell, idx) => {
                    const cellElement = cell as HTMLElement; // Change the type of cell to HTMLElement
                    obj[`cell${idx + 1}`] = cellElement.innerText.trim(); // Menyimpan teks dari sel
                });

                // Parse data ke dalam format yang diinginkan
                const dkb = obj['cell4'].split('\n')[0].replace(/No\. /, '').trim();
                const tanggalPenerbitan = obj['cell4'].split('\n')[1].replace(/Tgl\. /, '').trim();
                const nomorDokumen = obj['cell8'];
                const tanggalDimatikan = obj['cell14'].split('\n')[1].trim();

                return {
                    dkb,
                    tanggal_penerbitan: tanggalPenerbitan,
                    nomor_dokumen: nomorDokumen,
                    tanggal_dimatikan: tanggalDimatikan
                };
            });
        });


        await browser.close();
        return NextResponse.json({ data: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}