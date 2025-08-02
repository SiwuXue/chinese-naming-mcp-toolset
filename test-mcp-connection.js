#!/usr/bin/env node

/**
 * MCP连接测试脚本
 * 用于诊断MCP服务器连接问题
 */

const { spawn } = require('child_process');
const path = require('path');

function testMCPConnection() {
  console.log('🔍 开始测试MCP连接...');
  
  // 启动MCP服务器
  const mcpProcess = spawn('node', [path.join(__dirname, 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let responseReceived = false;
  let timeout;
  
  // 设置超时
  timeout = setTimeout(() => {
    if (!responseReceived) {
      console.log('❌ 测试超时 - MCP服务器可能没有响应');
      mcpProcess.kill();
      process.exit(1);
    }
  }, 10000);
  
  // 监听输出
  mcpProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📤 MCP服务器响应:', output.trim());
    
    try {
      const response = JSON.parse(output.trim());
      if (response.jsonrpc === '2.0' && response.result) {
        console.log('✅ MCP服务器响应正常!');
        console.log('📋 服务器信息:', JSON.stringify(response.result, null, 2));
        responseReceived = true;
        clearTimeout(timeout);
        mcpProcess.kill();
        
        // 测试工具列表
        setTimeout(() => testToolsList(), 1000);
      }
    } catch (e) {
      console.log('⚠️  响应不是有效的JSON:', output);
    }
  });
  
  // 监听错误
  mcpProcess.stderr.on('data', (data) => {
    console.log('❌ MCP服务器错误:', data.toString());
  });
  
  mcpProcess.on('error', (error) => {
    console.log('❌ 进程启动失败:', error.message);
    clearTimeout(timeout);
    process.exit(1);
  });
  
  mcpProcess.on('exit', (code) => {
    if (!responseReceived) {
      console.log(`❌ MCP服务器异常退出，退出码: ${code}`);
      clearTimeout(timeout);
      process.exit(1);
    }
  });
  
  // 发送初始化请求
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  console.log('📤 发送初始化请求:', JSON.stringify(initRequest));
  mcpProcess.stdin.write(JSON.stringify(initRequest) + '\n');
}

function testToolsList() {
  console.log('\n🔍 测试工具列表...');
  
  const mcpProcess = spawn('node', [path.join(__dirname, 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let responseReceived = false;
  let timeout;
  
  timeout = setTimeout(() => {
    if (!responseReceived) {
      console.log('❌ 工具列表测试超时');
      mcpProcess.kill();
      process.exit(1);
    }
  }, 10000);
  
  mcpProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📤 工具列表响应:', output.trim());
    
    try {
      const response = JSON.parse(output.trim());
      if (response.jsonrpc === '2.0' && response.result && response.result.tools) {
        console.log('✅ 工具列表获取成功!');
        console.log(`📊 可用工具数量: ${response.result.tools.length}`);
        response.result.tools.forEach((tool, index) => {
          console.log(`   ${index + 1}. ${tool.name} - ${tool.description}`);
        });
        responseReceived = true;
        clearTimeout(timeout);
        mcpProcess.kill();
        
        console.log('\n🎉 所有测试通过! MCP服务器工作正常。');
        console.log('\n💡 如果Claude Desktop仍然显示连接错误，请检查:');
        console.log('   1. Claude Desktop配置文件中的路径是否正确');
        console.log('   2. 是否重启了Claude Desktop');
        console.log('   3. 系统环境变量是否正确设置');
        process.exit(0);
      }
    } catch (e) {
      console.log('⚠️  工具列表响应不是有效的JSON:', output);
    }
  });
  
  mcpProcess.stderr.on('data', (data) => {
    console.log('❌ 工具列表测试错误:', data.toString());
  });
  
  // 发送工具列表请求
  const toolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  
  console.log('📤 发送工具列表请求:', JSON.stringify(toolsRequest));
  mcpProcess.stdin.write(JSON.stringify(toolsRequest) + '\n');
}

// 开始测试
testMCPConnection();