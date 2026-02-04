/**
 * USER DASHBOARD LOGIC
 * Enhanced with tab switching and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    initUserDetails();
    handleQueryParams();

    // Page-specific initializations
    if (document.getElementById('recentShipmentsBody')) renderRecentShipments();
    if (document.querySelector('.tab-nav')) initTabs();
    if (document.getElementById('shippingForm')) initShippingForm();
    if (document.getElementById('card-active')) initStatsInteractivity();
    if (document.getElementById('fullShipmentsBody')) renderShipmentsPage();
    if (document.getElementById('trackInput')) initTrackingPage();
    if (document.getElementById('historyShipmentsBody')) initHistoryPage();
});

function initUserDetails() {
    const userName = localStorage.getItem('userName') || 'Shipper User';
    const userEmail = localStorage.getItem('userEmail') || 'shipper@upside.com';

    document.getElementById('userNameDisplay').innerText = userName.split(' ')[0];
    const nameFull = document.getElementById('userNameFull');
    if (nameFull) nameFull.innerText = userName;

    const emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.innerText = userEmail;

    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const avatar = document.getElementById('userAvatar');
    if (avatar) avatar.innerText = initials || 'U';
}

const mockShipments = [
    { id: '#UP-10294', dest: 'Victoria Island, Lagos', status: 'In Transit', date: 'Today, 4:00 PM' },
    { id: '#UP-10295', dest: 'Ajah, Lagos', status: 'In Transit', date: 'Today, 2:00 PM' },
    { id: '#UP-10296', dest: 'Maryland, Lagos', status: 'In Transit', date: 'Yesterday' },
    { id: '#UP-10297', dest: 'Yaba, Lagos', status: 'In Transit', date: 'Yesterday' },
    { id: '#UP-10298', dest: 'Surulere, Lagos', status: 'In Transit', date: '2 days ago' },
    { id: '#UP-10281', dest: 'Lekki Phase 1, Lagos', status: 'Delivered', date: 'Yesterday' },
    { id: '#UP-10275', dest: 'Ikeja Mall, Lagos', status: 'Delivered', date: 'Jan 28' },
    { id: '#UP-10260', dest: 'Surulere, Lagos', status: 'Delivered', date: 'Jan 25' },
    { id: '#UP-10255', dest: 'Apapa, Lagos', status: 'Delivered', date: 'Jan 22' },
    { id: '#UP-10250', dest: 'Epe, Lagos', status: 'Delivered', date: 'Jan 20' }
];

function renderRecentShipments(filter = 'all') {
    const tbody = document.getElementById('recentShipmentsBody');
    const titleEl = document.getElementById('shipments-section-title');
    if (!tbody) return;

    let filteredData = mockShipments;
    if (filter === 'active') {
        filteredData = mockShipments.filter(s => s.status === 'In Transit');
        if (titleEl) titleEl.innerText = 'Active Shipments';
    } else if (filter === 'delivered') {
        filteredData = mockShipments.filter(s => s.status === 'Delivered');
        if (titleEl) titleEl.innerText = 'Delivered Shipments';
    } else {
        if (titleEl) titleEl.innerText = 'Recent Shipments';
    }

    tbody.innerHTML = filteredData.map((s, index) => `
        <tr style="animation: fadeIn 0.3s ease-out forwards; animation-delay: ${0.05 * index}s; opacity: 0;">
            <td style="font-weight: 700; color: var(--primary); cursor: pointer;" onclick="window.location.href='user-tracking.html?id=${s.id}'">${s.id}</td>
            <td>${s.dest}</td>
            <td><span class="status-badge ${s.status.toLowerCase().replace(' ', '-')}">${s.status}</span></td>
            <td>${s.date}</td>
        </tr>
    `).join('');
}

function initStatsInteractivity() {
    const activeCard = document.getElementById('card-active');
    const deliveredCard = document.getElementById('card-delivered');

    if (activeCard) {
        activeCard.addEventListener('click', () => {
            renderRecentShipments('active');
            document.getElementById('shipments-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (deliveredCard) {
        deliveredCard.addEventListener('click', () => {
            renderRecentShipments('delivered');
            document.getElementById('shipments-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function initTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

window.switchTab = function (tabId) {
    // Update Sidebar
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`.nav-item[data-tab="${tabId}"]`).classList.add('active');

    // Update Content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');

    // Smooth scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initShippingForm() {
    const form = document.getElementById('shippingForm');
    if (!form) return;

    let currentStep = 1;
    const nextBtns = form.querySelectorAll('.next-step');
    const prevBtns = form.querySelectorAll('.prev-step');
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Category Selection Logic
    const categoryCards = form.querySelectorAll('.category-card');
    let selectedCategory = null;

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCategory = card.getAttribute('data-category');
            updateSummary();
        });
    });

    function updateSummary() {
        const pickupInput = document.getElementById('pickupLocation');
        const dropoffInput = document.getElementById('dropoffLocation');
        const summaryPickup = document.getElementById('summary-pickup');
        const summaryDropoff = document.getElementById('summary-dropoff');
        const summaryCategory = document.getElementById('summary-category');
        const summaryCost = document.getElementById('summary-cost');

        if (summaryPickup) summaryPickup.innerText = pickupInput.value || 'Not entered';
        if (summaryDropoff) summaryDropoff.innerText = dropoffInput.value || 'Not entered';
        if (summaryCategory) summaryCategory.innerText = selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Not selected';

        if (selectedCategory) {
            const basePrices = {
                document: 1500,
                small: 2500,
                medium: 4500,
                large: 8500
            };
            const price = basePrices[selectedCategory] + Math.floor(Math.random() * 500);
            if (summaryCost) summaryCost.innerText = `₦${price.toLocaleString()}`;
        }
    }

    function goToStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        document.getElementById(`step-${step}`).classList.add('active');

        progressSteps.forEach((ps, idx) => {
            if (idx + 1 < step) {
                ps.classList.add('completed');
                ps.classList.remove('active');
            } else if (idx + 1 === step) {
                ps.classList.add('active');
                ps.classList.remove('completed');
            } else {
                ps.classList.remove('active', 'completed');
            }
        });

        currentStep = step;
        if (step === 3) updateSummary();
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < 3) goToStep(currentStep + 1);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) goToStep(currentStep - 1);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.calculate-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            alert(`Shipment Confirmed! Your rider will arrive shortly to pick up your ${selectedCategory} package.`);
            btn.innerHTML = originalText;
            btn.disabled = false;
            // Optionally redirect or reset
            window.switchTab('overview');
            resetForm();
        }, 2000);
    });

    function resetForm() {
        form.reset();
        currentStep = 1;
        goToStep(1);
        categoryCards.forEach(c => c.classList.remove('selected'));
        selectedCategory = null;
    }
}

// FULL SHIPMENTS PAGE LOGIC
window.renderShipmentsPage = function () {
    const tableBody = document.getElementById('fullShipmentsBody');
    const searchInput = document.getElementById('shipmentSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('empty-state');

    if (!tableBody) return;

    let currentFilter = 'all';
    let searchQuery = '';

    function render() {
        let filtered = mockShipments;

        // Apply Filter
        if (currentFilter === 'active') {
            filtered = filtered.filter(s => s.status === 'In Transit');
        } else if (currentFilter === 'delivered') {
            filtered = filtered.filter(s => s.status === 'Delivered');
        }

        // Apply Search
        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.dest.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Handle Empty State
        if (filtered.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }

        tableBody.innerHTML = filtered.map((s, index) => `
            <tr style="animation: fadeIn 0.3s ease-out forwards; animation-delay: ${0.05 * index}s; opacity: 0;">
                <td style="font-weight: 700; color: var(--primary); cursor: pointer;" onclick="window.location.href='user-tracking.html?id=${s.id}'">${s.id}</td>
                <td>Lagos, NG</td>
                <td>${s.dest}</td>
                <td><span class="status-badge ${s.status.toLowerCase().replace(' ', '-')}">${s.status}</span></td>
                <td>${s.date}</td>
                <td>
                    <button class="icon-btn" title="View Details" onclick="window.location.href='user-tracking.html?id=${s.id}'"><i data-lucide="eye"></i></button>
                </td>
            </tr>
        `).join('');

        lucide.createIcons();
    }

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            render();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            render();
        });
    });

    render();
}

// Handle query params for tab switching across pages
function handleQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && typeof switchTab === 'function') {
        const tabEl = document.querySelector(`[data-tab="${tab}"]`);
        if (tabEl) switchTab(tab);
    }
}

// TRACKING PAGE LOGIC
let trackMap = null;

window.initTrackingPage = function () {
    // Check if we have a tracking ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('id');
    if (trackId) {
        document.getElementById('trackInput').value = trackId;
        lookupTracking(trackId);
    }
}

window.lookupTracking = function (passedId) {
    const id = (passedId || document.getElementById('trackInput').value).trim().toUpperCase();
    if (!id) return;

    const results = document.getElementById('trackingResults');
    const defState = document.getElementById('trackingDefault');

    // Simulate lookup
    if (id === '#UP-10294' || id === 'UP-10294' || id.includes('UP-')) {
        results.style.display = 'grid';
        defState.style.display = 'none';

        const status = id === 'UP-10294' ? 'In Transit' : 'Package Picked Up';

        renderTimeline([
            { title: 'Order Placed', desc: 'Your request has been received', time: '09:00 AM', status: 'completed' },
            { title: 'Rider Assigned', desc: 'John Oladele is on the way', time: '09:15 AM', status: 'completed' },
            { title: 'Package Picked Up', desc: 'Rider has collected the package', time: '09:45 AM', status: status === 'In Transit' ? 'completed' : 'active' },
            { title: 'In Transit', desc: 'Moving towards destination', time: status === 'In Transit' ? '10:30 AM' : 'Pending', status: status === 'In Transit' ? 'active' : 'pending' },
            { title: 'Delivered', desc: 'Final destination reached', time: 'Pending', status: 'pending' }
        ]);

        document.getElementById('trackStatus').innerText = status;
        initLeafletMap();
    } else {
        alert("Shipment not found. Try #UP-10294 for a demo.");
    }
}

function renderTimeline(steps) {
    const container = document.getElementById('trackingTimeline');
    if (!container) return;
    container.innerHTML = steps.map(s => `
        <div class="timeline-step ${s.status}">
            <div class="dot"></div>
            <div class="timeline-content">
                <h4>${s.title}</h4>
                <p>${s.desc}</p>
                <div class="time">${s.time}</div>
            </div>
        </div>
    `).join('');
}

function initLeafletMap() {
    if (trackMap) return; // Already initialized

    const mapElement = document.getElementById('trackMap');
    if (!mapElement) return;

    trackMap = L.map('trackMap').setView([6.5244, 3.3792], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(trackMap);

    // Add markers
    const pickup = L.marker([6.6018, 3.3515]).addTo(trackMap).bindPopup('Pickup: Ikeja Mall');
    const dropoff = L.marker([6.4510, 3.4756]).addTo(trackMap).bindPopup('Destination: Lekki');

    const group = new L.featureGroup([pickup, dropoff]);
    trackMap.fitBounds(group.getBounds(), { padding: [50, 50] });

    // Polyline
    L.polyline([[6.6018, 3.3515], [6.4510, 3.4756]], { color: '#4f5dff', weight: 4, dashArray: '10, 10' }).addTo(trackMap);
}

const mockTransactions = [
    { id: 'TRX-99281', type: 'Top Up', amount: 5000, status: 'Success', date: 'Feb 01, 2024' },
    { id: 'TRX-99275', type: 'Payment', amount: -2500, status: 'Success', date: 'Jan 28, 2024' },
    { id: 'TRX-99264', type: 'Payment', amount: -1800, status: 'Success', date: 'Jan 25, 2024' },
    { id: 'TRX-99250', type: 'Top Up', amount: 10000, status: 'Success', date: 'Jan 20, 2024' },
    { id: 'TRX-99242', type: 'Payment', amount: -4200, status: 'Failed', date: 'Jan 18, 2024' }
];

window.switchHistoryTab = function (tab) {
    document.querySelectorAll('.history-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.history-tabs .filter-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(`history-${tab}`).classList.add('active');
    event.currentTarget.classList.add('active');
};

window.initHistoryPage = function () {
    const shipmentsBody = document.getElementById('historyShipmentsBody');
    const transactionsBody = document.getElementById('historyTransactionsBody');
    const searchInput = document.getElementById('historySearch');

    function render() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';

        // Render Shipments
        if (shipmentsBody) {
            const historyShipments = mockShipments.filter(s => s.status === 'Delivered');
            const filtered = historyShipments.filter(s =>
                s.id.toLowerCase().includes(query) || s.dest.toLowerCase().includes(query)
            );

            shipmentsBody.innerHTML = filtered.map((s, index) => `
                <tr style="animation: fadeIn 0.3s ease-out forwards; animation-delay: ${0.05 * index}s; opacity: 0;">
                    <td style="font-weight: 700; color: var(--primary); cursor: pointer;" onclick="window.location.href='user-tracking.html?id=${s.id}'">${s.id}</td>
                    <td>${s.dest}</td>
                    <td><span class="status-badge delivered">Delivered</span></td>
                    <td>${s.date}</td>
                    <td>₦${(2000 + Math.floor(Math.random() * 3000)).toLocaleString()}</td>
                </tr>
            `).join('');
        }

        // Render Transactions
        if (transactionsBody) {
            const filteredTrx = mockTransactions.filter(t =>
                t.id.toLowerCase().includes(query) || t.type.toLowerCase().includes(query)
            );

            transactionsBody.innerHTML = filteredTrx.map((t, index) => `
                <tr style="animation: fadeIn 0.3s ease-out forwards; animation-delay: ${0.05 * index}s; opacity: 0;">
                    <td style="font-weight: 700;">${t.id}</td>
                    <td><span class="status-badge ${t.type.toLowerCase().replace(' ', '-')}">${t.type}</span></td>
                    <td style="color: ${t.amount > 0 ? '#22c55e' : '#ef4444'}; font-weight: 700;">
                        ${t.amount > 0 ? '+' : ''}₦${Math.abs(t.amount).toLocaleString()}
                    </td>
                    <td><span class="status-badge ${t.status.toLowerCase()}">${t.status}</span></td>
                    <td>${t.date}</td>
                </tr>
            `).join('');
        }

        lucide.createIcons();
    }

    if (searchInput) {
        searchInput.addEventListener('input', render);
    }

    render();
};
