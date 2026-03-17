// 1. MA'LUMOTLARNI YUKLASH (LocalStorage)
let products = JSON.parse(localStorage.getItem('dokon_products')) || [];

// 2. SAHIFALARNI BOSHQARISH
function switchPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById('section-' + page).classList.remove('hidden');
    document.getElementById('btn-' + page).classList.add('active');
    document.getElementById('page-title').innerText = page.charAt(0).toUpperCase() + page.slice(1);
    
    if(page === 'mahsulotlar') renderProducts();
}

// 3. MAHSULOT QO'SHISH
function addProduct() {
    const name = document.getElementById('in-name').value;
    const price = document.getElementById('in-price').value;

    if(name && price) {
        products.push({ id: Date.now(), name, price });
        saveData();
        renderProducts();
        document.getElementById('in-name').value = '';
        document.getElementById('in-price').value = '';
    } else {
        alert("Iltimos, hamma maydonlarni to'ldiring!");
    }
}

// 4. MAHSULOTNI O'CHIRISH
function deleteProduct(id) {
    if(confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts();
    }
}

// 5. MAHSULOTLARNI JADVALGA CHIQARISH
function renderProducts() {
    const table = document.getElementById('product-table-body');
    table.innerHTML = products.map(p => `
        <tr class="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
            <td class="py-4 font-bold text-slate-200">${p.name}</td>
            <td class="py-4 text-indigo-400 font-black">${Number(p.price).toLocaleString()} so'm</td>
            <td class="py-4 text-center">
                <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// 6. MA'LUMOTLARNI SAQLASH
function saveData() {
    localStorage.setItem('dokon_products', JSON.stringify(products));
}

// 7. GRAFIKNI CHIZISH
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Yak'],
        datasets: [{
            label: 'Savdo',
            data: [5, 12, 18, 10, 22, 15, 25],
            borderColor: '#6366f1',
            borderWidth: 4,
            tension: 0.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.1)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#64748b' } } }
    }
});

// ILK YUKLANISHDA JADVALNI TO'LDIRISH
renderProducts();