// Configuração de colunas por tabela
const tableConfigs = {
    table1: 9,
    table2: 3,
    table3: 14,
    table4: 16
};

// Funções globais
window.addRow = function(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const numCols = tableConfigs[tableId];

    const row = document.createElement('tr');

    // Coluna numeração
    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    // Colunas editáveis
    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Digite aqui...';
        td.appendChild(input);
        row.appendChild(td);
    }

    // Coluna ações
    const tdAction = document.createElement('td');
    tdAction.classList.add('text-center');
    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-sm btn-delete-row';
    btn.innerHTML = '<i class="fas fa-trash"></i>';
    btn.addEventListener('click', () => deleteRow(btn));
    tdAction.appendChild(btn);
    row.appendChild(tdAction);

    tbody.appendChild(row);
    updateRowNumbers(tableId);
};

window.deleteRow = function(btn) {
    const row = btn.closest('tr');
    const table = row.closest('table');
    row.remove();
    updateRowNumbers(table.id);
};

function updateRowNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Inicializar tabelas + sidebar após DOM carregado
document.addEventListener('DOMContentLoaded', function() {
    Object.keys(tableConfigs).forEach(tableId => {
        for (let i = 0; i < 8; i++) addRow(tableId);
    });

    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});
