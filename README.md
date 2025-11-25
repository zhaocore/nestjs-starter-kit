# Nest.js 脚手架

[English](README.md) | [中文](README-zh.md)

[![test](https://github.com/zhao-core/nestjs-starter-kit/workflows/Test/badge.svg)](https://github.com/zhao-core/nestjs-starter-kit/actions?query=workflow%3A%22Test%22) [![codecov](https://codecov.io/gh/zhao-core/nestjs-starter-kit/branch/main/graph/badge.svg?token=NGR0C23CMW)](https://codecov.io/gh/zhao-core/nestjs-starter-kit)

这是一个 Nest.js REST API 项目的脚手架。

## 项目动机

这个项目的主要目标是提供一个功能完整的 [Nest.js](https://nestjs.com/) 应用程序，可以作为创建 REST API 的脚手架。

通常情况下，仅仅运行 `$ nest new project` 并开始编写所需的业务逻辑是不够的。Nest.js 提供的最小应用程序只有一个控制器和服务。在大多数情况下，需要从 Nest.js 生态系统中引入和设置一系列额外的包，如 `typeorm`、`passport`、`cache-manager`、DTO 验证器等。

这个仓库提供了一个已经配置好的 REST API 项目，包含了常用的 Nest.js 包（完整列表见下文），所以你可以直接复制它并开始编写业务逻辑，而不用浪费时间在样板配置上。

## 功能特性

- [Nest.js 脚手架](#nestjs-脚手架)
  - [项目动机](#项目动机)
  - [功能特性](#功能特性)
    - [Docker 化本地开发](#docker-化本地开发)
    - [通过环境变量配置](#通过环境变量配置)
    - [通过 DTO 验证](#通过-dto-验证)
    - [数据库迁移](#数据库迁移)
    - [Redis 缓存](#redis-缓存)
    - [基于 passport.js 的 JWT 认证](#基于-passportjs-的-jwt-认证)
    - [带追踪 ID 生成的日志记录](#带追踪-id-生成的日志记录)
    - [优雅关闭](#优雅关闭)
    - [使用 Swagger 自动生成 API 文档](#使用-swagger-自动生成-api-文档)
    - [带本地邮件捕获的邮件服务](#带本地邮件捕获的邮件服务)
    - [单元测试](#单元测试)
    - [Pm2 启动](#pm2-启动)
    - [Cors 中间件](#cors-中间件)
    - [Helmet 中间件](#helmet-中间件)
    - [响应中间件](#响应中间件)
  - [安装](#安装)
    - [前置要求](#前置要求)
    - [快速开始](#快速开始)

### Docker 化本地开发

你将获得一个功能完整的开发 Docker 环境,包含 Postgres 数据库、Redis 和实用服务,如本地 SMTP 服务器。你只需一个命令就能启动所有服务器依赖,无需手动设置数据库和 Redis 服务器。

查看 [.docker-node-api](./.docker-node-api) 文件夹和[安装指南](#安装)了解更多详情。

### 本地快速启动

**新功能!** 现在支持使用 SQLite 数据库和内存缓存进行本地快速启动,无需配置 MySQL/PostgreSQL 和 Redis:

```bash
# 直接运行(自动使用 SQLite 和内存缓存)
npm run start:local

# 或使用 npx(需要先构建)
npm run build
npx nest-api
```

本地模式特性:

- ✅ 使用 SQLite 数据库(自动创建在 `./data/local.db`)
- ✅ 使用内存缓存(无需 Redis)
- ✅ 自动创建数据表(synchronize: true)
- ✅ 无需任何外部依赖即可启动

查看 [LOCAL_START.md](./LOCAL_START.md) 了解详细的本地启动指南。

### 通过环境变量配置

根据 [12 factor app](https://12factor.net/config) 的建议，推荐将应用程序配置存储在环境变量中。这种技术允许你构建一次包，并将其部署到多个目标服务器（如 QA、Staging、生产环境），而无需修改代码。每个目标环境将有不同的配置值，应用程序从环境变量中获取这些值。

这个项目提供了一套开箱即用的配置值，例如用于连接数据库和缓存服务器。查看 [app.module.ts](./api/src/app.module.ts#L14) 和 [configuration.ts](./api/src/services/app-config/configuration.ts) 了解更多详情。

### 通过 DTO 验证

启用了全局 [ValidationPipeline](./api/src/main.ts)，API 请求通过 [DTOs](./api/src/user/dto) 进行验证。

### 数据库迁移

`TypeORM` 数据库迁移已在 [./api/src/db/migrations](./api/src/db/migrations) 文件夹中为你设置好。

要生成新的迁移，运行：

```console
npm run migrations:new -- src/db/migrations/Roles
```

要应用迁移，运行：

```console
npm run migrations:up
```

要回滚迁移，运行：

```console
npm run migrations:revert
```

### Redis 缓存

带有 Redis 存储的 [cache-manager](https://github.com/BryanDonovan/node-cache-manager#readme) 包在 [app-cache.module.ts](./api/src/app-cache/app-cache.module.ts) 中可用。

因此可以在控制器方法或类上使用 [`CacheInterceptor`](./api/src/user/user.controller.ts#L50)：

```typescript
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getUsers() {}
```

或者注入 `CacheManager` 并直接使用：

```typescript
constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

await this.cacheManager.get('key');
```

### 基于 passport.js 的 JWT 认证

JWT 认证已配置并可以使用。

用户注册、登录和 JWT 保护的 API 示例已添加到 [user.controller.ts](./api/src/user/user.controller.ts) 中。

### 带追踪 ID 生成的日志记录

[Pino](https://github.com/pinojs/pino) 作为应用程序日志记录器。

每个 API 请求都会分配一个唯一的 TraceID，并通过 [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage) 传递给日志记录器。

代码可在 [async-storage.middleware.ts](./api/src/global/middleware/async-storage/async-storage.middleware.ts) 和 [app-logger.service.ts](./api/src/logger/services/app-logger/app-logger.service.ts) 中找到。

<img width="799" alt="日志中的 TraceID 示例" src="https://user-images.githubusercontent.com/5843270/143482882-84c51e0e-0e54-407b-8ed7-cf7b8536f7e3.png">

### 优雅关闭

启用了 Nest.js [关闭钩子](https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown)。

这个脚手架订阅了 `OnModuleDestroy` 事件，并[优雅地断开](./api/src/app-cache/app-cache.module.ts) Redis 连接。

### 使用 Swagger 自动生成 API 文档

配置了 Nest.js swagger 模块，使用 [Swagger CLI 插件](https://docs.nestjs.com/openapi/cli-plugin)。

API 文档在应用服务器启动时自动生成，可在 [http://localhost:9797/swagger](http://localhost:9797/swagger) 访问：

<img width="1485" alt="生成的 Swagger 文档" src="https://user-images.githubusercontent.com/5843270/143483373-a0f3fd48-4f27-4d53-9b8f-6b80bc147d48.png">

### 带本地邮件捕获的邮件服务

邮件服务开箱即用，可以这样使用：

在构造函数中注入：

```typescript
constructor(
  private readonly mailer: MailService,
) {}
```

发送邮件：

```typescript
await this.mailer.send({
  to: 'to-mail@example.com',
  from: this.mailer.from(),
  subject: '用户注册',
  text: '邮件内容',
});
```

你可以通过打开 http://localhost:8025/ 并浏览 MailHog UI 来查看已发送的邮件。

![MailHog UI](https://user-images.githubusercontent.com/5843270/143854275-1415cf0d-0003-4744-9f25-4649a1b406c9.png)

由 [nodemailer](https://www.npmjs.com/package/nodemailer) 提供支持。

### 单元测试

项目中添加的所有代码都有[单元测试](https://github.com/zhao-core/nestjs-starter-kit/search?q=describe)覆盖。

你可以找到有用的测试示例：

- 数据库仓库模拟 [(auth.service.spec.ts)](./api/src/user/services/auth/auth.service.spec.ts)。搜索 `getRepositoryToken`。
- 控制器测试 [(user.controller.spec.ts)](./api/src/user/user.controller.spec.ts)
- 中间件测试 [(async-storage.middleware.spec.ts)](./api/src/global/middleware/async-storage/async-storage.middleware.spec.ts)
- 服务测试 [(jwt.service.spec.ts)](./api/src/user/services/jwt/jwt.service.spec.ts)

### Pm2 启动

```console
npm run pm2:start
```

```console
npm run pm2:stop
```

### Cors 中间件

这是围绕 cors 的 Nest 中间件包装器。(https://github.com/wbhob/nest-middlewares/tree/master/packages/cors)

### Helmet 中间件

这是围绕 helmet 的 Nest 中间件包装器。(https://github.com/wbhob/nest-middlewares/tree/master/packages/helmet)

### 响应中间件

这是围绕 response-time 的 Nest 中间件包装器。(https://github.com/wbhob/nest-middlewares/tree/master/packages/response-time)

## 安装

### 前置要求

- Docker for Desktop
- Node.js LTS

### 快速开始

- 克隆仓库

```console
git clone https://github.com/zhao-core/nestjs-starter-kit.git
```

- 运行 Docker 容器（数据库、Redis 等）

```console
docker-compose up -d
```

- 进入 api 文件夹并复制环境变量文件

```console
cd ../api
cp .env.example .env
```

- 如需要，更新 .env 文件中的凭据

- 接下来安装依赖

```console
npm install
```

- 初始化配置并运行迁移

```console
npm run migrations:up
```

- 运行应用程序

```console
npm start:dev
```
