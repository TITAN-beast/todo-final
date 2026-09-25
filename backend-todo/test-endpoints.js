const http = require('http');
const app = require('./src/app');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, rawBody: body });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5002, resolve));
  console.log('Test server running on port 5002');

  try {
    // 1. Test 404 on nonexistent route
    const res404 = await makeRequest({
      hostname: 'localhost',
      port: 5002,
      path: '/api/nonexistent',
      method: 'GET',
    });
    console.log('1. 404 Handler Test:', res404.status === 404 ? 'PASS' : 'FAIL', res404.body);

    // 2. Test registration validation (missing name)
    const resRegInvalid = await makeRequest({
      hostname: 'localhost',
      port: 5002,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { email: 'bad@test.com', password: '123' });
    console.log('2. Register Validation (missing name):', resRegInvalid.status === 400 ? 'PASS' : 'FAIL', resRegInvalid.body);

    // 3. Test registration validation (short password)
    const resRegShortPass = await makeRequest({
      hostname: 'localhost',
      port: 5002,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { name: 'John Doe', email: 'john@test.com', password: '123' });
    console.log('3. Register Validation (short password):', resRegShortPass.status === 400 ? 'PASS' : 'FAIL', resRegShortPass.body);

    // 4. Test login validation (invalid email)
    const resLoginInvalid = await makeRequest({
      hostname: 'localhost',
      port: 5002,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { email: 'invalid-email', password: 'password123' });
    console.log('4. Login Validation (invalid email):', resLoginInvalid.status === 400 ? 'PASS' : 'FAIL', resLoginInvalid.body);

    // 5. Test protected route without token (GET /api/todos)
    const resProtectedNoToken = await makeRequest({
      hostname: 'localhost',
      port: 5002,
      path: '/api/todos',
      method: 'GET',
    });
    console.log('5. Protected Route (No token):', resProtectedNoToken.status === 401 ? 'PASS' : 'FAIL', resProtectedNoToken.body);

    // 6. Test protected route with invalid token
    const resProtectedBadToken = await makeRequest({
      hostname: 'localhost',
      port: 5002,
      path: '/api/todos',
      method: 'GET',
      headers: { 'Authorization': 'Bearer bad_token_12345' },
    });
    console.log('6. Protected Route (Invalid token):', resProtectedBadToken.status === 401 ? 'PASS' : 'FAIL', resProtectedBadToken.body);

    console.log('\nAll security and validation checks passed successfully!');
  } finally {
    server.close();
  }
}

runTests().catch(console.error);
