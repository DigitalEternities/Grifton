[file name]: script.js
[file content begin]
// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Текущий пользователь
let currentUser = null;
let userWallet = null;
let cart = [];
let allNFTs = [];
let userNFTs = [];

// Администраторы (замените на реальные ID)
const ADMIN_IDS = [123456789, 987654321];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Инициализация приложения
async function initializeApp() {
    // Инициализация Telegram пользователя
    initTelegramUser();
    
    // Загрузка данных
    await loadMarketplaceData();
    await loadUserData();
    
    // Проверка прав администратора
    checkAdminRights();
    
    // Обновление интерфейса
    updateUI();
}

// Инициализация пользователя Telegram
function initTelegramUser() {
    if (tg.initDataUnsafe.user) {
        const tgUser = tg.initDataUnsafe.user;
        currentUser = {
            id: tgUser.id,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name || '',
            username: tgUser.username || `user_${tgUser.id}`,
            isPremium: tgUser.is_premium || false
        };
        
        document.getElementById('user-name').textContent = 
            `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('user-avatar').textContent = 
            currentUser.isPremium ? '👑' : '👾';
    } else {
        // Заглушка для разработки
        currentUser = {
            id: Math.floor(Math.random() * 1000000),
            firstName: 'Grifton',
            lastName: 'Collector',
            username: 'grifton_user',
            isPremium: false
        };
    }
}

// Проверка прав администратора
function checkAdminRights() {
    if (ADMIN_IDS.includes(currentUser.id)) {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'block';
        });
    }
}

// Загрузка данных маркетплейса
async function loadMarketplaceData() {
    try {
        // В реальном приложении здесь будет API запрос
        const response = await fetch('/api/nfts/marketplace');
        allNFTs = await response.json();
    } catch (error) {
        console.log('Используем демо-данные');
        allNFTs = getDemoMarketplaceData();
    }
    
    renderMarketplace();
    updatePlatformStats();
}

// Загрузка данных пользователя
async function loadUserData() {
    try {
        // В реальном приложении здесь будет API запрос
        const response = await fetch(`/api/users/${currentUser.id}`);
        const userData = await response.json();
        
        userNFTs = userData.nfts || [];
        userWallet = userData.wallet || { balance: 0, currency: 'GRFT' };
        
    } catch (error) {
        console.log('Используем демо-данные пользователя');
        userNFTs = getDemoUserNFTs();
        userWallet = { balance: 1500, currency: 'GRFT' };
    }
    
    updateUserStats();
}

// Демо-данные маркетплейса
function getDemoMarketplaceData() {
    return [
        {
            id: 1,
            name: "Cosmic Dragon #1",
            emoji: "🐉",
            image: "https://via.placeholder.com/300x300/667eea/white?text=🐉",
            price: 450,
            currency: "GRFT",
            rarity: "Legendary",
            category: "rare",
            owner: "0x742...d35a",
            forSale: true,
            attributes: {
                pattern: "dragon_scale",
                model: "mythical",
                background: "cosmic"
            }
        },
        {
            id: 2,
            name: "Digital Warrior",
            emoji: "⚔️",
            image: "https://via.placeholder.com/300x300/764ba2/white?text=⚔️",
            price: 230,
            currency: "GRFT",
            rarity: "Rare",
            category: "model",
            owner: "0x893...f21b",
            forSale: true,
            attributes: {
                pattern: "circuit",
                model: "warrior",
                background: "digital"
            }
        },
        {
            id: 3,
            name: "Neon Cat",
            emoji: "🐱",
            image: "https://via.placeholder.com/300x300/f093fb/white?text=🐱",
            price: 120,
            currency: "GRFT",
            rarity: "Common",
            category: "pattern",
            owner: "0x156...c89d",
            forSale: true,
            attributes: {
                pattern: "neon",
                model: "animal",
                background: "city"
            }
        },
        {
            id: 4,
            name: "Cyber Punk",
            emoji: "🤖",
            image: "https://via.placeholder.com/300x300/4facfe/white?text=🤖",
            price: 380,
            currency: "GRFT",
            rarity: "Epic",
            category: "model",
            owner: "0x342...a67f",
            forSale: true,
            attributes: {
                pattern: "cyber",
                model: "humanoid",
                background: "future"
            }
        },
        {
            id: 5,
            name: "Moon Walker",
            emoji: "👨‍🚀",
            image: "https://via.placeholder.com/300x300/43e97b/white?text=👨‍🚀",
            price: 290,
            currency: "GRFT",
            rarity: "Rare",
            category: "background",
            owner: "0x678...b32c",
            forSale: true,
            attributes: {
                pattern: "space",
                model: "astronaut",
                background: "moon"
            }
        }
    ];
}

// Демо-данные пользователя
function getDemoUserNFTs() {
    return [
        {
            id: 6,
            name: "Crypto King",
            emoji: "👑",
            image: "https://via.placeholder.com/300x300/f6d365/white?text=👑",
            price: 520,
            currency: "GRFT",
            rarity: "Legendary",
            category: "rare",
            owner: currentUser.id.toString(),
            forSale: false,
            attributes: {
                pattern: "royal",
                model: "crown",
                background: "gold"
            }
        }
    ];
}

// Функции переключения табов
function switchTab(tabName) {
    // Скрыть все табы
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс со всех кнопок
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать выбранный таб
    document.getElementById(tabName).classList.add('active');
    
    // Активировать кнопку
    event.target.classList.add('active');
    
    // Загрузить данные для таба
    if (tabName === 'nfts') {
        loadUserNFTs();
    } else if (tabName === 'market') {
        loadMarketplace();
    } else if (tabName === 'cart') {
        loadCart();
    } else if (tabName === 'admin') {
        loadAdminPanel();
    }
}

// Загрузка маркетплейса
function loadMarketplace() {
    renderMarketplace();
}

// Рендер маркетплейса
function renderMarketplace() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    
    allNFTs.filter(nft => nft.forSale).forEach(nft => {
        const marketItem = document.createElement('div');
        marketItem.className = 'market-item';
        marketItem.innerHTML = `
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.name}" onerror="this.style.display='none'">
                ${!nft.image ? nft.emoji : ''}
            </div>
            <div class="nft-info">
                <h3>${nft.name}</h3>
                <p>Редкость: ${nft.rarity}</p>
                <p class="nft-price">${nft.price} ${nft.currency}</p>
                <div class="nft-actions">
                    <button class="buy-btn" onclick="addToCart(${nft.id})">🛒 В корзину</button>
                    <button class="view-btn" onclick="viewNFT(${nft.id})">👁️ Посмотреть</button>
                </div>
            </div>
        `;
        grid.appendChild(marketItem);
    });
}

// Загрузка NFT пользователя
function loadUserNFTs() {
    const grid = document.getElementById('nft-grid');
    grid.innerHTML = '';
    
    userNFTs.forEach(nft => {
        const nftCard = document.createElement('div');
        nftCard.className = 'nft-card';
        nftCard.innerHTML = `
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.name}" onerror="this.style.display='none'">
                ${!nft.image ? nft.emoji : ''}
            </div>
            <div class="nft-info">
                <h3>${nft.name}</h3>
                <p>Редкость: ${nft.rarity}</p>
                <p class="nft-price">${nft.price} ${nft.currency}</p>
                <p>Владелец: Вы</p>
                <div class="nft-actions">
                    <button class="sell-btn" onclick="putForSale(${nft.id})">💰 Выставить на продажу</button>
                </div>
            </div>
        `;
        grid.appendChild(nftCard);
    });
}

// Просмотр NFT
function viewNFT(nftId) {
    const nft = allNFTs.find(n => n.id === nftId) || userNFTs.find(n => n.id === nftId);
    if (!nft) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="nft-detail">
            <div class="nft-image-large">
                <img src="${nft.image}" alt="${nft.name}" onerror="this.style.display='none'">
                ${!nft.image ? `<div style="font-size: 4em;">${nft.emoji}</div>` : ''}
            </div>
            <div class="nft-detail-info">
                <h2>${nft.name}</h2>
                <p><strong>Редкость:</strong> ${nft.rarity}</p>
                <p><strong>Категория:</strong> ${getCategoryName(nft.category)}</p>
                <p><strong>Цена:</strong> ${nft.price} ${nft.currency}</p>
                <div class="attributes">
                    <h4>Атрибуты:</h4>
                    <p>Узор: ${nft.attributes.pattern}</p>
                    <p>Модель: ${nft.attributes.model}</p>
                    <p>Фон: ${nft.attributes.background}</p>
                </div>
                ${nft.forSale ? 
                    `<button class="buy-btn-large" onclick="addToCart(${nft.id}); closeModal()">🛒 Добавить в корзину</button>` :
                    `<p class="not-for-sale">Не продается</p>`
                }
            </div>
        </div>
    `;
    
    document.getElementById('modal').style.display = 'block';
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'pattern': 'Узор',
        'model': 'Модель',
        'background': 'Фон',
        'rare': 'Редкий'
    };
    return categories[category] || category;
}

// Добавление в корзину
function addToCart(nftId) {
    const nft = allNFTs.find(n => n.id === nftId && n.forSale);
    if (!nft) return;
    
    if (cart.find(item => item.id === nftId)) {
        alert('Этот NFT уже в корзине!');
        return;
    }
    
    cart.push(nft);
    updateCart();
    showNotification(`"${nft.name}" добавлен в корзину!`);
}

// Обновление корзины
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
    
    // Сохранение корзины в localStorage
    localStorage.setItem('grifton_cart', JSON.stringify(cart));
}

// Загрузка корзины
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach((nft, index) => {
        totalPrice += nft.price;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${nft.image}" alt="${nft.name}" onerror="this.style.display='none'">
                ${!nft.image ? nft.emoji : ''}
            </div>
            <div class="cart-item-info">
                <h4>${nft.name}</h4>
                <p>${nft.price} ${nft.currency}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    totalPriceElement.textContent = totalPrice;
}

// Удаление из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    loadCart();
}

// Оформление покупки
async function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    if (!userWallet || userWallet.balance === 0) {
        alert('Пожалуйста, подключите кошелек!');
        return;
    }
    
    const totalPrice = cart.reduce((sum, nft) => sum + nft.price, 0);
    
    if (userWallet.balance < totalPrice) {
        alert('Недостаточно средств на балансе!');
        return;
    }
    
    if (confirm(`Подтвердить покупку ${cart.length} NFT за ${totalPrice} GRFT?`)) {
        try {
            // В реальном приложении здесь будет вызов API
            const result = await processPurchase(cart, currentUser.id);
            
            if (result.success) {
                // Обновление баланса
                userWallet.balance -= totalPrice;
                
                // Добавление NFT в коллекцию пользователя
                cart.forEach(nft => {
                    userNFTs.push({
                        ...nft,
                        owner: currentUser.id.toString(),
                        forSale: false
                    });
                });
                
                // Очистка корзины
                cart = [];
                updateCart();
                
                // Обновление UI
                updateUserStats();
                showNotification('🎉 Покупка успешно завершена!');
                
                // Переключение на вкладку NFT
                switchTab('nfts');
            } else {
                alert('Ошибка при покупке: ' + result.error);
            }
        } catch (error) {
            alert('Ошибка при обработке платежа: ' + error.message);
        }
    }
}

// Обработка покупки (заглушка)
async function processPurchase(nfts, userId) {
    // В реальном приложении здесь будет интеграция с блокчейном
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, transactionId: 'tx_' + Date.now() });
        }, 2000);
    });
}

// Подключение кошелька
async function connectWallet() {
    try {
        // Интеграция с Telegram Wallet или другим провайдером
        if (window.ton) {
            // TON кошелек
            const accounts = await window.ton.send('ton_requestAccounts');
            userWallet = {
                address: accounts[0],
                balance: 1500, // В реальности нужно получать баланс
                currency: 'GRFT'
            };
        } else {
            // Заглушка для демо
            userWallet = {
                address: '0x' + Math.random().toString(16).substr(2, 40),
                balance: 1500,
                currency: 'GRFT'
            };
        }
        
        updateUserStats();
        showNotification('Кошелек успешно подключен!');
    } catch (error) {
        alert('Ошибка подключения кошелька: ' + error.message);
    }
}

// Выставить на продажу
function putForSale(nftId) {
    const nft = userNFTs.find(n => n.id === nftId);
    if (!nft) return;
    
    const price = prompt('Введите цену продажи в GRFT:', nft.price);
    if (price && !isNaN(price) && price > 0) {
        nft.price = parseInt(price);
        nft.forSale = true;
        
        // Перемещение NFT на маркетплейс
        allNFTs.push(nft);
        
        // Удаление из коллекции пользователя
        userNFTs = userNFTs.filter(n => n.id !== nftId);
        
        // Обновление UI
        loadUserNFTs();
        renderMarketplace();
        updateUserStats();
        
        showNotification('NFT выставлено на продажу!');
    }
}

// Фильтрация NFT
function filterNFTs(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    
    let filteredNFTs = allNFTs.filter(nft => nft.forSale);
    
    if (category !== 'all') {
        filteredNFTs = filteredNFTs.filter(nft => nft.category === category);
    }
    
    filteredNFTs.forEach(nft => {
        const marketItem = document.createElement('div');
        marketItem.className = 'market-item';
        marketItem.innerHTML = `
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.name}" onerror="this.style.display='none'">
                ${!nft.image ? nft.emoji : ''}
            </div>
            <div class="nft-info">
                <h3>${nft.name}</h3>
                <p>Редкость: ${nft.rarity}</p>
                <p class="nft-price">${nft.price} ${nft.currency}</p>
                <div class="nft-actions">
                    <button class="buy-btn" onclick="addToCart(${nft.id})">🛒 В корзину</button>
                    <button class="view-btn" onclick="viewNFT(${nft.id})">👁️ Посмотреть</button>
                </div>
            </div>
        `;
        grid.appendChild(marketItem);
    });
}

// Поиск NFT
function searchNFTs() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    
    const filteredNFTs = allNFTs.filter(nft => 
        nft.forSale && nft.name.toLowerCase().includes(searchTerm)
    );
    
    filteredNFTs.forEach(nft => {
        const marketItem = document.createElement('div');
        marketItem.className = 'market-item';
        marketItem.innerHTML = `
            <div class="nft-image">
                <img src="${nft.image}" alt="${nft.name}" onerror="this.style.display='none'">
                ${!nft.image ? nft.emoji : ''}
            </div>
            <div class="nft-info">
                <h3>${nft.name}</h3>
                <p>Редкость: ${nft.rarity}</p>
                <p class="nft-price">${nft.price} ${nft.currency}</p>
                <div class="nft-actions">
                    <button class="buy-btn" onclick="addToCart(${nft.id})">🛒 В корзину</button>
                    <button class="view-btn" onclick="viewNFT(${nft.id})">👁️ Посмотреть</button>
                </div>
            </div>
        `;
        grid.appendChild(marketItem);
    });
}

// Админ: добавление NFT
function addNFT() {
    const name = document.getElementById('nft-name').value;
    const emoji = document.getElementById('nft-emoji').value;
    const price = parseInt(document.getElementById('nft-price').value);
    const category = document.getElementById('nft-category').value;
    const image = document.getElementById('nft-image').value;
    
    if (!name || !emoji || !price || !category) {
        alert('Заполните все обязательные поля!');
        return;
    }
    
    const newNFT = {
        id: Date.now(),
        name,
        emoji,
        image: image || '',
        price,
        currency: "GRFT",
        rarity: getRarityByPrice(price),
        category,
        owner: currentUser.id.toString(),
        forSale: true,
        attributes: {
            pattern: getRandomPattern(),
            model: getRandomModel(),
            background: getRandomBackground()
        }
    };
    
    allNFTs.push(newNFT);
    renderMarketplace();
    updatePlatformStats();
    
    // Очистка формы
    document.getElementById('nft-name').value = '';
    document.getElementById('nft-emoji').value = '';
    document.getElementById('nft-price').value = '';
    document.getElementById('nft-image').value = '';
    
    showNotification('NFT успешно добавлено на маркетплейс!');
}

// Вспомогательные функции для админа
function getRarityByPrice(price) {
    if (price >= 500) return "Legendary";
    if (price >= 300) return "Epic";
    if (price >= 200) return "Rare";
    return "Common";
}

function getRandomPattern() {
    const patterns = ['dragon_scale', 'circuit', 'neon', 'cyber', 'space', 'royal', 'geometric'];
    return patterns[Math.floor(Math.random() * patterns.length)];
}

function getRandomModel() {
    const models = ['mythical', 'warrior', 'animal', 'humanoid', 'astronaut', 'crown', 'abstract'];
    return models[Math.floor(Math.random() * models.length)];
}

function getRandomBackground() {
    const backgrounds = ['cosmic', 'digital', 'city', 'future', 'moon', 'gold', 'gradient'];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

// Обновление статистики пользователя
function updateUserStats() {
    document.getElementById('user-nft-count').textContent = userNFTs.length;
    document.getElementById('user-sales-count').textContent = userNFTs.filter(nft => nft.forSale).length;
    
    if (userWallet) {
        document.getElementById('user-balance').textContent = `${userWallet.balance} ${userWallet.currency}`;
        document.getElementById('balance-equivalent').textContent = `≈ $${(userWallet.balance * 1.5).toFixed(2)}`;
    }
    
    // Обновление профиля
    document.getElementById('profile-nft-count').textContent = userNFTs.length;
    document.getElementById('profile-sales-count').textContent = userNFTs.filter(nft => nft.forSale).length;
    document.getElementById('profile-balance').textContent = userWallet ? userWallet.balance : 0;
}

// Обновление статистики платформы
function updatePlatformStats() {
    document.getElementById('total-nfts').textContent = allNFTs.length;
    document.getElementById('total-users').textContent = Math.floor(Math.random() * 1000) + 1000;
    document.getElementById('total-volume').textContent = 
        allNFTs.reduce((sum, nft) => sum + nft.price, 0) + ' GRFT';
}

// Обновление UI
function updateUI() {
    updateCart();
    updateUserStats();
    updatePlatformStats();
}

// Уведомления
function showNotification(message) {
    // В реальном приложении можно использовать Toast уведомления
    console.log('Notification:', message);
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showPopup({ message: message });
    } else {
        alert(message);
    }
}

// Модальное окно
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Загрузка корзины из localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('grifton_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Инициализация при загрузке
loadCartFromStorage();

console.log('✅ Grifton Shop loaded successfully!');
[file content end]