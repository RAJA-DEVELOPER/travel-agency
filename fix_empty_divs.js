const fs = require('fs');
const path = require('path');

const dir = __dirname;
let count = 200;

function processFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // We want to find divs that are placeholders for images but don't have a background-image inline style.
    // For example: <div class="avatar"></div>
    // or: <div class="card__image"></div>
    
    // We can use a regex to find these elements and inject a style if they don't have one.
    // This is tricky with raw regex, so let's look for specific patterns.
    
    // Pattern 1: <div class="dash-sidebar__avatar"></div>
    const regex1 = /<div class="dash-sidebar__avatar">(\s*)<\/div>/g;
    if (regex1.test(content)) {
        content = content.replace(regex1, () => {
            count++;
            modified = true;
            return `<div class="dash-sidebar__avatar" style="background-image: url('https://loremflickr.com/200/200/portrait,face?random=${count}'); background-size: cover; background-position: center;"></div>`;
        });
    }

    // Pattern 2: <div class="avatar-lg"></div>
    const regex2 = /<div class="avatar-lg">(\s*)<\/div>/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, () => {
            count++;
            modified = true;
            return `<div class="avatar-lg" style="background-image: url('https://loremflickr.com/200/200/portrait,face?random=${count}'); background-size: cover; background-position: center;"></div>`;
        });
    }

    // Pattern 3: <div class="avatar"></div>
    const regex3 = /<div class="avatar[^"]*">(\s*)<\/div>/g;
    if (regex3.test(content)) {
        content = content.replace(regex3, (match) => {
            if (match.includes('style=')) return match; // Already has style
            count++;
            modified = true;
            // Inject style before the closing >
            return match.replace('>', ` style="background-image: url('https://loremflickr.com/200/200/portrait,face?random=${count}'); background-size: cover; background-position: center;">`);
        });
    }

    // Pattern 4: <div class="sidebar-user__avatar">AK</div>
    const regex4 = /<div class="sidebar-user__avatar">([^<]*)<\/div>/g;
    if (regex4.test(content)) {
        content = content.replace(regex4, (match, initials) => {
            count++;
            modified = true;
            return `<div class="sidebar-user__avatar" style="background-image: url('https://loremflickr.com/200/200/portrait,face?random=${count}'); background-size: cover; background-position: center; color: transparent;">${initials}</div>`;
        });
    }

    // Pattern 5: <div class="topbar-profile__avatar">AK</div>
    const regex5 = /<div class="topbar-profile__avatar">([^<]*)<\/div>/g;
    if (regex5.test(content)) {
        content = content.replace(regex5, (match, initials) => {
            count++;
            modified = true;
            return `<div class="topbar-profile__avatar" style="background-image: url('https://loremflickr.com/200/200/portrait,face?random=${count}'); background-size: cover; background-position: center; color: transparent;">${initials}</div>`;
        });
    }

    // Pattern 6: About page team members might just be missing images?
    // Let's check team-member__image
    const regex6 = /<div class="team-member__image"[^>]*>(\s*)<\/div>/g;
    if (regex6.test(content)) {
        content = content.replace(regex6, (match) => {
            if (match.includes('style=')) return match;
            count++;
            modified = true;
            return match.replace('>', ` style="background-image: url('https://loremflickr.com/600/800/portrait,face?random=${count}'); background-size: cover; background-position: center;">`);
        });
    }
    
    // Pattern 7: index.html 4th experience card (which I manually missed)
    const regex7 = /<div style="width:100%;height:100%;background:linear-gradient\(180deg, #065F46 0%, #0B1F3A 100%\);" class="experiences__img"><\/div>/g;
    if (regex7.test(content)) {
        content = content.replace(regex7, () => {
            count++;
            modified = true;
            return `<img src="https://loremflickr.com/800/600/luxury,travel,wildlife?random=${count}" alt="Wildlife Encounters" style="width:100%;height:100%;object-fit:cover;" class="experiences__img">`;
        });
    }

    // Pattern 8: Any card__image that has NO style
    const regex8 = /<div class="card__image">(\s*)<\/div>/g;
    if (regex8.test(content)) {
        content = content.replace(regex8, (match) => {
            count++;
            modified = true;
            return `<div class="card__image" style="background-image: url('https://loremflickr.com/800/600/luxury,travel?random=${count}'); background-size: cover; background-position: center;"></div>`;
        });
    }
    
    // Check about page story images
    const regex9 = /<div class="about-story__image">(\s*)<\/div>/g;
    if (regex9.test(content)) {
        content = content.replace(regex9, (match) => {
            count++;
            modified = true;
            return `<div class="about-story__image" style="background-image: url('https://loremflickr.com/800/600/luxury,travel?random=${count}'); background-size: cover; background-position: center;"></div>`;
        });
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed empty divs in ${path.basename(filePath)}`);
    }
}

const files = fs.readdirSync(dir);
files.forEach(file => {
    processFile(path.join(dir, file));
});
