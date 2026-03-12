// Ma'lumotlar Bazasi va Savat
let products = JSON.parse(localStorage.getItem('uzum_db_v5')) || [];
let cart = JSON.parse(localStorage.getItem('uzum_cart')) || [];
let currentFilter = "Barchasi";

// --- 1. RENDER FUNKSIYASI (ASOSIY SAHIFA) ---
function render(displayProducts = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    if (!displayProducts) {
        displayProducts = currentFilter === "Barchasi" ? products : products.filter(p => p.category === currentFilter);
    }

    // Kategoriyalar menyusi
    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="px-5 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${currentFilter === c ? 'bg-[#7000ff] text-white shadow-lg' : 'bg-white text-gray-500 border hover:border-purple-200'}">
            ${c}
        </button>
    `).join('');

    // Mahsulotlar kartochkalari
    grid.innerHTML = displayProducts.map(p => `
        <div class="bg-white rounded-[28px] p-3 border hover:shadow-2xl transition group relative">
            <button onclick="deleteProduct(${p.id})" class="absolute top-2 right-2 w-7 h-7 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition z-10 hover:bg-red-100 flex items-center justify-center">✕</button>
            <div class="h-40 rounded-[22px] overflow-hidden bg-gray-50 mb-3">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://placehold.co/300x300?text=Rasm+yoq'">
            </div>
            <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">${p.category}</p>
            <h3 class="text-xs font-semibold text-gray-700 h-10 line-clamp-2 mb-2 leading-tight">${p.name}</h3>
            <div class="flex flex-col gap-1 mb-3">
                <span class="text-base font-black text-gray-900">${p.price.toLocaleString()} so'm</span>
                <span class="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-1.5 rounded-lg w-fit">Oyiga ${Math.floor(p.price/12).toLocaleString()} so'm</span>
            </div>
            
            <button onclick="addToCart(${p.id})" class="w-full bg-gray-50 text-gray-800 py-2.5 rounded-xl font-bold text-[11px] hover:bg-[#7000ff] hover:text-white transition">
                Savatga qo'shish
            </button>
        </div>
    `).join('');

    updateCartUI();
}

// --- 2. QIDIRUV TIZIMI ---
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    render(filtered);
});

// --- 3. SAVAT MANTIQI ---
window.addToCart = function(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;

    // Tekshirish: mahsulot savatda bormi?
    const exists = cart.find(c => c.id === item.id);
    if (exists) {
        exists.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('uzum_cart', JSON.stringify(cart));
    updateCartUI();
    // Animatsiya (optional)
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    let total = 0;
    cartItemsDiv.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;
        return `
            <div class="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <img src="${item.image}" class="w-16 h-16 rounded-xl object-cover">
                <div class="flex-1">
                    <p class="text-xs font-bold line-clamp-1">${item.name}</p>
                    <p class="text-sm font-black text-[#7000ff]">${item.price.toLocaleString()} so'm x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 text-lg">✕</button>
            </div>
        `;
    }).join('');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p class="text-center text-gray-400 pt-10">Savat bo'sh...</p>`;
    }
    totalSpan.innerText = total.toLocaleString() + " so'm";
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('uzum_cart', JSON.stringify(cart));
    updateCartUI();
};

// --- 4. SOTIB OLISH (TELEGRAMGA BUYURTMA YUBORISH) ---
window.checkoutToTelegram = function() {
    if (cart.length === 0) return alert("Savat bo'sh!");

    const botToken = "BOT_TOKEN_SHU_YERGA_YOZING"; // Telegram Bot Token
    const chatId = "CHAT_ID_SHU_YERGA_YOZING"; // Xabar boradigan Chat ID

    if (botToken === "BOT_TOKEN_SHU_YERGA_YOZING") return alert("Avval Telegram bot sozlamalarini to'g'irlang!");

    let orderList = cart.map((p, i) => `${i+1}. ${p.name} (${p.price.toLocaleString()} so'm x ${p.quantity})`).join('\n');
    let total = cart.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    let text = `🛍️ YANGI BUYURTMA!\n\n${orderList}\n\n💰 JAMI: ${total.toLocaleString()} so'm`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`)
    .then(() => {
        alert("Buyurtma qabul qilindi! Tez orada aloqaga chiqamiz.");
        cart = []; // Savatni tozalash
        localStorage.setItem('uzum_cart', JSON.stringify(cart));
        toggleCartModal();
        updateCartUI();
    }).catch(err => {
        alert("Xatolik yuz berdi. Iltimos, qaytadan urunib ko'ring.");
        console.error(err);
    });
};

// --- YORDAMCHI FUNKSIYALAR ---
window.filterBy = (cat) => { currentFilter = cat; render(); };
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.toggleAdmin = () => document.getElementById('admin-panel').classList.toggle('hidden');

window.saveProduct = function() {
    const name = document.getElementById('p-name').value;
    const price = parseInt(document.getElementById('p-price').value);
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value;

    if(!name || !price) return alert("Ma'lumotlarni to'ldiring!");

    products.push({ id: Date.now(), name, price, category, image });
    localStorage.setItem('uzum_db_v5', JSON.stringify(products));
    render();
    toggleAdmin();
    // Formani tozalash (add code here)
};

window.deleteProduct = (id) => {
    if(!confirm("Haqiqatdan o'chirmoqchimisiz?")) return;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('uzum_db_v5', JSON.stringify(products));
    render();
}

// START
document.addEventListener('DOMContentLoaded', render);