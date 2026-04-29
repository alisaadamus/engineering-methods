function solveDynamic(items, capacity) {
  const n = items.length;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="result-item"><h3>Метод 2: Динамічне програмування</h3><p>Виконання алгоритму...</p></div>';

  const dp = Array(n + 1);
  for (let i = 0; i <= n; i++) {
    dp[i] = Array(capacity + 1).fill(0);
  }

  const taken = Array(n + 1);
  for (let i = 0; i <= n; i++) {
    taken[i] = Array(capacity + 1).fill(false);
  }

  let tableHtml = '<div class="combinations-container"><h4>Таблиця динамічного програмування:</h4>';
  tableHtml += '<div style="overflow-x: auto;"><table class="dp-table">';

  tableHtml += '<thead>';
  tableHtml += '<tr>';
  tableHtml += '<th>i\\w</th>';
  for (let w = 0; w <= capacity; w++) {
    tableHtml += `<th>${w}</th>`;
  }
  tableHtml += '</tr>';
  tableHtml += '</thead>';

  tableHtml += '<tbody id="dpTableBody">';

  tableHtml += '<tr>';
  tableHtml += '<td class="row-header"><strong>0</strong></td>';
  for (let w = 0; w <= capacity; w++) {
    tableHtml += `<td class="dp-cell" data-i="0" data-w="${w}">0</td>`;
  }
  tableHtml += '</tr>';

  for (let i = 1; i <= n; i++) {
    tableHtml += '<tr>';
    tableHtml += `<td class="row-header"><strong>${i}</strong><br><span style="font-size: 10px;">(${items[i - 1].weight},${items[i - 1].value})</span></td>`;
    for (let w = 0; w <= capacity; w++) {
      tableHtml += `<td class="dp-cell" data-i="${i}" data-w="${w}">-</td>`;
    }
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody>';
  tableHtml += '</table></div></div>';

  resultDiv.innerHTML += tableHtml;

  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1];

    for (let w = 0; w <= capacity; w++) {
      let cellValue;
      let isTaken = false;

      if (currentItem.weight <= w) {
        const includeItem = dp[i - 1][w - currentItem.weight] + currentItem.value;
        const excludeItem = dp[i - 1][w];

        if (includeItem > excludeItem) {
          cellValue = includeItem;
          isTaken = true;
          taken[i][w] = true;
        } else {
          cellValue = excludeItem;
          taken[i][w] = false;
        }
        dp[i][w] = cellValue;
      } else {
        cellValue = dp[i - 1][w];
        dp[i][w] = cellValue;
        taken[i][w] = false;
      }

      const cell = document.querySelector(`.dp-cell[data-i="${i}"][data-w="${w}"]`);
      if (cell) {
        let displayText = `${cellValue}`;
        if (isTaken && currentItem.weight <= w) {
          cell.classList.add('taken-cell');
        }
        cell.textContent = displayText;
        cell.classList.add('filled-cell');
      }
    }
  }

  const selectedItems = [];
  let w = capacity;
  let totalWeight = 0;

  for (let i = n; i > 0; i--) {
    if (taken[i][w]) {
      const item = items[i - 1];
      selectedItems.unshift(item);
      totalWeight += item.weight;
      w -= item.weight;
    }
  }

  const maxValue = dp[n][capacity];

  const finalResult = `
        <div class="result-item final-result" style="margin-top: 20px; background: #222222; border-left: 4px solid #f0a500;">
            <h3>Фінальний результат</h3>
            <p><span class="result-value">Максимальна цінність:</span> ${maxValue}</p>
            <p><span class="result-value">Загальна вага:</span> ${totalWeight} / ${capacity}</p>
            <p><span class="result-value">Вибрані предмети:</span></p>
            <ul>
                ${selectedItems.map(item => `<li>Предмет ${item.id}: вага=${item.weight}, цінність=${item.value}</li>`).join('')}
                ${selectedItems.length === 0 ? '<li>Немає вибраних предметів</li>' : ''}
            </ul>
        </div>
    `;

  resultDiv.innerHTML += finalResult;
}
