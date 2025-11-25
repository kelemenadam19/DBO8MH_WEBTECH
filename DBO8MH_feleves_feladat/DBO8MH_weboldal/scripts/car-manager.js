class CarManager {
    constructor() {
        this.cars = [];
        this.baseUrl = 'http://localhost:8080';
        this.init();
    }
   // Inicializálja a felületet: betölti az autókat és eseményfigyelőket állít be.
    init() {
        this.loadCars();
        this.setupEventListeners();
    }
    // Betölti a szerverről az autókat és frissíti a megjelenítést.
    loadCars() {
        $.ajax({
            url: `${this.baseUrl}/api/cars`,
            method: 'GET',
            success: (data) => {
                this.cars = data;
                this.displayCars(data);
                this.updateStatistics(data);
            },
            error: (xhr, status, error) => {
                console.error('Error loading cars:', error);
                $('#carList').html('<div class="alert alert-danger">Hiba történt az autók betöltése során.</div>');
            }
        });
    }
   // Megjeleníti az autók listáját a felületen.
    displayCars(cars) {
        const carList = $('#carList');
        carList.empty();

        if (cars.length === 0) {
            carList.html('<div class="alert alert-info">Nincsenek autók a listában.</div>');
            return;
        }

        cars.forEach(car => {
            const carCard = this.createCarCard(car);
            carList.append(carCard);
        });

        $('.car-card').hide().fadeIn(800);
    }
  // Létrehoz egy kártyát az oldalon az adott autó adataiból.
    createCarCard(car) {
        const imageSrc = car.image ? `data:image/jpeg;base64,${car.image}` : 'https://via.placeholder.com/300x200?text=Nincs+kép';
        
        return `
            <div class="col-md-4 mb-4 fade-in">
                <div class="card car-card h-100">
                    <img src="${imageSrc}" class="card-img-top car-image" alt="${car.brand} ${car.name}">
                    <div class="card-body">
                        <h5 class="card-title">${car.brand} ${car.name}</h5>
                        <p class="card-text">
                            <strong>Évjárat:</strong> ${car.manufacture_year || 'N/A'}<br>
                            <strong>Lóerő:</strong> ${car.horsepower || 'N/A'} HP<br>
                            <strong>Szín:</strong> ${car.color || 'N/A'}<br>
                            <strong>Ár:</strong> ${car.price ? `${car.price.toLocaleString()}Ft` : 'N/A'}
                        </p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">ID: ${car.id}</small>
                        <button class="btn btn-sm btn-outline-info view-details" data-id="${car.id}">
                            <i class="fas fa-info-circle"></i> Részletek
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    // Új autót ad az adatbázishoz (POST)
    addCar(carData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.baseUrl}/api/cars`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(carData),
                success: (response) => {
                    resolve(response);
                },
                error: (xhr, status, error) => {
                    reject({xhr, status, error});
                }
            });
        });
    }
    // Frissíti az adott ID-jű autó adatait (PUT)
    updateCar(carId, carData) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.baseUrl}/api/cars/${carId}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(carData),
                success: (response) => {
                    resolve(response);
                },
                error: (xhr, status, error) => {
                    reject({xhr, status, error});
                }
            });
        });
    }
  // Törli az adott ID-jű autót (DELETE)
    deleteCar(carId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.baseUrl}/api/cars/${carId}`,
                method: 'DELETE',
                success: (response) => {
                    resolve(response);
                },
                error: (xhr, status, error) => {
                    reject({xhr, status, error});
                }
            });
        });
    }
     //Megadott ID-jű autó adatait kéri le
    getCarDetails(carId) {
        $.ajax({
            url: `${this.baseUrl}/api/cars/${carId}`,
            method: 'GET',
            success: (car) => {
                this.showCarDetailsModal(car);
            },
            error: (xhr, status, error) => {
                console.error('Error fetching car details:', error);
                alert('Hiba történt az autó részleteinek betöltése során.');
            }
        });
    }
 // Megjeleníti a részletes autóadatokat tartalmazó modal ablakot.
    showCarDetailsModal(car) {
        const imageSrc = car.image ? `data:image/jpeg;base64,${car.image}` : 'https://via.placeholder.com/500x300?text=Nincs+kép';
        
        const modalHtml = `
            <div class="modal fade" id="carDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${car.brand} ${car.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${imageSrc}" class="img-fluid rounded mb-3" alt="${car.brand} ${car.name}">
                                </div>
                                <div class="col-md-6">
                                    <h6>Alapadatok</h6>
                                    <ul class="list-unstyled">
                                        <li><strong>Márka:</strong> ${car.brand}</li>
                                        <li><strong>Modell:</strong> ${car.name}</li>
                                        <li><strong>Évjárat:</strong> ${car.manufacture_year || 'N/A'}</li>
                                        <li><strong>Lóerő:</strong> ${car.horsepower || 'N/A'} HP</li>
                                        <li><strong>Szín:</strong> ${car.color || 'N/A'}</li>
                                        <li><strong>Ár:</strong> ${car.price ? `${car.price.toLocaleString()} Ft` : 'N/A'}</li>
                                        <li><strong>Hozzáadva:</strong> ${new Date(car.created_at).toLocaleDateString('hu-HU')}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-12">
                                    <div class="btn-group w-100" role="group">
                                        <button type="button" class="btn btn-warning edit-car" data-id="${car.id}">
                                            <i class="fas fa-edit"></i> Módosítás
                                        </button>
                                        <button type="button" class="btn btn-danger delete-car" data-id="${car.id}">
                                            <i class="fas fa-trash"></i> Törlés
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#carDetailsModal').remove();
        
        $('body').append(modalHtml);
        $('#carDetailsModal').modal('show');
        

        this.setupModalEventListeners(car);
        
        $('#carDetailsModal').on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }

    // modal gombokat jeleníti meg
    setupModalEventListeners(car) {

        $('.edit-car').click(() => {
            $('#carDetailsModal').modal('hide');
            setTimeout(() => {
                this.showEditModal(car);
            }, 500);
        });


        
        $('.delete-car').click(() => {
            if (confirm(`Biztosan törölni szeretné a(z) ${car.brand} ${car.name} autót?`)) {
                this.deleteCar(car.id)
                    .then((response) => {
                        alert('Autó sikeresen törölve!');
                        $('#carDetailsModal').modal('hide');
                        this.loadCars(); 
                    })
                    .catch((error) => {
                        console.error('Error deleting car:', error);
                        alert('Hiba történt az autó törlése során: ' + 
                              (error.xhr.responseJSON?.error || error.error));
                    });
            }
        });
    }
    //megnyitja a modalt
    showEditModal(car) {
        const modalHtml = `
            <div class="modal fade" id="editCarModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Autó módosítása</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editCarForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editBrand" class="form-label">Márka *</label>
                                            <input type="text" class="form-control" id="editBrand" 
                                                   value="${car.brand}" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editName" class="form-label">Modell *</label>
                                            <input type="text" class="form-control" id="editName" 
                                                   value="${car.name}" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="editManufactureYear" class="form-label">Gyártási év</label>
                                            <input type="number" class="form-control" id="editManufactureYear" 
                                                   value="${car.manufacture_year || ''}" min="1900" max="2025">
                                        </div>
                                        <div class="mb-3">
                                            <label for="editHorsepower" class="form-label">Lóerő (HP)</label>
                                            <input type="number" class="form-control" id="editHorsepower" 
                                                   value="${car.horsepower || ''}" min="10" max="20000">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editColor" class="form-label">Szín</label>
                                            <input type="text" class="form-control" id="editColor" 
                                                   value="${car.color || ''}">
                                        </div>
                                        <div class="mb-3">
                                            <label for="editPrice" class="form-label">Ár (Ft)</label>
                                            <input type="number" class="form-control" id="editPrice" 
                                                   value="${car.price || ''}" min="0" step="0.01">
                                        </div>
                                        <div class="mb-3">
                                            <label for="editImage" class="form-label">Kép cseréje</label>
                                            <input type="file" class="form-control" id="editImage" accept="image/*">
                                            <div class="form-text">Ha nem választ ki új képet, a régi marad.</div>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" id="editImageData">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                            <button type="button" class="btn btn-primary" id="saveEditBtn">Mentés</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#editCarModal').remove();
        $('body').append(modalHtml);
        $('#editCarModal').modal('show');


        $('#editImage').on('change', this.handleImageUpload.bind(this));


        $('#saveEditBtn').click(() => {
            this.handleEditSubmit(car.id);
        });

        $('#editCarModal').on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }
    //Betölti a képet, és Base64 formátumba alakítja hogy a DB fel tudja dolgozni
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('A kép mérete nem haladhatja meg az 5MB-ot!');
                $(e.target).val('');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result.split(',')[1];
                $('#editImageData').val(base64);
            };
            reader.readAsDataURL(file);
        }
    }
    // Elküldi a szerkesztett adatokat a szervernek
    handleEditSubmit(carId) {
        const formData = {
            brand: $('#editBrand').val().trim(),
            name: $('#editName').val().trim(),
            manufacture_year: $('#editManufactureYear').val() ? parseInt($('#editManufactureYear').val()) : null,
            horsepower: $('#editHorsepower').val() ? parseInt($('#editHorsepower').val()) : null,
            color: $('#editColor').val().trim() || null,
            price: $('#editPrice').val() ? parseFloat($('#editPrice').val()) : null,
            image: $('#editImageData').val() || undefined 
        };

        if (!formData.brand || !formData.name) {
            alert('A márka és modell megadása kötelező!');
            return;
        }

        const saveBtn = $('#saveEditBtn');
        const originalText = saveBtn.html();
        saveBtn.html('<i class="fas fa-spinner fa-spin"></i> Mentés...').prop('disabled', true);

        this.updateCar(carId, formData)
            .then((response) => {
                alert('Autó sikeresen módosítva!');
                $('#editCarModal').modal('hide');
                this.loadCars();
            })
            .catch((error) => {
                console.error('Error updating car:', error);
                alert('Hiba történt az autó módosítása során: ' + 
                      (error.xhr.responseJSON?.error || error.error));
                saveBtn.html(originalText).prop('disabled', false);
            });
    }
    // Frissíti a statisztikákat (darabszám, átlagár etc...)
    updateStatistics(cars) {
        $('#totalCars').text(cars.length);
        
        const prices = cars.filter(car => car.price).map(car => car.price);
        const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(0) : 0;
        $('#avgPrice').text(avgPrice.toLocaleString() + ' Ft');
        
        const horsepowers = cars.filter(car => car.horsepower).map(car => car.horsepower);
        const avgHorsepower = horsepowers.length ? (horsepowers.reduce((a, b) => a + b, 0) / horsepowers.length).toFixed(0) : 0;
        $('#avgHorsepower').text(avgHorsepower);
        
        const years = cars.filter(car => car.manufacture_year).map(car => car.manufacture_year);
        const newestYear = years.length ? Math.max(...years) : 0;
        $('#newestYear').text(newestYear);
    }
    // A kereséshez, rendezéshez és részletek megnyitásához adja hozzá az event listenereket
    setupEventListeners() {
        $('#searchInput').on('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredCars = this.cars.filter(car => 
                car.brand.toLowerCase().includes(searchTerm) ||
                car.name.toLowerCase().includes(searchTerm) ||
                (car.color && car.color.toLowerCase().includes(searchTerm))
            );
            this.displayCars(filteredCars);
        });

        $('#sortSelect').on('change', (e) => {
            const sortBy = e.target.value;
            const sortedCars = [...this.cars].sort((a, b) => {
                switch(sortBy) {
                    case 'price_asc':
                        return (a.price || 0) - (b.price || 0);
                    case 'price_desc':
                        return (b.price || 0) - (a.price || 0);
                    case 'year_desc':
                        return (b.manufacture_year || 0) - (a.manufacture_year || 0);
                    case 'name_asc':
                        return (a.brand + a.name).localeCompare(b.brand + b.name);
                    default:
                        return 0;
                }
            });
            this.displayCars(sortedCars);
        });

        $(document).on('click', '.view-details', (e) => {
            const carId = $(e.target).closest('.view-details').data('id');
            this.getCarDetails(carId);
        });
    }
}

class JSONManager {
     // Betölti az autókat JSON formában, és megcsinálja a statisztikákat
    static loadJSONData() {
        return new Promise((resolve) => {
            $.ajax({
                url: 'http://localhost:8080/api/cars',
                method: 'GET',
                success: (cars) => {
                    const jsonData = {
                        "cars": cars.map(car => ({
                            "id": car.id,
                            "brand": car.brand,
                            "name": car.name,
                            "manufacture_year": car.manufacture_year,
                            "horsepower": car.horsepower,
                            "color": car.color,
                            "price": car.price,
                        })),
                        "statistics": {
                            "total_cars": cars.length,
                            "average_price": cars.reduce((sum, car) => sum + (car.price || 0), 0) / cars.filter(car => car.price).length || 0,
                            "most_common_color": this.getMostCommonColor(cars)
                        }
                    };
                    resolve(jsonData);
                },
                error: (xhr, status, error) => {
                    console.error('Error loading JSON data:', error);
                    resolve(this.getSampleData());
                }
            });
        });
    }
 // Meghatározza a leggyakrabban előforduló autószínt.
    static getMostCommonColor(cars) {
        const colorCount = {};
        cars.forEach(car => {
            if (car.color) {
                colorCount[car.color] = (colorCount[car.color] || 0) + 1;
            }
        });
        
        const mostCommon = Object.keys(colorCount).reduce((a, b) => 
            colorCount[a] > colorCount[b] ? a : b, 'N/A'
        );
        return mostCommon;
    }
 // Ha nincs adat a szerverrő, akkor "default" értékként ezt a Camry-t fogja betölteni
    static getSampleData() {
        return {
            "cars": [
                {
                    "id": 1,
                    "brand": "Toyota",
                    "name": "Camry",
                    "manufacture_year": 2023,
                    "horsepower": 203,
                    "color": "Fehér",
                    "price": 28500,
                }
            ],
            "statistics": {
                "total_cars": 1,
                "average_price": 28500,
                "most_common_color": "Fehér"
            }
        };
    }
 // Betölti és megjeleníti a JSON adatokat egy adott konténerben.
    static async displayJSONData(containerId) {
        const data = await this.loadJSONData();
        const container = $(`#${containerId}`);
        
        let html = '<div class="row">';
        
        data.cars.forEach(car => {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${car.brand} ${car.name}</h5>
                            <p class="card-text">
                                <strong>Évjárat:</strong> ${car.manufacture_year || 'N/A'}<br>
                                <strong>Lóerő:</strong> ${car.horsepower || 'N/A'} HP<br>
                                <strong>Szín:</strong> ${car.color || 'N/A'}<br>
                                <strong>Ár:</strong> ${car.price ? `${car.price.toLocaleString()} Ft` : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        html += `
            <div class="mt-4 p-3 bg-light rounded">
                <h4>Statisztikák</h4>
                <div class="row">
                    <div class="col-md-4">
                        <strong>Összes autó:</strong> ${data.statistics.total_cars}
                    </div>
                    <div class="col-md-4">
                        <strong>Átlagár:</strong> ${Math.round(data.statistics.average_price).toLocaleString()} Ft
                    </div>
                    <div class="col-md-4">
                        <strong>Leggyakoribb szín:</strong> ${data.statistics.most_common_color}
                    </div>
                </div>
            </div>
        `;
        
        container.html(html);
        //animáció
        
        container.find('.card').hide().each(function(i) {
            $(this).delay(i * 300).slideDown(600);
        });
    }
}