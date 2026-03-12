// 1. Ma'lumotlar bazasini yuklash
let products = JSON.parse(localStorage.getItem('uzum_db_v3')) || [];
let currentFilter = "Barchasi";

// 2. Dinamik bo'limlarni (kategoriyalarni) yig'ish
function getUniqueCategories() {
    const cats = ["Barchasi"];
    products.forEach(p => {
        let catName = p.category ? p.category.trim() : "Boshqa";
        if (!cats.includes(catName)) {
            cats.push(catName);
        }
    });
    return cats;
}

// 3. Mahsulotlarni va menyuni ekranga chiqarish (Render)
function render() {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    if (!grid || !catBar) return;

    // Tepadagi bo'limlarni chizish
    const cats = getUniqueCategories();
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="cat-btn whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition duration-300 ${currentFilter === c ? 'bg-[#7000ff] text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-600 border border-gray-100 hover:border-purple-300'}">
            ${c}
        </button>
    `).join('');

    // Mahsulotlarni filtrlash
    const filtered = products.filter(p => currentFilter === "Barchasi" || p.category === currentFilter);

    // Mahsulotlar ro'yxatini chizish
    grid.innerHTML = filtered.map(p => {
        const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        const monthly = Math.floor(p.price / 12);

        return `
        <div class="bg-white rounded-[24px] p-3 border border-gray-50 hover:shadow-2xl transition duration-500 group relative flex flex-col justify-between">
            <button onclick="deleteProduct(${p.id})" class="absolute top-2 right-2 bg-white/80 text-red-500 w-8 h-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition z-10 hover:bg-red-50 flex items-center justify-center">✕</button>
            
            <div>
                <div class="h-44 overflow-hidden rounded-[20px] bg-gray-50 mb-3 relative group-hover:scale-[1.02] transition duration-500">
                    <img src="${p.image}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/400x400?text=Rasm+yoq'">
                    ${discount > 0 ? `<span class="absolute bottom-2 left-2 bg-[#7000ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 shadow-lg">Aksiya</span>` : ''}
                </div>
                
                <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">${p.category}</p>
                <h3 class="text-sm font-medium text-gray-800 leading-snug mb-2 h-10 line-clamp-2">${p.name}</h3>
                
                <div class="mb-2">
                    <p class="text-base font-black text-gray-900 leading-none">${p.price.toLocaleString()} so'm</p>
                    ${p.oldPrice ? `<p class="text-xs text-gray-400 line-through mt-1">${p.oldPrice.toLocaleString()} so'm</p>` : ''}
                </div>

                <div class="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1.5 rounded-lg inline-block border border-orange-100">
                    Oyiga ${monthly.toLocaleString()} so'm
                </div>
            </div>

            <button class="w-full mt-4 border border-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs hover:bg-[#7000ff] hover:text-white hover:border-[#7000ff] transition active:scale-95 shadow-sm">
                Savatga qo'shish
            </button>
        </div>
    `}).join('');
}

// 4. Yangi mahsulotni bazaga saqlash
window.saveProduct = function() {
    const name = document.getElementById('p-name').value;
    const price = parseInt(document.getElementById('p-price').value);
    const oldPrice = parseInt(document.getElementById('p-old-price').value);
    const categoryInput = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value;

    if(!name || !price) return alert("Nomi va narxini kiriting!");

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        oldPrice: oldPrice || null,
        category: categoryInput ? categoryInput.trim() : "Boshqa",
        image: image || "https://placehold.co/400x400?text=Tovar"
    };

    products.push(newProduct);
    localStorage.setItem('uzum_db_v3', JSON.stringify(products));

    // Formani tozalash
    document.getElementById('p-name').value = "";
    document.getElementById('p-price').value = "";
    document.getElementById('p-old-price').value = "";
    document.getElementById('p-category').value = "";
    document.getElementById('p-image').value = "";

    toggleAdmin();
    render();
};

// 5. Filtrlash funksiyasi
window.filterBy = function(cat) {
    currentFilter = cat;
    render();
};

// 6. O'chirish funksiyasi
window.deleteProduct = function(id) {
    if(!confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('uzum_db_v3', JSON.stringify(products));
    render();
};

// 7. Admin panelni ochish/yopish
window.toggleAdmin = () => {
    document.getElementById('admin-panel').classList.toggle('hidden');
};

// Start: Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', render);