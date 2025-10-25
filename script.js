// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Данные NFT (заглушка - замени на реальные данные)
const nftData = [
    {
        id: 1,
        name: "Cosmic Dragon #1",
        emoji: "🐉",
        price: "450 GRFT",
        rarity: "Legendary",
        owner: "You"
    },
    {
        id: 2,
        name: "Digital Warrior",
        emoji: "⚔️",
        price: "230 GRFT", 
        rarity: "Rare",
        owner: "You"
    },
    {
        id: 3,
        name: "Neon Cat",
        emoji: "🐱",
        price: "120 GRFT",
        rarity: "Common",
        owner: "You"
    },
    {
        id: 4,
        name: "Cyber Punk",
        emoji: "🤖",
        price: "380 GRFT",
        rarity: "Epic",
        owner: "You"
    },
    {
        id: 5,
        name: "Moon Walker",
        emoji: "👨‍🚀",
        price: "290 GRFT",
        rarity: "Rare",
        owner: "You"
    },
    {
        id: 6,
        name: "Crypto King",
        emoji: "👑",
        price: "520 GRFT",
        rarity: "Legendary",
        owner: "You"
    }
];

const marketData = [
    {
        id: 101,
        name: "Golden Bitcoin",
        emoji: "₿",
        price: "890 GRFT",
        rarity: "Legendary"
    },
    {
        id: 102,
        name: "Ethereum Spirit", 
        emoji: "🔶",
        price: "670 GRFT",
        rarity: "Epic"
    },
    {
        id: 103,
        name: "Polygon Art",
        emoji: "🔷",
        price: "340 GRFT",
        rarity: "Rare"
    }
];

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
        loadNFTs();
    } else if (tabName === 'market') {
        loadMarket();
    }
}

// Загрузка NFT
function loadNFTs() {
    const grid = document.getElementById('nft-grid');
    grid.innerHTML = '';
    
    nftData.forEach(nft => {
        const nftCard = document.createElement('div');
        nftCard.className = 'nft-card';
        nftCard.innerHTML = `
            <div class="nft-image">
                ${nft.emoji}
            </div>
            <div class="nft-info">
                <h3>${nft.name}</h3>
                <p>Редкость: ${nft.rarity}</p>
                <p class="nft-price">${nft.price}</p>
                <p>Владелец: ${nft.owner}</p>
            </div>
        `;
        grid.appendChild(nftCard);
    });
}

// Загрузка маркетплейса
function loadMarket() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    
    marketData.forEach(item => {
        const marketItem = document.createElement('div');
        marketItem.className = 'market-item';
        marketItem.innerHTML = `
            <div class="nft-image">
                ${item.emoji}
            </div>
            <div class="nft-info">
                <h3>${item.name}</h3>
                <p>Редкость: ${item.rarity}</p>
                <p class="nft-price">${item.price}</p>
                <button class="buy-btn" onclick="buyItem(${item.id})">Купить</button>
            </div>
        `;
        grid.appendChild(marketItem);
    });
}

// Функция покупки
function buyItem(itemId) {
    const item = marketData.find(i => i.id === itemId);
    if (item && confirm(`Купить ${item.name} за ${item.price}?`)) {
        alert(`🎉 Поздравляем! Вы купили ${item.name}!`);
        // Здесь можно добавить логику покупки
    }
}

// Фильтрация
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Здесь можно добавить логику фильтрации
    });
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    loadNFTs();
    
    // Симуляция загрузки данных
    setTimeout(() => {
        console.log('✅ Grifton Shop loaded successfully!');
    }, 1000);
});