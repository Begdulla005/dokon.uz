// 1. MA'LUMOTLAR BAZASINI YUKLASH
let products = JSON.parse(localStorage.getItem('dokon_products')) || [];
let sales = JSON.parse(localStorage.getItem('dokon_sales')) || [];
let cart = [];

// 2. SAHIFALARNI BOSHQARISH (Navigation)
function switchPage(page) {
    // Barcha bo'limlarni yashirish
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    // Barcha tugmalardan 'active' klassini olib tashlash
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    // Tanlangan bo'limni ko'rsatish
    document.getElementById('section-' + page).classList.remove('hidden');
    document.getElementById('btn-' + page).classList.add('active');
    document.getElementById('page-title').innerText = page.toUpperCase();

    // Sahifaga mos funksiyalarni ishga tushirish
    if(page === 'dashboard') updateDashboard();
    if(page === 'mahsulotlar') renderProducts();
    if(page === 'kassa') updateKassaDropdown();
    if(page === 'mijozlar') renderClients();
}

// 3. MAHSULOTLARNI BOSHQARISH
function addProduct() {
    const name = document.getElementById('in-name').value;
    const price = document.getElementById('in-price').value;

    if(name && price) {
        products.push({ id: Date.now(), name, price: Number(price) });
        saveData();
        renderProducts();
        // Inputlarni tozalash
        document.getElementById('in-name').value = '';
        document.getElementById('in-price').value = '';
    } else {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
    }
}

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50">
            <div>
                <p class="font-bold text-slate-200">${p.name}</p>
                <p class="text-xs text-indigo-400 font-black">${p.price.toLocaleString()} so'm</p>
            </div>
            <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">🗑️</button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if(confirm("Ushbu mahsulot o'chirilsinmi?")) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts();
    }
}

// 4. KASSA VA SOTUV TIZIMI
function updateKassaDropdown() {
    const select = document.getElementById('sale-product-select');
    select.innerHTML = '<option value="">Mahsulotni tanlang...</option>' + 
        products.map(p => `<option value="${p.id}">${p.name} - ${p.price.toLocaleString()} so'm</option>`).join('');
}

function addToCart() {
    const id = document.getElementById('sale-product-select').value;
    const product = products.find(p => p.id == id);
    if(product) {
        cart.push({...product, cartId: Date.now()});
        renderCart();
    }
}

function renderCart() {
    const container = document.getElementById('cart-list');
    let total = 0;
    
    container.innerHTML = cart.map((p, index) => {
        total += p.price;
        return `
            <div class="flex justify-between items-center bg-indigo-600/5 p-3 rounded-xl border border-indigo-500/10">
                <span class="font-semibold">${p.name}</span>
                <div class="flex items-center gap-4">
                    <span class="font-black text-indigo-400">${p.price.toLocaleString()} so'm</span>
                    <button onclick="removeFromCart(${index})" class="text-slate-500 hover:text-red-500">✕</button>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('cart-total').innerText = total.toLocaleString();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function checkout() {
    if(cart.length === 0) return alert("Savat bo'sh!");
    
    const clientName = prompt("Mijoz ismini kiriting:", "Noma'lum mijoz");
    if(clientName) {
        const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
        const newSale = {
            id: Date.now(),
            client: clientName,
            total: totalAmount,
            date: new Date().toLocaleDateString(),
            itemsCount: cart.length
        };
        
        sales.push(newSale);
        saveData();
        cart = []; // Savatni bo'shatish
        renderCart();
        alert("Sotuv muvaffaqiyatli yakunlandi!");
        switchPage('dashboard');
    }
}

// 5. DASHBOARD VA STATISTIKA
function updateDashboard() {
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalItemsSoldCount = sales.reduce((sum, s) => sum + s.itemsCount, 0);
    
    document.getElementById('stat-total-sales').innerText = totalSales.toLocaleString() + " so'm";
    // Agar index.html da boshqa stat kartalari bo'lsa, ularni ham shu yerda yangilash mumkin
}

function renderClients() {
    const body = document.getElementById('client-history');
    if(!body) return;
    
    body.innerHTML = sales.map(s => `
        <tr class="border-b border-slate-800/50">
            <td class="py-4 font-bold text-slate-300">${s.client}</td>
            <td class="py-4 text-slate-500 text-xs">${s.date}</td>
            <td class="py-4 text-emerald-400 font-black">${s.total.toLocaleString()} so'm</td>
        </tr>
    `).join('');
}

// 6. HAFTALIK GRAFIK (YAKSHANBA BILAN)
function initChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Oxirgi 7 kunlik statistikani hisoblash (Namuna uchun static ma'lumot)
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Yak'], // Yakshanba qo'shildi
            datasets: [{
                label: 'Savdo hajmi',
                data: [15, 28, 18, 35, 25, 40, 55], // Statistikani sal "narmalniyroq" ko'rsatish uchun
                borderColor: '#6366f1',
                borderWidth: 4,
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                pointRadius: 6,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#0f172a',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { 
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: { color: '#64748b', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// 7. YORDAMCHI FUNKSIYALAR
function saveData() {
    localStorage.setItem('dokon_products', JSON.stringify(products));
    localStorage.setItem('dokon_sales', JSON.stringify(sales));
}

// ILK YUKLANISHDA ISHLAYDIGAN QISM
window.onload = () => {
    updateDashboard();
    initChart();
};