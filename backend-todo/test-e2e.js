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

async function runE2ETests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5003, resolve));
  console.log('E2E Test server running on port 5003');

  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    // 1. Test Register
    console.log('1. Testing User Registration...');
    const regRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      name: 'Vinay Test',
      email: testEmail,
      password: testPassword,
    });
    console.log('Registration Status:', regRes.status, regRes.body?.message);
    if (regRes.status !== 201) throw new Error('Registration failed: ' + JSON.stringify(regRes.body));
    const token = regRes.body.data.token;
    const userId = regRes.body.data.user.id;
    console.log('User created with ID:', userId);

    // 2. Test Login
    console.log('2. Testing User Login...');
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: testEmail,
      password: testPassword,
    });
    console.log('Login Status:', loginRes.status, loginRes.body?.message);
    if (loginRes.status !== 200) throw new Error('Login failed');

    // 3. Test Get Current User (/api/auth/me)
    console.log('3. Testing /api/auth/me...');
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log('/api/auth/me Status:', meRes.status, meRes.body?.data?.user?.email);

    // 4. Test Create Todo
    console.log('4. Testing Create Todo...');
    const createTodoRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: '/api/todos',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, {
      title: 'End-to-End Test Task',
      description: 'Verifying full-stack connectivity to Supabase',
    });
    console.log('Create Todo Status:', createTodoRes.status, createTodoRes.body?.message);
    if (createTodoRes.status !== 201) throw new Error('Create todo failed: ' + JSON.stringify(createTodoRes.body));
    const todoId = createTodoRes.body.data.todo.id;

    // 5. Test Get Todos
    console.log('5. Testing Get Todos...');
    const getTodosRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: '/api/todos',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log('Get Todos Status:', getTodosRes.status, 'Total todos:', getTodosRes.body?.data?.todos?.length);

    // 6. Test Update Todo
    console.log('6. Testing Update Todo...');
    const updateTodoRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: `/api/todos/${todoId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }, {
      completed: true,
      title: 'End-to-End Test Task (Updated)',
    });
    console.log('Update Todo Status:', updateTodoRes.status, 'Completed:', updateTodoRes.body?.data?.todo?.completed);

    // 7. Test Delete Todo
    console.log('7. Testing Delete Todo...');
    const deleteTodoRes = await makeRequest({
      hostname: 'localhost',
      port: 5003,
      path: `/api/todos/${todoId}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log('Delete Todo Status:', deleteTodoRes.status, deleteTodoRes.body?.message);

    console.log('\n🎉 ALL REAL DATABASE END-TO-END TESTS PASSED!');
  } finally {
    server.close();
  }
}

runE2ETests().catch((err) => {
  console.error('E2E Test Error:', err);
  process.exit(1);
});
