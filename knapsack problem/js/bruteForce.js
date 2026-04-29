function solveBruteForce(items, capacity) {

  const n = items.length;
  let bestValue = 0;
  let bestMask = 0;
  let bestWeight = 0;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="result-item"><h3>Метод 1: Повний перебір (Brute Force)</h3><p>Виконання алгоритму...</p></div>';

  let stepsHtml = '<div class="combinations-container"><h4>Покрокове виконання алгоритму:</h4>';
  stepsHtml += '<table class="combinations-table">';
  stepsHtml += '<thead><tr>';
  stepsHtml += '<th>Крок</th>';
  stepsHtml += '<th>Предмети (в комбінації)</th>';
  stepsHtml += '<th>Вага</th>';
  stepsHtml += '<th>Цінність</th>';
  stepsHtml += '<th>Статус</th>';
  stepsHtml += '</tr></thead><tbody id="stepsTableBody">';
  stepsHtml += '</tbody></td></div>';

  resultDiv.innerHTML += stepsHtml;

  const tbody = document.getElementById('stepsTableBody');
  let currentBest = 0;

  const totalCombinations = Math.pow(2, n);

  for (let mask = 0; mask < totalCombinations; mask++) {
    let currentWeight = 0;
    let currentValue = 0;
    const selectedItemsList = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        currentWeight += items[i].weight;
        currentValue += items[i].value;
        selectedItemsList.push(items[i].id);
      }
    }

    const isValid = currentWeight <= capacity;
    let status = '';
    let isNewBest = false;

    if (!isValid) {
      status = 'Перевищує вагу';
    } else {
      if (currentValue > bestValue) {
        bestValue = currentValue;
        bestMask = mask;
        bestWeight = currentWeight;
        status = 'НОВА НАЙКРАЩА!';
        isNewBest = true;
        currentBest = bestValue;
      } else {
        status = 'Допустима';
      }
    }

    const row = tbody.insertRow();

    const stepCell = row.insertCell(0);
    stepCell.textContent = mask + 1;
    stepCell.style.textAlign = 'center';

    const itemsCell = row.insertCell(1);
    itemsCell.textContent = selectedItemsList.length > 0 ? selectedItemsList.join(', ') : '— пусто —';

    const weightCell = row.insertCell(2);
    weightCell.textContent = currentWeight;
    weightCell.style.textAlign = 'center';
    if (!isValid) weightCell.style.color = '#ff6b6b';

    const valueCell = row.insertCell(3);
    valueCell.textContent = currentValue;
    valueCell.style.textAlign = 'center';
    valueCell.style.fontWeight = 'bold';
    if (isNewBest) valueCell.style.color = '#4CAF50';

    const statusCell = row.insertCell(4);
    statusCell.textContent = status;
    statusCell.style.textAlign = 'center';
    if (isNewBest) {
      statusCell.style.color = '#4CAF50';
      statusCell.style.fontWeight = 'bold';
    } else if (!isValid) {
      statusCell.style.color = '#ff6b6b';
    }

    if (isNewBest) {
      row.style.background = 'rgba(76, 175, 80, 0.2)';
      row.style.borderLeft = '3px solid #4CAF50';
    } else if (!isValid) {
      row.style.background = 'rgba(255, 107, 107, 0.1)';
    } else {
      row.style.background = 'rgba(255, 255, 255, 0.05)';
    }
  }

  const selectedItems = [];
  for (let i = 0; i < n; i++) {
    if (bestMask & (1 << i)) {
      selectedItems.push(items[i]);
    }
  }


  const finalResult = `
        <div class="result-item final-result" style="margin-top: 20px; background: #222222; border-left: 4px solid #f0a500;">
            <h3>Фінальний результат</h3>
            <p><span class="result-value">Максимальна цінність:</span> ${bestValue}</p>
            <p><span class="result-value">Загальна вага:</span> ${bestWeight} / ${capacity}</p>
            <p><span class="result-value">Вибрані предмети:</span></p>
            <ul>
                ${selectedItems.map(item => `<li>Предмет ${item.id}: вага=${item.weight}, цінність=${item.value}</li>`).join('')}
                ${selectedItems.length === 0 ? '<li>Немає вибраних предметів</li>' : ''}
            </ul>
            <p><span class="result-value">Всього кроків:</span> ${totalCombinations}</p>
            <p><span class="result-value">Допустимих комбінацій:</span> ${tbody.children.length}</p>
        </div>
    `;

  resultDiv.innerHTML += finalResult;
}
