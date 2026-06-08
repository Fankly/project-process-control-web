<script lang="ts" setup>
import { computed } from 'vue';

import { useAccessStore, useUserStore } from '@vben/stores';

defineOptions({ name: 'ProjectWorkspace' });

const accessStore = useAccessStore();
const userStore = useUserStore();

const userName = computed(() => userStore.userInfo?.realName || '当前用户');

const foundationItems = [
  ['Vben 基座', 'apps/web-ele', '已接入'],
  ['登录协议', '/login', '已接入'],
  ['用户信息', '/sys/getUserInfo', '已接入'],
  ['后端菜单', '/sys/menu/nav', '已接入'],
  ['按钮权限', '/sysMenu/hasPermission', '已接入'],
  ['下载导出', 'blob/content-disposition', '已建入口'],
];

const migrationOrder = [
  ['系统/配置', '表单、表格、弹窗基础回归'],
  ['报表/统计', '图表、导出、查询条件回归'],
  ['预算/目标预算', '核心业务状态和权限回归'],
  ['财务/采购/事项', '流程和数据提交回归'],
  ['workflow', '特殊全屏路由单独回归'],
];
</script>

<template>
  <main class="workspace-page">
    <section class="workspace-header">
      <div>
        <h1>项目过程管控平台</h1>
        <p>{{ userName }}，当前环境已切换到 Vben Element Plus 基座。</p>
      </div>
      <dl>
        <div>
          <dt>权限模式</dt>
          <dd>mixed</dd>
        </div>
        <div>
          <dt>动态路由</dt>
          <dd>{{ accessStore.isAccessChecked ? '已生成' : '待生成' }}</dd>
        </div>
        <div>
          <dt>权限码</dt>
          <dd>{{ accessStore.accessCodes.length }}</dd>
        </div>
      </dl>
    </section>

    <section class="workspace-grid">
      <article class="workspace-panel">
        <header>
          <h2>框架链路</h2>
        </header>
        <table>
          <thead>
            <tr>
              <th>能力</th>
              <th>接口/目录</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in foundationItems" :key="item[0]">
              <td>{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="workspace-panel">
        <header>
          <h2>页面迁移顺序</h2>
        </header>
        <ol>
          <li v-for="item in migrationOrder" :key="item[0]">
            <strong>{{ item[0] }}</strong>
            <span>{{ item[1] }}</span>
          </li>
        </ol>
      </article>
    </section>
  </main>
</template>

<style scoped>
.workspace-page {
  min-height: 100%;
  padding: 24px;
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}

.workspace-header {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid hsl(var(--border));
}

.workspace-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 650;
  line-height: 1.3;
}

.workspace-header p {
  margin: 8px 0 0;
  color: hsl(var(--muted-foreground));
}

.workspace-header dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(92px, 1fr));
  gap: 12px;
  min-width: 360px;
  margin: 0;
}

.workspace-header dl > div,
.workspace-panel {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
}

.workspace-header dl > div {
  padding: 12px;
}

.workspace-header dt {
  font-size: 13px;
  color: hsl(var(--muted-foreground));
}

.workspace-header dd {
  margin: 6px 0 0;
  font-size: 18px;
  font-weight: 650;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.8fr);
  gap: 16px;
  margin-top: 20px;
}

.workspace-panel {
  overflow: hidden;
}

.workspace-panel header {
  padding: 16px 18px;
  border-bottom: 1px solid hsl(var(--border));
}

.workspace-panel h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 650;
}

.workspace-panel table {
  width: 100%;
  border-collapse: collapse;
}

.workspace-panel th,
.workspace-panel td {
  padding: 13px 18px;
  text-align: left;
  border-bottom: 1px solid hsl(var(--border));
}

.workspace-panel th {
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

.workspace-panel tr:last-child td {
  border-bottom: 0;
}

.workspace-panel ol {
  display: grid;
  gap: 0;
  padding: 0;
  margin: 0;
  list-style: none;
}

.workspace-panel li {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid hsl(var(--border));
}

.workspace-panel li:last-child {
  border-bottom: 0;
}

.workspace-panel li span {
  color: hsl(var(--muted-foreground));
}

@media (max-width: 900px) {
  .workspace-header,
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .workspace-header {
    display: grid;
  }

  .workspace-header dl {
    grid-template-columns: 1fr;
    min-width: 0;
  }
}
</style>
