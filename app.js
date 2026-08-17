// ==========================================
// GAME CONSTANTS & CONFIGURATION
// ==========================================

const GAME_CONSTANTS = {
    passGoAmount: 200,
    startingBalance: 1500
};

// Complete standard property values and upgrade multipliers
const PROPERTY_DATA = {
    "mediterranean_avenue": {
        name: "Mediterranean Avenue",
        color: "brown",
        purchasePrice: 60,
        upgradeCost: 50,
        baseRent: 2,
        upgradeRents: [2, 10, 30, 90, 160, 250]
    },
    "baltic_avenue": {
        name: "Baltic Avenue",
        color: "brown",
        purchasePrice: 60,
        upgradeCost: 50,
        baseRent: 4,
        upgradeRents: [4, 20, 60, 180, 320, 450]
    },
    "oriental_avenue": {
        name: "Oriental Avenue",
        color: "light-blue",
        purchasePrice: 100,
        upgradeCost: 50,
        baseRent: 6,
        upgradeRents: [6, 30, 90, 270, 400, 550]
    },
    "vermont_avenue": {
        name: "Vermont Avenue",
        color: "light-blue",
        purchasePrice: 100,
        upgradeCost: 50,
        baseRent: 6,
        upgradeRents: [6, 30, 90, 270, 400, 550]
    },
    "connecticut_avenue": {
        name: "Connecticut Avenue",
        color: "light-blue",
        purchasePrice: 120,
        upgradeCost: 50,
        baseRent: 8,
        upgradeRents: [8, 40, 100, 300, 450, 600]
    },
    "st_charles_place": {
        name: "St. Charles Place",
        color: "pink",
        purchasePrice: 140,
        upgradeCost: 100,
        baseRent: 10,
        upgradeRents: [10, 50, 150, 450, 625, 750]
    },
    "states_avenue": {
        name: "States Avenue",
        color: "pink",
        purchasePrice: 140,
        upgradeCost: 100,
        baseRent: 10,
        upgradeRents: [10, 50, 150, 450, 625, 750]
    },
    "virginia_avenue": {
        name: "Virginia Avenue",
        color: "pink",
        purchasePrice: 160,
        upgradeCost: 100,
        baseRent: 12,
        upgradeRents: [12, 60, 180, 500, 700, 900]
    },
    "st_james_place": {
        name: "St. James Place",
        color: "orange",
        purchasePrice: 180,
        upgradeCost: 100,
        baseRent: 14,
        upgradeRents: [14, 70, 200, 550, 750, 950]
    },
    "tennessee_avenue": {
        name: "Tennessee Avenue",
        color: "orange",
        purchasePrice: 180,
        upgradeCost: 100,
        baseRent: 14,
        upgradeRents: [14, 70, 200, 550, 750, 950]
    },
    "new_york_avenue": {
        name: "New York Avenue",
        color: "orange",
        purchasePrice: 200,
        upgradeCost: 100,
        baseRent: 16,
        upgradeRents: [16, 80, 220, 600, 800, 1000]
    },
    "kentucky_avenue": {
        name: "Kentucky Avenue",
        color: "red",
        purchasePrice: 220,
        upgradeCost: 150,
        baseRent: 18,
        upgradeRents: [18, 90, 250, 700, 875, 1050]
    },
    "indiana_avenue": {
        name: "Indiana Avenue",
        color: "red",
        purchasePrice: 220,
        upgradeCost: 150,
        baseRent: 18,
        upgradeRents: [18, 90, 250, 700, 875, 1050]
    },
    "illinois_avenue": {
        name: "Illinois Avenue",
        color: "red",
        purchasePrice: 240,
        upgradeCost: 150,
        baseRent: 20,
        upgradeRents: [20, 100, 300, 750, 925, 1100]
    },
    "atlantic_avenue": {
        name: "Atlantic Avenue",
        color: "yellow",
        purchasePrice: 260,
        upgradeCost: 150,
        baseRent: 22,
        upgradeRents: [22, 110, 330, 800, 975, 1150]
    },
    "ventnor_avenue": {
        name: "Ventnor Avenue",
        color: "yellow",
        purchasePrice: 260,
        upgradeCost: 150,
        baseRent: 22,
        upgradeRents: [22, 110, 330, 800, 975, 1150]
    },
    "marvin_gardens": {
        name: "Marvin Gardens",
        color: "yellow",
        purchasePrice: 280,
        upgradeCost: 150,
        baseRent: 24,
        upgradeRents: [24, 120, 360, 850, 1025, 1200]
    },
    "pacific_avenue": {
        name: "Pacific Avenue",
        color: "green",
        purchasePrice: 300,
        upgradeCost: 200,
        baseRent: 26,
        upgradeRents: [26, 130, 390, 900, 1100, 1275]
    },
    "north_carolina_avenue": {
        name: "North Carolina Avenue",
        color: "green",
        purchasePrice: 300,
        upgradeCost: 200,
        baseRent: 26,
        upgradeRents: [26, 130, 390, 900, 1100, 1275]
    },
    "pennsylvania_avenue": {
        name: "Pennsylvania Avenue",
        color: "green",
        purchasePrice: 320,
        upgradeCost: 200,
        baseRent: 28,
        upgradeRents: [28, 150, 450, 1000, 1200, 1400]
    },
    "park_place": {
        name: "Park Place",
        color: "dark-blue",
        purchasePrice: 350,
        upgradeCost: 200,
        baseRent: 35,
        upgradeRents: [35, 175, 500, 1100, 1300, 1500]
    },
    "boardwalk": {
        name: "Boardwalk",
        color: "dark-blue",
        purchasePrice: 400,
        upgradeCost: 200,
        baseRent: 50,
        upgradeRents: [50, 200, 600, 1400, 1700, 2000]
    }
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
  apiKey: "AIzaSyD8I7i_K7aQuaQZFr19Zx6yGw1ukpnNN8k",
    authDomain: "monopoly-sync-712c8.firebaseapp.com",
    projectId: "monopoly-sync-712c8",
    storageBucket: "monopoly-sync-712c8.firebasestorage.app",
    messagingSenderId: "418791061260",
    appId: "1:418791061260:web:b2f4a114b95afdfa34bb29"
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

    // --- 2. MODAL TOGGLING & COMBO LOGIC ---
    const propertyModal = document.getElementById('property-modal');
    const historyModal = document.getElementById('history-action-modal');
    const transactionModal = document.getElementById('transaction-modal');

    const propertyElements = document.querySelectorAll('.property-card, .market-item');
    propertyElements.forEach(element => {
        element.addEventListener('click', () => {
            const selectedAvatar = document.querySelector('.avatar-item.selected');
            const selectedBank = document.querySelector('.bank-btn.selected');
            
            if (selectedAvatar || selectedBank) {
                if (selectedAvatar) selectedAvatar.classList.remove('selected');
                if (selectedBank) selectedBank.classList.remove('selected');
                
                transactionModal.classList.remove('hidden');
            } else {
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

    // --- 3. CLOSING MODALS ---
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

    // --- 4. AVATAR & BANK SELECTION LOGIC ---
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

    // --- 5. ACTION BUTTON RESOLUTIONS ---
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
