let currentItems = [];
let currentCapacity = 30;
let nextItemId = 1;

document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  const addItemBtn = document.getElementById('addItemBtn');
  const clearItemsBtn = document.getElementById('clearItemsBtn');
  const inputMode = document.getElementById('inputMode');
  const autoControls = document.getElementById('autoControls');
  const manualControls = document.getElementById('manualControls');
  const capacityInput = document.getElementById('capacity');
  const itemCountInput = document.getElementById('itemCount');

  function generateItems(count) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i + 1,
        weight: Math.floor(Math.random() * 10) + 5,
        value: Math.floor(Math.random() * 20) + 10
      });
    }
    nextItemId = count + 1;
    return items;
  }

  function displayItems(items) {
    const itemsListDiv = document.getElementById('itemsList');
    if (items.length === 0) {
      itemsListDiv.innerHTML = '<p>Немає предметів. Додайте предмети вручну або згенеруйте автоматично.</p>';
      return;
    }

    let html = '';
    items.forEach((item, index) => {
      html += `
                <div class="item-row" data-id="${item.id}">
                    <span>Предмет ${item.id}.</span>
                    <div class="item-inputs">
                        <span>вага:</span>
                        <input type="number" class="edit-weight" value="${item.weight}" min="1" max="100" style="width: 70px;">
                        <span>цінність:</span>
                        <input type="number" class="edit-value" value="${item.value}" min="1" max="500" style="width: 70px;">

                    </div>
                    <button class="delete-btn" data-id="${item.id}">✖</button>
                </div>
            `;
    });
    itemsListDiv.innerHTML = html;

    document.querySelectorAll('.edit-weight').forEach((input, idx) => {
      input.addEventListener('change', (e) => {
        items[idx].weight = parseInt(e.target.value);
        if (isNaN(items[idx].weight) || items[idx].weight < 1) items[idx].weight = 1;
        displayItems(items);
      });
    });

    document.querySelectorAll('.edit-value').forEach((input, idx) => {
      input.addEventListener('change', (e) => {
        items[idx].value = parseInt(e.target.value);
        if (isNaN(items[idx].value) || items[idx].value < 1) items[idx].value = 1;
        displayItems(items);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items.splice(index, 1);
          items.forEach((item, idx) => {
            item.id = idx + 1;
          });
          nextItemId = items.length + 1;
          displayItems(items);
        }
      });
    });
  }

  function addItem() {
    currentItems.push({
      id: nextItemId++,
      weight: 10,
      value: 30
    });
    displayItems(currentItems);
  }

  function clearItems() {
    currentItems = [];
    nextItemId = 1;
    displayItems(currentItems);
  }

  inputMode.addEventListener('change', (e) => {
    if (e.target.value === 'auto') {
      autoControls.style.display = 'block';
      manualControls.style.display = 'none';
      if (currentItems.length === 0) {
        generateItems(5);
        displayItems(currentItems);
      }
    } else {
      autoControls.style.display = 'none';
      manualControls.style.display = 'block';
      if (currentItems.length === 0) {
        addItem();
      }
    }
  });

  generateBtn.addEventListener('click', () => {
    const capacity = parseInt(capacityInput.value);
    const itemCount = parseInt(itemCountInput.value);

    if (isNaN(capacity) || isNaN(itemCount) || capacity <= 0 || itemCount <= 0) {
      alert('Будь ласка, введіть коректні значення');
      return;
    }

    currentCapacity = capacity;
    currentItems = generateItems(Math.min(itemCount, 10));
    displayItems(currentItems);

    document.getElementById('result').innerHTML = '<p>Виберіть метод для розв\'язання</p>';
  });


  const bruteForceBtn = document.getElementById('bruteForceBtn');
  const dynamicBtn = document.getElementById('dynamicBtn');
  const greedyBtn = document.getElementById('greedyBtn');
  const branchBoundBtn = document.getElementById('branchBoundBtn');
  const recursiveBtn = document.getElementById('recursiveBtn');

  bruteForceBtn.addEventListener('click', () => {
    if (currentItems.length === 0) {
      alert('Спочатку додайте предмети');
      return;
    }
    if (currentItems.length > 15) {
      if (!confirm(`Увага! ${currentItems.length} предметів дадуть ${Math.pow(2, currentItems.length)} комбінацій. Це може бути дуже повільно. Продовжити?`)) {
        return;
      }
    }
    currentCapacity = parseInt(capacityInput.value);
    if (isNaN(currentCapacity) || currentCapacity <= 0) {
      alert('Введіть коректну місткість рюкзака');
      return;
    }
    solveBruteForce(currentItems, currentCapacity);
  });

  dynamicBtn.addEventListener('click', () => {
    if (currentItems.length === 0) {
      alert('Спочатку додайте предмети');
      return;
    }
    currentCapacity = parseInt(capacityInput.value);
    if (isNaN(currentCapacity) || currentCapacity <= 0) {
      alert('Введіть коректну місткість рюкзака');
      return;
    }
    solveDynamic(currentItems, currentCapacity);
  });

  greedyBtn.addEventListener('click', () => {
    if (currentItems.length === 0) {
      alert('Спочатку додайте предмети');
      return;
    }
    currentCapacity = parseInt(capacityInput.value);
    if (isNaN(currentCapacity) || currentCapacity <= 0) {
      alert('Введіть коректну місткість рюкзака');
      return;
    }
    solveGreedy(currentItems, currentCapacity);
  });

  branchBoundBtn.addEventListener('click', () => {
    if (currentItems.length === 0) {
      alert('Спочатку додайте предмети');
      return;
    }
    currentCapacity = parseInt(capacityInput.value);
    if (isNaN(currentCapacity) || currentCapacity <= 0) {
      alert('Введіть коректну місткість рюкзака');
      return;
    }
    solveBranchBound(currentItems, currentCapacity);
  });


  recursiveBtn.addEventListener('click', () => {
    if (currentItems.length === 0) {
      alert('Спочатку додайте предмети');
      return;
    }
    if (currentItems.length > 15) {
      if (!confirm(`Увага! Рекурсивний метод для ${currentItems.length} предметів може виконати ${Math.pow(2, currentItems.length)} рекурсивних викликів. Це може бути дуже повільно. Продовжити?`)) {
        return;
      }
    }
    currentCapacity = parseInt(capacityInput.value);
    if (isNaN(currentCapacity) || currentCapacity <= 0) {
      alert('Введіть коректну місткість рюкзака');
      return;
    }
    solveRecursive(currentItems, currentCapacity);
  });

  addItemBtn.addEventListener('click', addItem);
  clearItemsBtn.addEventListener('click', clearItems);

  currentItems = generateItems(5);
  displayItems(currentItems);
});
