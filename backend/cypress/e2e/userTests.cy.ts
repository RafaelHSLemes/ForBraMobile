import request from 'supertest';
import app from '../../server';

describe('User Routes - End-to-End Tests', () => {
  it('Deve cadastrar um usuário com endereço residencial dos EUA', async () => {
    const res = await request(app).post('/api/users/register').send({
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: 'SecurePass123!',
      endereco: {
        rua: '123 Main St',
        cidade: 'Los Angeles',
        estado: 'CA',
        cep: '90001',
        pais: 'USA',
      },
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Usuário cadastrado com sucesso');
  });

  it('Deve retornar erro ao tentar cadastrar um usuário sem um campo obrigatório', async () => {
    const res = await request(app).post('/api/users/register').send({
      nome: 'Jane Doe',
      email: '', // Email ausente
      senha: 'SecurePass123!',
      endereco: {
        rua: '456 Elm St',
        cidade: 'New York',
        estado: 'NY',
        cep: '10001',
        pais: 'USA',
      },
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Todos os campos obrigatórios devem ser preenchidos.');
  });

  it('Deve permitir login de um usuário existente', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'johndoe@example.com',
      senha: 'SecurePass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Deve retornar erro ao tentar login com credenciais inválidas', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'johndoe@example.com',
      senha: 'WrongPass456!',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
  });

  it('Deve buscar informações do usuário logado', async () => {
    const loginRes = await request(app).post('/api/users/login').send({
      email: 'johndoe@example.com',
      senha: 'SecurePass123!',
    });

    const token = loginRes.body.token;
    
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nome', 'John Doe');
    expect(res.body.endereco).toEqual({
      rua: '123 Main St',
      cidade: 'Los Angeles',
      estado: 'CA',
      cep: '90001',
      pais: 'USA',
    });
  });
});