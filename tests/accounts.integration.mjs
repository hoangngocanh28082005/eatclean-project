// Requires local API, SQL Server Windows Authentication and local email mode.
// Creates isolated test accounts, then removes only their own test records.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readdir, readFile, unlink } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const base = 'http://localhost:5050'
const mailDirectory = fileURLToPath(new URL('../server/OffiMeal.Api/App_Data/mail/', import.meta.url))
const suffix = `${Date.now()}-${process.pid}`
const emails = [`accounts-a-${suffix}@example.test`, `accounts-b-${suffix}@example.test`]
const password = 'OffiMeal-Test-Initial-2026!'
const nextPassword = 'OffiMeal-Test-Replaced-2026!'
const sql = query => execFileSync('sqlcmd', ['-S', process.env.OFFIMEAL_TEST_SERVER ?? 'DESKTOP-V2J7BSI', '-E', '-C', '-d', 'OffiMealDB', '-b', '-Q', `SET NOCOUNT ON; SET QUOTED_IDENTIFIER ON; ${query}`], { encoding: 'utf8' })
const quote = text => "N'" + text.replaceAll("'", "''") + "'"
const scoped = `SELECT UserId FROM dbo.Users WHERE Email IN (${emails.map(quote).join(',')})`

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
async function tokenFor(email, purpose) {
  for (const name of await readdir(mailDirectory)) {
    const mail = JSON.parse(await readFile(path.join(mailDirectory, name), 'utf8'))
    if (mail.to === email && mail.purpose === purpose) return new URLSearchParams(new URL(mail.link).hash.slice(1)).get('token')
  }
  throw new Error('Expected local test email was not written')
}
async function expect(request, route, method, body, status) {
  const result = await request(route, method, body)
  assert.equal(result.status, status, `${method} ${route} returned ${result.status}; expected ${status}`)
  return result.data
}

const a = client(), b = client(), anonymous = client()
try {
  assert.equal((await anonymous('/api/health')).status, 200)
  assert.equal((await anonymous('/api/auth/delivery-mode')).data.localMail, true, 'Run in local mail mode')
  assert.equal((await anonymous('/api/auth/register', 'POST', { fullName: 'CSRF' }, { csrf: false })).status, 400)
  await expect(anonymous, '/api/account/me', 'GET', null, 401)
  await expect(anonymous, '/api/admin/access', 'GET', null, 401)
  await expect(a, '/api/auth/register', 'POST', { fullName: 'Invalid', email: 'bad', password: 'short', confirmPassword: 'different' }, 400)
  for (const [index, request] of [a, b].entries()) {
    await expect(request, '/api/auth/register', 'POST', { fullName: `OffiMeal Integration ${index}`, email: emails[index], password, confirmPassword: password, role: 'Admin' }, 201)
    const user = await expect(request, '/api/auth/login', 'POST', { email: emails[index], password }, 200)
    assert.equal(user.role, 'Customer', 'Registration must ignore a forged admin role')
    assert.equal(user.emailConfirmed, false)
  }
  await expect(a, '/api/auth/register', 'POST', { fullName: 'Duplicate', email: emails[0].toUpperCase(), password, confirmPassword: password }, 409)
  await expect(a, '/api/admin/access', 'GET', null, 403)
  await expect(a, '/api/auth/resend-verification', 'POST', {}, 429)
  const address = { recipientName: 'Integration Recipient', recipientPhone: '0901234567', addressLine: '123 Test', city: 'Test City', isDefault: true }
  await expect(a, '/api/account/addresses', 'POST', address, 403)
  for (const [index, request] of [a, b].entries()) {
    const token = await tokenFor(emails[index], 'verify')
    await expect(request, '/api/auth/verify-email', 'POST', { token }, 200)
    await expect(request, '/api/auth/verify-email', 'POST', { token }, 400)
    assert.equal((await expect(request, '/api/account/me', 'GET', null, 200)).emailConfirmed, true)
  }
  const saved = await expect(a, '/api/account/addresses', 'POST', address, 200)
  await expect(b, `/api/account/addresses/${saved.addressId}`, 'PUT', address, 404)
  await expect(b, `/api/account/addresses/${saved.addressId}`, 'DELETE', null, 404)
  assert.deepEqual(await expect(b, '/api/account/addresses', 'GET', null, 200), [])
  await expect(a, `/api/account/addresses/${saved.addressId}`, 'PUT', { ...address, addressLine: '456 Test' }, 200)
  await expect(a, '/api/account/me', 'PUT', { fullName: 'Updated Test Name', phone: '0901234567', role: 'Admin' }, 200)
  assert.equal((await expect(a, '/api/account/me', 'GET', null, 200)).role, 'Customer')
  sql(`INSERT INTO dbo.Orders(UserId, AddressId, DeliveryDate, TotalAmount) SELECT UserId, ${saved.addressId}, CAST(GETDATE() AS date), 70000 FROM dbo.Users WHERE Email = ${quote(emails[0])};`)
  assert.equal((await expect(a, '/api/account/orders', 'GET', null, 200)).length, 1)
  assert.equal((await expect(b, '/api/account/orders', 'GET', null, 200)).length, 0)
  await expect(a, `/api/account/addresses/${saved.addressId}`, 'DELETE', null, 409)
  sql(`UPDATE dbo.Users SET Role=N'Admin' WHERE Email=${quote(emails[0])};`)
  await expect(a, '/api/admin/access', 'GET', null, 200)
  sql(`UPDATE dbo.Users SET Role=N'Customer' WHERE Email=${quote(emails[0])};`)
  await expect(a, '/api/admin/access', 'GET', null, 403)
  console.log('PASS: registration, duplicate email, CSRF, verification/replay/cooldown, ownership, verified-only writes, role checks, orders')

  await expect(a, '/api/account/change-password', 'POST', { currentPassword: 'incorrect', password: nextPassword, confirmPassword: nextPassword }, 400)
  const oldSession = client()
  await expect(oldSession, '/api/auth/login', 'POST', { email: emails[0], password }, 200)
  await expect(a, '/api/account/change-password', 'POST', { currentPassword: password, password: nextPassword, confirmPassword: nextPassword }, 200)
  await expect(oldSession, '/api/account/me', 'GET', null, 401)
  await expect(a, '/api/auth/login', 'POST', { email: emails[0], password }, 401)
  await expect(a, '/api/auth/login', 'POST', { email: emails[0], password: nextPassword }, 200)
  await expect(a, '/api/auth/forgot-password', 'POST', { email: emails[0] }, 200)
  const resetToken = await tokenFor(emails[0], 'reset')
  sql(`UPDATE dbo.AccountTokens SET ExpiresAt=DATEADD(second,-1,SYSUTCDATETIME()) WHERE Purpose='reset' AND UserId IN (${scoped});`)
  await expect(a, '/api/auth/reset-password', 'POST', { token: resetToken, password, confirmPassword: password }, 400)
  sql(`UPDATE dbo.AccountTokens SET ExpiresAt=DATEADD(minute,30,SYSUTCDATETIME()) WHERE Purpose='reset' AND UserId IN (${scoped});`)
  await expect(a, '/api/auth/reset-password', 'POST', { token: resetToken, password, confirmPassword: password }, 200)
  await expect(a, '/api/auth/reset-password', 'POST', { token: resetToken, password, confirmPassword: password }, 400)
  await expect(a, '/api/account/me', 'GET', null, 401)
  await expect(a, '/api/auth/login', 'POST', { email: emails[0], password }, 200)
  await expect(a, '/api/auth/logout', 'POST', {}, 200)
  await expect(a, '/api/account/me', 'GET', null, 401)
  console.log('PASS: password verification, change, expired/reset/replayed tokens, revoked sessions and logout')
  let limited = false
  for (let i = 0; i < 31; i++) {
    const result = await anonymous('/api/auth/login', 'POST', { email: 'invalid', password: '' })
    if (result.status === 429) { limited = true; break }
  }
  assert.ok(limited, 'Account endpoints must enforce their request rate limit')
  console.log('PASS: request rate limiting')
} finally {
  sql(`BEGIN TRANSACTION; DELETE FROM dbo.Orders WHERE UserId IN (${scoped}); DELETE FROM dbo.DeliveryAddresses WHERE UserId IN (${scoped}); DELETE FROM dbo.AccountTokens WHERE UserId IN (${scoped}); DELETE FROM dbo.Users WHERE Email IN (${emails.map(quote).join(',')}); COMMIT;`)
  for (const name of await readdir(mailDirectory).catch(() => [])) {
    const fullPath = path.join(mailDirectory, name)
    const mail = JSON.parse(await readFile(fullPath, 'utf8'))
    if (emails.includes(mail.to)) await unlink(fullPath)
  }
}
