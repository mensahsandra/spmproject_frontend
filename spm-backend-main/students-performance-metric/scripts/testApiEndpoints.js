const http = require('http');
const querystring = require('querystring');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          // For CSV responses
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testHealthEndpoint() {
  console.log('\n=== Testing Health Endpoint ===');
  try {
    const response = await makeRequest('GET', '/api/health');
    console.log(`Status: ${response.status}`);
    console.log('Response:', response.data);
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testAttendanceLogsEndpoint() {
  console.log('\n=== Testing Attendance Logs Endpoint ===');
  try {
    const params = querystring.stringify({
      courseCode: 'CS101',
      filterType: 'day',
      page: 1,
      limit: 10
    });
    
    const response = await makeRequest('GET', `/api/attendance/logs?${params}`);
    console.log(`Status: ${response.status}`);
    console.log('Response structure:', {
      ok: response.data.ok,
      logsCount: response.data.logs ? response.data.logs.length : 0,
      totalPages: response.data.totalPages
    });
    return response.status === 200 && response.data.ok;
  } catch (error) {
    console.error('Attendance logs test failed:', error.message);
    return false;
  }
}

async function testAttendanceExportEndpoint() {
  console.log('\n=== Testing Attendance Export Endpoint ===');
  try {
    const params = querystring.stringify({
      courseCode: 'CS101',
      filterType: 'day'
    });
    
    const response = await makeRequest('GET', `/api/attendance/export?${params}`);
    console.log(`Status: ${response.status}`);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Disposition:', response.headers['content-disposition']);
    console.log('Response preview:', typeof response.data === 'string' ? response.data.substring(0, 200) + '...' : response.data);
    return response.status === 200;
  } catch (error) {
    console.error('Attendance export test failed:', error.message);
    return false;
  }
}

async function testGradesEnrolledEndpoint() {
  console.log('\n=== Testing Grades Enrolled Endpoint ===');
  try {
    const params = querystring.stringify({
      courseCode: 'CS101'
    });
    
    const response = await makeRequest('GET', `/api/grades/enrolled?${params}`);
    console.log(`Status: ${response.status}`);
    console.log('Response structure:', {
      ok: response.data.ok,
      studentsCount: response.data.students ? response.data.students.length : 0
    });
    return response.status === 200 && response.data.ok;
  } catch (error) {
    console.error('Grades enrolled test failed:', error.message);
    return false;
  }
}

async function testGradesBulkUpdateEndpoint() {
  console.log('\n=== Testing Grades Bulk Update Endpoint ===');
  try {
    const data = {
      courseCode: 'CS101',
      updates: [
        { studentId: 'TEST001', grade: 'A' }
      ]
    };
    
    const response = await makeRequest('POST', '/api/grades/bulk-update', data);
    console.log(`Status: ${response.status}`);
    console.log('Response:', response.data);
    return response.status === 200 && response.data.ok;
  } catch (error) {
    console.error('Grades bulk update test failed:', error.message);
    return false;
  }
}

async function testGradesHistoryEndpoint() {
  console.log('\n=== Testing Grades History Endpoint ===');
  try {
    const params = querystring.stringify({
      courseCode: 'CS101'
    });
    
    const response = await makeRequest('GET', `/api/grades/history?${params}`);
    console.log(`Status: ${response.status}`);
    console.log('Response structure:', {
      ok: response.data.ok,
      historyCount: response.data.history ? response.data.history.length : 0
    });
    return response.status === 200 && response.data.ok;
  } catch (error) {
    console.error('Grades history test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Endpoint Tests...');
  console.log('Make sure the server is running on port 3000');
  
  const tests = [
    { name: 'Health Check', fn: testHealthEndpoint },
    { name: 'Attendance Logs', fn: testAttendanceLogsEndpoint },
    { name: 'Attendance Export', fn: testAttendanceExportEndpoint },
    { name: 'Grades Enrolled', fn: testGradesEnrolledEndpoint },
    { name: 'Grades Bulk Update', fn: testGradesBulkUpdateEndpoint },
    { name: 'Grades History', fn: testGradesHistoryEndpoint }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
      console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      results.push({ name: test.name, passed: false });
      console.log(`❌ ${test.name}: FAILED - ${error.message}`);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  console.log(`${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the server logs and database connection.');
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };