#!/bin/sh
# 修复 config.prod.js 中的硬编码数据库配置，改为从环境变量读取
node -e "
var fs = require('fs');
var p = '/app/dist/config/config.prod.js';
var c = fs.readFileSync(p, 'utf8');
c = c.replace(/'host': '127.0.0.1',/, \"'host': process.env.MYSQL_HOST || '127.0.0.1',\");
c = c.replace(/'port': 3003,/, \"'port': parseInt(process.env.MYSQL_PORT || '3003'),\");
c = c.replace(/'username': 'root',/, \"'username': process.env.MYSQL_USER || 'root',\");
c = c.replace(/'password': '123456',/, \"'password': process.env.MYSQL_PASSWORD || '123456',\");
c = c.replace(/'database': 'cool',/, \"'database': process.env.MYSQL_DATABASE || 'cool',\");
c = c.replace(/'synchronize': true/, \"'synchronize': !!process.env.MYSQL_HOST\");
fs.writeFileSync(p, c);
console.log('config.prod.js patched successfully');
"
exec npm run start
