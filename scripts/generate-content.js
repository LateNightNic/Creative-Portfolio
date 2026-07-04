const path = require('path');
const { generateBlog } = require('./lib/generate-blog');

const SRC = path.join(__dirname, '..', 'src');
const SITE_URL = 'https://www.nicmilligan.com';

generateBlog({ outDir: SRC, siteUrl: SITE_URL });
console.log('Generated blog content → src/');
