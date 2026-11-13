const workDialog = document.querySelector('#work-detail');
document.querySelector('.work-list').addEventListener('click', event => {
  const row = event.target.closest('.work-row');
  if (!row) return;
  workDialog.querySelector('#detail-title').textContent = row.querySelector('.work-name').textContent;
  workDialog.querySelector('.detail-kind').textContent = row.querySelector('.work-kind').textContent;
  workDialog.querySelector('.detail-summary').textContent = document.documentElement.lang === 'zh' ? row.dataset.summaryZh : row.dataset.summaryEn;
  workDialog.querySelector('.detail-image').src = row.dataset.image;
  workDialog.scrollTop = 0;
  workDialog.showModal();
});
workDialog.addEventListener('click', event => {
  if (event.target !== workDialog) return;
  const box = workDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) workDialog.close();
});
