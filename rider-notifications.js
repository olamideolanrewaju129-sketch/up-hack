// Mock Notifications Data
let notifications = [
    {
        id: 1,
        type: 'order',
        title: 'New Delivery Available',
        message: 'A new delivery request from Ikeja Mall is available in your area.',
        time: 'Just now',
        unread: true,
        icon: 'package'
    },
    {
        id: 2,
        type: 'earning',
        title: 'Payout Successful',
        message: 'Your withdrawal of ₦15,000 has been processed successfully.',
        time: '2 hours ago',
        unread: true,
        icon: 'wallet'
    },
    {
        id: 3,
        type: 'system',
        title: 'App Update Available',
        message: 'Version 2.4.0 is out! Update now to enjoy new features and performance improvements.',
        time: '5 hours ago',
        unread: false,
        icon: 'smartphone'
    },
    {
        id: 4,
        type: 'order',
        title: 'Order Completed',
        message: 'Order #UP-4429 has been delivered successfully. You earned ₦2,200.',
        time: 'Yesterday',
        unread: false,
        icon: 'check-circle'
    },
    {
        id: 5,
        type: 'system',
        title: 'Safety Reminder',
        message: 'Always remember to wear your helmet and follow traffic rules for a safe trip.',
        time: 'Yesterday',
        unread: false,
        icon: 'shield-alert'
    },
    {
        id: 6,
        type: 'earning',
        title: 'Bonus Received!',
        message: 'You have been awarded a ₦1,500 weekly performance bonus.',
        time: '2 days ago',
        unread: false,
        icon: 'gift'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderNotifications('all');
    initFilterListeners();
    initActionListeners();
});

function renderNotifications(filter) {
    const list = document.getElementById('notificationsList');
    if (!list) return;

    list.innerHTML = '';

    const filtered = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return notif.unread;
        if (filter === 'system') return notif.type === 'system';
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i data-lucide="bell-off"></i></div>
                <h3>No notifications found</h3>
                <p>We'll notify you when something important happens.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filtered.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notification-card ${notif.unread ? 'unread' : ''}`;
        item.setAttribute('data-id', notif.id);

        item.innerHTML = `
            <div class="notif-icon-box ${notif.type}">
                <i data-lucide="${notif.icon}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-header">
                    <h4>${notif.title}</h4>
                    <span class="notif-time">${notif.time}</span>
                </div>
                <p>${notif.message}</p>
                <div class="notif-actions">
                    ${notif.unread ? `<button class="mark-btn" onclick="markRead(${notif.id})">Mark as read</button>` : ''}
                    <button class="delete-btn" onclick="deleteNotif(${notif.id})">Delete</button>
                </div>
            </div>
            ${notif.unread ? '<div class="unread-dot"></div>' : ''}
        `;
        list.appendChild(item);
    });

    lucide.createIcons();
}

function initFilterListeners() {
    const filters = document.querySelectorAll('.filter-chip');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            renderNotifications(filter.getAttribute('data-filter'));
        });
    });
}

function initActionListeners() {
    const markAllBtn = document.getElementById('markAllRead');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            notifications = notifications.map(notif => ({ ...notif, unread: false }));
            renderNotifications(document.querySelector('.filter-chip.active').getAttribute('data-filter'));
        });
    }
}

function markRead(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        notif.unread = false;
        renderNotifications(document.querySelector('.filter-chip.active').getAttribute('data-filter'));
    }
}

function deleteNotif(id) {
    notifications = notifications.filter(n => n.id !== id);
    renderNotifications(document.querySelector('.filter-chip.active').getAttribute('data-filter'));
}
