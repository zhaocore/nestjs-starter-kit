#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { open } = require('open');
dotenv.config();
// 设置本地运行环境变量
process.env.NODE_ENV = 'local';
process.env.DB_TYPE = 'better-sqlite3';
process.env.DB_DATABASE_PATH =
  process.env.DB_DATABASE_PATH || path.join(process.cwd(), 'data', 'local.db');
process.env.USE_MEMORY_CACHE = 'true';
process.env.PORT = process.env.PORT || '3000';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'local-dev-secret-key-change-in-production';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

// 确保 data 目录存在
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory:', dataDir);
}

console.log('Starting in local mode...');
console.log('Database:', process.env.DB_DATABASE_PATH);
console.log('Cache: In-Memory');
console.log('Port:', process.env.PORT);

// 启动 NestJS 应用
const nestProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

nestProcess.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

nestProcess.on('exit', (code) => {
  // 恢复终端模式
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  process.exit(code);
});

// 处理退出信号
process.on('SIGINT', () => {
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  nestProcess.kill('SIGINT');
  setTimeout(() => process.exit(0), 100);
});

process.on('SIGTERM', () => {
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  nestProcess.kill('SIGTERM');
  setTimeout(() => process.exit(0), 100);
});

function getEditorUrl() {
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}/`;
}

function openBrowser() {
  const editorUrl = getEditorUrl();

  open(editorUrl, { wait: true }).catch(() => {
    console.info(
      `\nWas not able to open URL in browser. Please open manually by visiting:\n${editorUrl}\n`,
    );
  });
}

function onTerminationSignal(signal) {
  console.log(`\nReceived ${signal}. Shutting down...`);
  
  // 恢复终端模式
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  
  // 杀死子进程
  nestProcess.kill(signal);
  
  // 等待子进程退出
  setTimeout(() => {
    process.exit(0);
  }, 100);
}

console.log('\nPress "o" to open in Browser.');

// 设置 stdin 为 raw 模式以捕获单个按键
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
process.stdin.setEncoding('utf8');
process.stdin.resume();

process.stdin.on('data', (key) => {
  if (key === 'o') {
    openBrowser();
  } else if (key.charCodeAt(0) === 3) {
    // Ctrl+C
    onTerminationSignal('SIGINT');
  } else {
    // When anything else got pressed, record it and send it on enter into the child process

    if (key.charCodeAt(0) === 13) {
      // send to child process and print in terminal
      process.stdout.write('\n');
    } else {
      // record it and write into terminal
      process.stdout.write(key);
    }
  }
});
