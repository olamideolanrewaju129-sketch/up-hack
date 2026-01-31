// Map Initialization
let map;
let currentRouteLine;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    renderDeliveries();
});

function initMap() {
    // Center on Lagos, Nigeria
    map = L.map('map').setView([6.5244, 3.3792], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Zoom controls are top-left by default, let's keep them there
}

// Mock Data
const deliveryHistory = [
    {
        id: 'del_001',
        date: 'Today, 10:23 AM',
        price: 2500,
        status: 'Delivered',
        pickup: { name: "Ikeja City Mall", lat: 6.6018, lng: 3.3515 },
        dropoff: { name: "Maryland Mall", lat: 6.5727, lng: 3.3670 },
        items: "Electronics"
    },
    {
        id: 'del_002',
        date: 'Yesterday, 4:15 PM',
        price: 4200,
        status: 'Delivered',
        pickup: { name: "Victoria Island", lat: 6.4281, lng: 3.4219 },
        dropoff: { name: "Lekki Phase 1", lat: 6.4510, lng: 3.4756 },
        items: "Food Delivery"
    },
    {
        id: 'del_003',
        date: 'Jan 28, 2:30 PM',
        price: 1800,
        status: 'Canceled',
        pickup: { name: "Yaba", lat: 6.5095, lng: 3.3711 },
        dropoff: { name: "Surulere", lat: 6.4973, lng: 3.3718 },
        items: "Document"
    },
    {
        id: 'del_004',
        date: 'Jan 27, 11:00 AM',
        price: 3500,
        status: 'Delivered',
        pickup: { name: "Gbagada", lat: 6.5562, lng: 3.3932 },
        dropoff: { name: "Ikoyi", lat: 6.4446, lng: 3.4258 },
        items: "Package"
    },
    {
        id: 'del_005',
        date: 'Jan 26, 9:45 AM',
        price: 1200,
        status: 'Delivered',
        pickup: { name: "Magodo", lat: 6.6194, lng: 3.3926 },
        dropoff: { name: "Ikeja", lat: 6.6018, lng: 3.3515 },
        items: "Medicine"
    }
];

function renderDeliveries() {
    const container = document.getElementById('deliveriesListWrapper');
    container.innerHTML = '';

    deliveryHistory.forEach((del, index) => {
        const isSelected = index === 0; // Select first by default

        const card = document.createElement('div');
        card.className = `delivery-card ${isSelected ? 'selected' : ''}`;
        card.onclick = () => selectDelivery(del, card);
        card.innerHTML = `
            <div class="del-header">
                <span class="del-date">${del.date}</span>
                <span class="del-status ${del.status.toLowerCase()}">${del.status}</span>
            </div>
            <div class="del-route">
                <div class="route-node">
                    <div class="dot pick"></div>
                    <span class="loc">${del.pickup.name}</span>
                </div>
                <div class="route-line-vert"></div>
                <div class="route-node">
                    <div class="dot drop"></div>
                    <span class="loc">${del.dropoff.name}</span>
                </div>
            </div>
            <div class="del-footer">
                <span class="del-price">₦${del.price.toLocaleString()}</span>
                <span class="del-items">${del.items}</span>
            </div>
        `;
        container.appendChild(card);

        if (isSelected) {
            drawRoute(del);
        }
    });
}

function selectDelivery(del, card) {
    // Update UI highlights
    document.querySelectorAll('.delivery-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    // Draw Map
    drawRoute(del);
}

function drawRoute(del) {
    // Clear existing
    if (currentRouteLine) map.removeLayer(currentRouteLine);
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Add Markers
    const pickMarker = L.marker([del.pickup.lat, del.pickup.lng]).addTo(map)
        .bindPopup(`<b>Pickup:</b> ${del.pickup.name}`);

    const dropMarker = L.marker([del.dropoff.lat, del.dropoff.lng]).addTo(map)
        .bindPopup(`<b>Dropoff:</b> ${del.dropoff.name}`);

    markers.push(pickMarker, dropMarker);

    // Draw Line (Polyline)
    const latlngs = [
        [del.pickup.lat, del.pickup.lng],
        [del.dropoff.lat, del.dropoff.lng]
    ];

    currentRouteLine = L.polyline(latlngs, { color: '#6366f1', weight: 4, opacity: 0.8 }).addTo(map);

    // Fit bounds
    map.fitBounds(latlngs, { padding: [50, 50] });
}
