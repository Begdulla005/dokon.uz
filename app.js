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