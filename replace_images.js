const fs = require('fs');
const path = require('path');

const dir = __dirname;
let count = 100;

function processFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We will find all elements with linear-gradient and replace them with loremflickr URLs
    
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Regex to find background: linear-gradient(...) or background-image: linear-gradient(...)
        const regex = /background(?:-image)?\s*:\s*linear-gradient\([^)]+\)/g;
        
        if (regex.test(line)) {
            line = line.replace(regex, (match) => {
                count++;
                
                // Determine image type based on line content
                let keywords = 'luxury,travel';
                let width = 800;
                let height = 600;
                
                if (line.includes('avatar') || line.includes('border-radius:50%')) {
                    keywords = 'portrait,face';
                    width = 200;
                    height = 200;
                } else if (line.includes('hero') || line.includes('min-height:')) {
                    keywords = 'luxury,resort,landscape';
                    width = 1600;
                    height = 900;
                } else if (line.includes('auth-visual')) {
                    keywords = 'luxury,hotel,interior';
                    width = 1000;
                    height = 1400;
                }
                
                return `background-image: url('https://loremflickr.com/${width}/${height}/${keywords}?random=${count}')`;
            });
            lines[i] = line;
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}

// Process all files in the current directory
const files = fs.readdirSync(dir);
files.forEach(file => {
    processFile(path.join(dir, file));
});

console.log('All placeholders replaced with LoremFlickr images.');
