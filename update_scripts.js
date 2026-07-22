const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    if (content.includes('<script type="module" src="js/app.js"></script>')) {
        content = content.replace('<script type="module" src="js/app.js"></script>', '<script src="js/bundle.js" defer></script>');
        modified = true;
    }

    if (content.includes('<script type="module" src="js/dashboard.js"></script>')) {
        content = content.replace('<script type="module" src="js/dashboard.js"></script>', '<script src="js/dashboard-bundle.js" defer></script>');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated scripts in ${file}`);
    }
});
