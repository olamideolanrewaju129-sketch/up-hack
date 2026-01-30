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

// Mock Order Simulation
function simulateOrder() {
    if (!isOnline) {
        alert("Please go online first!");
        // Auto switch on for UX demo
        onlineToggle.click();
        return;
    }

    waitingState.style.display = 'none';
    activeOrderState.style.display = 'block';

    // Play a sound or animation if we had one
}

function declineOrder() {
    activeOrderState.style.display = 'none';
    waitingState.style.display = 'flex'; // Flex to center content
}

function acceptOrder() {
    const btn = document.querySelector('.accept-btn');
    btn.innerText = 'Accepted!';
    btn.style.backgroundColor = '#22c55e';

    setTimeout(() => {
        alert("Order accepted! Navigating to navigation view...");
        // Reset for demo
        declineOrder();
        btn.innerText = 'Accept Order';
        btn.style.backgroundColor = ''; // Reset to default class style
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
