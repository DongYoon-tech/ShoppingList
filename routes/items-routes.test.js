process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');

let example = {
	name: 'Test',
	price: 9.99
};

beforeEach(function() {
	items.push(example);
});

afterEach(function() {
	items.length = 0;
});

describe('GET /items', function() {
	test('Gets a list of items', async function() {
		const resp = await request(app).get(`/items`);
		expect(resp.statusCode).toBe(200);

		expect(resp.body).toEqual([ example ]);
	});
});

describe('GET /items/:name', function() {
	test('Gets a single item', async function() {
		const resp = await request(app).get(`/items/${example.name}`);
		expect(resp.statusCode).toBe(200);

		expect(resp.body).toEqual(example);
	});

	test("Responds with 404 if can't find item", async function() {
		const resp = await request(app).get(`/items/0`);
		expect(resp.statusCode).toBe(404);
	});
});

describe('POST /items', function() {
	test('Creates a new item', async function() {
		const resp = await request(app).post(`/items`).send({
			name: 'Test2',
			price: 7.77
		});
		expect(resp.statusCode).toBe(201);
		expect(resp.body).toEqual({
			added: {
				name: 'Test2',
				price: 7.77
			}
		});
	});
});

describe('PATCH /items/:name', function() {
	test('Updates a single item', async function() {
		const resp = await request(app).patch(`/items/${example.name}`).send({
			name: 'Edited',
			price: 1.11
		});
		expect(resp.statusCode).toBe(200);
		expect(resp.body).toEqual({
			updated: {
				name: 'Edited',
				price: 1.11
			}
		});
	});

	test('Responds with 404 if id invalid', async function() {
		const resp = await request(app).patch(`/items/0`);
		expect(resp.statusCode).toBe(404);
	});
});

describe('DELETE /items/:name', function() {
	test('Deletes a single a item', async function() {
		const resp = await request(app).delete(`/items/${example.name}`);
		expect(resp.statusCode).toBe(200);
		expect(resp.body).toEqual({ message: 'Deleted' });
	});
});
