const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Car Management API',
            version: '1.0.0',
            description: 'API for managing car inventory with SQLite database',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Car: {
                    type: 'object',
                    required: ['brand', 'name'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Auto-generated car ID'
                        },
                        brand: {
                            type: 'string',
                            description: 'Car manufacturer brand',
                            example: 'Toyota'
                        },
                        name: {
                            type: 'string',
                            description: 'Car model name',
                            example: 'Camry'
                        },
                        manufacture_year: {
                            type: 'integer',
                            description: 'Year of manufacture',
                            example: 2022
                        },
                        horsepower: {
                            type: 'integer',
                            description: 'Engine horsepower',
                            example: 203
                        },
                        image: {
                            type: 'string',
                            description: 'Base64 encoded image',
                            format: 'byte'
                        },
                        color: {
                            type: 'string',
                            description: 'Car color',
                            example: 'Black'
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            description: 'Price in USD',
                            example: 28500.00
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                }
            }
        }
    },
    apis: ['./server.js'] // fájl, ahol a JSDoc kommentek vannak
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const db = new sqlite3.Database('./cars.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite: ' + err.message);
        return;
    }
    console.log('Connected to SQLite database');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    manufacture_year INTEGER,
    horsepower INTEGER,
    image BLOB,
    color TEXT,
    price DECIMAL(10, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.get('/api/cars', (req, res) => {
    const query = 'SELECT * FROM cars ORDER BY created_at DESC';
    db.all(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching cars: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const carsWithBase64Images = results.map(car => ({
            ...car,
            image: car.image ? car.image.toString('base64') : null,
        }));

        res.json(carsWithBase64Images);
    });
});



app.get('/api/cars/:id', (req, res) => {
    const carId = req.params.id;
    const query = 'SELECT * FROM cars WHERE id = ?';

    db.get(query, [carId], (err, car) => {
        if (err) {
            console.error('Error fetching car: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }

        const carWithBase64Image = {
            ...car,
            image: car.image ? car.image.toString('base64') : null,
        };

        res.json(carWithBase64Image);
    });
});



app.get('/api/cars/brand/:brand', (req, res) => {
    const brand = req.params.brand;
    const query = 'SELECT * FROM cars WHERE brand = ?';

    db.all(query, [brand], (err, results) => {
        if (err) {
            console.error('Error fetching cars by brand: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'No cars found for this brand' });
            return;
        }

        const carsWithBase64Images = results.map(car => ({
            ...car,
            image: car.image ? car.image.toString('base64') : null,
        }));

        res.json(carsWithBase64Images);
    });
});

app.post('/api/cars', (req, res) => {
    const { brand, name, manufacture_year, horsepower, image, color, price } = req.body;

    if (!brand || !name) {
        return res.status(400).json({ error: 'Brand and name are required' });
    }

    const query = `INSERT INTO cars (brand, name, manufacture_year, horsepower, image, color, price) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    let imageBuffer = null;
    if (image) {
        imageBuffer = Buffer.from(image, 'base64');
    }

    db.run(query, [brand, name, manufacture_year, horsepower, imageBuffer, color, price], function (err) {
        if (err) {
            console.error('Error creating car: ' + err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(201).json({
            message: 'Car created successfully',
            id: this.lastID
        });
    });
});


app.put('/api/cars/:id', (req, res) => {
    const carId = req.params.id;
    const { brand, name, manufacture_year, horsepower, image, color, price } = req.body;

    db.get('SELECT id FROM cars WHERE id = ?', [carId], (err, car) => {
        if (err) {
            console.error('Error checking car: ' + err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const query = `UPDATE cars 
                   SET brand = ?, name = ?, manufacture_year = ?, horsepower = ?, 
                       image = ?, color = ?, price = ? 
                   WHERE id = ?`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        db.run(query, [brand, name, manufacture_year, horsepower, imageBuffer, color, price, carId], function (err) {
            if (err) {
                console.error('Error updating car: ' + err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json({
                message: 'Car updated successfully',
                changes: this.changes
            });
        });
    });
});


app.delete('/api/cars/:id', (req, res) => {
    const carId = req.params.id;

    db.get('SELECT id FROM cars WHERE id = ?', [carId], (err, car) => {
        if (err) {
            console.error('Error checking car: ' + err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const query = 'DELETE FROM cars WHERE id = ?';

        db.run(query, [carId], function (err) {
            if (err) {
                console.error('Error deleting car: ' + err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json({
                message: 'Car deleted successfully',
                changes: this.changes
            });
        });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});