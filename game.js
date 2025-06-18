let vidas = 3;
let temaAtivo = "binario";
let regiaoAtual = 0;

const desempenhoFinal = {
    acertos: 0,
    erros: 0,
    reinicios: 0
};

const progresso = {
    binario_para_decimal: false,
    decimal_para_binario: false,
    octal_para_decimal: false,
    decimal_para_octal: false,
    hexadecimal_para_decimal: false,
    decimal_para_hexadecimal: false,
    soma_binaria: false,
    subtracao_binaria: false,
    multiplicacao_binaria: false,
    divisao_binaria: false
};

const temasPorNome = {
    binario_para_decimal: "Binário → Decimal",
    decimal_para_binario: "Decimal → Binário",
    octal_para_decimal: "Octal → Decimal",
    decimal_para_octal: "Decimal → Octal",
    hexadecimal_para_decimal: "Hexadecimal → Decimal",
    decimal_para_hexadecimal: "Decimal → Hexadecimal",
    soma_binaria: "Soma Binária",
    subtracao_binaria: "Subtração Binária",
    multiplicacao_binaria: "Multiplicação Binária",
    divisao_binaria: "Divisão Binária"
};

const conquistas = {
    primeiroAcerto: {
        nome: "Primeiro Passo",
        desc: "Acertou a primeira pergunta",
        desbloqueada: false
    },
    semErros: {
        nome: "Perfeição",
        desc: "Completou um tema sem erros",
        desbloqueada: false
    },
    mestreNumerico: {
        nome: "Mestre Numérico",
        desc: "Completou todos os temas",
        desbloqueada: false
    }
};

function desbloquearConquista(id) {
    if (!conquistas[id].desbloqueada) {
        conquistas[id].desbloqueada = true;
        const container = document.getElementById("texto");
        const conquistaElement = document.createElement("div");
        conquistaElement.className = "conquista";
        conquistaElement.innerHTML = `
            <div class="conquista-badge">★</div>
            <div class="conquista-texto">
                <strong>${conquistas[id].nome}</strong><br>
                ${conquistas[id].desc}
            </div>
        `;
        container.appendChild(conquistaElement);
        
        setTimeout(() => {
            conquistaElement.style.opacity = "1";
            conquistaElement.style.transform = "translateY(0)";
        }, 100);
        
        gerarSom8Bit("conquista");
    }
}

const dicasPorTema = {
    binario_para_decimal: "Cada bit representa uma potência de 2. Ex: 1100 = 1×8 + 1×4 + 0×2 + 0×1 = 12",
    decimal_para_binario: "Divida o número por 2 repetidamente. Ex: 6 = 110 (6/2=3 resto 0, 3/2=1 resto 1, 1/2=0 resto 1)",
    octal_para_decimal: "Cada dígito vale potência de 8. Ex: 24₈ = 2×8 + 4×1 = 20",
    decimal_para_octal: "Divida por 8 repetidamente. Ex: 20 = 24₈ (20/8=2 resto 4, 2/8=0 resto 2)",
    hexadecimal_para_decimal: "A=10,B=11,C=12,D=13,E=14,F=15. Ex: 2A₁₆ = 2×16 + 10 = 42",
    decimal_para_hexadecimal: "Divida por 16. Restos >9: A=10,B=11,C=12,D=13,E=14,F=15. Ex: 42 = 2A₁₆",
    soma_binaria: "0+0=0, 0+1=1, 1+1=10 (vai 1). Ex: 110 + 11 = 1001",
    subtracao_binaria: "Empreste 1 quando necessário. Ex: 1001 - 11 = 110",
    multiplicacao_binaria: "0×qualquer=0, 1×qualquer=o número. Ex: 101 × 10 = 1010",
    divisao_binaria: "Igual à decimal com divisão longa. Ex: 1010 / 10 = 101"
};

const regioes = [
    {
        tema: "binario_para_decimal",
        nome: "Região Binária",
        inimigo: "BugBin de Espelho",
        tutorial: "Professor Byte: \"Bem-vindo à Região Binária! Aqui os números são representados apenas por 0s e 1s. Cada posição representa uma potência de 2, começando da direita. Por exemplo: 1010 = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 0 + 2 + 0 = 10\""
    },
    {
        tema: "decimal_para_binario",
        nome: "Região Decimal",
        inimigo: "Glitch Binário",
        tutorial: "Professor Byte: \"Esta é a Região Decimal, onde os números são familiares para você. Para converter para binário, divida o número por 2 repetidamente e colete os restos de trás para frente. Ex: 10 dividido por 2 é 5 com resto 0, 5/2=2 resto 1, 2/2=1 resto 0, 1/2=0 resto 1. Lendo de trás: 1010\""
    },
    {
        tema: "octal_para_decimal",
        nome: "Região Octal",
        inimigo: "Octazumbi",
        tutorial: "Professor Byte: \"Entramos na Região Octal! Aqui usamos base 8 com dígitos de 0-7. Cada posição é uma potência de 8. Ex: 17₈ = 1×8¹ + 7×8⁰ = 8 + 7 = 15. Converta para decimal usando essa lógica.\""
    },
    {
        tema: "decimal_para_octal",
        nome: "Território Octal",
        inimigo: "Operador Falho",
        tutorial: "Professor Byte: \"Para converter decimal para octal, divida o número por 8 repetidamente e colete os restos de trás para frente. Ex: 15 dividido por 8 é 1 com resto 7, 1/8=0 resto 1. Lendo de trás: 17₈\""
    },
    {
        tema: "hexadecimal_para_decimal",
        nome: "Dimensão Hexadecimal",
        inimigo: "Shade.exe",
        tutorial: "Professor Byte: \"Bem-vindo à Dimensão Hexadecimal! Aqui usamos base 16 com dígitos 0-9 e A-F. A=10, B=11, C=12, D=13, E=14, F=15. Cada posição é uma potência de 16. Ex: 1E₁₆ = 1×16¹ + 14×16⁰ = 16 + 14 = 30\""
    },
    {
        tema: "decimal_para_hexadecimal",
        nome: "Plano Hexadecimal",
        inimigo: "Hexafantasma",
        tutorial: "Professor Byte: \"Para converter decimal para hexadecimal, divida o número por 16. Restos acima de 9: 10=A, 11=B, 12=C, 13=D, 14=E, 15=F. Ex: 30/16=1 resto 14 (E), 1/16=0 resto 1 → 1E₁₆\""
    },
    {
        tema: "soma_binaria",
        nome: "Campo de Operações",
        inimigo: "Soma Maldita",
        tutorial: "Professor Byte: \"Agora operações binárias! Soma: 0+0=0, 0+1=1, 1+1=10 (vai 1), 1+1+1=11 (vai 1). Sempre alinhe os números pela direita e some coluna por coluna. Ex: 101 + 11 = 1000\""
    },
    {
        tema: "subtracao_binaria",
        nome: "Campo de Subtração",
        inimigo: "Subtraktor",
        tutorial: "Professor Byte: \"Subtração binária: empreste 1 quando necessário. 0-0=0, 1-0=1, 1-1=0, 0-1=1 (emprestando 1 da esquerda). Ex: 101 - 11 = 10 (5-3=2)\""
    },
    {
        tema: "multiplicacao_binaria",
        nome: "Campo de Multiplicação",
        inimigo: "Multiplicador de Erros",
        tutorial: "Professor Byte: \"Multiplicação binária é simples: 0×qualquer=0, 1×qualquer=o número. Desloque para a esquerda conforme a posição. Ex: 11 × 101 = 11 (deslocado 0) + 000 (deslocado 1) + 1100 (deslocado 2) = 1111\""
    },
    {
        tema: "divisao_binaria",
        nome: "Campo de Divisão",
        inimigo: "Divisor do Caos",
        tutorial: "Professor Byte: \"Divisão binária segue a mesma lógica da decimal. Ex: 100 / 10 = 10 (4/2=2). Comece com o divisor cabendo no dividendo, subtraia e desça o próximo dígito.\""
    }
];

function carregarDesafiosTema(tema) {
    temaAtivo = tema;
    let perguntas = [];
    
    switch (tema) {
        case "binario_para_decimal":
            perguntas = [
                { pergunta: "Converta 1010 para decimal", resposta: "10", dica: dicasPorTema.binario_para_decimal },
                { pergunta: "Converta 1111 para decimal", resposta: "15", dica: dicasPorTema.binario_para_decimal }
            ];
            break;
        case "decimal_para_binario":
            perguntas = [
                { pergunta: "Converta 5 para binário", resposta: "101", dica: dicasPorTema.decimal_para_binario },
                { pergunta: "Converta 8 para binário", resposta: "1000", dica: dicasPorTema.decimal_para_binario }
            ];
            break;
        case "octal_para_decimal":
            perguntas = [
                { pergunta: "Converta 17₈ para decimal", resposta: "15", dica: dicasPorTema.octal_para_decimal },
                { pergunta: "Converta 10₈ para decimal", resposta: "8", dica: dicasPorTema.octal_para_decimal }
            ];
            break;
        case "decimal_para_octal":
            perguntas = [
                { pergunta: "Converta 8 para octal", resposta: "10", dica: dicasPorTema.decimal_para_octal },
                { pergunta: "Converta 15 para octal", resposta: "17", dica: dicasPorTema.decimal_para_octal }
            ];
            break;
        case "hexadecimal_para_decimal":
            perguntas = [
                { pergunta: "Converta A₁₆ para decimal", resposta: "10", dica: dicasPorTema.hexadecimal_para_decimal },
                { pergunta: "Converta 1E₁₆ para decimal", resposta: "30", dica: dicasPorTema.hexadecimal_para_decimal }
            ];
            break;
        case "decimal_para_hexadecimal":
            perguntas = [
                { pergunta: "Converta 10 para hexadecimal", resposta: "A", dica: dicasPorTema.decimal_para_hexadecimal },
                { pergunta: "Converta 30 para hexadecimal", resposta: "1E", dica: dicasPorTema.decimal_para_hexadecimal }
            ];
            break;
        case "soma_binaria":
            perguntas = [
                { pergunta: "Some 101 + 11", resposta: "1000", dica: dicasPorTema.soma_binaria },
                { pergunta: "Some 1 + 1", resposta: "10", dica: dicasPorTema.soma_binaria }
            ];
            break;
        case "subtracao_binaria":
            perguntas = [
                { pergunta: "Subtraia 101 - 11", resposta: "10", dica: dicasPorTema.subtracao_binaria },
                { pergunta: "Subtraia 1001 - 1", resposta: "1000", dica: dicasPorTema.subtracao_binaria }
            ];
            break;
        case "multiplicacao_binaria":
            perguntas = [
                { pergunta: "Multiplique 10 × 10", resposta: "100", dica: dicasPorTema.multiplicacao_binaria },
                { pergunta: "Multiplique 11 × 11", resposta: "1001", dica: dicasPorTema.multiplicacao_binaria }
            ];
            break;
        case "divisao_binaria":
            perguntas = [
                { pergunta: "Divida 100 / 10", resposta: "10", dica: dicasPorTema.divisao_binaria },
                { pergunta: "Divida 1100 / 100", resposta: "11", dica: dicasPorTema.divisao_binaria }
            ];
            break;
    }
    
    return perguntas;
}

function iniciarDesafiosSimples(perguntas, tema) {
    let indice = 0;
    let erros = 0;
    let acertos = 0;
    
    function proximaPergunta() {
        if (modoHardcore) {
            iniciarTemporizador(15);
        }
        
        if (indice >= perguntas.length) {
            progresso[tema] = true;
            
            if (acertos === perguntas.length) {
                desbloquearConquista("semErros");
            }
            
            if (Object.values(progresso).every(v => v)) {
                desbloquearConquista("mestreNumerico");
            }
            
            escreverTexto(`Professor Byte: "Fim dos desafios! Acertos: ${acertos} | Erros: ${erros}"`, () => {
                desempenhoFinal.acertos += acertos;
                desempenhoFinal.erros += erros;
                salvarProgresso();
                
                if (modoHardcore) {
                    mostrarOpcoes([
                        { texto: "Escolher outro tema", acao: iniciarModoHardcore },
                        { texto: "Voltar ao menu", acao: () => location.reload() }
                    ]);
                } else {
                    avancarHistoria();
                }
            });
            return;
        }
        
        const perguntaAtual = perguntas[indice];
        escreverTexto(`Desafio ${indice + 1}/${perguntas.length}: ${perguntaAtual.pergunta}`, () => {
            mostrarCampoDeResposta(resposta => {
                const respostaFormatada = resposta.trim().toUpperCase();
                const gabarito = perguntaAtual.resposta.toUpperCase();
                
                if (respostaFormatada === gabarito) {
                    escreverTexto("Professor Byte: \"Resposta correta!\"", () => {
                        acertos++;
                        if (acertos === 1) desbloquearConquista("primeiroAcerto");
                        indice++;
                        proximaPergunta();
                    });
                } else {
                    escreverTexto(`Professor Byte: "Errado. A resposta correta era ${gabarito}."`, () => {
                        erros++;
                        indice++;
                        proximaPergunta();
                    });
                }
            }, perguntaAtual);
        });
    }
    
    proximaPergunta();
}

function primeiraCena() {
    escreverTexto(
        `Ligando o terminal educacional...\n\n` +
        `Professor Byte conectado.\n` +
        `"Bem-vindo(a), recruta. Parece que o caos numérico se espalhou de novo...\n` +
        `Vamos ver se você tem capacidade lógica para impedir a ruína matemática."`,
        () => {
            escreverTexto("Pressione uma opção para continuar...", () => {
                mostrarOpcoes([
                    { texto: "Iniciar Jornada", acao: avancarHistoria },
                    { texto: "Ver Progresso", acao: mostrarRelatorioFinalDesempenho }
                ]);
            });
        }
    );
}


function avancarHistoria() {
    // Esconde a HUD durante a narrativa
    document.getElementById("hud").classList.add("hidden");
    
    // Se já passou por todas as regiões, mostra o relatório final
    if (regiaoAtual >= regioes.length) {
        escreverTexto(
            "Professor Byte: \"Parabéns! Você restaurou a ordem numérica em todas as regiões!\"",
            () => mostrarRelatorioFinalDesempenho()
        );
        return;
    }

    const regiao = regioes[regiaoAtual];
    escreverTexto(
        `Viajando para ${regiao.nome}...\n\n${regiao.tutorial}`,
        () => {
            mostrarOpcoes([
                {
                    texto: "Continuar para o combate",
                    acao: () => {
                        const perguntas = carregarDesafiosTema(regiao.tema);
                        const inimigo = {
                            nome: regiao.inimigo,
                            perguntas,
                            vida: perguntas.length,
                            acertosTema: 0,   
                            errosTema: 0,     
                            aoVencer: () => {
                                
                                progresso[regiao.tema] = (inimigo.errosTema === 0);

                                
                                if (inimigo.acertosTema > 0)  desbloquearConquista("primeiroAcerto");
                                if (inimigo.errosTema === 0)  desbloquearConquista("semErros");
                                if (Object.values(progresso).every(v => v)) 
                                    desbloquearConquista("mestreNumerico");

                                regiaoAtual++;
                                salvarProgresso();
                                escreverTexto(
                                    "Professor Byte: \"Inimigo derrotado! Avançando para próxima região...\"",
                                    avancarHistoria
                                );
                            }
                        };

                        
                        combateRodada(inimigo);
                    }
                },
                {
                    texto: "Ler novamente",
                    acao: avancarHistoria
                }
            ]);
        },
        50  // velocidade de escrita do texto
    );
}



function mostrarRelatorioFinalDesempenho() {
    let relatorio = `📊 RELATÓRIO FINAL 📊\n\n`;
    relatorio += `✔️ Acertos totais: ${desempenhoFinal.acertos}\n`;
    relatorio += `❌ Erros totais: ${desempenhoFinal.erros}\n`;
    relatorio += `🔄 Reinícios: ${desempenhoFinal.reinicios}\n\n`;
    relatorio += `📚 Temas concluídos:\n`;
    
    for (const [tema, concluido] of Object.entries(progresso)) {
        relatorio += `- ${temasPorNome[tema]}: ${concluido ? "✅" : "❌"}\n`;
    }
    
    relatorio += `\n🏆 Conquistas desbloqueadas:\n`;
    for (const c of Object.values(conquistas)) {
        if (c.desbloqueada) relatorio += `- ${c.nome}: ${c.desc}\n`;
    }
    
    escreverTexto(relatorio, () => {
        mostrarOpcoes([
            { texto: "Novo Jogo", acao: () => location.reload() },
            { texto: "Sair", acao: () => window.close() }
        ]);
    });
}

carregarProgresso();