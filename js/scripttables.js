/**************************************
 * CONFIGURAÇÕES GERAIS
 **************************************/

const tableConfigs = {
    table1: 9,
    table2: 3, 
    table3: 14,
    table4: 16
};

let rowCounters = {
    table1: 0,
    table2: 0,
    table3: 0,
    table4: 0
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

/**************************************
 * ORÇAMENTO – COLUNAS DINÂMICAS (TABLE2)
 **************************************/

function addBudgetColumn() {
    const select = document.getElementById('budgetCategorySelect');
    const category = select.value;

    if (!category) {
        alert('Selecione uma categoria');
        return;
    }

    if (budgetColumns.includes(category)) {
        alert('Esta categoria já foi adicionada');
        return;
    }

    budgetColumns.push(category);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    // Adicionar novo header ANTES do header de Ações
    const actionsHeader = theadRow.querySelector('th:last-child');
    const newHeader = document.createElement('th');
    newHeader.style.width = '10%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    theadRow.insertBefore(newHeader, actionsHeader);

    // Adicionar célula em cada linha ANTES da célula de Ações
    tbody.querySelectorAll('tr').forEach(row => {
        const actionsCell = row.querySelector('td:last-child');
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        row.insertBefore(td, actionsCell);
    });

    select.value = '';
}

function removeBudgetColumn(category) {
    if (!confirm(`Remover a coluna "${category}"?`)) return;

    budgetColumns = budgetColumns.filter(cat => cat !== category);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    const headers = Array.from(theadRow.querySelectorAll('th'));
    
    // Encontrar e remover header da categoria
    const headerToRemove = headers.find(th => th.textContent.includes(category));
    if (headerToRemove) {
        headerToRemove.remove();
    }

    // Remover células correspondentes em todas as linhas
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const cellToRemove = cells.find(td => td.querySelector('input') && 
            td.previousElementSibling?.querySelector('input')?.placeholder === '...' &&
            !td.classList.contains('text-center'));
        if (cellToRemove) {
            cellToRemove.remove();
        }
    });
    
    updateRowNumbers('table2');
}

/**************************************
 * CRUD DE LINHAS - TABLE2 (CORRIGIDA)
 **************************************/

function addRowTable2() {
    const table = document.getElementById('table2');
    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');

    // Coluna #
    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    // Coluna Ação/Operação
    const tdAction = document.createElement('td');
    const inputAction = document.createElement('input');
    inputAction.type = 'text';
    inputAction.placeholder = '...';
    tdAction.appendChild(inputAction);
    row.appendChild(tdAction);

    // Coluna Custo Total
    const tdTotal = document.createElement('td');
    const inputTotal = document.createElement('input');
    inputTotal.type = 'text';
    inputTotal.placeholder = '...';
    tdTotal.appendChild(inputTotal);
    row.appendChild(tdTotal);

    // Colunas dinâmicas de orçamento (sempre ANTES da coluna Ações)
    budgetColumns.forEach(() => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        row.appendChild(td);
    });

    // Coluna Ações (SEMPRE ÚLTIMA)
    const tdActions = document.createElement('td');
    tdActions.classList.add('text-center');
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-danger btn-sm btn-delete-row';
    btnDelete.innerHTML = '<i class="fas fa-trash"></i>';
    btnDelete.onclick = function() { deleteRow(this); };
    tdActions.appendChild(btnDelete);
    row.appendChild(tdActions);
    
    tbody.appendChild(row);
    updateRowNumbers('table2');
}

/**************************************
 * CRUD DE LINHAS - OUTRAS TABELAS
 **************************************/

window.addRow = function(tableId) {
    if (tableId === 'table2') {
        addRowTable2();
        return;
    }

    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const numCols = tableConfigs[tableId];
    const row = document.createElement('tr');

    // Nº
    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    // Colunas editáveis
    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        row.appendChild(td);
    }

    // Coluna Ações (SEMPRE ÚLTIMA)
    const tdActions = document.createElement('td');
    tdActions.classList.add('text-center');
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-danger btn-sm btn-delete-row';
    btnDelete.innerHTML = '<i class="fas fa-trash"></i>';
    btnDelete.onclick = function() { deleteRow(this); };
    tdActions.appendChild(btnDelete);
    row.appendChild(tdActions);

    tbody.appendChild(row);
    updateRowNumbers(tableId);
};

window.deleteRow = function(btn) {
    if (!confirm('Deseja remover a linha selecionada?')) return;
    const row = btn.closest('tr');
    const tableId = row.closest('table').id;
    row.remove();
    updateRowNumbers(tableId);
};

function updateRowNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
        if (row.cells[0]) {
            row.cells[0].textContent = index + 1;
        }
    });
}

/**************************************
 * INICIALIZAÇÃO
 **************************************/

document.addEventListener('DOMContentLoaded', function() {
    Object.keys(tableConfigs).forEach(tableId => {
        for (let i = 0; i < 8; i++) {
            addRow(tableId);
        }
    });

    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});
