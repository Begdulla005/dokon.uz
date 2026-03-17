// MA'LUMOTLARNI YUKLASH (LocalStorage)
let products = JSON.parse(localStorage.getItem('dokon_products')) || [];

// SAHIFALARNI BOSHQARISH
function switchPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById('section-' + page).classList.remove('hidden');
    document.getElementById('btn-' + page).classList.add('active');
    document.getElementById('page-title').innerText = page.charAt(0).toUpperCase() + page.slice(1);
    
    if(page === 'mahsulotlar') renderProducts();
}

// MAHSULOT QO'SHISH
function addProduct() {
    const name = document.getElementById('in-name').value;
    const price = document.getElementById('in-price').value;

    if(name && price) {
        products.push({ id: Date.now(), name, price });
        localStorage.setItem('dokon_products', JSON.stringify(products));
        alert("Saqlandi!");
        document.getElementById('in-name').value = '';
        document.getElementById('in-price').value = '';
        renderProducts();
    }
}

// JADVALNI CHIZISH
function renderProducts() {
    const table = document.getElementById('product-table-body');
    table.innerHTML = products.map(p => `
        <tr class="border-b border-slate-800/50">
            <td class="py-4 font-bold text-slate-200">${p.name}</td>
            <td class="py-4 text-indigo-400 font-black">${Number(p.price).toLocaleString()} so'm</td>
            <td class="py-4 text-center">
                <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// O'CHIRISH
function deleteProduct(id) {
    if(confirm("O'chirilsinmi?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('dokon_products', JSON.stringify(products));
        renderProducts();
    }
}

// GRAFIKNI CHIZISH
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'],
        datasets: [{
            label: 'Savdo',
            data: [10, 25, 15, 30, 20, 35],
            borderColor: '#6366f1',
            borderWidth: 4,
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { grid: { display: false } } }
    }
});

// ILK YUKLANISHDA JADVALNI TO'LDIRISH
renderProducts();