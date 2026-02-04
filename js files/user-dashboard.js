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
    const userName = localStorage.getItem('userName') || 'Upside Member';
    const userEmail = localStorage.getItem('userEmail') || 'member@upsidelogistics.com';

    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.innerText = userName.split(' ')[0];
    const nameFull = document.getElementById('userNameFull');
    if (nameFull) nameFull.innerText = userName;

    const emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.innerText = userEmail;

    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const avatar = document.getElementById('userAvatar');
    if (avatar) avatar.innerText = initials || 'U';
}

let allShipments = JSON.parse(localStorage.getItem('upside_shipments')) || [
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

function saveShipments() {
    localStorage.setItem('upside_shipments', JSON.stringify(allShipments));
}

function renderRecentShipments(filter = 'all') {
    const tbody = document.getElementById('recentShipmentsBody');
    const titleEl = document.getElementById('shipments-section-title');
    if (!tbody) return;

    let filteredData = allShipments;
    if (filter === 'active') {
        filteredData = allShipments.filter(s => s.status === 'In Transit');
        if (titleEl) titleEl.innerText = 'Active Shipments';
    } else if (filter === 'delivered') {
        filteredData = allShipments.filter(s => s.status === 'Delivered');
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
            ${filter === 'active' || (filter === 'all' && s.status === 'In Transit') ? `
                <td>
                    <button class="icon-btn cancel-btn" title="Cancel Shipment" onclick="cancelShipment('${s.id}')">
                        <i data-lucide="x-circle" style="color: #ef4444; width: 18px; height: 18px;"></i>
                    </button>
                </td>
            ` : '<td></td>'}
        </tr>
    `).join('');
    lucide.createIcons();
}

/**
 * CANCEL SHIPMENT LOGIC
 */
window.cancelShipment = function (shipmentId) {
    if (confirm(`Are you sure you want to cancel shipment ${shipmentId}?`)) {
        const shipmentIndex = allShipments.findIndex(s => s.id === shipmentId);
        if (shipmentIndex > -1) {
            allShipments[shipmentIndex].status = 'Cancelled';
            saveShipments();

            alert(`Shipment ${shipmentId} has been cancelled.`);

            // Re-render based on current page
            if (document.getElementById('recentShipmentsBody')) renderRecentShipments();
            if (document.getElementById('fullShipmentsBody')) renderShipmentsPage();
            if (document.getElementById('historyShipmentsBody')) initHistoryPage();
        }
    }
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

// SETTINGS PAGE LOGIC
window.initSettingsPage = function () {
    const form = document.getElementById('profileForm');
    const nameInput = document.getElementById('settingsName');
    const emailInput = document.getElementById('settingsEmail');

    if (!form) return;

    // Load current values
    nameInput.value = localStorage.getItem('userName') || '';
    emailInput.value = localStorage.getItem('userEmail') || '';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();

        if (newName) localStorage.setItem('userName', newName);
        if (newEmail) localStorage.setItem('userEmail', newEmail);

        // Update display immediately
        initUserDetails();

        const btn = form.querySelector('.save-settings-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Saved!';
        btn.style.background = '#22c55e';
        lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            lucide.createIcons();
            alert('Settings saved successfully!');
        }, 2000);
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
            const pickup = document.getElementById('pickupLocation').value;
            const dropoff = document.getElementById('dropoffLocation').value;
            const shipmentId = `#UP-${Math.floor(10000 + Math.random() * 90000)}`;

            const newShipment = {
                id: shipmentId,
                dest: dropoff,
                status: 'In Transit',
                date: 'Just Now'
            };

            allShipments.unshift(newShipment);
            saveShipments();

            alert(`Shipment Confirmed! Your rider will arrive shortly to pick up your ${selectedCategory} package. Shipment ID: ${shipmentId}`);
            btn.innerHTML = originalText;
            btn.disabled = false;

            // Re-render recent shipments on overview
            if (document.getElementById('recentShipmentsBody')) renderRecentShipments();

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
        let filtered = allShipments;

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
                    <div style="display: flex; gap: 8px;">
                        <button class="icon-btn" title="View Details" onclick="window.location.href='user-tracking.html?id=${s.id}'"><i data-lucide="eye"></i></button>
                        ${s.status === 'In Transit' ? `
                            <button class="icon-btn cancel-btn" title="Cancel Shipment" onclick="cancelShipment('${s.id}')">
                                <i data-lucide="trash-2" style="color: #ef4444;"></i>
                            </button>
                        ` : ''}
                    </div>
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
            const historyShipments = allShipments.filter(s => s.status === 'Delivered');
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

// STANDALONE SHIPMENT MAP LOGIC
let shipmentMap = null;
let pickupMarker = null;
let dropoffMarker = null;
let routeLine = null;

window.initShipmentMap = function () {
    const mapElement = document.getElementById('shipmentMap');
    if (!mapElement) return;

    // Initialize map centered on Lagos
    shipmentMap = L.map('shipmentMap').setView([6.5244, 3.3792], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(shipmentMap);

    const pickupInput = document.getElementById('pickupLocation');
    const dropoffInput = document.getElementById('dropoffLocation');

    if (pickupInput) {
        pickupInput.addEventListener('input', debounce(() => {
            updateMapMarker('pickup', pickupInput.value);
        }, 800));
    }

    if (dropoffInput) {
        dropoffInput.addEventListener('input', debounce(() => {
            updateMapMarker('dropoff', dropoffInput.value);
        }, 800));
    }
};

function updateMapMarker(type, address) {
    if (!address || address.length < 5) return;

    // Simulated Geocoding (Lagos areas)
    const locations = {
        'ikeja': [6.6018, 3.3515],
        'lekki': [6.4510, 3.4756],
        'victoria island': [6.4281, 3.4219],
        'ajah': [6.4673, 3.5701],
        'yaba': [6.5095, 3.3711],
        'surulere': [6.4994, 3.3424],
        'maryland': [6.5714, 3.3667],
        'oshodi': [6.5546, 3.3392],
        'ikoyi': [6.4474, 3.4384],
        'epe': [6.5841, 3.9839],
        'badagry': [6.4158, 2.8812],
        'ikorodu': [6.6194, 3.5105]
    };

    let coords = [6.5244 + (Math.random() - 0.5) * 0.1, 3.3792 + (Math.random() - 0.5) * 0.1]; // Default random Lagos

    const lowerAddr = address.toLowerCase();
    for (const key in locations) {
        if (lowerAddr.includes(key)) {
            coords = locations[key];
            break;
        }
    }

    if (type === 'pickup') {
        if (pickupMarker) shipmentMap.removeLayer(pickupMarker);
        pickupMarker = L.marker(coords, {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#4f5dff; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); font-weight:bold;'>P</div>",
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(shipmentMap).bindPopup('Pickup: ' + address);
    } else {
        if (dropoffMarker) shipmentMap.removeLayer(dropoffMarker);
        dropoffMarker = L.marker(coords, {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#22c55e; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); font-weight:bold;'>D</div>",
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(shipmentMap).bindPopup('Dropoff: ' + address);
    }

    updateRoute();
}

function updateRoute() {
    if (pickupMarker && dropoffMarker) {
        const p1 = pickupMarker.getLatLng();
        const p2 = dropoffMarker.getLatLng();

        if (routeLine) shipmentMap.removeLayer(routeLine);
        routeLine = L.polyline([p1, p2], { color: '#4f5dff', weight: 4, dashArray: '10, 10', opacity: 0.6 }).addTo(shipmentMap);

        const group = new L.featureGroup([pickupMarker, dropoffMarker]);
        shipmentMap.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else if (pickupMarker) {
        shipmentMap.setView(pickupMarker.getLatLng(), 14);
    } else if (dropoffMarker) {
        shipmentMap.setView(dropoffMarker.getLatLng(), 14);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// EXPENSE BREAKDOWN MODAL LOGIC
window.showSpendingBreakdown = function () {
    const modal = document.getElementById('spendingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

window.closeSpendingModal = function () {
    const modal = document.getElementById('spendingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal when clicking on overlay
document.addEventListener('click', (e) => {
    const modal = document.getElementById('spendingModal');
    if (modal && e.target === modal) {
        closeSpendingModal();
    }
});
