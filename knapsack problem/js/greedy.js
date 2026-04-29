function solveGreedy(items, capacity) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="result-item"><h3>Метод 3: Жадібний метод (Greedy)</h3><p>Виконання алгоритму...</p></div>';

  const itemsWithRatio = items.map(item => ({
    id: item.id,
    weight: item.weight,
    value: item.value,
    ratio: item.value / item.weight
  }));

  const sortedItems = [...itemsWithRatio].sort((a, b) => b.ratio - a.ratio);


  let stepsHtml = '<div class="combinations-container">';

  stepsHtml += `
        <div style="margin: 20px 0; padding: 15px; background: #2a2a2a; border-radius: 8px;">
            <h5 style="color: #f0a500; margin: 0 0 10px 0;">Етап 1: Сортування предметів за співвідношенням цінність/вага</h5>
            <table class="sorting-table">
                <thead>
                    <tr>
                        <th>Пріоритет</th>
                        <th>Предмет</th>
                        <th>Вага</th>
                        <th>Цінність</th>
                        <th>Співвідношення (цінність/вага)</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedItems.map((item, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td>Предмет ${item.id}</td>
                            <td>${item.weight}</td>
                            <td>${item.value}</td>
                            <td class="ratio-value">${item.ratio.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

  stepsHtml += `
          <div style="margin: 20px 0; padding: 15px; background: #2a2a2a; border-radius: 8px;">
            <h5 style="color: #f0a500; margin: 0 0 10px 0;">Етап 2: Покрокове наповнення рюкзака</h5>
            <table class="bag-table">
                <thead>
                    <tr>
                        <th>Крок</th>
                        <th>Дія</th>
                        <th>Предмет</th>
                        <th>Вага</th>
                        <th>Цінність</th>
                        <th>Вміст рюкзака</th>
                        <th>Загальна вага</th>
                        <th>Загальна цінність</th>
                    </tr>
                </thead>
                <tbody id="bagStepsBody">
                </tbody>
            </table>
        </div>
    `;

  stepsHtml += '</div>';
  resultDiv.innerHTML += stepsHtml;

  const bagBody = document.getElementById('bagStepsBody');

  let currentWeight = 0;
  let currentValue = 0;
  const selectedItems = [];
  const rejectedItems = [];
  let stepNumber = 0;
  let bagContent = [];

  for (const item of sortedItems) {
    stepNumber++;
    const freeSpace = capacity - currentWeight;
    const canTake = currentWeight + item.weight <= capacity;
    let action = '';

    if (canTake) {
      currentWeight += item.weight;
      currentValue += item.value;
      bagContent.push(`Предмет ${item.id}`);
      selectedItems.push({
        id: item.id,
        weight: item.weight,
        value: item.value,
        ratio: item.ratio
      });
      action = 'Додано до рюкзака';

      const bagRow = bagBody.insertRow();
      bagRow.classList.add('take-row');
      bagRow.insertCell(0).textContent = stepNumber;
      bagRow.insertCell(1).textContent = action;
      bagRow.insertCell(2).textContent = `Предмет ${item.id}`;
      bagRow.insertCell(3).textContent = item.weight;
      bagRow.insertCell(4).textContent = item.value;
      bagRow.insertCell(5).textContent = bagContent.join(', ');
      bagRow.insertCell(6).textContent = `${currentWeight}/${capacity}`;
      bagRow.insertCell(7).innerHTML = `<span class="value-highlight">${currentValue}</span>`;
    } else {

      rejectedItems.push({
        id: item.id,
        weight: item.weight,
        value: item.value,
        ratio: item.ratio,
        reason: `Не вистачає місця (потрібно ${item.weight}, доступно ${freeSpace})`
      });
      action = 'Пропущено (не вистачає місця)';

      const bagRow = bagBody.insertRow();
      bagRow.classList.add('reject-row');
      bagRow.insertCell(0).textContent = stepNumber;
      bagRow.insertCell(1).textContent = action;
      bagRow.insertCell(2).textContent = `Предмет ${item.id}`;
      bagRow.insertCell(3).textContent = item.weight;
      bagRow.insertCell(4).textContent = item.value;
      bagRow.insertCell(5).textContent = bagContent.join(', ') || '— пусто —';
      bagRow.insertCell(6).textContent = `${currentWeight}/${capacity}`;
      bagRow.insertCell(7).innerHTML = `<span class="value-highlight">${currentValue}</span>`;
    }
  }

  const finalResult = `
        <div class="result-item final-result" style="margin-top: 20px; background: #222222; border-left: 4px solid #f0a500;">
            <h3>Фінальний результат</h3>
            <p><span class="result-value">Максимальна цінність:</span> ${currentValue}</p>
            <p><span class="result-value">Загальна вага:</span> ${currentWeight} / ${capacity}</p>
            <p><span class="result-value">Вибрані предмети:</span></p>
            <ul>
                ${selectedItems.map((item, idx) => `<li>${idx + 1}. Предмет ${item.id}: вага=${item.weight}, цінність=${item.value}, співвідношення=${item.ratio.toFixed(2)}</li>`).join('')}
                ${selectedItems.length === 0 ? '<li>Немає вибраних предметів</li>' : ''}
            </ul>
            ${rejectedItems.length > 0 ? `
            <p><span class="result-value">Відхилені предмети:</span></p>
            <ul>
                ${rejectedItems.map(item => `<li>Предмет ${item.id}: вага=${item.weight}, цінність=${item.value} - ${item.reason}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
    `;

  resultDiv.innerHTML += finalResult;
}
