const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const images = [
    { name: 'netflix.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg' },
    { name: 'prime.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
    { name: 'disney.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    { name: 'apple.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { name: 'blutv.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/BluTV_logo.png' },
    { name: 'mubi.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/MUBI_logo.svg' }
];

const download = (url, dest) => {
    const file = fs.createWriteStream(dest);
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    };

    https.get(url, options, (response) => {
       
        if (response.statusCode === 301 || response.statusCode === 302) {
            download(response.headers.location, dest);
            return;
        }
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`✅ İndirildi: ${dest}`);
        });
    }).on('error', (err) => {
        fs.unlink(dest);
        console.error(`❌ Hata: ${err.message}`);
    });
};

console.log('Resimler indiriliyor...');
images.forEach(img => download(img.url, path.join(dir, img.name)));