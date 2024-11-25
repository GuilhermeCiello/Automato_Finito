let automato = {
    estados: ['q0'], 
    alfabeto: [...Array(26)].map((_, i) => String.fromCharCode(97 + i)), 
    transicoes: {},
    estadoInicial: 'q0',
    estadosFinais: [] 
};

let palavrasDigitadas = [];

//gera o autômato com base na palavra digitada
function gerarAutomato() {
    const input = document.getElementById('inputText').value.toLowerCase().trim();
    const alfabeto = automato.alfabeto;

    if (input.length === 0) {
        document.getElementById('output').textContent = "Por favor, insira uma palavra.";
        return;
    }

    palavrasDigitadas.push(input);

    document.getElementById('palavraDigitadaOutput').textContent = 
        `Palavras digitadas: ${palavrasDigitadas.join(", ")}`;

    let estadoAtual = automato.estadoInicial;
    let estadoOffset = automato.estados.length;

    for (let i = 0; i < input.length; i++) {
        let simbolo = input[i];

        if (!alfabeto.includes(simbolo)) {
            document.getElementById('output').textContent = `Símbolo '${simbolo}' não pertence ao alfabeto (a-z).`;
            return;
        }

        let proximoEstado;
        if (automato.transicoes[estadoAtual] && automato.transicoes[estadoAtual][simbolo]) {
            proximoEstado = automato.transicoes[estadoAtual][simbolo];
        } else {
            proximoEstado = `q${estadoOffset}`;
            automato.estados.push(proximoEstado);
            estadoOffset++;

            if (!automato.transicoes[estadoAtual]) automato.transicoes[estadoAtual] = {};
            automato.transicoes[estadoAtual][simbolo] = proximoEstado;
        }

        estadoAtual = proximoEstado;
    }

    if (!automato.estadosFinais.includes(estadoAtual)) {
        automato.estadosFinais.push(estadoAtual);
    }

    atualizarTabela();
    document.getElementById('inputText').value = "";
}

// Função para atualizar a tabela de transições
function atualizarTabela() {
    const alfabeto = automato.alfabeto;

    let tabelaHtml = `<table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Estados</th>`;
    alfabeto.forEach(letra => {
        tabelaHtml += `<th>${letra}</th>`;
    });
    tabelaHtml += `</tr>
                </thead>
                <tbody>`;
    automato.estados.forEach(estado => {
        let estadoLabel = estado;
        if (estado === automato.estadoInicial) estadoLabel = `->${estado}`; 
        if (automato.estadosFinais.includes(estado)) estadoLabel = `${estado}*`;

        tabelaHtml += `<tr><td>${estadoLabel}</td>`;
        alfabeto.forEach(letra => {
            const destino = automato.transicoes[estado]?.[letra] || '-';
            const cellId = `${estado}-${letra}`;
            tabelaHtml += `<td id="${cellId}">${destino}</td>`;
        });
        tabelaHtml += `</tr>`;
    });

    tabelaHtml += `</tbody></table>`;
    document.getElementById('tabelaAutomato').innerHTML = tabelaHtml;
}

//verifica se uma palavra é aceita pelo automato
function verificarPalavra() {
    const palavra = document.getElementById('palavraVerificar').value.toLowerCase().trim();
    document.getElementById('palavraDigitadaOutput').textContent = `Palavra digitada: "${palavra}"`; // Exibe a palavra digitada
    let estadoAtual = automato.estadoInicial;
    let valid = true;
    clearHighlights();

    for (let i = 0; i < palavra.length; i++) {
        const simbolo = palavra[i];

        if (!automato.alfabeto.includes(simbolo)) {
            document.getElementById('verificacaoOutput').textContent = `Símbolo '${simbolo}' não pertence ao alfabeto (a-z).`;
            return;
        }

        const proximoEstado = automato.transicoes[estadoAtual]?.[simbolo];

        const cellId = `${estadoAtual}-${simbolo}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            if (proximoEstado && proximoEstado !== '-') {
                cell.classList.add('highlight-valid');
                estadoAtual = proximoEstado;
            } else {
                cell.classList.add('highlight-invalid');
                valid = false;
                break;
            }
        } else {
            valid = false;
            break;
        }
    }

    if (valid) {
        if (automato.estadosFinais.includes(estadoAtual)) {
            document.getElementById('verificacaoOutput').textContent = "Palavra aceita!";
        } else {
            document.getElementById('verificacaoOutput').textContent = "Palavra não aceita. Não chegou a um estado final válido.";
        }
    } else {
        document.getElementById('verificacaoOutput').textContent = "Palavra não aceita. Transição inválida.";
    }
}


//limpar todo os destaques
function clearHighlights() {
    automato.estados.forEach(estado => {
        automato.alfabeto.forEach(letra => {
            const cellId = `${estado}-${letra}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.classList.remove('highlight-valid');
                cell.classList.remove('highlight-invalid');
            }
        });
    });
   
}

//destacar os passos em tempo real
function highlightSteps() {
    const palavra = document.getElementById('palavraVerificar').value.toLowerCase().trim();
    let estadoAtual = automato.estadoInicial;
    let valid = true;

    clearHighlights();

    for (let i = 0; i < palavra.length; i++) {
        const simbolo = palavra[i];

        if (!automato.alfabeto.includes(simbolo)) {
            valid = false;
            break;
        }

        const proximoEstado = automato.transicoes[estadoAtual]?.[simbolo];
        const cellId = `${estadoAtual}-${simbolo}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            if (proximoEstado && proximoEstado !== '-') {
                cell.classList.add('highlight-valid');
                estadoAtual = proximoEstado;
            } else {
                cell.classList.add('highlight-invalid');
                valid = false;
                break;
            }
        } else {
            valid = false;
            break;
        }
    }

    if (palavra.length === 0) {
        document.getElementById('verificacaoOutput').textContent = "";
        return;
    }

    if (valid) {
        if (automato.estadosFinais.includes(estadoAtual)) {
            document.getElementById('verificacaoOutput').textContent = "Palavra aceita!";
        } else {
            document.getElementById('verificacaoOutput').textContent = "Palavra não aceita. Não chegou a um estado final válido.";
        }
    } else {
        document.getElementById('verificacaoOutput').textContent = "Palavra não aceita. Transição inválida.";
    }
}