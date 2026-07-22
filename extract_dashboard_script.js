const fs = require('fs');

let html = fs.readFileSync('dashboard.html', 'utf8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);

if (scriptMatch) {
    fs.writeFileSync('js/dashboard-init.js', scriptMatch[1], 'utf8');
    html = html.replace(scriptMatch[0], '<script src="js/dashboard-bundle.js" defer></script>');
    fs.writeFileSync('dashboard.html', html, 'utf8');
    console.log('Extracted dashboard inline script');
} else {
    console.log('No script type="module" found in dashboard.html');
}
