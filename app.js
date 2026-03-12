let products = JSON.parse(localStorage.getItem('uzum_db_v10')) || [];
let cart = JSON.parse(localStorage.getItem('uzum_cart')) || [];
let currentFilter = "Barchasi";

// 1. RENDER - MAHSULOTLARNI EKRANGA CHIQARISH
function render(displayProducts = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    
    if (!displayProducts) {
        displayProducts = currentFilter === "Barchasi" ? products : products.filter(p => p.category === currentFilter);
    }

    // Kategoriyalar
    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="px-5 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${currentFilter === c ? 'bg-[#7000ff] text-white shadow-lg' : 'bg-white text-gray-500 border'}">
            ${c}
        </button>
    `).join('');

    // Mahsulot kartalari
    grid.innerHTML = displayProducts.map(p => `
        <div class="bg-white rounded-[28px] p-3 border hover:shadow-xl transition group relative">
            <div class="h-44 rounded-[22px] overflow-hidden bg-gray-50 mb-3">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://placehold.co/400x400?text=Rasm+yoq'">
            </div>
            <h3 class="text-xs font-semibold text-gray-700 h-10 line-clamp-2 mb-2">${p.name}</h3>
            <div class="flex flex-col gap-0.5 mb-3">
                <span class="text-[10px] text-gray-400 line-through">${parseInt(p.oldPrice).toLocaleString()} so'm</span>
                <span class="text-base font-black text-[#7000ff]">${parseInt(p.price).toLocaleString()} so'm</span>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-gray-50 text-gray-800 py-2.5 rounded-xl font-bold text-[11px] hover:bg-[#7000ff] hover:text-white transition">
                Savatga qo'shish
            </button>
        </div>
    `).join('');

    updateCartUI();
}

// 2. QIDIRUV
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    render(filtered);
});

// 3. SAVAT ISHLASHI
window.addToCart = function(id) {
    const item = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) { existing.qty += 1; } else { cart.push({ ...item, qty: 1 }); }
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
            <div class="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border mb-3">
                <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover">
                <div class="flex-1 text-xs font-bold">${item.name}</div>
                <div class="text-[#7000ff] font-black text-xs">${parseInt(item.price).toLocaleString()} x ${item.qty}</div>
                <button onclick="removeFromCart(${index})" class="text-red-400">✕</button>
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

// 4. TELEGRAM BUYURTMA
window.checkoutToTelegram = function() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    const botToken = "8626121351:AAG0DsSYyPHDoFerOMgRcv_W04Wc3_umaFI"; 
    const chatId = "5300585671"; 

    let msg = `🛍️ BUYURTMA!\n\n`;
    cart.forEach(p => msg += `• ${p.name} (${p.qty} ta)\n`);
    msg += `\n💰 JAMI: ${cart.reduce((s, p) => s + (p.price*p.qty), 0).toLocaleString()} so'm`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`)
    .then(() => {
        alert("Yuborildi!");
        cart = [];
        localStorage.setItem('uzum_cart', JSON.stringify(cart));
        toggleCartModal();
        updateCartUI();
    });
};

// 5. TOVAR QO'SHISH VA TOZALASH
window.saveProduct = function() {
    const fields = {
        name: document.getElementById('p-name'),
        oldPrice: document.getElementById('p-old-price'),
        price: document.getElementById('p-price'),
        cat: document.getElementById('p-category'),
        img: document.getElementById('p-image')
    };

    if(!fields.name.value || !fields.price.value) return alert("To'ldiring!");

    products.push({ 
        id: Date.now(), 
        name: fields.name.value, 
        oldPrice: fields.oldPrice.value || 0,
        price: fields.price.value, 
        category: fields.cat.value, 
        image: fields.img.value 
    });

    localStorage.setItem('uzum_db_v10', JSON.stringify(products));
    
    // AVTO TOZALASH
    Object.values(fields).forEach(input => input.value = "");

    render();
    toggleAdmin();
};

window.filterBy = (c) => { currentFilter = c; render(); };
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.toggleAdmin = () => document.getElementById('admin-panel').classList.toggle('hidden');

document.addEventListener('DOMContentLoaded', render);