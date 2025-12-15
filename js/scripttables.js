// Configuração de colunas por tabela
    const tableConfigs = {
        table1: 9,  // colunas editáveis (sem # e ações)
        table2: 3,
        table3: 14,
        table4: 16
    };

    // Inicializar tabelas com 8 linhas
    document.addEventListener('DOMContentLoaded', function () {
        Object.keys(tableConfigs).forEach(tableId => {
            for (let i = 0; i < 8; i++) {
                addRow(tableId);
            }
        });
    });

    // Adicionar nova linha
    function addRow(tableId) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const numCols = tableConfigs[tableId];

        const row = document.createElement('tr');

        // Coluna de numeração
        row.innerHTML = `<td class="text-center"></td>`;

        // Colunas editáveis
        for (let i = 0; i < numCols; i++) {
            row.innerHTML += `
                <td>
                    <input type="text" placeholder="Digite aqui...">
                </td>
            `;
        }

        // Coluna de ações
        row.innerHTML += `
            <td class="text-center">
                <button class="btn btn-danger btn-sm btn-delete-row" onclick="deleteRow(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
        updateRowNumbers(tableId);
    }

    // Excluir linha
    function deleteRow(btn) {
        const row = btn.closest('tr');
        const table = row.closest('table');
        row.remove();
        updateRowNumbers(table.id);
    }

    // Atualizar numeração das linhas
    function updateRowNumbers(tableId) {
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Toggle sidebar
    document.getElementById('sidebarToggle').addEventListener('click', function () {
        document.body.classList.toggle('sb-sidenav-toggled');
    });
