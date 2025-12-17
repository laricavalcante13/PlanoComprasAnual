/**************************************
 * CONFIGURAÇÕES GERAIS
 **************************************/

const tableConfigs = {
    table1: 9,
    table2: 3, 
    table3: 14,
    table4: 16
};

const budgetCategories = [
    "Passagem Aérea",
    "Passagem Rodoviária",
    "Diárias e Deslocamento",
    "Auxílio Representação",
    "Material Consumo",
    "Locação de Equipamentos",
    "Locação Anfiteatros/Salas",
    "Serviço Postal",
    "Assessorias",
    "Impressões",
    "Outros"
];

let budgetColumns = [];
let savedData = {}; // Armazena dados salvos por tabela

/**************************************
 * BOTÃO FLUTUANTE PARA TODAS AS TABELAS
 **************************************/

function addBudgetColumn() {
    const select = document.getElementById('budgetCategorySelect');
    const category = select.value;

    if (!category || budgetColumns.includes(category)) {
        alert('Selecione uma categoria válida e não duplicada');
        return;
    }

    budgetColumns.push(category);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    
    const newHeader = document.createElement('th');
    newHeader.style.width = '10%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    theadRow.insertBefore(newHeader, theadRow.lastElementChild);

    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const newTd = document.createElement('td');
        newTd.innerHTML = '<input type="text" placeholder="...">';
        row.insertBefore(newTd, row.lastElementChild);
    });

    select.value = '';
}

/**************************************
 * FUNÇÃO SALVAR PLANILHA
 **************************************/

window.saveTableData = function(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    const data = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        
        cells.forEach((cell, index) => {
            if (cell.classList.contains('row-number')) {
                rowData.push(cell.textContent); // Mantém o número
            } else {
                const input = cell.querySelector('input');
                rowData.push(input ? input.value : cell.textContent);
            }
        });
        
        data.push(rowData);
    });

    // Salva no localStorage
    savedData[tableId] = {
        data: data,
        budgetColumns: tableId === 'table2' ? [...budgetColumns] : []
    };
    
    localStorage.setItem('planilhaData', JSON.stringify(savedData));
    
    // Feedback visual
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Salvo!';
    btn.classList.remove('btn-warning');
    btn.classList.add('btn-success');
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-warning');
    }, 2000);
    
    console.log(`Planilha ${tableId} salva com ${data.length} linhas`);
};

/**************************************
 * FUNÇÃO CARREGAR DADOS SALVOS
 **************************************/

function loadSavedData() {
    const saved = localStorage.getItem('planilhaData');
    if (!saved) return;

    savedData = JSON.parse(saved);
    
    Object.keys(tableConfigs).forEach(tableId => {
        if (savedData[tableId]) {
            const tableData = savedData[tableId];
            
            if (tableId === 'table2' && tableData.budgetColumns) {
                // Recria colunas dinâmicas da table2
                budgetColumns = tableData.budgetColumns;
                tableData.budgetColumns.forEach(category => addBudgetColumnRecreate(category));
            }
            
            // Recria linhas
            const table = document.getElementById(tableId);
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            
            tableData.data.forEach(rowData => {
                const row = document.createElement('tr');
                row.dataset.rowId = Date.now();
                
                rowData.forEach((cellData, index) => {
                    const td = document.createElement('td');
                    if (index === 0) {
                        td.className = 'text-center row-number';
                        td.textContent = cellData;
                    } else {
                        td.innerHTML = `<input type="text" value="${cellData}" placeholder="...">`;
                    }
                    row.appendChild(td);
                });
                
                tbody.appendChild(row);
                row.addEventListener('mouseenter', showDeleteButton);
                row.addEventListener('mouseleave', hideDeleteButton);
            });
            
            updateRowNumbers(tableId);
        }
    });
}

function addBudgetColumnRecreate(category) {
    budgetColumns.push(category);
    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    const newHeader = document.createElement('th');
    newHeader.style.width = '10%';
    newHeader.innerHTML = `${category}`;
    theadRow.insertBefore(newHeader, theadRow.lastElementChild);
}

/**************************************
 * CRIAÇÃO DE LINHAS (mantida igual)
 **************************************/

function addRowAnyTable(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');
    row.dataset.rowId = Date.now();

    // Coluna #
    const tdNum = document.createElement('td');
    tdNum.className = 'text-center row-number';
    row.appendChild(tdNum);

    // Table2 tem estrutura especial
    if (tableId === 'table2') {
        // Ação/Operação
        const tdAction = document.createElement('td');
        tdAction.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(tdAction);

        // Quantidade
        const tdQty = document.createElement('td');
        tdQty.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(tdQty);

        // Custo Total
        const tdTotal = document.createElement('td');
        tdTotal.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(tdTotal);

        // Colunas dinâmicas
        budgetColumns.forEach(() => {
            const td = document.createElement('td');
            td.innerHTML = '<input type="text" placeholder="...">';
            row.appendChild(td);
        });
    } else {
        // Outras tabelas: colunas fixas
        for (let i = 0; i < tableConfigs[tableId]; i++) {
            const td = document.createElement('td');
            td.innerHTML = '<input type="text" placeholder="...">';
            row.appendChild(td);
        }
    }

    tbody.appendChild(row);
    updateRowNumbers(tableId);

    // Botão flutuante
    row.addEventListener('mouseenter', showDeleteButton);
    row.addEventListener('mouseleave', hideDeleteButton);
}

// Resto das funções mantidas iguais (showDeleteButton, hideDeleteButton, etc.)
function showDeleteButton(e) {
    const row = e.currentTarget;
    if (row.querySelector('.floating-delete')) return;

    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-sm floating-delete position-absolute';
    btn.style.cssText = `
        top: 5px; right: 5px; z-index: 1000; 
        opacity: 0; transition: all 0.2s ease;
        background: #dc3545 !important; border: none !important;
    `;
    btn.innerHTML = '<i class="fas fa-trash"></i>';
    btn.onclick = (ev) => {
        ev.stopPropagation();
        deleteFloatingRow(btn);
    };

    row.style.position = 'relative';
    row.appendChild(btn);
    setTimeout(() => btn.style.opacity = '1', 50);
}

function hideDeleteButton(e) {
    const btn = e.currentTarget.querySelector('.floating-delete');
    if (btn) {
        btn.style.opacity = '0';
        setTimeout(() => {
            if (btn.parentNode) btn.remove();
        }, 200);
    }
}

function deleteFloatingRow(btn) {
    if (!confirm('Remover esta linha?')) return;
    const row = btn.closest('tr');
    const tableId = row.closest('table').id;
    row.remove();
    updateRowNumbers(tableId);
}

window.addRow = function(tableId) {
    addRowAnyTable(tableId);
};

function updateRowNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
        const numCell = row.querySelector('.row-number') || row.cells[0];
        numCell.textContent = index + 1;
    });
}

function removeBudgetColumn(category) {
    if (!confirm(`Remover coluna "${category}"?`)) return;

    budgetColumns = budgetColumns.filter(cat => cat !== category);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    const thToRemove = Array.from(theadRow.children).find(th => th.textContent.includes(category));
    if (thToRemove) thToRemove.remove();

    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const tds = Array.from(row.children);
        const tdToRemove = tds.find((td, i) => i < tds.length - 1 && td.textContent.includes(category));
        if (tdToRemove) tdToRemove.remove();
    });
    
    updateRowNumbers('table2');
}

/**************************************
 * INICIALIZAÇÃO
 **************************************/

document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados salvos
    loadSavedData();
    
    // Cria linhas iniciais se não houver dados salvos
    Object.keys(tableConfigs).forEach(tableId => {
        if (!savedData[tableId]) {
            for (let i = 0; i < 8; i++) {
                addRow(tableId);
            }
        }
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});
