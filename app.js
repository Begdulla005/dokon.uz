// BAZANI YUKLASH
let products = JSON.parse(localStorage.getItem('dokon_products')) || [];

function saveProduct() {
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;

    if(name && price) {
        products.push({ id: Date.now(), name, price });
        localStorage.setItem('dokon_products', JSON.stringify(products));
        alert("Saqlandi!");
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-price').value = '';
    }
}

function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('section-' + pageId).classList.remove('hidden');
    document.getElementById('page-title').innerText = pageId.toUpperCase();
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(pageId)) btn.classList.add('active');
    });
}

// GRAFIKNI CHIZISH
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'],
        datasets: [{ label: 'Savdo', data: [12, 19, 3, 5, 2, 3], borderColor: '#6366f1', tension: 0.4 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { display: false } } }
});