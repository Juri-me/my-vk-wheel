// 1. Инициализируем мост с ВКонтакте
const bridge = window.VKBridge || null;

document.addEventListener('DOMContentLoaded', () => {
    // 2. САМОЕ ВАЖНОЕ: Сообщаем ВКонтакте, что приложение загрузилось
    if (bridge) {
        bridge.send('VKWebAppInit');
    }

    // 3. Приветствуем пользователя (если есть данные)
    const greeting = document.getElementById('greeting');
    if (bridge) {
        bridge.send('VKWebAppGetUserInfo')
            .then(data => {
                if (data.first_name) {
                    greeting.textContent = `Привет, \${data.first_name}!`;
                }
            })
            .catch(err => {
                console.log('Не удалось получить имя пользователя (это нормально для тестов)');
            });
    }

    // 4. Логика колеса
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.getElementById('wheel');
    const resultText = document.getElementById('result');

    spinBtn.addEventListener('click', () => {
        // Блокируем кнопку, пока крутится
        spinBtn.disabled = true;
        resultText.textContent = '';

        // Генерируем случайное число оборотов (от 5 до 10) + случайный угол
        const randomDegrees = Math.floor(Math.random() * 3600) + 1800; 
        
        // Крутим!
        wheel.style.transform = `rotate(\${randomDegrees}deg)`;

        // Ждем окончания анимации (4 секунды, как в CSS)
        setTimeout(() => {
            // Вычисляем реальный угол (остаток от деления на 360)
            const finalAngle = randomDegrees % 360;
            
            // Определяем приз (сектор каждые 60 градусов)
            let prize = '';
            if (finalAngle >= 0 && finalAngle < 60) prize = '🎁 Суперприз!';
            else if (finalAngle >= 60 && finalAngle < 120) prize = '🍫 Шоколадка';
            else if (finalAngle >= 120 && finalAngle < 180) prize = '🎮 Игра';
            else if (finalAngle >= 180 && finalAngle < 240) prize = '☕ Кофе';
            else if (finalAngle >= 240 && finalAngle < 300) prize = '🎟️ Билет';
            else prize = '💎 Драгоценность';

            resultText.textContent = prize;
            
            // Возвращаем колесо в исходное состояние для следующего раза (но с тем же углом, чтобы не дергалось)
            // На самом деле, нам не нужно сбрасывать transform, так как мы будем крутить дальше.
            // Но чтобы логика не ломалась, мы просто оставляем его как есть.
            
            spinBtn.disabled = false;
        }, 4000);
    });
});
