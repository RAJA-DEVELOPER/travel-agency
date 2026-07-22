const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let totalFixed = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix: replace type="module" src="js/app.js" with bundle.js
    if (content.includes('<script type="module" src="js/app.js"></script>')) {
        content = content.replace(
            '<script type="module" src="js/app.js"></script>',
            '<script src="js/bundle.js" defer></script>'
        );
        modified = true;
    }

    // 2. Fix: replace any remaining type="module" src with bundle
    const modulePattern = /<script type="module" src="js\/(app|forms|navbar|hero-slider|scroll-reveal|page-transitions|utils)\.js"><\/script>/g;
    if (modulePattern.test(content)) {
        content = content.replace(modulePattern, '<script src="js/bundle.js" defer></script>');
        modified = true;
    }

    // 3. Fix: replace inline type="module" scripts that import from ./js/
    // These need to become normal scripts that call the already-bundled functions
    // But the dashboard already handles this via extracted script

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched: ${file}`);
        totalFixed++;
    }
});

console.log(`\nTotal patched: ${totalFixed} files`);
