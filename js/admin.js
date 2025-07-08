// public/js/admin.js
async function api(path, opts) {
  const res = await fetch('https://YOUR_API_URL/api/deals' + path, {
    headers:{'Content-Type':'application/json'},
    ...opts
  });
  return res.json();
}

const form = document.getElementById('form');
const list = document.getElementById('list');
const fields = ['id','link','title','image','originalPrice','dealPrice','description','notes','expired'];

function fillForm(d) {
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (!el) return;
    if (f==='expired') el.checked = d.expired;
    else el.value = d[f] || '';
  });
}

function readForm() {
  const out = {};
  fields.forEach(f => {
    const el = document.getElementById(f);
    if (!el) return;
    out[f] = (f==='expired') ? el.checked : el.value;
  });
  return out;
}

async function loadList() {
  const deals = await api('');
  list.innerHTML = '';
  deals.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.title}</td>
      <td>$${d.dealPrice}</td>
      <td>${d.expired?'✅':'❌'}</td>
      <td>
        <button class="btn btn-sm btn-primary edit">Edit</button>
        <button class="btn btn-sm btn-danger delete">Delete</button>
      </td>`;
    tr.querySelector('.edit').onclick = () => fillForm(d);
    tr.querySelector('.delete').onclick = async () => {
      await api('/' + d.id, { method: 'DELETE' });
      loadList();
    };
    list.append(tr);
  });
}

form.onsubmit = async e => {
  e.preventDefault();
  const data = readForm();
  if (data.id) {
    await api('/' + data.id, { method: 'PUT', body: JSON.stringify(data) });
  } else {
    delete data.id;
    await api('', { method: 'POST', body: JSON.stringify(data) });
  }
  form.reset();
  loadList();
};

document.getElementById('reset').onclick = () => form.reset();
window.addEventListener('DOMContentLoaded', loadList);
