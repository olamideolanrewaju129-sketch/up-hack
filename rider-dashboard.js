// DOM Elements
const onlineToggle = document.getElementById('onlineToggle');
const statusText = document.getElementById('status-text');
const waitingState = document.getElementById('waitingState');
const activeOrderState = document.getElementById('activeOrderState');

// State
let isOnline = false;

// Online Toggle Handler
if (onlineToggle) {
    onlineToggle.addEventListener('change', (e) => {
        isOnline = e.target.checked;
        updateOnlineStatus();
    });
}

function updateOnlineStatus() {
    if (isOnline) {
        statusText.innerText = "You are currently online";
        statusText.style.color = "#22c55e"; // Green
        waitingState.classList.add('visible'); // Show waiting animation or opacity change
        // In a real app, this would start a connection to the backend
    } else {
        statusText.innerText = "You are currently offline";
        statusText.style.color = "#6b7280"; // Gray
        waitingState.classList.remove('visible');

        // Reset to waiting state if offline
        hideOrder();
    }
}

// Locations Data (Lagos)
const locations = [
    "Ikeja City Mall", "Lekki Phase 1", "Victoria Island", "Surulere", "Yaba",
    "Maryland Mall", "Gbagada", "Magodo Phase 2", "VGC", "Ajah",
    "Festac Town", "Apapa", "Marina", "Ikoyi", "Banana Island"
];

const itemTypes = ["Electronics", "Food", "Document", "Package", "Groceries", "Medicine"];

// Helper to get random item from array
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate random price
function getRandomPrice() {
    return Math.floor(Math.random() * (5000 - 800) + 800);
}

// Helper to generate random distance
function getRandomDistance() {
    return (Math.random() * (25 - 2) + 2).toFixed(1);
}

// Mock Order Simulation
function simulateOrder() {
    if (!isOnline) {
        alert("Please go online first!");
        // Auto switch on for UX demo
        onlineToggle.click();
        return;
    }

    const ordersList = document.getElementById('ordersList');
    const orderCountBadge = document.getElementById('orderCountBadge');

    // Clear previous orders
    ordersList.innerHTML = '';

    // Generate 3-5 orders
    const orderCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5

    orderCountBadge.innerText = orderCount;

    for (let i = 0; i < orderCount; i++) {
        const price = getRandomPrice();
        const distance = getRandomDistance();
        const pickup = getRandom(locations);
        let dropoff = getRandom(locations);

        // Ensure pickup and dropoff are different
        while (dropoff === pickup) {
            dropoff = getRandom(locations);
        }

        const itemType = getRandom(itemTypes);

        const orderHTML = `
            <div class="state-card active-order simulated-order-card" id="order-${i}" style="display: block; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
                <div class="order-header">
                    <span class="order-badge">New Request</span>
                    <span class="timer">00:${Math.floor(Math.random() * 50 + 10)}</span>
                </div>

                <div class="order-details">
                    <div class="route-line">
                        <div class="point pickup">
                            <div class="dot"></div>
                            <div class="text">
                                <h4>Pickup</h4>
                                <p>${pickup}</p>
                            </div>
                        </div>
                        <div class="connector"></div>
                        <div class="point dropoff">
                            <div class="dot"></div>
                            <div class="text">
                                <h4>Dropoff</h4>
                                <p>${dropoff}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="order-info-grid">
                    <div class="info-item">
                        <span>Est. Earning</span>
                        <strong>₦${price.toLocaleString()}</strong>
                    </div>
                    <div class="info-item">
                        <span>Distance</span>
                        <strong>${distance} km</strong>
                    </div>
                    <div class="info-item">
                        <span>Item Type</span>
                        <strong>${itemType}</strong>
                    </div>
                </div>

                <div class="order-actions">
                    <a href="#" class="decline-btn" onclick="event.preventDefault(); removeOrder('order-${i}')">Decline</a>
                    <a href="#" class="accept-btn primary-btn" onclick="event.preventDefault(); acceptOrder(this)">Accept Order</a>
                </div>
            </div>
        `;

        ordersList.insertAdjacentHTML('beforeend', orderHTML);
    }

    waitingState.style.display = 'none';
    activeOrderState.style.display = 'block';
}

function removeOrder(id) {
    const orderCard = document.getElementById(id);
    if (orderCard) {
        orderCard.style.opacity = '0';
        setTimeout(() => {
            orderCard.remove();
            // Update badge
            const count = document.querySelectorAll('.simulated-order-card').length;
            document.getElementById('orderCountBadge').innerText = count;

            if (count === 0) {
                declineOrder(); // Go back to waiting if all declined
            }
        }, 200);
    }
}

function declineOrder() {
    activeOrderState.style.display = 'none';
    waitingState.style.display = 'flex'; // Flex to center content
}

function acceptOrder(btn) {
    // Visual feedback
    btn.innerText = 'Accepted!';
    btn.style.backgroundColor = '#22c55e';

    // Disable all buttons in this specific card or globally?
    // Let's just disable buttons in this card and alert
    const card = btn.closest('.active-order');
    // Disable all buttons/links in this specific card
    if (card) {
        const allBtns = card.querySelectorAll('.order-actions a, .order-actions button');
        allBtns.forEach(b => {
            b.style.pointerEvents = 'none'; // Disable clicks
            b.style.opacity = '0.7';
        });
    }

    setTimeout(() => {
        alert("Order accepted! Navigating to navigation view...");
        // Reset for demo
        declineOrder();
        // In a real app we would navigate to the map view for this specific order
    }, 1000);
}

// Initialize
waitingState.style.display = 'flex'; // Default visible

// Theme Management
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.removeAttribute('data-theme');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Bind Theme Toggle to Settings Link (Temporary for testing)
const settingsLink = document.querySelector('a[href="#"] i[data-lucide="settings"]')?.parentElement;
if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
    });
}


// See More / See Less Functionality used for recent activities
const seeMoreBtn = document.getElementById('seeMoreBtn');
const hiddenItems = document.querySelectorAll('.activity-item.hidden');

if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', () => {
        const isExpanded = seeMoreBtn.getAttribute('data-expanded') === 'true';

        hiddenItems.forEach(item => {
            item.style.display = isExpanded ? 'none' : 'flex';
        });

        if (isExpanded) {
            seeMoreBtn.innerText = 'See More';
            seeMoreBtn.setAttribute('data-expanded', 'false');
        } else {
            seeMoreBtn.innerText = 'See Less';
            seeMoreBtn.setAttribute('data-expanded', 'true');
        }
    });
}


// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.querySelector('.sidebar');
const dashboardContainer = document.querySelector('.dashboard-container');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        dashboardContainer.classList.toggle('sidebar-open');
    });
}

// Close sidebar when clicking overlay
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        dashboardContainer.classList.remove('sidebar-open');
    });
}
