// BAZA
let products = JSON.parse(localStorage.getItem('dokon_products')) || [];
let sales = JSON.parse(localStorage.getItem('dokon_sales')) || [];
let cart = [];

// 1. SAHIFALARNI ALMASHTIRISH
function switchPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById('section-' + page).classList.remove('hidden');
    document.getElementById('btn-' + page).classList.add('active');
    document.getElementById('page-title').innerText = page.toUpperCase();

    if(page === 'dashboard') updateStats();
    if(page === 'mahsulotlar') renderProducts();
    if(page === 'kassa') updateKassaDropdown();
    if(page === 'mijozlar') renderClients();
}

// 2. MAHSULOT QO'SHISH
function addProduct() {
    const name = document.getElementById('in-name').value;
    const price = document.getElementById('in-price').value;

    if(name && price) {
        products.push({ id: Date.now(), name, price });
        saveData();
        renderProducts();
        document.getElementById('in-name').value = '';
        document.getElementById('in-price').value = '';
    }
}

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50">
            <div><p class="font-bold text-slate-200">${p.name}</p><p class="text-xs text-indigo-400 font-black">${Number(p.price).toLocaleString()} so'm</p></div>
            <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">🗑️</button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveData();
    renderProducts();
}

// 3. KASSA VA SOTUV
function updateKassaDropdown() {
    const select = document.getElementById('sale-product-select');
    select.innerHTML = '<option value="">Mahsulotni tanlang...</option>' + 
        products.map(p => `<option value="${p.id}">${p.name} - ${p.price} so'm</option>`).join('');
}

function addToCart() {
    const id = document.getElementById('sale-product-select').value;
    const product = products.find(p => p.id == id);
    if(product) {
        cart.push(product);
        renderCart();
    }
}

function renderCart() {
    const body = document.getElementById('cart-items');
    let total = 0;
    body.innerHTML = cart.map((p, index) => {
        total += Number(p.price);
        return `<tr class="border-b border-slate-800/50"><td class="p-4 font-bold">${p.name}</td><td class="p-4 text-center text-red-400 cursor-pointer" onclick="removeFromCart(${index})">O'chirish</td></tr>`;
    }).join('');
    document.getElementById('cart-total').innerText = total.toLocaleString() + " so'm";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function checkout() {
    const client = document.getElementById('sale-client-name').value || "Noma'lum Mijoz";
    if(cart.length > 0) {
        let total = cart.reduce((sum, p) => sum + Number(p.price), 0);
        sales.push({ client, total, date: new Date().toLocaleDateString(), items: cart.length });
        saveData();
        cart = [];
        renderCart();
        document.getElementById('sale-client-name').value = '';
        alert("Sotuv muvaffaqiyatli yakunlandi!");
    }
}

// 4. STATISTIKA (YAKSHANBA QO'SHILDI)
function updateStats() {
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalItems = sales.reduce((sum, s) => sum + s.items, 0);
    
    document.getElementById('stat-total-sales').innerText = totalSales.toLocaleString() + " so'm";
    document.getElementById('stat-total-items').innerText = totalItems + " ta";
    document.getElementById('stat-total-clients').innerText = sales.length + " ta";
    document.getElementById('stat-stock').innerText = products.length + " ta";
}

function renderClients() {
    const body = document.getElementById('client-history');
    body.innerHTML = sales.map(s => `
        <tr class="border-b border-slate-800/50">
            <td class="py-4 font-bold">${s.client}</td>
            <td class="py-4 text-slate-500">${s.date}</td>
            <td class="py-4 text-emerald-400 font-black">${s.total.toLocaleString()} so'm</td>
        </tr>
    `).join('');
}

function saveData() {
    localStorage.setItem('dokon_products', JSON.stringify(products));
    localStorage.setItem('dokon_sales', JSON.stringify(sales));
}

// 5. CHART
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Yak'], // Yakshanba qo'shildi
        datasets: [{
            label: 'Savdo',
            data: [12, 19, 13, 25, 22, 30, 45],
            borderColor: '#6366f1',
            borderWidth: 4,
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            pointRadius: 5,
            pointBackgroundColor: '#6366f1'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: '#64748b' } } }
    }
});

// ILK YUKLANISH
updateStats();