
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.init();
    }
 //inicializálás összegyűjti az űrlap mezőit, és mindegyikhez hozzáad egy blur és egy input eseménykezelőt.
    init() {

        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            this.fields[input.name] = input;
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        this.form.addEventListener('submit', (e) => this.validateForm(e));
    }
    //érvényesség ellenőrzése
    validateField(field) {
        this.clearError(field);
        
        let isValid = true;
        let errorMessage = '';
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ez a mező kötelező.';
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Érvényes email címet adjon meg.';
            }
        }
        if (field.type === 'number' && field.value) {
            if (isNaN(field.value) || Number(field.value) <= 0) {
                isValid = false;
                errorMessage = 'Érvényes számot adjon meg.';
            }
        }

        if (field.type === 'date' && field.value) {
            const selectedDate = new Date(field.value);
            const today = new Date();
            if (selectedDate > today) {
                isValid = false;
                errorMessage = 'A dátum nem lehet a jövőben.';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.showSuccess(field);
        }

        return isValid;
    }

    validateForm(e) {
        e.preventDefault();
        
        let isFormValid = true;
        Object.values(this.fields).forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.form.submit();
        } else {
            $(this.form).animate({ 
                marginLeft: '-=10px' 
            }, 100).animate({ 
                marginLeft: '+=20px' 
            }, 100).animate({ 
                marginLeft: '-=10px' 
            }, 100);
        }

        return isFormValid;
    }
    //metódus megjeleníti a hibaüzenetet és formázza a mezőt hibaként.
    showError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    //metódus eltávolítja a hibaüzenetet és formázza a mezőt sikeresként.
    showSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    //metódus eltávolítja a hiba stílusokat és üzenetet a mezőről.
    clearError(field) {
        field.classList.remove('error', 'success');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
}
//ellenőrzéseket végez a lóerő, gyártási év és ár mezőkre
class CarFormValidator extends FormValidator {
    validateField(field) {
        const baseValid = super.validateField(field);
        if (field.name === 'horsepower' && field.value) {
            const hp = parseInt(field.value);
            if (hp < 50 || hp > 2000) {
                this.showError(field, 'A lóerő 50 és 2000 között legyen.');
                return false;
            }
        }

        if (field.name === 'manufacture_year' && field.value) {
            const year = parseInt(field.value);
            const currentYear = new Date().getFullYear();
            if (year < 1900 || year > currentYear) {
                this.showError(field, `Az év 1900 és ${currentYear} között legyen.`);
                return false;
            }
        }

        if (field.name === 'price' && field.value) {
            const price = parseFloat(field.value);
            if (price < 0 || price > 100000000000) {
                this.showError(field, 'Az ár 0 és 100,000,000,000 között legyen.');
                return false;
            }
        }

        return baseValid;
    }
}