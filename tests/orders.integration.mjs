// Requires local API and SQL Server Windows Authentication.
// Creates isolated test accounts, then removes only their own test records.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const base = 'http://localhost:5050'
const suffix = `${Date.now()}-${process.pid}`
const emails = [`orders-a-${suffix}@example.test`, `orders-b-${suffix}@example.test`, `orders-admin-${suffix}@example.test`]
const password = 'OffiMeal-Test-Initial-2026!'
const sql = query => execFileSync('sqlcmd', ['-S', process.env.OFFIMEAL_TEST_SERVER ?? 'localhost', '-E', '-C', '-d', 'OffiMealDB', '-b', '-Q', `SET NOCOUNT ON; SET QUOTED_IDENTIFIER ON; ${query}`], { encoding: 'utf8' })
const quote = text => "N'" + text.replaceAll("'", "''") + "'"
const scoped = `SELECT UserId FROM dbo.Users WHERE Email IN (${emails.map(quote).join(',')})`
const dayFromNow = days => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

function client() {
  const cookies = new Map()
  async function request(route, method = 'GET', body, { csrf = true } = {}) {
    const headers = { Cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join('; ') }
    if (method !== 'GET' && csrf) {
      const result = await request('/api/auth/csrf')
      headers['X-CSRF-TOKEN'] = result.data.token
      headers.Cookie = [...cookies].map(([key, value]) => `${key}=${value}`).join('; ')
    }
    if (body) headers['Content-Type'] = 'application/json'
    const response = await fetch(base + route, { method, headers, body: body ? JSON.stringify(body) : undefined })
    for (const raw of response.headers.getSetCookie()) {
      const first = raw.split(';')[0]
      const index = first.indexOf('=')
      cookies.set(first.slice(0, index), first.slice(index + 1))
    }
    const data = await response.json().catch(() => null)
    return { status: response.status, data }
  }
  return request
}
async function expect(request, route, method, body, status) {
  const result = await request(route, method, body)
  assert.equal(result.status, status, `${method} ${route} returned ${result.status}; expected ${status}: ${JSON.stringify(result.data)}`)
  return result.data
}
async function signIn(email, role) {
  const request = client()
  await expect(request, '/api/auth/register', 'POST', { fullName: 'OffiMeal Orders Test', email, password, confirmPassword: password }, 201)
  sql(`UPDATE dbo.Users SET EmailConfirmed = 1, Role = ${quote(role)} WHERE Email = ${quote(email)};`)
  await expect(request, '/api/auth/login', 'POST', { email, password }, 200)
  return request
}

try {
  const anonymous = client()
  const meals = await expect(anonymous, '/api/meals', 'GET', undefined, 200)
  const packages = await expect(anonymous, '/api/packages', 'GET', undefined, 200)
  assert.ok(meals.length > 0, 'Run server/sql/002_catalog_orders.sql first')
  assert.deepEqual(packages.map(item => [item.mealCount, item.price]), [[5, 350000], [20, 1300000]])
  await expect(anonymous, `/api/meals/${meals[0].id}`, 'GET', undefined, 200)
  await expect(anonymous, '/api/orders', 'GET', undefined, 401)

  const a = await signIn(emails[0], 'Customer')
  const b = await signIn(emails[1], 'Customer')
  const admin = await signIn(emails[2], 'Admin')
  const address = await expect(a, '/api/account/addresses', 'POST', { recipientName: 'Test', recipientPhone: '0901234567', addressLine: '1 Test', city: 'Hà Nội', isDefault: true }, 201).catch(async () => (await expect(a, '/api/account/addresses', 'GET', undefined, 200))[0])

  // Dang ky goi: can CSRF, khong tao trung, khong nhan ngay qua khu
  assert.equal((await a('/api/subscriptions', 'POST', { packageId: 1, startDate: dayFromNow(0) }, { csrf: false })).status, 400)
  await expect(a, '/api/subscriptions', 'POST', { packageId: 1, startDate: dayFromNow(-1) }, 400)
  const created = await expect(a, '/api/subscriptions', 'POST', { packageId: 1, startDate: dayFromNow(0) }, 200)
  assert.equal(created.amount, 350000)
  await expect(a, '/api/subscriptions', 'POST', { packageId: 1, startDate: dayFromNow(0) }, 409)
  await expect(a, '/api/payments', 'POST', { subscriptionId: created.subscriptionId, paymentMethod: 'BankTransfer' }, 409)

  const order = { subscriptionId: created.subscriptionId, addressId: address.addressId, deliveryDate: dayFromNow(1), note: 'Test', items: [{ mealId: Number(meals[0].id), quantity: 1 }] }

  // Chua thanh toan thi chua dat bua; khach khong tu xac nhan duoc
  await expect(a, '/api/orders', 'POST', order, 400)
  await expect(a, `/api/payments/${created.paymentId}/confirm`, 'POST', {}, 403)
  await expect(a, '/api/payments/pending', 'GET', undefined, 403)
  const pending = await expect(admin, '/api/payments/pending', 'GET', undefined, 200)
  const listed = pending.find(item => item.paymentId === created.paymentId)
  assert.equal(listed.customerEmail, emails[0])
  assert.equal(listed.amount, 350000)
  assert.ok(listed.packageName)
  await expect(admin, `/api/payments/${created.paymentId}/confirm`, 'POST', { transactionCode: 'TEST' }, 200)
  await expect(admin, `/api/payments/${created.paymentId}/confirm`, 'POST', {}, 404)
  const remaining = await expect(admin, '/api/payments/pending', 'GET', undefined, 200)
  assert.ok(!remaining.some(item => item.paymentId === created.paymentId))
  await expect(a, '/api/payments', 'POST', { subscriptionId: created.subscriptionId, paymentMethod: 'BankTransfer' }, 400)

  // Dat bua: tru so bua, khong thu them tien, moi ngay mot don, trong thoi han goi
  await expect(a, '/api/orders', 'POST', { ...order, deliveryDate: dayFromNow(0) }, 400)
  await expect(a, '/api/orders', 'POST', { ...order, deliveryDate: dayFromNow(30) }, 400)
  await expect(a, '/api/orders', 'POST', { ...order, deliveryDate: dayFromNow(2), items: [{ mealId: Number(meals[0].id), quantity: 6 }] }, 400)
  assert.equal((await expect(a, '/api/orders', 'POST', order, 200)).remainingMeals, 4)
  await expect(a, '/api/orders', 'POST', order, 409)
  const subscription = await expect(a, `/api/subscriptions/${created.subscriptionId}`, 'GET', undefined, 200)
  assert.equal(subscription.status, 'Active')
  assert.equal(subscription.remainingMeals, 4, 'A rejected order must not consume meals')
  const [saved] = await expect(a, '/api/orders', 'GET', undefined, 200)
  assert.equal(saved.totalAmount, 0)
  assert.equal(saved.items[0].mealName, meals[0].name)

  // Xu ly don: chi admin, tung buoc mot; khach xac nhan don dang giao cua chinh minh
  const status = (id, value) => [`/api/orders/${id}/status`, 'PATCH', { status: value }]
  const received = id => [`/api/orders/${id}/received`, 'POST', undefined]
  const statusOf = async id => (await expect(a, `/api/orders/${id}`, 'GET', undefined, 200)).status
  await expect(a, '/api/orders/manage', 'GET', undefined, 403)
  await expect(a, ...status(saved.orderId, 'Confirmed'), 403)
  const managed = (await expect(admin, '/api/orders/manage', 'GET', undefined, 200)).find(item => item.orderId === saved.orderId)
  assert.equal(managed.customerEmail, emails[0])
  assert.equal(managed.items[0].mealName, meals[0].name)
  await expect(admin, ...status(saved.orderId, 'Preparing'), 400)
  await expect(admin, ...status(saved.orderId, 'Delivered'), 404)
  await expect(a, ...received(saved.orderId), 404)
  await expect(admin, ...status(saved.orderId, 'Confirmed'), 200)
  await expect(admin, ...status(saved.orderId, 'Confirmed'), 404)
  await expect(admin, ...status(saved.orderId, 'Delivering'), 200)
  await expect(b, ...received(saved.orderId), 404)
  await expect(a, ...received(saved.orderId), 200)
  await expect(a, ...received(saved.orderId), 404)
  assert.equal(await statusOf(saved.orderId), 'Delivered')

  // Khach quen bam nhan hang thi admin van dong duoc don, nhung chi tu ngay giao
  const second = await expect(a, '/api/orders', 'POST', { ...order, deliveryDate: dayFromNow(2) }, 200)
  await expect(admin, ...status(second.orderId, 'Confirmed'), 200)
  await expect(admin, ...status(second.orderId, 'Delivering'), 200)
  await expect(admin, ...status(second.orderId, 'Delivered'), 400)
  assert.equal(await statusOf(second.orderId), 'Delivering')
  sql(`UPDATE dbo.Orders SET DeliveryDate = ${quote(dayFromNow(0))} WHERE OrderId = ${second.orderId};`)
  await expect(admin, ...status(second.orderId, 'Delivered'), 200)
  assert.equal(await statusOf(second.orderId), 'Delivered')

  // Khong doc hoac dung du lieu cua nguoi khac
  await expect(b, `/api/subscriptions/${created.subscriptionId}`, 'GET', undefined, 404)
  await expect(b, `/api/orders/${saved.orderId}`, 'GET', undefined, 404)
  await expect(b, '/api/orders', 'POST', { ...order, deliveryDate: dayFromNow(2) }, 400)
  console.log('Orders integration passed.')
} finally {
  sql(`BEGIN TRANSACTION; DELETE FROM dbo.Payments WHERE UserId IN (${scoped}); DELETE FROM dbo.OrderDetails WHERE OrderId IN (SELECT OrderId FROM dbo.Orders WHERE UserId IN (${scoped})); DELETE FROM dbo.Orders WHERE UserId IN (${scoped}); DELETE FROM dbo.Subscriptions WHERE UserId IN (${scoped}); DELETE FROM dbo.DeliveryAddresses WHERE UserId IN (${scoped}); DELETE FROM dbo.AccountTokens WHERE UserId IN (${scoped}); DELETE FROM dbo.Users WHERE Email IN (${emails.map(quote).join(',')}); COMMIT;`)
}
