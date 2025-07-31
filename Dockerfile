# 中文起名MCP工具集 Docker 镜像
# Chinese Naming MCP Toolset Docker Image

# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    dumb-init \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 依赖安装阶段
FROM base AS deps

# 复制包管理文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# 开发依赖安装阶段（用于构建）
FROM base AS dev-deps

# 复制包管理文件
COPY package*.json ./

# 安装所有依赖
RUN npm ci --no-audit --no-fund

# 构建阶段
FROM dev-deps AS builder

# 复制源代码
COPY . .

# 运行构建脚本
RUN npm run build

# 生产运行阶段
FROM base AS runner

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# 创建应用目录
RUN mkdir -p /app/logs /app/data /app/config && \
    chown -R nodejs:nodejs /app

# 切换到非root用户
USER nodejs

# 从依赖阶段复制node_modules
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# 从构建阶段复制构建产物
COPY --from=builder --chown=nodejs:nodejs /app/build ./build

# 复制必要的配置文件
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs config/ ./config/
COPY --chown=nodejs:nodejs data/ ./data/

# 复制启动脚本
COPY --chown=nodejs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# 暴露端口
EXPOSE $PORT

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# 设置启动命令
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]

# 多阶段构建 - 开发环境
FROM dev-deps AS development

# 设置开发环境变量
ENV NODE_ENV=development
ENV PORT=3000
ENV HOST=0.0.0.0

# 复制源代码
COPY --chown=nodejs:nodejs . .

# 创建必要目录
RUN mkdir -p logs data config && \
    chown -R nodejs:nodejs .

# 切换到非root用户
USER nodejs

# 暴露端口
EXPOSE $PORT
EXPOSE 9229

# 开发环境启动命令
CMD ["npm", "run", "dev"]

# 多阶段构建 - 测试环境
FROM dev-deps AS test

# 复制源代码
COPY . .

# 运行测试
RUN npm test

# 运行代码质量检查
RUN npm run lint

# 生成测试覆盖率报告
RUN npm run test:coverage

# 标签信息
LABEL maintainer="Chinese Naming Team <team@chinese-naming.com>"
LABEL version="1.0.0"
LABEL description="中文起名MCP工具集 - 专业的中文姓名分析和生成工具"
LABEL org.opencontainers.image.title="Chinese Naming MCP Toolset"
LABEL org.opencontainers.image.description="Professional Chinese naming analysis and generation tools"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="Chinese Naming Team"
LABEL org.opencontainers.image.url="https://github.com/chinese-naming/mcp-toolset"
LABEL org.opencontainers.image.documentation="https://github.com/chinese-naming/mcp-toolset/blob/main/README.md"
LABEL org.opencontainers.image.source="https://github.com/chinese-naming/mcp-toolset"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.created="2024-01-01T00:00:00Z"