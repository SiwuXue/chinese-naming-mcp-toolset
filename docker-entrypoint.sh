#!/bin/sh
# 中文起名MCP工具集 Docker 入口脚本
# Chinese Naming MCP Toolset Docker Entrypoint Script

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    echo "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo "${GREEN}[SUCCESS]${NC} $1"
}

# 错误处理
error_exit() {
    log_error "$1"
    exit 1
}

# 信号处理
handle_signal() {
    log_info "Received signal, shutting down gracefully..."
    if [ ! -z "$APP_PID" ]; then
        kill -TERM "$APP_PID" 2>/dev/null || true
        wait "$APP_PID" 2>/dev/null || true
    fi
    log_success "Application stopped"
    exit 0
}

# 注册信号处理器
trap 'handle_signal' TERM INT

# 环境变量默认值
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}
export HOST=${HOST:-0.0.0.0}
export LOG_LEVEL=${LOG_LEVEL:-info}
export CACHE_ENABLED=${CACHE_ENABLED:-true}
export MAX_CONCURRENT_REQUESTS=${MAX_CONCURRENT_REQUESTS:-10}

log_info "Starting Chinese Naming MCP Toolset..."
log_info "Environment: $NODE_ENV"
log_info "Port: $PORT"
log_info "Host: $HOST"

# 检查必要的目录
log_info "Checking directories..."
for dir in logs data config; do
    if [ ! -d "/app/$dir" ]; then
        log_warn "Directory /app/$dir does not exist, creating..."
        mkdir -p "/app/$dir" || error_exit "Failed to create directory /app/$dir"
    fi
done

# 检查配置文件
log_info "Checking configuration files..."
if [ ! -f "/app/config/default.json" ]; then
    log_warn "Default configuration not found, creating from template..."
    if [ -f "/app/config/default.json.template" ]; then
        cp "/app/config/default.json.template" "/app/config/default.json" || error_exit "Failed to copy default configuration"
    else
        log_warn "No configuration template found, using built-in defaults"
    fi
fi

# 检查数据文件
log_info "Checking data files..."
if [ ! -f "/app/data/characters.json" ]; then
    log_warn "Character data not found"
    if [ -f "/app/data/characters.json.sample" ]; then
        cp "/app/data/characters.json.sample" "/app/data/characters.json" || error_exit "Failed to copy character data"
        log_info "Using sample character data"
    fi
fi

# 检查环境文件
if [ ! -f "/app/.env" ] && [ -f "/app/.env.example" ]; then
    log_info "Creating .env from example..."
    cp "/app/.env.example" "/app/.env" || log_warn "Failed to copy .env.example"
fi

# 等待依赖服务
log_info "Waiting for dependencies..."

# 等待Redis（如果配置了）
if [ ! -z "$REDIS_HOST" ]; then
    log_info "Waiting for Redis at $REDIS_HOST:${REDIS_PORT:-6379}..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if nc -z "$REDIS_HOST" "${REDIS_PORT:-6379}" 2>/dev/null; then
            log_success "Redis is ready"
            break
        fi
        timeout=$((timeout - 1))
        sleep 1
    done
    if [ $timeout -eq 0 ]; then
        log_warn "Redis connection timeout, continuing anyway..."
    fi
fi

# 运行健康检查
log_info "Running pre-start health checks..."

# 检查Node.js版本
node_version=$(node --version)
log_info "Node.js version: $node_version"

# 检查内存使用
mem_info=$(cat /proc/meminfo | grep MemAvailable | awk '{print $2}')
if [ ! -z "$mem_info" ] && [ "$mem_info" -lt 134217728 ]; then  # 128MB
    log_warn "Low memory available: $(($mem_info / 1024))MB"
fi

# 检查磁盘空间
disk_usage=$(df /app | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 90 ]; then
    log_warn "Disk usage is high: ${disk_usage}%"
fi

# 设置文件权限
log_info "Setting file permissions..."
chmod -R 755 /app/logs 2>/dev/null || true
chmod -R 644 /app/config/*.json 2>/dev/null || true

# 清理临时文件
log_info "Cleaning temporary files..."
rm -rf /app/.temp/* 2>/dev/null || true
rm -rf /app/logs/*.tmp 2>/dev/null || true

# 初始化应用
log_info "Initializing application..."
if [ -f "/app/scripts/init.js" ]; then
    node /app/scripts/init.js || log_warn "Initialization script failed"
fi

# 启动应用
log_info "Starting application..."

# 根据环境选择启动方式
if [ "$NODE_ENV" = "development" ]; then
    log_info "Starting in development mode..."
    exec node --inspect=0.0.0.0:9229 index.js &
elif [ "$NODE_ENV" = "production" ]; then
    log_info "Starting in production mode..."
    if [ -f "/app/build/index.js" ]; then
        exec node /app/build/index.js &
    else
        exec node index.js &
    fi
else
    log_info "Starting in $NODE_ENV mode..."
    exec node index.js &
fi

APP_PID=$!
log_success "Application started with PID: $APP_PID"

# 等待应用启动
log_info "Waiting for application to be ready..."
sleep 5

# 健康检查
if command -v curl >/dev/null 2>&1; then
    timeout=30
    while [ $timeout -gt 0 ]; do
        if curl -f "http://localhost:$PORT/health" >/dev/null 2>&1; then
            log_success "Application is healthy and ready to serve requests"
            break
        fi
        timeout=$((timeout - 1))
        sleep 1
    done
    if [ $timeout -eq 0 ]; then
        log_warn "Health check timeout, but application may still be starting..."
    fi
else
    log_warn "curl not available, skipping health check"
fi

# 显示启动信息
log_success "=== Chinese Naming MCP Toolset Started ==="
log_info "Environment: $NODE_ENV"
log_info "Listening on: http://$HOST:$PORT"
log_info "Process ID: $APP_PID"
log_info "Log Level: $LOG_LEVEL"
log_info "Cache Enabled: $CACHE_ENABLED"
log_success "========================================="

# 等待应用进程
wait "$APP_PID"