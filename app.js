// ==========================================
// 1. GAME CONSTANTS & CONFIGURATION
// ==========================================
const GAME_CONSTANTS = { passGoAmount: 200, startingBalance: 1500 };

const PROPERTY_DATA = {
    "mediterranean_avenue": { name: "Mediterranean Avenue", color: "brown", purchasePrice: 60, upgradeCost: 50, baseRent: 2, upgradeRents: [2, 10, 30, 90, 160, 250] },
    "baltic_avenue": { name: "Baltic Avenue", color: "brown", purchasePrice: 60, upgradeCost: 50, baseRent: 4, upgradeRents: [4, 20, 60, 180, 320, 450] },
    "oriental_avenue": { name: "Oriental Avenue", color: "light-blue", purchasePrice: 100, upgradeCost: 50, baseRent: 6, upgradeRents: [6, 30, 90, 270, 400, 550] },
    "vermont_avenue": { name: "Vermont Avenue", color: "light-blue", purchasePrice: 100, upgradeCost: 50, baseRent: 6, upgradeRents: [6, 30, 90, 270, 400, 550] },
    "connecticut_avenue": { name: "Connecticut Avenue", color: "light-blue", purchasePrice: 120, upgradeCost: 50, baseRent: 8, upgradeRents: [8, 40, 100, 300, 450, 600] },
    "st_charles_place": { name: "St. Charles Place", color: "pink", purchasePrice: 140, upgradeCost: 100, baseRent: 10, upgradeRents: [10, 50, 150, 450, 625, 750] },
    "states_avenue": { name: "States Avenue", color: "pink", purchasePrice: 140, upgradeCost: 100, baseRent: 10, upgradeRents: [10, 50, 150, 450, 625, 750] },
    "virginia_avenue": { name: "Virginia Avenue", color: "pink", purchasePrice: 160, upgradeCost: 100, baseRent: 12, upgradeRents: [12, 60, 180, 500, 700, 900] },
    "st_james_place": { name: "St. James Place", color: "orange", purchasePrice: 180, upgradeCost: 100, baseRent: 14, upgradeRents: [14, 70, 200, 550, 750, 950] },
    "tennessee_avenue": { name: "Tennessee Avenue", color: "orange", purchasePrice: 180, upgradeCost: 100, baseRent: 14, upgradeRents: [14, 70, 200, 550, 750, 950] },
    "new_york_avenue": { name: "New York Avenue", color: "orange", purchasePrice: 200, upgradeCost: 100, baseRent: 16, upgradeRents: [16, 80, 220, 600, 800, 1000] },
    "kentucky_avenue": { name: "Kentucky Avenue", color: "red", purchasePrice: 220, upgradeCost: 150, baseRent: 18, upgradeRents: [18, 90, 250, 700, 875, 1050] },
    "indiana_avenue": { name: "Indiana Avenue", color: "red", purchasePrice: 220, upgradeCost: 150, baseRent: 18, upgradeRents: [18, 90, 250, 700, 875, 1050] },
    "illinois_avenue": { name: "Illinois Avenue", color: "red", purchasePrice: 240, upgradeCost: 150, baseRent: 20, upgradeRents: [20, 100, 300, 750, 925, 1100] },
    "atlantic_avenue": { name: "Atlantic Avenue", color: "yellow", purchasePrice: 260, upgradeCost: 150, baseRent: 22, upgradeRents: [22, 110, 330, 800, 975, 1150] },
    "ventnor_avenue": { name: "Ventnor Avenue", color: "yellow", purchasePrice: 260, upgradeCost: 150, baseRent: 22, upgradeRents: [22, 110, 330, 800, 975, 1150] },
    "marvin_gardens": { name: "Marvin Gardens", color: "yellow", purchasePrice: 280, upgradeCost: 150, baseRent: 24, upgradeRents: [24, 120, 360, 850, 1025, 1200] },
    "pacific_avenue": { name: "Pacific Avenue", color: "green", purchasePrice: 300, upgradeCost: 200, baseRent: 26, upgradeRents: [26, 130, 390, 900, 1100, 1275] },
    "north_carolina_avenue": { name: "North Carolina Avenue", color: "green", purchasePrice: 300, upgradeCost: 200, baseRent: 26, upgradeRents: [26, 130, 390, 900, 1100, 1275] },
    "pennsylvania_avenue": { name: "Pennsylvania Avenue", color: "green", purchasePrice: 320, upgradeCost: 200, baseRent: 28, upgradeRents: [28, 150, 450, 1000, 1200, 1400] },
    "park_place": { name: "Park Place", color: "dark-blue", purchasePrice: 350, upgradeCost: 200, baseRent: 35, upgradeRents: [35, 175, 500, 1100, 1300, 1500] },
    "boardwalk": { name: "Boardwalk", color: "dark-blue", purchasePrice: 400, upgradeCost: 200, baseRent: 50, upgradeRents: [50, 200, 600, 1400, 1700, 2000] }
};

// ==========================================
// 2. FIREBASE SETUP & SAFEGUARDS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, collection, doc, onSnapshot, setDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyYourApiKeyHere...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

let app, db;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.warn("Firebase failed to init. Running offline UI mode.");
}

let currentRoomId = null;
let localPlayerId = null;
let isHost = false;
let liveGameState = { players: {}, properties: {}, transactions: [] };

// ==========================================
// 3. UI RENDERING LOGIC
// ==========================================
function renderMarket() {
    const marketList = document.getElementById('global-market-list');
    marketList.innerHTML = '';
    Object.keys(PROPERTY_DATA).forEach(propId => {
        const prop = PROPERTY_DATA[propId];
        const liveState = liveGameState.properties[propId];
        let owner = '';
        let displayValue = `$${prop.purchasePrice}`;
        
        if (liveState && liveState.owner) {
            owner = liveState.owner;
            const level = liveState.upgradeLevel || 0;
            displayValue = `$${prop.upgradeRents[level]}`;
        }
        const itemHTML = `
            <div class="market-item" data-property-id="${propId}">
                <div class="col-property">
                    <div class="prop-color-bar ${prop.color}"></div>
                    <span class="prop-name">${prop.name.replace(' ', '<br>')}</span>
                </div>
                <div class="col-owner">${owner}</div>
                <div class="col-rent">${displayValue}</div>
            </div>
        `;
        marketList.insertAdjacentHTML('beforeend', itemHTML);
    });
    attachPropertyClickListeners();
}

function renderMyAssets() {
    const assetsGrid = document.getElementById('my-assets-grid');
    assetsGrid.innerHTML = '';
    Object.keys(liveGameState.properties).forEach(propId => {
        const liveState = liveGameState.properties[propId];
        if (liveState.owner === localPlayerId) {
            const prop = PROPERTY_DATA[propId];
            const level = liveState.upgradeLevel || 0;
            const currentRent = prop.upgradeRents[level];
            let upgradeVisual = '‎'; 
            if (level >= 1 && level <= 4) upgradeVisual = '⌂'.repeat(level);
            if (level === 5) upgradeVisual = '🏨';

            const cardHTML = `
                <div class="property-card" data-property-id="${propId}">
                    <div class="property-header ${prop.color}"><h3>${prop.name.replace(' ', '<br>')}</h3></div>
                    <div class="property-body"><span class="rent-label">Rent</span><h2 class="rent-price">$${currentRent}</h2></div>
                    <div class="upgrade-status"><span class="house-icon ${prop.color}-text">${upgradeVisual}</span><span class="arrow-icon">⬆</span></div>
                </div>
            `;
            assetsGrid.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
    attachPropertyClickListeners();
}

function renderTransactions() {
    const transList = document.getElementById('global-transaction-list');
    transList.innerHTML = '';
    const sortedTrans = [...liveGameState.transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    sortedTrans.forEach(tx => {
        const txHTML = `
            <div class="transaction-item" data-tx-id="${tx.id}">
                <div class="col-from">${tx.from}</div>
                <div class="col-to">${tx.to}</div>
                <div class="col-amount">$${tx.amount}</div>
                <div class="col-details">${tx.details}</div>
            </div>
        `;
        transList.insertAdjacentHTML('beforeend', txHTML);
    });
    
    // Reattach listeners to generated transactions
    const historyModal = document.getElementById('history-action-modal');
    document.querySelectorAll('.transaction-item').forEach(item => {
        item.addEventListener('click', () => historyModal.classList.remove('hidden'));
    });
}

function attachPropertyClickListeners() {
    const propertyModal = document.getElementById('property-modal');
    const transactionModal = document.getElementById('transaction-modal');

    document.querySelectorAll('.property-card, .market-item').forEach(element => {
        element.addEventListener('click', () => {
            const selectedAvatar = document.querySelector('.avatar-item.selected');
            const selectedBank = document.querySelector('.bank-btn.selected');
            if (selectedAvatar || selectedBank) {
                if (selectedAvatar) selectedAvatar.classList.remove('selected');
                if (selectedBank) selectedBank.classList.remove('selected');
                transactionModal.classList.remove('hidden');
            } else {
                const propertyId = element.getAttribute('data-property-id');
                populatePropertyModal(propertyId);
                propertyModal.classList.remove('hidden');
            }
        });
    });
}

function populatePropertyModal(propertyId) {
    if (!propertyId || !PROPERTY_DATA[propertyId]) return;
    const prop = PROPERTY_DATA[propertyId];
    const propertyModal = document.getElementById('property-modal');
    
    propertyModal.querySelector('.modal-header').className = `modal-header ${prop.color}`; 
    propertyModal.querySelector('.modal-title').innerHTML = prop.name.replace(' ', '<br>'); 
    const rows = propertyModal.querySelectorAll('.stat-row');
    rows[0].querySelector('strong').textContent = `$${prop.baseRent}`;
    for (let i = 2; i <= 6; i++) {
        rows[i].querySelectorAll('span')[1].textContent = `$${prop.upgradeCost}`;
        rows[i].querySelectorAll('span')[2].textContent = `$${prop.upgradeRents[i-1]}`;
    }
    propertyModal.querySelector('.btn-pay').innerHTML = `Pay Bank $${prop.upgradeCost}<br><small>Upgrade</small>`;
}

// ==========================================
// 4. CORE APP & DOM EVENTS (Flattened!)
// ==========================================

let tempRecentCode = null;
const landingPage = document.getElementById('landing-page');
const lobbyPage = document.getElementById('lobby-page');
const mainApp = document.getElementById('main-app');

function loadRecentGames() {
    const list = document.getElementById('recent-games-list');
    const container = document.getElementById('recent-games-container');
    const saved = JSON.parse(localStorage.getItem('monopoly_recent_games')) || [];
    
    if (saved.length === 0) {
        container.style.display = 'none';
        return;
    }
    container.style.display = 'block';
    list.innerHTML = '';
    
    saved.forEach(code => {
        const btn = document.createElement('button');
        btn.textContent = `Room: ${code}`;
        btn.className = 'btn-request modal-action-btn';
        btn.style.margin = '0';
        btn.style.padding = '10px';
        btn.addEventListener('click', () => {
            tempRecentCode = code;
            document.getElementById('recent-modal-code').textContent = code;
            document.getElementById('recent-game-modal').classList.remove('hidden');
        });
        list.appendChild(btn);
    });
}

function saveRecentGame(code) {
    let saved = JSON.parse(localStorage.getItem('monopoly_recent_games')) || [];
    if (!saved.includes(code)) {
        saved.unshift(code);
        if (saved.length > 3) saved.pop(); 
        localStorage.setItem('monopoly_recent_games', JSON.stringify(saved));
    }
}

// Initialize history on load
loadRecentGames();

// Recent Game Modal Actions
document.getElementById('btn-recent-play').addEventListener('click', () => {
    document.getElementById('recent-game-modal').classList.add('hidden');
    currentRoomId = tempRecentCode;
    isHost = false;

    landingPage.classList.add('hidden');
    lobbyPage.classList.remove('hidden');
    document.getElementById('lobby-room-code-display').textContent = currentRoomId;
    document.getElementById('btn-start-game').classList.add('hidden');
    document.getElementById('waiting-host-text').style.display = 'block';
    saveRecentGame(currentRoomId);
    
    if(db) { listenToRoomState(currentRoomId); }
});

document.getElementById('btn-recent-delete').addEventListener('click', () => {
    let saved = JSON.parse(localStorage.getItem('monopoly_recent_games')) || [];
    saved = saved.filter(c => c !== tempRecentCode);
    localStorage.setItem('monopoly_recent_games', JSON.stringify(saved));
    loadRecentGames();
    document.getElementById('recent-game-modal').classList.add('hidden');
});

// Avatar Selection in Lobby
const lobbyCards = document.querySelectorAll('.lobby-avatar-card');
lobbyCards.forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('taken')) return;
        lobbyCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        localPlayerId = card.getAttribute('data-avatar-id');
    });
});

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 4; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
}

// Create New Game
document.getElementById('btn-create-game').addEventListener('click', () => {
    currentRoomId = generateRoomCode();
    isHost = true;
    
    // UI Updates instantly
    landingPage.classList.add('hidden');
    lobbyPage.classList.remove('hidden');
    document.getElementById('lobby-room-code-display').textContent = currentRoomId;
    document.getElementById('btn-start-game').classList.remove('hidden');
    document.getElementById('waiting-host-text').style.display = 'none';
    saveRecentGame(currentRoomId);

    // Firebase in background (does not crash UI if it fails)
    if(db) {
        setDoc(doc(db, "games", currentRoomId), { status: 'waiting', host: 'LocalHostId' })
            .catch(e => console.warn("Firebase skipped"));
        listenToRoomState(currentRoomId); 
    }
});

// Join Game
document.getElementById('btn-join-game').addEventListener('click', () => {
    const code = document.getElementById('join-code-input').value.toUpperCase();
    if (code.length !== 4) return;

    currentRoomId = code;
    isHost = false;

    landingPage.classList.add('hidden');
    lobbyPage.classList.remove('hidden');
    document.getElementById('lobby-room-code-display').textContent = currentRoomId;
    document.getElementById('btn-start-game').classList.add('hidden');
    document.getElementById('waiting-host-text').style.display = 'block';
    saveRecentGame(currentRoomId);

    if(db) { listenToRoomState(currentRoomId); }
});

// Host Starts Game
document.getElementById('btn-start-game').addEventListener('click', () => {
    if (!localPlayerId) { alert("Please select your avatar before starting!"); return; }
    
    if(db) {
        updateDoc(doc(db, "games", currentRoomId), { status: 'active' }).catch(e => console.warn(e));
    }
    
    // Force transition immediately for testing (Host shouldn't wait for server response)
    transitionToMainApp();
});

function listenToRoomState(roomId) {
    onSnapshot(doc(db, "games", roomId), (docSnap) => {
        if (docSnap.exists() && docSnap.data().status === 'active') {
            transitionToMainApp();
        }
    });
}

function transitionToMainApp() {
    if (!localPlayerId) localPlayerId = "Observer"; 
    
    lobbyPage.classList.add('hidden');
    mainApp.classList.remove('hidden');
    document.querySelector('.player-name').textContent = localPlayerId;
    
    // Starting payout
    liveGameState.transactions.push({
        id: "start_" + localPlayerId + Math.random(),
        from: "Bank",
        to: localPlayerId,
        amount: GAME_CONSTANTS.startingBalance,
        details: "Pass Go:<br>Starting Balance",
        timestamp: new Date().toISOString()
    });
    
    renderMyAssets();
    renderMarket();
    renderTransactions();
}

// Header Profile Menu
document.getElementById('header-profile-trigger').addEventListener('click', () => {
    document.getElementById('modal-room-code-text').textContent = currentRoomId || "TEST";
    document.getElementById('profile-menu-modal').classList.remove('hidden');
});

document.getElementById('btn-return-landing').addEventListener('click', () => {
    document.getElementById('profile-menu-modal').classList.add('hidden');
    mainApp.classList.add('hidden');
    landingPage.classList.remove('hidden');
    loadRecentGames();
});

document.getElementById('join-code-input').addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());

// --- TABS & MODALS ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => { c.classList.remove('active'); c.classList.add('hidden'); });
        btn.classList.add('active');
        tabContents[index].classList.remove('hidden');
        tabContents[index].classList.add('active');
    });
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.add('hidden');
    });
});

document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
});

document.querySelectorAll('.modal-action-btn:not(#btn-recent-play):not(#btn-recent-delete):not(#btn-start-game):not(#btn-create-game):not(#btn-join-game), .request-property-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.add('hidden');
    });
});

// --- IN-GAME AVATAR/BANK SELECTION ---
const appAvatarItems = document.querySelectorAll('.avatar-ribbon .avatar-item');
const bankBtn = document.querySelector('.bank-btn');

function clearAppSelections() {
    appAvatarItems.forEach(a => a.classList.remove('selected'));
    bankBtn.classList.remove('selected');
}

appAvatarItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
        } else {
            clearAppSelections();
            item.classList.add('selected');
        }
    });
});

bankBtn.addEventListener('click', () => {
    if (bankBtn.classList.contains('selected')) {
        bankBtn.classList.remove('selected');
    } else {
        clearAppSelections();
        bankBtn.classList.add('selected');
    }
});
