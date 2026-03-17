// XODIMLAR BAZASI
const STAFF = [
    { phone: "905040811", role: "ADMIN", name: "Admin" },
    { phone: "912345678", role: "MENEJER", name: "Menejer" }
];

const products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 18500000, image: "https://vsc-store.uz/wp-content/uploads/2023/10/iphone-15-pro-finish-select-202309-6-7-inch-natural-titanium.webp" },
    { id: 2, name: "Samsung Galaxy A10", price: 900000, image: "https://images.uzum.uz/cl05k7l6sfhsc0um2m4g/original.jpg" }
];

// MODALNI BOSHQARISH
window.openStaffLogin = () => document.getElementById('staff-modal').classList.remove('hidden');
window.closeStaffLogin = () => document.getElementById('staff-modal').classList.add('hidden');

// LOGIN
window.handleStaffLogin = () => {
    const ph = document.getElementById('login-phone').value;
    const user = STAFF.find(s => s.phone === ph);
    if(user) {
        alert("Xush kelibsiz, " + user.name);
        // Admin panelga yo'naltirish kodi shu yerda bo'ladi
    } else {
        alert("Raqam xato!");
    }
};

// MAHSULOTLARNI CHIQARISH
function init() {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(p => `
        <div class="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition">
            <img src="${p.image}" class="h-32 md:h-40 w-full object-contain mb-4">
            <h4 class="text-[11px] font-bold text-gray-800 line-clamp-2 h-8">${p.name}</h4>
            <p class="text-[#7000ff] font-black text-sm mt-2">${p.price.toLocaleString()} so'm</p>
            <button class="w-full mt-3 py-2 border-2 border-[#7000ff] text-[#7000ff] rounded-xl text-[10px] font-black hover:bg-[#7000ff] hover:text-white transition">Savatga</button>
        </div>
    `).join('');
}

init();