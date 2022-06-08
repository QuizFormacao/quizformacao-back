import fs from 'fs';

fs.writeFileSync('build/.env', fs.readFileSync('.env.development'));
