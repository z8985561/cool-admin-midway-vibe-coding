import { spawn } from 'node:child_process';

function run(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...opts,
    });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`命令 "${command} ${args.join(' ')}" 退出码: ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  // 第一步：启动 MySQL + Redis 容器
  console.log('[dev-docker] 正在启动 MySQL + Redis 容器...');
  try {
    await run('docker', ['compose', 'up', '-d', 'mysql', 'redis']);
    console.log('[dev-docker] 容器启动成功\n');
  } catch (err) {
    console.error('\n[dev-docker] ❌ Docker 容器启动失败！');
    console.error(err.message);
    process.exit(1);
  }

  // 第二步：启动开发服务器
  console.log('[dev-docker] 正在启动开发服务器...');
  await run('npm', ['run', 'dev']);
}

main();
