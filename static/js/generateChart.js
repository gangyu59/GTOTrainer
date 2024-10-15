// 定义颜色映射
const actionColors = {
    raise: 'green',
    call: 'yellow',
    fold: 'red'
};

// 动态生成范围图
export function generateRangeChart(rangeChartData) {
    const table = document.createElement('table');
    table.classList.add('range-chart');

    // 表头
    const headerRow = document.createElement('tr');
    const headers = ['手牌', '行动', '概率'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerText = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // 动态填充表格
    rangeChartData.forEach(data => {
        const row = document.createElement('tr');

        // 手牌列
        const handCell = document.createElement('td');
        handCell.innerText = data.hand;
        row.appendChild(handCell);

        // 行动列，颜色根据行动来定义
        const actionCell = document.createElement('td');
        actionCell.innerText = data.action;
        actionCell.style.backgroundColor = actionColors[data.action] || 'white';
        row.appendChild(actionCell);

        // 概率列
        const probabilityCell = document.createElement('td');
        probabilityCell.innerText = `${(data.probability * 100).toFixed(2)}%`;
        row.appendChild(probabilityCell);

        table.appendChild(row);
    });

    // 将表格添加到页面的某个区域
    const chartSection = document.getElementById('range-chart-section');
    chartSection.innerHTML = ''; // 清空旧内容
    chartSection.appendChild(table);
}