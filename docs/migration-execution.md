# project-process-control-web 迁移执行说明

> 来源项目：`D:\code\WebstormProjects\core-admin`  
> 新工程：`D:\code\WebstormProjects\project-process-control-web`  
> 基座：Vben Admin `apps/web-ele`

## 已完成范围

- 基于 Vben Admin `apps/web-ele` 创建新工程。
- 应用名、命名空间和默认首页改为项目过程管控平台。
- 权限模式设置为 `mixed`，固定页面和后端菜单共同生成路由。
- 登录接口保持旧协议：`POST /login`。
- 用户信息接口保持旧协议：`GET /sys/getUserInfo`。
- 菜单接口保持旧协议：`GET /sys/menu/nav`。
- 系统访问权限接口保持旧协议：`GET /sysMenu/hasPermission`。
- 请求头保持旧协议：`token`、`X-Requested-With`、`Request-Start`、`Accept-Language`、签名字段。
- 旧响应包络 `{ code, data, msg, success }` 已在请求层统一转换。
- 旧 token 缓存 `sessionStorage v1@CacheToken` 和 `permissions` 已兼容。
- 后端菜单字段 `openStyle`、`isFrame`、`frameSrc`、`outsideMenu` 已有前端适配层。
- 下载导出已提供 `downloadLegacyFile` 入口，支持 `content-disposition` 文件名解析。
- 微服务 key 已集中到 `src/api/request/service-clients.ts`。

## 关键文件

| 能力 | 文件 |
| --- | --- |
| 请求兼容层 | `apps/web-ele/src/api/request.ts` |
| 旧登录/用户字段适配 | `apps/web-ele/src/api/legacy/auth.ts` |
| 旧缓存适配 | `apps/web-ele/src/api/legacy/cache.ts` |
| 旧响应包络适配 | `apps/web-ele/src/api/legacy/transform.ts` |
| 后端菜单转 Vben route | `apps/web-ele/src/router/legacy/menu-transform.ts` |
| 登录、退出、权限接口 | `apps/web-ele/src/api/core/auth.ts` |
| 用户信息接口 | `apps/web-ele/src/api/core/user.ts` |
| 后端菜单接口 | `apps/web-ele/src/api/core/menu.ts` |
| 微服务客户端映射 | `apps/web-ele/src/api/request/service-clients.ts` |
| 下载导出入口 | `apps/web-ele/src/api/request/download.ts` |
| 项目工作台 | `apps/web-ele/src/views/dashboard/workspace/index.vue` |

## 环境变量映射

| 旧项目变量 | 新项目变量 | 说明 |
| --- | --- | --- |
| `VITE_APP_API=/api` | `VITE_GLOB_API_URL=/api` | 开发环境代理入口 |
| `BASE_URL=/` | `VITE_BASE=/` | 开发环境静态资源基础路径 |
| `BASE_URL=/budget-process/` | `VITE_BASE=/budget-process/` | 生产/SIT/UAT 部署子路径 |
| `VITE_APP_TITLE` | `VITE_APP_TITLE` | 应用标题保留 |

默认继续使用 hash 路由：`VITE_ROUTER_HISTORY=hash`。

## 旧目录到新目录映射

| 旧项目 | 新项目 |
| --- | --- |
| `src/views/*` | `apps/web-ele/src/views/*` |
| `src/api/*` | `apps/web-ele/src/api/*` |
| `src/components/*` | `apps/web-ele/src/components/*` |
| `src/hooks/*` | `apps/web-ele/src/hooks/*` 或 `apps/web-ele/src/composables/*` |
| `src/utils/*` | `apps/web-ele/src/utils/*`，框架协议类逻辑优先放到 `api/legacy` 或 `router/legacy` |
| `src/service/*` | 不原样迁移，统一走 `apps/web-ele/src/api/request.ts` |
| `src/store/*` | 不原样迁移，按业务域拆 Pinia store |
| `src/router/*` | 不原样迁移，只保留菜单适配逻辑 |
| `src/layout/*` | 不迁移，使用 Vben 布局 |

## 后续页面迁移规则

1. 先迁移对应业务 API，保持旧 URL、method、参数位置和返回结构。
2. 页面不要直接拼 `service` 参数，按业务域使用 `getServiceClient()`。
3. 下载导出统一使用 `downloadLegacyFile()` 或基于该入口扩展。
4. 菜单 URL 到页面组件路径优先按 `/xxx/yyy` -> `/xxx/yyy/index.vue`，特殊页面补显式映射。
5. 旧 Vuex 状态不要合成一个大 Pinia store，按业务域拆分。
6. 旧 Options API 页面迁移时优先改为 `<script setup lang="ts">`。
7. `workflow` 页面最后单独迁移，保留全屏路由和外部入口验收。

## 当前验证命令

```bash
pnpm exec vitest run apps/web-ele/src/api/request/service-clients.test.ts apps/web-ele/src/api/request/download.test.ts apps/web-ele/src/api/legacy/transform.test.ts apps/web-ele/src/router/legacy/menu-transform.test.ts apps/web-ele/src/api/legacy/auth.test.ts apps/web-ele/src/api/legacy/cache.test.ts
pnpm -F @project-process-control/web-ele run typecheck
pnpm -F @project-process-control/web-ele run build
```
