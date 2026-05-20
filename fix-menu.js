const fs = require('fs');
const j = JSON.parse(fs.readFileSync('src/modules/base/menu.json', 'utf8'));
j.forEach(m => {
  m.childMenus = m.childMenus.filter(c => c.name !== 'crud 示例');
  if (m.name === '首页') m.viewPath = null;
});
fs.writeFileSync('src/modules/base/menu.json', JSON.stringify(j, null, 4), 'utf8');
console.log('OK');
