// script.js

document.addEventListener('DOMContentLoaded', () => {
    const popupForm = document.getElementById('popupForm');
    const openFormBtn = document.getElementById('openForm');
    const closeFormBtn = document.getElementById('closeForm');
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('formMessage');

    // Показ и скрытие формы с использованием History API
    const showForm = () => {
        popupForm.classList.remove('hidden');
        history.pushState({ form: true }, '', '#form');
    };

    const hideForm = () => {
        popupForm.classList.add('hidden');
        history.back();
    };

    openFormBtn.addEventListener('click', showForm);
    closeFormBtn.addEventListener('click', hideForm);

    window.addEventListener('popstate', () => {
        if (!popupForm.classList.contains('hidden')) {
            popupForm.classList.add('hidden');
        }
    });

    // Загрузка сохраненных данных
    const loadFormData = () => {
        const savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = savedData[key];
            });
        }
    };

    loadFormData();

    // Сохранение данных в LocalStorage
    const saveFormData = () => {
        const formData = Object.fromEntries(new FormData(feedbackForm));
        localStorage.setItem('formData', JSON.stringify(formData));
    };

    // Отправка формы
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveFormData();

        const formData = new FormData(feedbackForm);
        try {
            const response = await fetch('https://formcarry.com/s/YOUR_FORMCARRY_URL', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                formMessage.textContent = 'Форма успешно отправлена!';
                formMessage.style.color = 'green';
                localStorage.removeItem('formData');
                feedbackForm.reset();
            } else {
                formMessage.textContent = 'Ошибка при отправке. Попробуйте снова.';
            }
        } catch (error) {
            formMessage.textContent = 'Ошибка сети. Попробуйте снова.';
        }
    });
});
