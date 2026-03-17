// 1. MA'LUMOTLAR STRUKTURASI
let products = JSON.parse(localStorage.getItem('dokon_products')) || [
    { id: 1, name: "iPhone 15 Pro Max", price: 18500000, image: "https://vsc-store.uz/wp-content/uploads/2023/10/iphone-15-pro-finish-select-202309-6-7-inch-natural-titanium.webp" },
    { id: 2, name: "Samsung A 10", price: 900000, image: "https://images.uzum.uz/cl05k7l6sfhsc0um2m4g/original.jpg" }
];

// Asosiy Ma'lumotlar Bazasi (Xaridlar tarixi)
let salesDatabase = JSON.parse(localStorage.getItem('dokon_sales_db')) || [];

// Adminlar Ro'yxati
const ADMIN_ROLES = [
    { phone: "905040811", role: "super" }, // Asosiy Admin
    { phone: "912345678", role: "sub" }    // Yordamchi Admin
];

let cart = JSON.parse(localStorage.getItem('dokon_cart')) || [];
let currentUser = localStorage.getItem('user_phone');
let tempSmsCode = "";

// --- ASOSIY RENDER ---
function init() {
    const grid = document.getElementById('product-list');
    grid.innerHTML = products.map(p => `
        <div class="bg-white p-4 rounded-[28px] shadow-sm hover:shadow-xl transition-all group">
            <div class="overflow-hidden rounded-2xl mb-4 h-40 flex items-center justify-center bg-gray-50">
                <img src="${p.image}" class="max-h-full object-contain group-hover:scale-110 transition duration-500">
            </div>
            <h3 class="text-[13px] font-bold h-10 line-clamp-2 mb-2">${p.name}</h3>
            <p class="text-[#7000ff] font-black text-lg mb-4">${p.price.toLocaleString()} so'm</p>
            <button onclick="addToCart(${p.id})" class="w-full py-3 rounded-xl border-2 border-[#7000ff] text-[#7000ff] text-xs font-black hover:bg-[#7000ff] hover:text-white transition">SAVATGA</button>
        </div>
    `).join('');
    updateStatsUI();
}

// --- XARID VA BAZAGA YOZISH ---
window.addToCart = (id) => {
    const p = products.find(x => x.id === id);
    cart.push({...p, orderId: Date.now()});
    localStorage.setItem('dokon_cart', JSON.stringify(cart));
    updateStatsUI();
};

window.openCart = () => {
    if(cart.length === 0) return alert("Savatchangiz hozircha bo'sh!");
    if(!currentUser) return toggleLogin();

    const confirmBuy = confirm(`Jami: ${cart.reduce((s,i)=>s+i.price,0).toLocaleString()} so'm. Sotib olishni tasdiqlaysizmi?`);
    
    if(confirmBuy) {
        // MA'LUMOTLAR BAZASIGA YOZISH (Eng muhim qismi)
        const newOrder = {
            id: "#" + Math.floor(1000 + Math.random() * 9000),
            customer: currentUser,
            items: cart.map(i => i.name).join(', '),
            totalAmount: cart.reduce((s, i) => s + i.price, 0),
            date: new Date().toLocaleString('uz-UZ'),
            status: "Muvaffaqiyatli"
        };

        salesDatabase.unshift(newOrder); // Bazaning boshiga qo'shish
        localStorage.setItem('dokon_sales_db', JSON.stringify(salesDatabase));

        alert("Xarid muvaffaqiyatli amalga oshirildi! Ma'lumotlar bazasiga saqlandi. ✅");
        cart = [];
        localStorage.setItem('dokon_cart', JSON.stringify(cart));
        updateStatsUI();
    }
};

// --- ADMIN PANEL VA STATISTIKA ---
window.toggleAdminPanel = () => {
    const admin = ADMIN_ROLES.find(a => a.phone === currentUser);
    if(!admin) return alert("Ushbu bo'limga faqat adminlar kira oladi!");

    const panel = document.getElementById('admin-panel');
    panel.classList.toggle('hidden');

    // Statistika hisob-kitobi
    const totalIncome = salesDatabase.reduce((s, i) => s + i.totalAmount, 0);
    document.getElementById('total-income').innerText = totalIncome.toLocaleString() + " so'm";
    document.getElementById('total-orders').innerText = salesDatabase.length + " ta";
    document.getElementById('total-profit').innerText = (totalIncome * 0.2).toLocaleString() + " so'm"; // 20% foyda deb hisoblasak

    // Rollarga ko'ra cheklov
    if(admin.role !== 'super') {
        document.getElementById('super-stats').classList.add('opacity-50', 'pointer-events-none');
        document.getElementById('profit-card').classList.add('hidden');
    }

    // Bazadagi xaridlarni chiqarish
    const dbList = document.getElementById('db-orders-list');
    dbList.innerHTML = salesDatabase.map(order => `
        <div class="bg-white p-6 rounded-[24px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border-l-8 border-green-500">
            <div class="mb-4 md:mb-0">
                <div class="flex items-center gap-3 mb-1">
                    <span class="font-black text-purple-600">${order.id}</span>
                    <span class="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold">${order.date}</span>
                </div>
                <p class="text-sm font-bold text-gray-800">Mijoz: +998 ${order.customer}</p>
                <p class="text-[11px] text-gray-500 mt-1">Mahsulotlar: ${order.items}</p>
            </div>
            <div class="text-right">
                <p class="text-lg font-black text-gray-900">${order.totalAmount.toLocaleString()} so'm</p>
                <span class="text-[9px] text-green-600 font-black uppercase tracking-widest">To'landi ✅</span>
            </div>
        </div>
    `).join('');
};

// --- LOGIN VA SMS ---
window.toggleLogin = () => {
    document.getElementById('login-modal').classList.toggle('hidden');
    document.getElementById('phone-view').classList.remove('hidden');
    document.getElementById('code-view').classList.add('hidden');
};

window.requestSms = () => {
    const ph = document.getElementById('login-phone').value;
    if(ph.length < 9) return alert("Raqamni to'g'ri kiriting!");
    tempSmsCode = "7777";
    document.getElementById('phone-view').classList.add('hidden');
    document.getElementById('code-view').classList.remove('hidden');
    alert("Tasdiqlash kodi: 7777");
};

window.verifyAndLogin = () => {
    const code = document.getElementById('verify-code').value;
    if(code === tempSmsCode) {
        currentUser = document.getElementById('login-phone').value;
        localStorage.setItem('user_phone', currentUser);
        location.reload();
    } else alert("Kod xato!");
};

// --- QO'SHIMCHA FUNKSIYALAR ---
window.addProduct = () => {
    const n = document.getElementById('new-p-name').value;
    const p = document.getElementById('new-p-price').value;
    const i = document.getElementById('new-p-img').value;
    if(!n || !p) return alert("Ma'lumotlarni to'ldiring!");
    
    products.push({ id: Date.now(), name: n, price: parseInt(p), image: i || 'https://via.placeholder.com/150' });
    localStorage.setItem('dokon_products', JSON.stringify(products));
    alert("Mahsulot bazaga qo'shildi!");
    location.reload();
};

window.clearDatabase = () => {
    if(confirm("DIQQAT! Barcha xaridlar tarixini o'chirib tashlamoqchimisiz?")) {
        salesDatabase = [];
        localStorage.setItem('dokon_sales_db', JSON.stringify(salesDatabase));
        toggleAdminPanel();
    }
};

function updateStatsUI() {
    document.getElementById('cart-badge').innerText = cart.length;
    if(currentUser) document.getElementById('login-text').innerText = "Profil";
}

init();