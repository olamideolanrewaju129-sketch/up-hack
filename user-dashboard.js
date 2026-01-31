/**
 * USER DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    initUserDetails();
    renderRecentShipments();
    initTabs();
});

function initUserDetails() {
    const userName = localStorage.getItem('userName') || 'Shipper User';
    const userEmail = localStorage.getItem('userEmail') || 'shipper@upside.com';

    document.getElementById('userNameDisplay').innerText = userName.split(' ')[0];
    document.getElementById('userNameFull').innerText = userName;
    document.getElementById('userEmail').innerText = userEmail;

    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    document.getElementById('userAvatar').innerText = initials || 'U';
}

const mockShipments = [
    { id: '#UP-10294', dest: 'Victoria Island, Lagos', status: 'In Transit', date: 'Today, 4:00 PM' },
    { id: '#UP-10281', dest: 'Lekki Phase 1, Lagos', status: 'Delivered', date: 'Yesterday' },
    { id: '#UP-10275', dest: 'Ikeja Mall, Lagos', status: 'Delivered', date: 'Jan 28' }
];

function renderRecentShipments() {
    const tbody = document.getElementById('recentShipmentsBody');
    if (!tbody) return;

    tbody.innerHTML = mockShipments.map(s => `
        <tr>
            <td style="font-weight: 600; color: var(--primary);">${s.id}</td>
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
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tab = item.getAttribute('data-tab');
            console.log(`Switching to tab: ${tab}`);
            // In a full SPA this would swap out the main content
        });
    });
}
