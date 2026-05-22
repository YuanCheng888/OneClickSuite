# Contributing to OneClickSuite

感谢您有兴趣为 OneClickSuite 项目做出贡献！我们欢迎各种形式的贡献，包括代码提交、文档改进、bug 报告和功能建议。

## 📋 贡献流程

### 1. Fork 仓库

首先，点击 GitHub 页面上的 "Fork" 按钮，创建您自己的仓库副本。

### 2. 克隆仓库

```bash
git clone https://github.com/YuanCheng888/OneClickSuite.git
cd OneClickSuite
```

### 3. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 4. 开发和测试

在本地进行开发，确保代码通过所有测试：

```bash
npm install
npm run lint
npm run build
```

### 5. 提交更改

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. 推送到分支

```bash
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request

在 GitHub 上创建一个 Pull Request，描述您的更改内容。

## 📝 代码规范

### TypeScript 规范

- 使用 `import type` 导入类型
- 使用 `const` 而非 `var`
- 为所有函数和变量提供类型注解
- 使用 ES6+ 语法

### ESLint

确保代码通过 ESLint 检查：

```bash
npm run lint
```

### 提交信息规范

请使用以下格式：

- `feat`: 添加新功能
- `fix`: 修复 bug
- `docs`: 更新文档
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 添加/修改测试
- `chore`: 构建/工具相关

### 示例

```
feat: add image batch generation feature
fix: resolve authentication token expiration issue
docs: update installation guide
```

## 🐛 报告 Bug

如果您发现了 bug，请创建一个 Issue 并提供以下信息：

- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 截图（如果适用）
- 环境信息（Node.js 版本、浏览器等）

## 💡 功能建议

欢迎提出新功能建议！请创建一个 Issue 并描述：

- 功能描述
- 使用场景
- 预期效果

## 📄 文档贡献

文档是项目的重要组成部分，我们欢迎对 README.md、API 文档等进行改进。

## 📞 联系方式

如有问题，请通过以下方式联系我们：

- 创建 [Issue](https://github.com/YuanCheng888/OneClickSuite/issues)

---

再次感谢您的贡献！🎉