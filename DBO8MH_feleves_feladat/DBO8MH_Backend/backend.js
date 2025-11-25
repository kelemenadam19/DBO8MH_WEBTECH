const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));
app.use(cors({
    maxHeaderSize: 16384 
}));
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
});