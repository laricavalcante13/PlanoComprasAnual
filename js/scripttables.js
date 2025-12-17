// Variável para armazenar dados da tabela
let table1Data = [];
let modalInstance;

// Inicializar modal
document.addEventListener('DOMContentLoaded', function () {
    modalInstance = new bootstrap.Modal(document.getElementById('rowModal'));

    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }

    renderTable1();
});

// Abrir modal para adicionar
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Item';
    document.getElementById('editingRowIndex').value = '';
    clearModalInputs();
    modalInstance.show();
}

// Abrir modal para editar
function openEditModal(index) {
    document.getElementById('modalTitle').textContent = 'Editar Item';
    document.getElementById('editingRowIndex').value = index;

    const row = table1Data[index];
    document.getElementById('inputProjeto').value = row.projeto;
    document.getElementById('inputAcao').value = row.acao;
    document.getElementById('inputProduto').value = row.produto;
    document.getElementById('inputResultados').value = row.resultados;
    document.getElementById('inputPrioridade').value = row.prioridade;
    document.getElementById('inputCronograma').value = row.cronograma;
    document.getElementById('inputRealizado').value = row.realizado;
    document.getElementById('inputLideranca').value = row.lideranca;
    document.getElementById('inputRecursos').value = row.recursos;

    modalInstance.show();
}

// Limpar inputs do modal
function clearModalInputs() {
    document.getElementById('inputProjeto').value = '';
    document.getElementById('inputAcao').value = '';
    document.getElementById('inputProduto').value = '';
    document.getElementById('inputResultados').value = '';
    document.getElementById('inputPrioridade').value = '';
    document.getElementById('inputCronograma').value = '';
    document.getElementById('inputRealizado').value = '';
    document.getElementById('inputLideranca').value = '';
    document.getElementById('inputRecursos').value = '';
}

// Salvar dados do modal
function saveRowData() {
    const rowData = {
        projeto: document.getElementById('inputProjeto').value,
        acao: document.getElementById('inputAcao').value,
        produto: document.getElementById('inputProduto').value,
        resultados: document.getElementById('inputResultados').value,
        prioridade: document.getElementById('inputPrioridade').value,
        cronograma: document.getElementById('inputCronograma').value,
        realizado: document.getElementById('inputRealizado').value,
        lideranca: document.getElementById('inputLideranca').value,
        recursos: document.getElementById('inputRecursos').value
    };

    const editingIndex = document.getElementById('editingRowIndex').value;

    if (editingIndex === '') {
        // Adicionar nova linha
        table1Data.push(rowData);
    } else {
        // Editar linha existente
        table1Data[editingIndex] = rowData;
    }

    renderTable1();
    modalInstance.hide();
}

// Renderizar tabela
function renderTable1() {
    const tbody = document.querySelector('#table1 tbody');
    tbody.innerHTML = '';

    table1Data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.projeto}</td>
                    <td>${row.acao}</td>
                    <td>${row.produto}</td>
                    <td>${row.resultados}</td>
                    <td>${row.prioridade}</td>
                    <td>${row.cronograma}</td>
                    <td>${row.realizado}</td>
                    <td>${row.lideranca}</td>
                    <td>${row.recursos}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openEditModal(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRow(${index})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(tr);
    });
}

// Excluir linha
function deleteRow(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        table1Data.splice(index, 1);
        renderTable1();
    }
}

// Salvar dados da tabela
function saveTableData(tableId) {
    if (tableId === 'table1') {
        console.log('Salvando dados da tabela 1:', table1Data);
        alert('Dados salvos com sucesso!');
        // Aqui você pode adicionar código para enviar os dados para o servidor
    }
}

// Funções placeholder para as outras tabelas (manter compatibilidade)
function addRow(tableId) {
    if (tableId !== 'table1') {
        alert('Função addRow para ' + tableId + ' ainda não implementada');
    }
}

function addBudgetColumn() {
    alert('Função addBudgetColumn ainda não implementada');
}
