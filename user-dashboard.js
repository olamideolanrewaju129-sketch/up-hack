/**
 * USER DASHBOARD LOGIC
 * Enhanced with tab switching and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    initUserDetails();
    renderRecentShipments();
    initTabs();
    initShippingForm();
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
    { id: '#UP-10281', dest: 'Lekki Phase 1, Lagos', status: 'Delivered', date: 'Yesterday' },
    { id: '#UP-10275', dest: 'Ikeja Mall, Lagos', status: 'Delivered', date: 'Jan 28' },
    { id: '#UP-10260', dest: 'Surulere, Lagos', status: 'Delivered', date: 'Jan 25' }
];

function renderRecentShipments() {
    const tbody = document.getElementById('recentShipmentsBody');
    if (!tbody) return;

    tbody.innerHTML = mockShipments.map((s, index) => `
        <tr style="animation: fadeIn 0.3s ease-out forwards; animation-delay: ${0.1 * index}s; opacity: 0;">
            <td style="font-weight: 700; color: var(--primary); cursor: pointer;">${s.id}</td>
            <td>${s.dest}</td>
            <td><span class="status-badge ${s.status.toLowerCase().replace(' ', '-')}">${s.status}</span></td>
            <td>${s.date}</td>
        </tr>
    `).join('');
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
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Calculating...';
            btn.disabled = true;

            setTimeout(() => {
                const cost = Math.floor(Math.random() * (5000 - 1500 + 1)) + 1500;
                alert(`Estimated Shipping Cost: ₦${cost.toLocaleString()}\n\nYou can proceed to payment in the next version!`);
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
}
