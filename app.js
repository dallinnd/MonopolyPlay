// ==========================================
// GAME CONSTANTS & CONFIGURATION
// ==========================================

const GAME_CONSTANTS = {
    passGoAmount: 200,
    startingBalance: 1500
};

// Complete standard property values and upgrade multipliers
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
// FIREBASE INITIALIZATION & CONFIGURATION
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    onSnapshot, 
    runTransaction 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Replace with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyYourApiKeyHere...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// GAME STATE MANAGEMENT
// ==========================================

let currentRoomId = "TEST_ROOM_1234";
let localPlayerId = null;

let liveGameState = {
    players: {},
    properties: {},
    transactions: []
};

// Firebase Real-time listeners
function initializeGameListeners(roomId) {
    console.log(`Connecting to room: ${roomId}...`);

    const propertiesRef = collection(db, `games/${roomId}/properties`);
    onSnapshot(propertiesRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            liveGameState.properties[change.doc.id] = change.doc.data();
        });
        console.log("Properties updated from server!");
    });

    const playersRef = collection(db, `games/${roomId}/players`);
    onSnapshot(playersRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            liveGameState.players[change.doc.id] = change.doc.data();
        });
        console.log("Players updated from server!");
    });

    const transactionsRef = collection(db, `games/${roomId}/transactions`);
    onSnapshot(transactionsRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                liveGameState.transactions.push({ id: change.doc.id, ...change.doc.data() });
            }
        });
        console.log("New transaction received!");
    });
}

// ==========================================
// LOBBY, WAITING ROOM & SESSION MANAGEMENT
// ==========================================

let selectedAvatarId = null;
let isHost = false;
let activeGameCode = null;

document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const lobbyPage = document.getElementById('lobby-page');
    const mainApp = document.getElementById('main-app');
    
    const btnCreateGame = document.getElementById('btn-create-game');
    const btnJoinGame = document.getElementById('btn-join-game');
    const joinCodeInput = document.getElementById('join-code-input');
    const lobbyCards = document.querySelectorAll('.lobby-avatar-card');
    const btnStartGame = document.getElementById('btn-start-game');
    const waitingHostText = document.getElementById('waiting-host-text');
    const lobbyCodeDisplay = document.getElementById('lobby-room-code-display');
    
    // Header Profile Menu
    const profileTrigger = document.getElementById('header-profile-trigger');
    const profileModal = document.getElementById('profile-menu-modal');
    const modalRoomCodeText = document.getElementById('modal-room-code-text');
    const btnReturnLanding = document.getElementById('btn-return-landing');

    // Load Recent Games from LocalStorage
    function loadRecentGames() {
        const container = document.getElementById('recent-games-container');
        const list = document.getElementById('recent-games-list');
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
            btn.style.fontSize = '14px';
            btn.addEventListener('click', () => {
                joinCodeInput.value = code;
            });
            list.appendChild(btn);
        });
    }

    function saveRecentGame(code) {
        let saved = JSON.parse(localStorage.getItem('monopoly_recent_games')) || [];
        if (!saved.includes(code)) {
            saved.unshift(code); // Add to top
            if (saved.length > 3) saved.pop(); // Keep max 3
            localStorage.setItem('monopoly_recent_games', JSON.stringify(saved));
        }
    }

    loadRecentGames();

    // 1. Avatar selection in Lobby
    lobbyCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('taken')) return;
            
            lobbyCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedAvatarId = card.getAttribute('data-avatar-id');
        });
    });

    // Code generator helper
    function generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let res = '';
        for (let i = 0; i < 4; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        return res;
    }

    // 2. Create Game (Host Action)
    btnCreateGame.addEventListener('click', () => {
        activeGameCode = generateRoomCode();
        isHost = true;
        
        landingPage.classList.add('hidden');
        lobbyPage.classList.remove('hidden');
        
        lobbyCodeDisplay.textContent = activeGameCode;
        btnStartGame.classList.remove('hidden'); // Host gets start button
        waitingHostText.style.display = 'none';
        
        saveRecentGame(activeGameCode);
    });

    // 3. Join Game (Player Action)
    btnJoinGame.addEventListener('click', () => {
        const code = joinCodeInput.value.toUpperCase();
        if (code.length !== 4) {
            alert("Please enter a valid 4-digit code.");
            return;
        }

        activeGameCode = code;
        isHost = false;

        landingPage.classList.add('hidden');
        lobbyPage.classList.remove('hidden');

        lobbyCodeDisplay.textContent = activeGameCode;
        btnStartGame.classList.add('hidden'); // Non-host hides start button
        waitingHostText.style.display = 'block';

        saveRecentGame(activeGameCode);
    });

    // 4. Host Starts Game -> Triggers Transition to Main App & Payout
    btnStartGame.addEventListener('click', () => {
        if (!selectedAvatarId) {
            alert("Please select your avatar before starting!");
            return;
        }

        transitionToMainApp(selectedAvatarId, activeGameCode);
    });

    function transitionToMainApp(avatarId, roomId) {
        lobbyPage.classList.add('hidden');
        mainApp.classList.remove('hidden');

        // Update Header
        document.querySelector('.player-name').textContent = avatarId;
        
        // Issue Starting Cash ($1500)
        const startingTx = {
            from: "Bank",
            to: avatarId,
            amount: GAME_CONSTANTS.startingBalance,
            details: "Pass Go:<br>Starting Balance",
            timestamp: new Date().toISOString()
        };
        liveGameState.transactions.push(startingTx);
        console.log(`Initialized game in room ${roomId}. Issued $1500 to ${avatarId}`);
    }

    // 5. Header Profile Trigger Modal
    profileTrigger.addEventListener('click', () => {
        modalRoomCodeText.textContent = activeGameCode || "TEST";
        profileModal.classList.remove('hidden');
    });

    // Return to Landing Page from Profile Menu
    btnReturnLanding.addEventListener('click', () => {
        profileModal.classList.add('hidden');
        mainApp.classList.add('hidden');
        lobbyPage.classList.add('hidden');
        landingPage.classList.remove('hidden');
        loadRecentGames();
    });

    // Force uppercase code entry
    joinCodeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
});

// ==========================================
// DOM EVENTS & UI LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. TAB NAVIGATION LOGIC ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.classList.add('hidden');
            });

            btn.classList.add('active');
            tabContents[index].classList.remove('hidden');
            tabContents[index].classList.add('active');
        });
    });

    // --- 2. DYNAMIC PROPERTY MODAL INJECTION ---
    const propertyModal = document.getElementById('property-modal');
    
    function populatePropertyModal(propertyId) {
        if (!propertyId || !PROPERTY_DATA[propertyId]) return;
        
        const prop = PROPERTY_DATA[propertyId];
        
        // Update Header Color
        const header = propertyModal.querySelector('.modal-header');
        header.className = `modal-header ${prop.color}`; 
        
        // Update Title (Splits on first space to fit in the card)
        const title = propertyModal.querySelector('.modal-title');
        title.innerHTML = prop.name.replace(' ', '<br>'); 
        
        // Update Rent & Upgrade Stats Table
        const rows = propertyModal.querySelectorAll('.stat-row');
        
        // Base Rent
        rows[0].querySelector('strong').textContent = `$${prop.baseRent}`;
        
        // Multiplier Rents (1x through Hotel)
        for (let i = 2; i <= 6; i++) {
            rows[i].querySelectorAll('span')[1].textContent = `$${prop.upgradeCost}`;
            rows[i].querySelectorAll('span')[2].textContent = `$${prop.upgradeRents[i-1]}`;
        }
        
        // Update the Pay Bank Button
        const payBtn = propertyModal.querySelector('.btn-pay');
        payBtn.innerHTML = `Pay Bank $${prop.upgradeCost}<br><small>Upgrade</small>`;
    }

    // --- 3. MODAL TOGGLING & COMBO LOGIC ---
    const historyModal = document.getElementById('history-action-modal');
    const transactionModal = document.getElementById('transaction-modal');

    const propertyElements = document.querySelectorAll('.property-card, .market-item');
    propertyElements.forEach(element => {
        element.addEventListener('click', () => {
            const selectedAvatar = document.querySelector('.avatar-item.selected');
            const selectedBank = document.querySelector('.bank-btn.selected');
            
            if (selectedAvatar || selectedBank) {
                // Combo: Avatar + Property (Goes to Payment)
                if (selectedAvatar) selectedAvatar.classList.remove('selected');
                if (selectedBank) selectedBank.classList.remove('selected');
                
                transactionModal.classList.remove('hidden');
            } else {
                // Standard: Inject data and open Info
                const propertyId = element.getAttribute('data-property-id');
                populatePropertyModal(propertyId);
                
                propertyModal.classList.remove('hidden');
            }
        });
    });

    const transactionItems = document.querySelectorAll('.transaction-item');
    transactionItems.forEach(item => {
        item.addEventListener('click', () => {
            historyModal.classList.remove('hidden');
        });
    });

    // --- 4. CLOSING MODALS ---
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });

    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });

    // --- 5. AVATAR & BANK SELECTION LOGIC ---
    const avatarItems = document.querySelectorAll('.avatar-item');
    const bankBtn = document.querySelector('.bank-btn');

    function clearAllSelections() {
        avatarItems.forEach(a => a.classList.remove('selected'));
        bankBtn.classList.remove('selected');
    }

    avatarItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            } else {
                clearAllSelections();
                item.classList.add('selected');
            }
        });
    });

    bankBtn.addEventListener('click', () => {
        if (bankBtn.classList.contains('selected')) {
            bankBtn.classList.remove('selected');
        } else {
            clearAllSelections();
            bankBtn.classList.add('selected');
        }
    });

    // --- 6. ACTION BUTTON RESOLUTIONS ---
    const actionBtns = document.querySelectorAll('.modal-action-btn, .request-property-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                modal.classList.add('hidden');
            } else if (btn.classList.contains('request-property-btn')) {
                alert("This will open the Bank's unowned property list!");
            }
        });
    });
});
