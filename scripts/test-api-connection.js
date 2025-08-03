#!/usr/bin/env node

/**
 * Test API Connection Script
 * 
 * This script tests the connection to your ML repository API
 * Run with: node scripts/test-api-connection.js
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function testApiConnection() {
  console.log('🧪 Testing ML Repository API Connection...\n');
  console.log(`📡 API Base URL: ${API_BASE_URL}\n`);

  const tests = [
    {
      name: 'Health Check',
      endpoint: '/',
      method: 'GET'
    },
    {
      name: 'Random Songs',
      endpoint: '/api/songs/random',
      method: 'GET'
    },
    {
      name: 'Statistics',
      endpoint: '/api/stats',
      method: 'GET'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`🔍 Testing ${test.name}...`);
      
      const response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: SUCCESS`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...\n`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${response.statusText}\n`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   Message: ${error.message}\n`);
    }
  }

  console.log('📊 Test Results:');
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your ML API is ready to use.');
    console.log('🚀 Start your frontend with: npm run dev');
  } else {
    console.log('⚠️  Some tests failed. Please check:');
    console.log('   1. ML API server is running: python api_server.py');
    console.log('   2. API URL is correct in .env.local');
    console.log('   3. CORS settings allow frontend domain');
  }
}

// Run if called directly
if (require.main === module) {
  testApiConnection().catch(console.error);
}

module.exports = { testApiConnection };
