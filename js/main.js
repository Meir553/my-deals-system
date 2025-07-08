// public/js/main.js
async function loadDeals() {
  const res = await fetch('https://YOUR_API_URL/api/deals');
  const deals = await res.json();
  const container = document.getElementById('deals');
  container.innerHTML = '';
  deals.forEach(d => {
    if (d.expired) return;
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${d.image}" class="card-img-top" style="height:200px;object-fit:cover">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${d.title}</h5>
          <p><del>$${d.originalPrice}</del> <strong>$${d.dealPrice}</strong></p>
          <a href="item.html?id=${d.id}" class="btn btn-primary mt-auto">View Deal</a>
        </div>
      </div>`;
    container.append(col);
  });
}

window.addEventListener('DOMContentLoaded', loadDeals);
