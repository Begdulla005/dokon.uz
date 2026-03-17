// ... oldingi kodlar (mahsulotlar, kassa va navigatsiya) saqlanadi ...

// Fake mijozlar bazasi (demo uchun)
const customers = [
  { id:1001, name:"Ali Valiyev", phone:"+998901234567", orders:45, total:"8 450 000 so'm", last:"2026-03-15" },
  { id:1002, name:"Nodira Karimova", phone:"+998971234567", orders:32, total:"5 920 000 so'm", last:"2026-03-14" },
  { id:1003, name:"Jasurbek Toshpulatov", phone:"+998991234567", orders:28, total:"4 780 000 so'm", last:"2026-03-13" },
  { id:1004, name:"Madina Sobirova", phone:"+998931234567", orders:19, total:"3 120 000 so'm", last:"2026-03-12" },
  { id:1005, name:"Sherzod Rahimov", phone:"+998981234567", orders:15, total:"2 890 000 so'm", last:"2026-03-10" },
];

// Mijozlar jadvalini to'ldirish
function loadCustomers() {
  const tableBody = document.getElementById('customers-table');
  if (!tableBody) return;

  tableBody.innerHTML = '';
  customers.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td class="text-center">${c.orders}</td>
      <td class="text-right font-medium">${c.total}</td>
      <td>${c.last}</td>
    `;
    tableBody.appendChild(row);
  });
}
// Fake buyurtmalar bazasi (demo uchun)
const orders = [
  { id: "#ORD-001", customer: "Ali Valiyev", items: "Samsung A55 × 1", amount: "5 200 000 so'm", status: "Yetkazib berilgan", date: "2026-03-15" },
  { id: "#ORD-002", customer: "Nodira Karimova", items: "AirPods Pro × 2", amount: "8 400 000 so'm", status: "Yangi", date: "2026-03-16" },
  { id: "#ORD-003", customer: "Jasurbek T.", items: "Power Bank × 3", amount: "2 850 000 so'm", status: "Qayta ishlanmoqda", date: "2026-03-14" },
  { id: "#ORD-004", customer: "Madina S.", items: "iPhone 15 × 1", amount: "14 800 000 so'm", status: "Yetkazib berilgan", date: "2026-03-13" },
];

// Buyurtmalar jadvalini to'ldirish
function loadOrders() {
  const tableBody = document.getElementById('orders-table');
  if (!tableBody) return;

  tableBody.innerHTML = '';
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="font-medium">${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.items}</td>
      <td class="text-right font-medium">${order.amount}</td>
      <td>
        <span class="px-3 py-1 rounded-full text-xs font-medium ${
          order.status === 'Yetkazib berilgan' ? 'bg-green-900/50 text-green-300' :
          order.status === 'Yangi' ? 'bg-yellow-900/50 text-yellow-300' :
          'bg-blue-900/50 text-blue-300'
        }">${order.status}</span>
      </td>
      <td>${order.date}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Navigatsiya ichida chaqirish (oldingi kodga qo'shing)
if (pageId === 'buyurtmalar') loadOrders();
// Navigatsiya + sahifa ochilganda chaqirish
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    // ... oldingi kod ...
    const pageId = link.getAttribute('data-page');
    if (pageId === 'dashboard') drawChart();
    if (pageId === 'mijozlar') loadCustomers();
  });
});

// Boshlash
loadProducts();       // kassa uchun
renderCart();         // kassa uchun
if (document.getElementById('salesChart')) drawChart();
loadCustomers();      // mijozlar jadvali