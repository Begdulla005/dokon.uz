// Baza va Xotira
let products = JSON.parse(localStorage.getItem('uzum_db_final')) || [];
let cart = JSON.parse(localStorage.getItem('uzum_cart')) || [];
let currentFilter = "Barchasi";

// 1. ASOSIY CHIqarish FUNKSIYASI
function render(displayProducts = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    
    if (!displayProducts) {
        displayProducts = currentFilter === "Barchasi" ? products : products.filter(p => p.category === currentFilter);
    }

    // Bo'limlar menyusi
    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="px-5 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${currentFilter === c ? 'bg-[#7000ff] text-white shadow-lg' : 'bg-white text-gray-500 border'}">
            ${c}
        </button>
    `).join('');

    // Mahsulot kartochkalari
    grid.innerHTML = displayProducts.map(p => `
        <div class="bg-white rounded-[28px] p-3 border hover:shadow-xl transition group relative">
            <div class="h-44 rounded-[22px] overflow-hidden bg-gray-50 mb-3">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://placehold.co/400x400?text=Rasm+yoq'">
            </div>
            <h3 class="text-xs font-semibold text-gray-700 h-10 line-clamp-2 mb-2 leading-tight">${p.name}</h3>
            <div class="flex flex-col gap-1 mb-3">
                <span class="text-base font-black text-gray-900">${p.price.toLocaleString()} so'm</span>
                <span class="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-1 rounded-lg w-fit">Oyiga ${Math.floor(p.price/12).toLocaleString()} so'm</span>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-gray-50 text-gray-800 py-2.5 rounded-xl font-bold text-[11px] hover:bg-[#7000ff] hover:text-white transition">
                Savatga qo'shish
            </button>
        </div>
    `).join('');

    updateCartUI();
}

// 2. QIDIRUV TIZIMI
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    render(filtered);
});

// 3. SAVAT ISHLASHI
window.addToCart = function(id) {
    const item = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    localStorage.setItem('uzum_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.qty, 0);
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    let total = 0;
    cartItemsDiv.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border">
                <img src="${item.image}" class="w-16 h-16 rounded-xl object-cover">
                <div class="flex-1">
                    <p class="text-xs font-bold line-clamp-1">${item.name}</p>
                    <p class="text-sm font-black text-[#7000ff]">${item.price.toLocaleString()} x ${item.qty}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 text-lg">✕</button>
            </div>
        `;
    }).join('');
    
    totalSpan.innerText = total.toLocaleString() + " so'm";
}

window.removeFromCart = (i) => {
    cart.splice(i, 1);
    localStorage.setItem('uzum_cart', JSON.stringify(cart));
    updateCartUI();
};

// 4. TELEGRAM BUYURTMA (ENG MUHIMI)
window.checkoutToTelegram = function() {
    if (cart.length === 0) return alert("Savat bo'sh!");

    const botToken = "8626121351:AAG0DsSYyPHDoFerOMgRcv_W04Wc3_umaFI"; 
    const chatId = "5579963983"; // O'zingizning Chat ID ni yozing!

    let msg = `🛍️ YANGI BUYURTMA!\n\n`;
    cart.forEach((p, i) => msg += `${i+1}. ${p.name}\n${p.price.toLocaleString()} x ${p.qty} ta\n\n`);
    msg += `💰 JAMI: ${cart.reduce((s, p) => s + (p.price*p.qty), 0).toLocaleString()} so'm`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`)
    .then(() => {
        alert("Buyurtma yuborildi! Botni tekshiring.");
        cart = [];
        localStorage.setItem('uzum_cart', JSON.stringify(cart));
        toggleCartModal();
        updateCartUI();
    });
};

// 5. BOSHQARUV (ADMIN)
window.saveProduct = function() {
    const name = document.getElementById('p-name').value;
    const price = parseInt(document.getElementById('p-price').value);
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value;

    if(!name || !price) return alert("Nom va narxni kiriting!");

    products.push({ id: Date.now(), name, price, category, image });
    localStorage.setItem('uzum_db_final', JSON.stringify(products));
    render();
    toggleAdmin();
    alert("Tovar qo'shildi!");
};

window.filterBy = (c) => { currentFilter = c; render(); };
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.toggleAdmin = () => document.getElementById('admin-panel').classList.toggle('hidden');

// START
document.addEventListener('DOMContentLoaded', render);