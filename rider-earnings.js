// Breakdown Data
const breakdownData = {
    today: {
        title: "Today's Delivery Breakdown",
        items: [
            { id: '#UP9281', desc: 'Victoria Island to Lekki', price: 2500, time: '6:45 PM' },
            { id: '#UP9275', desc: 'Ikeja to Maryland', price: 1800, time: '4:20 PM' },
            { id: '#UP9270', desc: 'Surulere to Yaba', price: 2200, time: '1:15 PM' },
            { id: '#UP9265', desc: 'Gbagada to Maroko', price: 1900, time: '10:30 AM' }
        ]
    },
    weekly: {
        title: "Weekly Daily Totals",
        items: [
            { day: 'Monday', desc: '6 Deliveries', price: 4200 },
            { day: 'Tuesday', desc: '10 Deliveries', price: 7500 },
            { day: 'Wednesday', desc: '5 Deliveries', price: 3800 },
            { day: 'Thursday', desc: '12 Deliveries', price: 8900 },
            { day: 'Friday', desc: '9 Deliveries', price: 6400 },
            { day: 'Saturday', desc: '15 Deliveries', price: 12500 },
            { day: 'Sunday', desc: '11 Deliveries', price: 8800 }
        ]
    },
    bonus: {
        title: "Performance Bonus History",
        items: [
            { type: 'Peak Hour Bonus', desc: 'Jan 24 - Jan 31', price: 2000 },
            { type: 'High Rating Bonus', desc: 'Weekly 4.9+ Stars', price: 1500 },
            { type: 'Early Bird Bonus', desc: 'Jan 28', price: 1000 },
            { type: 'Safety Bonus', desc: 'Zero Incidents Week', price: 500 }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initEarningsChart();
    initStatCardClickListeners();
    initModalCloseListener();
});

function initStatCardClickListeners() {
    const cards = document.querySelectorAll('.stats-row .stat-card');

    // Index 0: Today, 1: Weekly, 2: Bonus
    cards[0].onclick = () => openBreakdown('today');
    cards[1].onclick = () => openBreakdown('weekly');
    cards[2].onclick = () => openBreakdown('bonus');
}

function openBreakdown(type) {
    const modal = document.getElementById('breakdownModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const data = breakdownData[type];

    title.innerText = data.title;
    body.innerHTML = '';

    data.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'breakdown-item';

        let label = item.id || item.day || item.type;
        let sub = item.desc;
        if (item.time) sub += ` • ${item.time}`;

        itemEl.innerHTML = `
            <div class="breakdown-info">
                <h4>${label}</h4>
                <p>${sub}</p>
            </div>
            <div class="breakdown-amount">₦${item.price.toLocaleString()}</div>
        `;
        body.appendChild(itemEl);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function initModalCloseListener() {
    const modal = document.getElementById('breakdownModal');
    const closeBtn = document.getElementById('closeModal');

    const closeModalFunc = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModalFunc;
    modal.onclick = (e) => {
        if (e.target === modal) closeModalFunc();
    };
}

// Reuse Chart logic
function initEarningsChart() {
    const canvas = document.getElementById('earningsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Get colors based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Earnings (₦)',
                data: [4200, 7500, 3800, 8900, 6400, 12500, 8800],
                backgroundColor: '#6366f1',
                borderColor: '#6366f1',
                borderWidth: 0,
                borderRadius: 8,
                barThickness: 24,
                hoverBackgroundColor: '#4f46e5'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    titleColor: isDark ? '#f8fafc' : '#0f172a',
                    bodyColor: isDark ? '#f8fafc' : '#0f172a',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return '₦' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: { family: 'Inter' },
                        callback: function (value) {
                            return '₦' + value / 1000 + 'k';
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: textColor,
                        font: { family: 'Inter' }
                    }
                }
            }
        }
    });
}
