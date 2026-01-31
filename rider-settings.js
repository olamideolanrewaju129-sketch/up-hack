document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadProfileData();
    initSettingsActions();
    syncThemeToggle();
});

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.settings-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Update tab buttons
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panes
            panes.forEach(p => {
                p.classList.remove('active');
                if (p.id === target) p.classList.add('active');
            });
        });
    });
}

function loadProfileData() {
    const currentName = localStorage.getItem('riderName') || 'Rider User';
    const nameInput = document.getElementById('settingName');
    if (nameInput) nameInput.value = currentName;

    // Load Preferences
    const navApp = localStorage.getItem('navApp') || 'google';
    const autoAccept = localStorage.getItem('autoAccept') === 'true';

    const navSelect = document.getElementById('navAppSelect');
    const autoToggle = document.getElementById('autoAcceptToggle');

    if (navSelect) navSelect.value = navApp;
    if (autoToggle) autoToggle.checked = autoAccept;
}

function initSettingsActions() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('settingName').value;
            if (newName.trim() !== "") {
                localStorage.setItem('riderName', newName);
                // Call global profile sync from rider-dashboard.js
                if (typeof initUserProfile === 'function') initUserProfile();
                alert('Profile updated successfully!');
            }
        });
    }

    const themeToggle = document.getElementById('themeSettingToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            // toggleTheme() is global in rider-dashboard.js
            if (typeof toggleTheme === 'function') toggleTheme();
        });
    }

    const navSelect = document.getElementById('navAppSelect');
    if (navSelect) {
        navSelect.addEventListener('change', (e) => {
            localStorage.setItem('navApp', e.target.value);
            // Optionally show a toast
        });
    }

    const autoToggle = document.getElementById('autoAcceptToggle');
    if (autoToggle) {
        autoToggle.addEventListener('change', (e) => {
            localStorage.setItem('autoAccept', e.target.checked);
        });
    }
}

function syncThemeToggle() {
    const themeToggle = document.getElementById('themeSettingToggle');
    if (themeToggle) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.checked = isDark;
    }
}
