// 1. SAVDO DINAMIKASI (LINE CHART)
const ctxSales = document.getElementById('salesChart').getContext('2d');
new Chart(ctxSales, {
    type: 'line',
    data: {
        labels: ['Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha', 'Yak'],
        datasets: [{
            label: 'Savdo (mln)',
            data: [12, 19, 15, 25, 22, 30, 28], //
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 4,
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
        }
    }
});

// 2. TO'LOV TURLARI (PIE/DONUT CHART)
const ctxPay = document.getElementById('paymentChart').getContext('2d');
new Chart(ctxPay, {
    type: 'doughnut',
    data: {
        labels: ['Naqd', 'Plastik', 'Nasiya'],
        datasets: [{
            data: [45, 35, 20], // Foizlar
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: { legend: { display: false } }
    }
});