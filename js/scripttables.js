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

/**************************************
 * ORÇAMENTO – COLUNAS DINÂMICAS (TABLE2) - CORRIGIDO
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
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    // Header ANTES do "Ações"
    const actionsHeader = thead.querySelector('th:last-child');
    const newHeader = document.createElement('th');
    newHeader.style.width = '10%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    thead.insertBefore(newHeader, actionsHeader);

    // NOVA LÓGICA: sempre inserir ANTES da ÚLTIMA TD de cada linha
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const lastCell = cells[cells.length - 1]; // SEMPRE a última
        const newCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        newCell.appendChild(input);
        row.insertBefore(newCell, lastCell);
    });

    select.value = '';
}

function removeBudgetColumn(category) {
    if (!confirm(`Remover a coluna "${category}"?`)) return;

    budgetColumns = budgetColumns.filter(cat => cat !== category);

    const table = document.getElementById('table2');
    const thead = table.querySelector('thead tr');
    const thToRemove = Array.from(thead.querySelectorAll('th')).find(th => 
        th.textContent.includes(category) && !th.textContent.includes('Ações')
    );
    
    if (thToRemove) thToRemove.remove();

    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        // Remove célula que CONTÉM o nome da categoria (não a última)
        const cellToRemove = cells.find((cell, index) => {
            return index < cells.length - 1 && // Não a última (ações)
                   cell.textContent.includes(category);
        });
        if (cellToRemove) cellToRemove.remove();
    });
    
    updateRowNumbers('table2');
}

/**************************************
 * TABLE2 - CRIAÇÃO CORRETA DE LINHAS
 **************************************/

function addRowTable2() {
    const table = document.getElementById('table2');
    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');

    // 1. #
    const td1 = document.createElement('td');
    td1.className = 'text-center';
    row.appendChild(td1);

    // 2. Ação/Operação
    const td2 = document.createElement('td');
    td2.innerHTML = '<input type="text" placeholder="...">';
    row.appendChild(td2);

    // 3. Custo Total
    const td3 = document.createElement('td');
    td3.innerHTML = '<input type="text" placeholder="...">';
    row.appendChild(td3);

    // Colunas dinâmicas (se existirem)
    budgetColumns.forEach(() => {
        const td = document.createElement('td');
        td.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(td);
    });

    // ÚLTIMA: Ações
    const tdActions = document.createElement('td');
    tdActions.className = 'text-center';
    tdActions.innerHTML = '<button class="btn btn-danger btn-sm btn-delete-row" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>';
    row.appendChild(tdActions);

    tbody.appendChild(row);
    updateRowNumbers('table2');
}

/**************************************
 * FUNÇÕES GLOBAIS
 **************************************/

window.addRow = function(tableId) {
    if (tableId === 'table2') {
        addRowTable2();
        return;
    }

    // Lógica das outras tabelas (inalterada)
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const numCols = tableConfigs[tableId];
    const row = document.createElement('tr');

    const tdNum = document.createElement('td');
    tdNum.className = 'text-center';
    row.appendChild(tdNum);

    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        td.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(td);
    }

    const tdActions = document.createElement('td');
    tdActions.className = 'text-center';
    tdActions.innerHTML = '<button class="btn btn-danger btn-sm btn-delete-row" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>';
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
        row.cells[0].textContent = index + 1;
    });
}

/**************************************
 * INICIALIZAÇÃO CORRIGIDA
 **************************************/

document.addEventListener('DOMContentLoaded', function() {
    // LIMPA tbody da table2 antes de recriar
    const table2Tbody = document.querySelector('#table2 tbody');
    if (table2Tbody) table2Tbody.innerHTML = '';

    Object.keys(tableConfigs).forEach(tableId => {
        for (let i = 0; i < 8; i++) {
            window.addRow(tableId);
        }
    });

    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});
