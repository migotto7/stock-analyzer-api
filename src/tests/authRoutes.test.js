import { jest } from '@jest/globals';
import request from 'supertest';

// Mock repository and utils modules to avoid DB and bcrypt operations
const mockFindUser = jest.fn();
const mockCreateUser = jest.fn();
const mockEncryptPassword = jest.fn();
const mockComparePassword = jest.fn();

await jest.unstable_mockModule('../repository/userRepository.js', () => ({
  findUser: mockFindUser,
  createUser: mockCreateUser,
}));

await jest.unstable_mockModule('../utils/userUtils.js', () => ({
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  encryptPassword: mockEncryptPassword,
  comparePassword: mockComparePassword,
}));

// Mock jwt to return a predictable token
await jest.unstable_mockModule('jsonwebtoken', () => ({
  // export both the named `sign` and a default-shaped object to satisfy different import styles
  sign: () => 'mocked-token',
  default: { sign: () => 'mocked-token' },
}));

const { default: app } = await import('../app.js');

describe('Auth routes', () => {
  beforeEach(() => {
    mockFindUser.mockReset();
    mockCreateUser.mockReset();
    mockEncryptPassword.mockReset();
    mockComparePassword.mockReset();
  });

  test('POST /api/auth/login - success', async () => {
    const user = { id: 1, email: 'test@example.com', password_hash: 'hashed' };
    mockFindUser.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'plain' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mocked-token');
    expect(res.body.user.email).toBe(user.email);
  });

  test('POST /api/auth/login - missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Email and password are required/);
  });

  test('POST /api/auth/register - success', async () => {
    const newUser = { id: 2, username: 'new', email: 'new@example.com' };
    mockFindUser.mockResolvedValue(null);
    mockEncryptPassword.mockResolvedValue('encrypted');
    mockCreateUser.mockResolvedValue(newUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: newUser.username, email: newUser.email, password: 'pwd' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBe('mocked-token');
    expect(res.body.newUser).toEqual(newUser);
  });

  test('POST /api/auth/register - email already exists', async () => {
    const existingUser = { id: 1, email: 'existing@example.com' };
    mockFindUser.mockResolvedValue(existingUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'new', email: existingUser.email, password: 'pwd' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email not valid');
  });

  test('POST /api/auth/login - invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: 'pwd' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email not valid');
  });

  test('POST /api/auth/login - user not found', async () => {
    mockFindUser.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'pwd' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User not found');
  });

  test('POST /api/auth/login - wrong password', async () => {
    const user = { email: 'test@example.com', password_hash: 'hashed' };
    mockFindUser.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'wrong' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('POST /api/auth/logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toBe('Logout bem suscedido');
  });
});
