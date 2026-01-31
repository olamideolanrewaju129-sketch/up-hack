/**
 * UPDATED RIDER CORE JS
 * Consolidates: rider-dashboard.js, rider-deliveries.js, rider-earnings.js, 
 *               rider-notifications.js, rider-settings.js
 */

// --- SHARED DATA ---
const locations = [
    "Ikeja City Mall", "Lekki Phase 1", "Victoria Island", "Surulere", "Yaba",
    "Maryland Mall", "Gbagada", "Magodo Phase 2", "VGC", "Ajah",
    "Festac Town", "Apapa", "Marina", "Ikoyi", "Banana Island"
];

const itemTypes = ["Electronics", "Food", "Document", "Package", "Groceries", "Medicine"];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Global initializations
    initUserProfile();
    initMobileMenu();

    // Page-specific initializations based on present DOM elements
    if (document.getElementById('onlineToggle')) initDashboard();
    if (document.getElementById('map')) initDeliveries();
    if (document.getElementById('earningsChart')) initEarnings();
    if (document.getElementById('notificationsList')) initNotifications();
    if (document.getElementById('profileForm') || document.getElementById('themeSettingToggle')) initSettings();

    // Listen for global theme changes to sync toggles if present
    window.addEventListener('themeChanged', () => {
        if (typeof syncThemeToggle === 'function') syncThemeToggle();
    });
});

// --- GLOBAL UTILITIES ---

function initUserProfile() {
    const userName = localStorage.getItem('riderName') || 'Rider User';

    // Update Welcome message
    const welcomeSpan = document.querySelector('.header-left h1 span');
    if (welcomeSpan) {
        welcomeSpan.innerText = userName.split(' ')[0];
    }

    // Update Avatar Initials
    const avatars = document.querySelectorAll('.avatar');
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    avatars.forEach(avatar => {
        avatar.innerText = initials || 'R';
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const dashboardContainer = document.querySelector('.dashboard-container');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            dashboardContainer.classList.toggle('sidebar-open');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            dashboardContainer.classList.remove('sidebar-open');
        });
    }
}

// --- DASHBOARD LOGIC ---
let isOnline = false;

function initDashboard() {
    const onlineToggle = document.getElementById('onlineToggle');
    const waitingState = document.getElementById('waitingState');

    if (onlineToggle) {
        onlineToggle.addEventListener('change', (e) => {
            isOnline = e.target.checked;
            updateOnlineStatus();
        });
    }

    if (waitingState) waitingState.style.display = 'flex';

    // See More / See Less
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const hiddenItems = document.querySelectorAll('.activity-item.hidden');

    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            const isExpanded = seeMoreBtn.getAttribute('data-expanded') === 'true';
            hiddenItems.forEach(item => {
                item.style.display = isExpanded ? 'none' : 'flex';
            });
            seeMoreBtn.innerText = isExpanded ? 'See More' : 'See Less';
            seeMoreBtn.setAttribute('data-expanded', !isExpanded);
        });
    }
}

function updateOnlineStatus() {
    const statusText = document.getElementById('status-text');
    const waitingState = document.getElementById('waitingState');
    const activeOrderState = document.getElementById('activeOrderState');

    if (isOnline) {
        statusText.innerText = "You are currently online";
        statusText.style.color = "#22c55e";
        if (waitingState) waitingState.classList.add('visible');
    } else {
        statusText.innerText = "You are currently offline";
        statusText.style.color = "#6b7280";
        if (waitingState) waitingState.classList.remove('visible');
        if (activeOrderState) activeOrderState.style.display = 'none';
        if (waitingState) waitingState.style.display = 'flex';
    }
}

// Global functions for inline onclick handlers in dashboard
window.simulateOrder = function () {
    if (!isOnline) {
        alert("Please go online first!");
        document.getElementById('onlineToggle').click();
        return;
    }

    const ordersList = document.getElementById('ordersList');
    const orderCountBadge = document.getElementById('orderCountBadge');
    ordersList.innerHTML = '';

    const orderCount = Math.floor(Math.random() * 3) + 3;
    orderCountBadge.innerText = orderCount;

    for (let i = 0; i < orderCount; i++) {
        const price = Math.floor(Math.random() * (5000 - 800) + 800);
        const distance = (Math.random() * (25 - 2) + 2).toFixed(1);
        const pickup = locations[Math.floor(Math.random() * locations.length)];
        let dropoff = locations[Math.floor(Math.random() * locations.length)];
        while (dropoff === pickup) dropoff = locations[Math.floor(Math.random() * locations.length)];

        const orderHTML = `
            <div class="state-card active-order simulated-order-card" id="order-${i}" style="display: block; margin-bottom: 20px;">
                <div class="order-header"><span class="order-badge">New Request</span></div>
                <div class="order-details">
                    <div class="route-line">
                        <div class="point pickup"><div class="dot"></div><div class="text"><h4>Pickup</h4><p>${pickup}</p></div></div>
                        <div class="connector"></div>
                        <div class="point dropoff"><div class="dot"></div><div class="text"><h4>Dropoff</h4><p>${dropoff}</p></div></div>
                    </div>
                </div>
                <div class="order-info-grid">
                    <div class="info-item"><span>Est. Earning</span><strong>₦${price.toLocaleString()}</strong></div>
                    <div class="info-item"><span>Distance</span><strong>${distance} km</strong></div>
                </div>
                <div class="order-actions">
                    <button class="decline-btn" onclick="removeOrder('order-${i}')">Decline</button>
                    <button class="accept-btn primary-btn" onclick="acceptOrder(this)">Accept Order</button>
                </div>
            </div>`;
        ordersList.insertAdjacentHTML('beforeend', orderHTML);
    }

    document.getElementById('waitingState').style.display = 'none';
    document.getElementById('activeOrderState').style.display = 'block';
};

window.removeOrder = function (id) {
    const orderCard = document.getElementById(id);
    if (orderCard) {
        orderCard.style.opacity = '0';
        setTimeout(() => {
            orderCard.remove();
            const count = document.querySelectorAll('.simulated-order-card').length;
            document.getElementById('orderCountBadge').innerText = count;
            if (count === 0) {
                document.getElementById('activeOrderState').style.display = 'none';
                document.getElementById('waitingState').style.display = 'flex';
            }
        }, 200);
    }
};

window.acceptOrder = function (btn) {
    btn.innerText = 'Accepted!';
    btn.style.backgroundColor = '#22c55e';
    const card = btn.closest('.active-order');
    if (card) {
        card.querySelectorAll('button').forEach(b => { b.disabled = true; b.style.opacity = '0.7'; });
    }
    setTimeout(() => {
        alert("Order accepted!");
        document.getElementById('activeOrderState').style.display = 'none';
        document.getElementById('waitingState').style.display = 'flex';
    }, 1000);
};

// --- DELIVERIES LOGIC ---
let deliveryMap, currentRouteLine, deliveryMarkers = [];
let currentDeliveryFilter = 'All';

function initDeliveries() {
    deliveryMap = L.map('map').setView([6.5244, 3.3792], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(deliveryMap);

    const filterBtns = document.querySelectorAll('.filter-chip');
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDeliveryFilter = btn.innerText;
            renderDeliveries();
        };
    });
    renderDeliveries();
}

const deliveryHistory = [
    { id: 'del_001', date: 'Today, 10:23 AM', price: 2500, status: 'Completed', pickup: { name: "Ikeja City Mall", lat: 6.6018, lng: 3.3515 }, dropoff: { name: "Maryland Mall", lat: 6.5727, lng: 3.3670 }, items: "Electronics" },
    { id: 'del_002', date: 'Yesterday, 4:15 PM', price: 4200, status: 'Completed', pickup: { name: "Victoria Island", lat: 6.4281, lng: 3.4219 }, dropoff: { name: "Lekki Phase 1", lat: 6.4510, lng: 3.4756 }, items: "Food" },
    { id: 'del_003', date: 'Jan 28, 2:30 PM', price: 1800, status: 'Canceled', pickup: { name: "Yaba", lat: 6.5095, lng: 3.3711 }, dropoff: { name: "Surulere", lat: 6.4973, lng: 3.3718 }, items: "Document" }
];

function renderDeliveries() {
    const container = document.getElementById('deliveriesListWrapper');
    if (!container) return;
    container.innerHTML = '';

    const filtered = deliveryHistory.filter(del => {
        if (currentDeliveryFilter === 'All') return true;
        if (currentDeliveryFilter === 'Completed') return del.status === 'Completed';
        if (currentDeliveryFilter === 'Canceled') return del.status === 'Canceled';
        return true;
    });

    filtered.forEach((del, index) => {
        const card = document.createElement('div');
        card.className = `delivery-card ${index === 0 ? 'selected' : ''}`;
        card.onclick = () => {
            document.querySelectorAll('.delivery-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            drawRoute(del);
        };
        card.innerHTML = `<div class="del-header"><span>${del.date}</span><span class="del-status ${del.status.toLowerCase()}">${del.status}</span></div>
                          <div class="del-route"><span class="loc">${del.pickup.name}</span> → <span class="loc">${del.dropoff.name}</span></div>`;
        container.appendChild(card);
        if (index === 0) drawRoute(del);
    });
}

function drawRoute(del) {
    if (currentRouteLine) deliveryMap.removeLayer(currentRouteLine);
    deliveryMarkers.forEach(m => deliveryMap.removeLayer(m));
    deliveryMarkers = [];

    const p = L.marker([del.pickup.lat, del.pickup.lng]).addTo(deliveryMap);
    const d = L.marker([del.dropoff.lat, del.dropoff.lng]).addTo(deliveryMap);
    deliveryMarkers.push(p, d);

    currentRouteLine = L.polyline([[del.pickup.lat, del.pickup.lng], [del.dropoff.lat, del.dropoff.lng]], { color: '#6366f1', weight: 4 }).addTo(deliveryMap);
    deliveryMap.fitBounds(currentRouteLine.getBounds(), { padding: [50, 50] });
}

// --- EARNINGS LOGIC ---
function initEarnings() {
    const cards = document.querySelectorAll('.stats-row .stat-card');
    if (cards.length >= 3) {
        cards[0].onclick = () => openBreakdown('today');
        cards[1].onclick = () => openBreakdown('weekly');
        cards[2].onclick = () => openBreakdown('bonus');
    }

    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.onclick = () => document.getElementById('breakdownModal').classList.remove('active');

    initEarningsChart();
}

function initEarningsChart() {
    const ctx = document.getElementById('earningsChart')?.getContext('2d');
    if (!ctx) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: [4200, 7500, 3800, 8900, 6400, 12500, 8800], backgroundColor: '#6366f1', borderRadius: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

const breakdownData = {
    today: { title: "Today's Deliveries", items: [{ id: '#UP9281', desc: 'VI to Lekki', price: 2500 }] },
    weekly: { title: "Weekly Totals", items: [{ day: 'Mon', price: 4200 }] },
    bonus: { title: "Bonuses", items: [{ type: 'Peak Hour', price: 2000 }] }
};

function openBreakdown(type) {
    const modal = document.getElementById('breakdownModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const data = breakdownData[type];

    title.innerText = data.title;
    body.innerHTML = data.items.map(item => `
        <div class="breakdown-item">
            <div><h4>${item.id || item.day || item.type}</h4><p>${item.desc || ''}</p></div>
            <div>₦${item.price.toLocaleString()}</div>
        </div>`).join('');
    modal.classList.add('active');
}

// --- NOTIFICATIONS LOGIC ---
let notifications = [
    { id: 1, type: 'order', title: 'New Delivery', message: 'Request from Ikeja Mall', time: 'Just now', unread: true, icon: 'package' },
    { id: 2, type: 'earning', title: 'Payout', message: '₦15,000 processed', time: '2 hours ago', unread: true, icon: 'wallet' }
];

function initNotifications() {
    renderNotifications('all');
    document.querySelectorAll('.filter-chip').forEach(f => {
        f.onclick = () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            f.classList.add('active');
            renderNotifications(f.getAttribute('data-filter'));
        };
    });
    document.getElementById('markAllRead')?.addEventListener('click', () => {
        notifications.forEach(n => n.unread = false);
        renderNotifications('all');
    });
}

function renderNotifications(filter) {
    const list = document.getElementById('notificationsList');
    if (!list) return;
    list.innerHTML = '';
    const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && n.unread));

    filtered.forEach(n => {
        const item = document.createElement('div');
        item.className = `notification-card ${n.unread ? 'unread' : ''}`;
        item.innerHTML = `<h4>${n.title}</h4><p>${n.message}</p>
                          <button onclick="markRead(${n.id})">Mark as read</button>
                          <button onclick="deleteNotif(${n.id})">Delete</button>`;
        list.appendChild(item);
    });
    lucide.createIcons();
}

window.markRead = function (id) {
    const n = notifications.find(x => x.id === id);
    if (n) { n.unread = false; renderNotifications('all'); }
};

window.deleteNotif = function (id) {
    notifications = notifications.filter(x => x.id !== id);
    renderNotifications('all');
};

// --- SETTINGS LOGIC ---
function initSettings() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.settings-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
        };
    });

    // Profile Load/Save
    const nameInput = document.getElementById('settingName');
    const emailInput = document.getElementById('settingEmail');
    if (nameInput) nameInput.value = localStorage.getItem('riderName') || '';
    if (emailInput) emailInput.value = localStorage.getItem('riderEmail') || '';

    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('riderName', nameInput.value);
        localStorage.setItem('riderEmail', emailInput.value);
        initUserProfile();
        alert('Profile saved!');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeSettingToggle');
    if (themeToggle) {
        syncThemeToggle();
        themeToggle.onchange = () => { if (typeof toggleTheme === 'function') toggleTheme(); };
    }
}

function syncThemeToggle() {
    const themeToggle = document.getElementById('themeSettingToggle');
    if (themeToggle) {
        themeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    }
}









// theme toggle

(function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    window.toggleTheme = function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }

        // Dispatch event for other components to listen to
        window.dispatchEvent(new Event('themeChanged'));
    };
})();
