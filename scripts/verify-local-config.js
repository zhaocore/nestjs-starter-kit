#!/usr/bin/env node

/**
 * 验证本地配置是否正确
 * 运行: node scripts/verify-local-config.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 验证本地配置...\n");

const checks = [];

// 1. 检查 package.json 中的 bin 配置
try {
	const pkg = require("../package.json");
	if (pkg.bin && pkg.bin["nest-api"]) {
		checks.push({ name: "✅ package.json bin 配置", status: "OK" });
	} else {
		checks.push({
			name: "❌ package.json bin 配置",
			status: "FAIL",
			detail: "bin 字段未配置",
		});
	}

	if (pkg.scripts["start:local"]) {
		checks.push({ name: "✅ start:local 脚本", status: "OK" });
	} else {
		checks.push({
			name: "❌ start:local 脚本",
			status: "FAIL",
			detail: "start:local 脚本未配置",
		});
	}

	if (pkg.dependencies["better-sqlite3"]) {
		checks.push({ name: "✅ better-sqlite3 依赖", status: "OK" });
	} else {
		checks.push({
			name: "⚠️  better-sqlite3 依赖",
			status: "WARN",
			detail: "需要安装: pnpm install better-sqlite3",
		});
	}
} catch (error) {
	checks.push({
		name: "❌ package.json 读取",
		status: "FAIL",
		detail: error.message,
	});
}

// 2. 检查启动脚本
const startScriptPath = path.join(__dirname, "start-local.js");
if (fs.existsSync(startScriptPath)) {
	checks.push({ name: "✅ start-local.js 脚本", status: "OK" });
} else {
	checks.push({
		name: "❌ start-local.js 脚本",
		status: "FAIL",
		detail: "文件不存在",
	});
}

// 3. 检查配置文件
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
	checks.push({ name: "✅ .env.local 配置文件", status: "OK" });
} else {
	checks.push({
		name: "⚠️  .env.local 配置文件",
		status: "WARN",
		detail: "可选文件,未找到",
	});
}

// 4. 检查数据目录
const dataDir = path.join(__dirname, "..", "data");
if (fs.existsSync(dataDir)) {
	checks.push({ name: "✅ data 目录", status: "OK" });
} else {
	checks.push({
		name: "⚠️  data 目录",
		status: "WARN",
		detail: "将在首次运行时自动创建",
	});
}

// 5. 检查源代码文件
const configPath = path.join(
	__dirname,
	"..",
	"src",
	"config",
	"configuration.ts",
);
if (fs.existsSync(configPath)) {
	const configContent = fs.readFileSync(configPath, "utf8");
	if (configContent.includes("better-sqlite3")) {
		checks.push({ name: "✅ configuration.ts SQLite 支持", status: "OK" });
	} else {
		checks.push({
			name: "❌ configuration.ts SQLite 支持",
			status: "FAIL",
			detail: "SQLite 配置未添加",
		});
	}

	if (configContent.includes("useMemoryCache")) {
		checks.push({ name: "✅ configuration.ts 内存缓存支持", status: "OK" });
	} else {
		checks.push({
			name: "❌ configuration.ts 内存缓存支持",
			status: "FAIL",
			detail: "内存缓存配置未添加",
		});
	}
} else {
	checks.push({
		name: "❌ configuration.ts",
		status: "FAIL",
		detail: "文件不存在",
	});
}

const dbModulePath = path.join(__dirname, "..", "src", "db", "db.module.ts");
if (fs.existsSync(dbModulePath)) {
	const dbModuleContent = fs.readFileSync(dbModulePath, "utf8");
	if (dbModuleContent.includes("better-sqlite3")) {
		checks.push({ name: "✅ db.module.ts SQLite 支持", status: "OK" });
	} else {
		checks.push({
			name: "❌ db.module.ts SQLite 支持",
			status: "FAIL",
			detail: "SQLite 支持未添加",
		});
	}
} else {
	checks.push({
		name: "❌ db.module.ts",
		status: "FAIL",
		detail: "文件不存在",
	});
}

const cacheConfigPath = path.join(
	__dirname,
	"..",
	"src",
	"cache",
	"cache-config.service.ts",
);
if (fs.existsSync(cacheConfigPath)) {
	const cacheConfigContent = fs.readFileSync(cacheConfigPath, "utf8");
	if (cacheConfigContent.includes("useMemoryCache")) {
		checks.push({ name: "✅ cache-config.service.ts 内存缓存", status: "OK" });
	} else {
		checks.push({
			name: "❌ cache-config.service.ts 内存缓存",
			status: "FAIL",
			detail: "内存缓存支持未添加",
		});
	}
} else {
	checks.push({
		name: "❌ cache-config.service.ts",
		status: "FAIL",
		detail: "文件不存在",
	});
}

// 打印结果
console.log("验证结果:\n");
checks.forEach((check) => {
	console.log(`${check.name}`);
	if (check.detail) {
		console.log(`   ${check.detail}`);
	}
});

console.log("\n");

// 统计
const ok = checks.filter((c) => c.status === "OK").length;
const fail = checks.filter((c) => c.status === "FAIL").length;
const warn = checks.filter((c) => c.status === "WARN").length;

console.log(`总计: ${checks.length} 项检查`);
console.log(`✅ 通过: ${ok}`);
console.log(`⚠️  警告: ${warn}`);
console.log(`❌ 失败: ${fail}`);

if (fail > 0) {
	console.log("\n❌ 配置验证失败,请检查上述错误!");
	process.exit(1);
} else if (warn > 0) {
	console.log("\n⚠️  配置验证通过(有警告),可以继续!");
	process.exit(0);
} else {
	console.log("\n✅ 配置验证完全通过!可以运行 npm run start:local");
	process.exit(0);
}
