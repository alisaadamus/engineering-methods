function solveBranchBound(items, capacity) {
  const startTime = performance.now();

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<div class="result-item"><h3>Метод 5: Гілки та межі (Branch and Bound)</h3><p>Побудова дерева рішень з відсіканням гілок...</p></div>';

  let treeHtml = '<div class="combinations-container"><h4>Дерево рішень:</h4>';
  treeHtml += '<div class="tree-container" id="treeContainer">';
  treeHtml += '<div class="tree" id="treeStructure"></div>';
  treeHtml += '</div></div>';

  resultDiv.innerHTML += treeHtml;

  const treeStructure = document.getElementById('treeStructure');

  const sortedItems = [...items].sort((a, b) =>
    (b.value / b.weight) - (a.value / a.weight)
  );

  const results = [];
  let bestValue = 0;
  let bestCombination = [];
  let prunedCount = 0;
  let totalNodes = 0;

  function calculateBound(index, currentWeight, currentValue) {
    let boundValue = currentValue;
    let remainingWeight = capacity - currentWeight;

    for (let i = index; i < sortedItems.length; i++) {
      if (remainingWeight >= sortedItems[i].weight) {
        remainingWeight -= sortedItems[i].weight;
        boundValue += sortedItems[i].value;
      } else {
        boundValue += sortedItems[i].value * (remainingWeight / sortedItems[i].weight);
        break;
      }
    }

    return boundValue;
  }

  function buildTreeHTML(index, currentWeight, currentValue, path, level) {
    totalNodes++;
    const isLeaf = index >= sortedItems.length;
    const currentItem = index < sortedItems.length ? sortedItems[index] : null;

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

      results.push(result);

      if (result.isValid && result.totalValue > bestValue) {
        bestValue = result.totalValue;
        bestCombination = result.selectedItems;
      }

      return `
                <div class="tree-node leaf-node">
                    <div class="node-content">
                        <div class="node-title"> КІНЦЕВИЙ РЕЗУЛЬТАТ</div>
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

    const upperBound = calculateBound(index, currentWeight, currentValue);

    if (upperBound <= bestValue) {
      prunedCount++;
      return `
                <div class="tree-node pruned-node" style="margin-left: ${level * 20}px;">
                    <div class="node-content pruned">
                        <div class="node-title">ВІДСІЧЕНО (межа ${upperBound.toFixed(1)} ≤ ${bestValue})</div>
                        <div class="node-info">
                            <span>Предмет ${currentItem.id}</span>
                            <span>Вага: ${currentItem.weight}</span>
                            <span>Цінність: ${currentItem.value}</span>
                        </div>
                        <div class="node-current">
                            <span>Поточна вага: ${currentWeight}</span>
                            <span>Поточна цінність: ${currentValue}</span>
                        </div>
                    </div>
                </div>
            `;
    }

    let takeHtml = '';
    let canTake = false;

    if (currentWeight + currentItem.weight <= capacity) {
      canTake = true;
      const newWeight = currentWeight + currentItem.weight;
      const newValue = currentValue + currentItem.value;
      takeHtml = buildTreeHTML(index + 1, newWeight, newValue,
        [...path, { id: currentItem.id, action: 'take', weight: currentItem.weight, value: currentItem.value }],
        level + 1);
    }

    const notTakeHtml = buildTreeHTML(index + 1, currentWeight, currentValue,
      [...path, { id: currentItem.id, action: 'notTake', weight: currentItem.weight, value: currentItem.value }],
      level + 1);

    return `
            <div class="tree-node" style="margin-left: ${level * 20}px;">
                <div class="node-content">
                    <div class="node-title">Рівень ${level + 1}: Предмет ${currentItem.id}</div>
                    <div class="node-info">
                        <span>Вага: ${currentItem.weight}</span>
                        <span>Цінність: ${currentItem.value}</span>
                        <span class="bound-value">Межа: ${upperBound.toFixed(1)}</span>
                    </div>
                    <div class="node-current">
                        <span>Поточна вага: ${currentWeight}</span>
                        <span>Поточна цінність: ${currentValue}</span>
                    </div>
                </div>
                <div class="node-children">
                    ${canTake ? `
                    <div class="branch branch-left">
                        <div class="branch-label">ВЗЯТИ</div>
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

  const validResults = results.filter(r => r.isValid);

  let resultsHtml = `
        <div style="margin-top: 20px; padding: 15px; background: #2a2a2a; border-radius: 8px;">
            <h4>Всі знайдені допустимі результати (${validResults.length} комбінацій):</h4>
            <div style="overflow-x: auto;">
                <table class="greedy-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; background: #444; color: #f0a500; border: 1px solid #555;">№</th>
                            <th style="padding: 10px; background: #444; color: #f0a500; border: 1px solid #555;">Вибрані предмети</th>
                            <th style="padding: 10px; background: #444; color: #f0a500; border: 1px solid #555;">Загальна вага</th>
                            <th style="padding: 10px; background: #444; color: #f0a500; border: 1px solid #555;">Загальна цінність</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${validResults.map((result, idx) => `
                            <tr style="${result.totalValue === bestValue ? 'background: rgba(76, 175, 80, 0.2); font-weight: bold;' : ''}">
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
            <h3>Фінальний результат (Метод гілок та меж)</h3>
            <p><span class="result-value">Максимальна цінність:</span> ${bestValue}</p>
            <p><span class="result-value">Загальна вага:</span> ${bestCombination.reduce((sum, i) => sum + i.weight, 0)} / ${capacity}</p>
            <p><span class="result-value">Вибрані предмети:</span></p>
            <ul>
                ${bestCombination.length > 0
      ? bestCombination.map(item => `<li>Предмет ${item.id}: вага=${item.weight}, цінність=${item.value}</li>`).join('')
      : '<li>Немає вибраних предметів</li>'
    }
            </ul>
        </div>
    `;

  resultDiv.innerHTML += finalResult;
}
