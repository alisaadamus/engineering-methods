function solveRecursive(items, capacity, returnResult = false) {
  const startTime = performance.now();

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="result-item"><h3>Метод 4: Рекурсивний метод (Recursive)</h3><p>Побудова дерева рішень...</p></div>';

  if (items.length > 8) {
    const warning = document.createElement('div');
    warning.className = 'result-item';
    warning.innerHTML = `<p style="color: #ff6b6b;">⚠️ Увага! Для ${items.length} предметів дерево буде дуже великим. Рекомендується використовувати не більше 8 предметів для зручного перегляду.</p>`;
    document.getElementById('result').appendChild(warning);
  }

  let treeHtml = '<div class="combinations-container"><h4>Дерево рекурсивних викликів:</h4>';
  treeHtml += '<div class="tree-container" id="treeContainer">';
  treeHtml += '<div class="tree" id="treeStructure"></div>';
  treeHtml += '</div></div>';

  resultDiv.innerHTML += treeHtml;

  const treeStructure = document.getElementById('treeStructure');
  const leafResults = [];

  function buildTreeHTML(index, currentWeight, currentValue, path, level) {
    const isLeaf = index >= items.length;

    if (isLeaf) {
      const selectedItems = path.filter(p => p.action === 'take').map(p => ({
        id: p.id,
        weight: p.weight,
        value: p.value
      }));

      const result = {
        path: path,
        totalWeight: currentWeight,
        totalValue: currentValue,
        isValid: currentWeight <= capacity,
        selectedItems: selectedItems
      };

      leafResults.push(result);

      return `
                <div class="tree-node leaf-node">
                    <div class="node-content">
                        <div class="node-title">КІНЦЕВИЙ РЕЗУЛЬТАТ</div>
                        <div class="node-info">
                            <span>Вага: ${currentWeight}/${capacity}</span>
                            <span>Цінність: ${currentValue}</span>
                        </div>
                        <div class="node-items">
                            <strong>Взяті предмети:</strong> ${result.selectedItems.map(i => `${i.id}`).join(', ') || 'немає'}
                        </div>
                    </div>
                </div>
            `;
    }

    const currentItem = items[index];

    const notTakeHtml = buildTreeHTML(index + 1, currentWeight, currentValue,
      [...path, { id: currentItem.id, action: 'notTake', weight: currentItem.weight, value: currentItem.value }],
      level + 1);

    let takeHtml = '';
    let canTake = false;

    if (currentWeight + currentItem.weight <= capacity) {
      canTake = true;
      takeHtml = buildTreeHTML(index + 1, currentWeight + currentItem.weight, currentValue + currentItem.value,
        [...path, { id: currentItem.id, action: 'take', weight: currentItem.weight, value: currentItem.value }],
        level + 1);
    }

    return `
            <div class="tree-node" style="margin-left: ${level * 20}px;">
                <div class="node-content">
                    <div class="node-title">Рівень ${level + 1}: Предмет ${currentItem.id}</div>
                    <div class="node-info">
                        <span>Вага: ${currentItem.weight}</span>
                        <span>Цінність: ${currentItem.value}</span>
                    </div>
                    <div class="node-current">
                        <span>Поточна вага: ${currentWeight}</span>
                        <span>Поточна цінність: ${currentValue}</span>
                    </div>
                </div>
                <div class="node-children">
                    ${canTake ? `
                    <div class="branch branch-left">
                        <div class="branch-label">ВЗЯТИ (вата +${currentItem.weight}, цінність +${currentItem.value})</div>
                        <div class="branch-content">
                            ${takeHtml}
                        </div>
                    </div>
                    ` : ''}
                    <div class="branch branch-right">
                        <div class="branch-label">НЕ БРАТИ</div>
                        <div class="branch-content">
                            ${notTakeHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  const treeHTML = buildTreeHTML(0, 0, 0, [], 0);
  treeStructure.innerHTML = treeHTML;
  let bestResult = null;
  let maxValue = -1;

  leafResults.forEach(result => {
    if (result.isValid && result.totalValue > maxValue) {
      maxValue = result.totalValue;
      bestResult = result;
    }
  });

  const validResults = leafResults.filter(r => r.isValid);
  const bestResults = validResults.filter(r => r.totalValue === maxValue);


  let resultsHtml = `
        <div style="margin-top: 30px; padding: 15px; background: #2a2a2a; border-radius: 8px;">
            <h4>Всі кінцеві результати (${validResults.length} допустимих комбінацій:</h4>
            <div style="overflow-x: auto;">
                <table class="greedy-table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="padding: 10px;">№</th>
                            <th style="padding: 10px;">Вибрані предмети</th>
                            <th style="padding: 10px;">Загальна вага</th>
                            <th style="padding: 10px;">Загальна цінність</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${validResults.map((result, idx) => `
                            <tr class="${result.totalValue === maxValue ? 'best-result-row' : ''}" style="${result.totalValue === maxValue ? 'background: rgba(76, 175, 80, 0.2); font-weight: bold;' : ''}">
                                <td style="padding: 8px; text-align: center; border: 1px solid #555;">${idx + 1}</td>
                                <td style="padding: 8px; text-align: center; border: 1px solid #555;">${result.selectedItems.map(i => i.id).join(', ') || '—'}</td>
                                <td style="padding: 8px; text-align: center; border: 1px solid #555;">${result.totalWeight}/${capacity}</td>
                                <td style="padding: 8px; text-align: center; border: 1px solid #555; color: #f0a500; font-weight: bold;">${result.totalValue}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
  resultDiv.innerHTML += resultsHtml;


  const finalResult = `
        <div class="result-item final-result" style="margin-top: 20px; background: #222222; border-left: 4px solid #f0a500;">
            <h3>Фінальний результат (Рекурсивний метод)</h3>
            <p><span class="result-value">Максимальна цінність:</span> ${bestResult ? bestResult.totalValue : 0}</p>
            <p><span class="result-value">Загальна вага:</span> ${bestResult ? bestResult.totalWeight : 0} / ${capacity}</p>
            <p><span class="result-value">Вибрані предмети:</span></p>
            <ul>
                ${bestResult && bestResult.selectedItems.length > 0
      ? bestResult.selectedItems.map(item => `<li>Предмет ${item.id}: вага=${item.weight}, цінність=${item.value}</li>`).join('')
      : '<li>Немає вибраних предметів</li>'
    }
            </ul>
        </div>
    `;

  resultDiv.innerHTML += finalResult;

}
