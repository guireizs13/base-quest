// engine.js bloco 1
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function escreverTexto(texto, callback = null, velocidade = 80) { 
    const container = document.getElementById("texto");
    container.innerHTML = "";
    container.classList.add("typing");
    
    const linhas = texto.split('\n');
    let linhaAtual = 0;
    let charIndex = 0;
    
    function escrever() {
        if (linhaAtual < linhas.length) {
            if (charIndex === 0) {
                const linhaElement = document.createElement("div");
                container.appendChild(linhaElement);
            }
            
            const linhaElement = container.lastChild;
            if (charIndex < linhas[linhaAtual].length) {
                linhaElement.textContent += linhas[linhaAtual].charAt(charIndex);
                charIndex++;
                setTimeout(escrever, velocidade); 
            } else {
                linhaAtual++;
                charIndex = 0;
                setTimeout(escrever, velocidade); 
            }
        } else {
            container.classList.remove("typing");
            if (callback) setTimeout(callback, 500);
        }
    }
    
    escrever();
}

function mostrarCampoDeResposta(callback, perguntaAtual) {
    const entrada = document.getElementById("entrada");
    const campo = document.getElementById("resposta");
    const botao = document.getElementById("botao-responder");
    
    entrada.classList.remove("hidden");
    entrada.classList.add("fade-in");
    campo.value = "";
    campo.focus();
    
    document.querySelectorAll("#entrada .btn-dica").forEach(el => el.remove());
    
    if (perguntaAtual && perguntaAtual.dica) {
        const botaoDica = document.createElement("button");
        botaoDica.textContent = "Pedir Dica";
        botaoDica.className = "btn btn-pixel btn-dica btn-pequeno";
        botaoDica.onclick = () => {
            const textoOriginal = document.getElementById("texto").innerHTML; // Guarda o estado atual
            escreverTexto(`💡 Dica: ${perguntaAtual.dica}`, () => {
                document.getElementById("texto").innerHTML = textoOriginal;
                document.getElementById("texto").classList.add("typing");
            });
        };

        entrada.appendChild(botaoDica);
    }
    
    function tratarResposta() {
        entrada.classList.add("hidden");
        const resposta = campo.value.trim();
        botao.removeEventListener("click", tratarResposta);
        campo.removeEventListener("keypress", handleKeyPress);
        callback(resposta);
    }
    
    function handleKeyPress(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            tratarResposta();
        }
    }
    
    botao.addEventListener("click", tratarResposta);
    campo.addEventListener("keypress", handleKeyPress);
}

function mostrarOpcoes(opcoes) {
    const container = document.getElementById("opcoes");
    container.innerHTML = "";
    container.classList.remove("hidden");
    container.classList.add("fade-in");
    
    opcoes.forEach((opcao, index) => {
        const botao = document.createElement("button");
        botao.textContent = opcao.texto;
        botao.style.animationDelay = `${index * 0.1}s`;
        botao.onclick = () => {
            container.classList.add("hidden");
            container.innerHTML = "";
            opcao.acao();
        };
        container.appendChild(botao);
    });
}

function atualizarBarraVida(atual, max) {
    const barra = document.getElementById("vida-atual");
    const porcentagem = (atual / max) * 100;
    barra.style.width = `${porcentagem}%`;
    
    if (porcentagem > 60) {
        barra.style.background = 'linear-gradient(45deg, #00ffcc, #00aa99)';
    } else if (porcentagem > 30) {
        barra.style.background = 'linear-gradient(45deg, #ffaa00, #ff8800)';
    } else {
        barra.style.background = 'linear-gradient(45deg, #ff6699, #ff3366)';
    }
}

function atualizarVidasHUD() {
    const hudVidas = document.getElementById("vidas-container");
    hudVidas.innerHTML = "";
    
    for (let i = 0; i < vidas; i++) {
        const vida = document.createElement("div");
        vida.className = "vida-icon";
        hudVidas.appendChild(vida);
    }
}

function gerarSom8Bit(tipo) {
    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        gain.gain.value = 0.3;
        
        const config = {
            acerto: { type: "square", freq: 523.25, duration: 0.3 },
            erro: { type: "sawtooth", freq: 220, duration: 0.5 },
            conquista: { type: "sine", freq: 659.25, duration: 0.8 },
            vitoria: { type: "triangle", freq: 784.0, duration: 1.5 }
        }[tipo];
        
        if (!config) return;
        
        osc.type = config.type;
        osc.frequency.value = config.freq;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration);
        osc.stop(audioContext.currentTime + config.duration);
    } catch (e) {
        console.log("Erro de áudio:", e);
    }
}

function combateRodada(inimigo) {
    const hud = document.getElementById("hud");
    const nome = document.getElementById("nome-inimigo");
    const inimigoVisual = document.getElementById("inimigo-visual");
    
    // rola até o HUD e exibe uma única vez
    hud.scrollIntoView({ 
      behavior: "smooth",
      block: "center"
    });
    hud.classList.remove("hidden");
    hud.classList.add("fade-in");
    
    nome.textContent = `Inimigo: ${inimigo.nome}`;
    
    let estilo = "";
    switch (inimigo.nome) {
        case "BugBin de Espelho":
            estilo = "background: linear-gradient(135deg, #000, #333); border: 2px solid #00ffcc; box-shadow: 0 0 20px #00ffcc;";
            break;
        case "Octazumbi":
            estilo = "background: radial-gradient(circle, #551a8b, #301934); border: 2px solid #aa00ff; box-shadow: 0 0 20px #aa00ff;";
            break;
        case "Glitch Binário":
            estilo = "background: linear-gradient(135deg, #0d2b2b, #1a1a2e); border: 2px solid #00ffcc; box-shadow: 0 0 20px #00ffcc;";
            break;
        case "Processador Caótico":
            estilo = "background: radial-gradient(circle, #8b1a1a, #301930); border: 2px solid #ffaa00; box-shadow: 0 0 20px #ffaa00;";
            break;
        case "Operador Falho":
            estilo = "background: linear-gradient(135deg, #1a2e2a, #16213e); border: 2px solid #ff3366; box-shadow: 0 0 20px #ff3366;";
            break;
        case "Shade.exe":
            estilo = "background: linear-gradient(135deg, #1a2e2e, #0d3d2e); border: 2px solid #00aaff; box-shadow: 0 0 20px #00aaff;";
            break;
        case "Erro-Mestre":
            estilo = "background: linear-gradient(135deg, #000, #ff0066, #000); border: 2px solid #ff0066; box-shadow: 0 0 20px #ff0066;";
            break;
    }
    
    inimigoVisual.classList.remove("entrada-inimigo", "saida-inimigo");
    void inimigoVisual.offsetWidth;
    inimigoVisual.style = estilo;
    inimigoVisual.classList.add("entrada-inimigo");

    const vidaMax = inimigo.perguntas.length;
    atualizarBarraVida(inimigo.vida, vidaMax);
    atualizarVidasHUD();

    if (inimigo.vida <= 0) {
        setTimeout(() => {
            inimigoVisual.classList.remove("entrada-inimigo");
            inimigoVisual.classList.add("saida-inimigo");

            inimigoVisual.addEventListener("animationend", function limparSaida() {
                inimigoVisual.classList.remove("saida-inimigo");
                inimigoVisual.removeEventListener("animationend", limparSaida);
                
                hud.classList.add("hidden");
                if (inimigo.aoVencer) inimigo.aoVencer();
            });
        }, 1000);
        return;
    }

    const perguntaAtual = inimigo.perguntas[inimigo.perguntas.length - inimigo.vida];
    escreverTexto(`HP: ${inimigo.vida} ❤️\n\n${perguntaAtual.pergunta}`);

    function tratarResposta(resposta) {
        if (resposta.trim().toUpperCase() === perguntaAtual.resposta.toUpperCase()) {
            gerarSom8Bit("acerto");
            desempenhoFinal.acertos++;
            inimigo.acertosTema++;    // incrementa acertos no tema
            inimigo.vida--;

            escreverTexto(
              "Professor Byte: \"Golpe certeiro. Parece que aprendeu alguma coisa.\"",
              () => setTimeout(() => combateRodada(inimigo), 800)
            );
        } else {
            gerarSom8Bit("erro");
            desempenhoFinal.erros++;
            inimigo.errosTema++;      // incrementa erros no tema
            vidas--;
            atualizarVidasHUD();

            if (vidas <= 0) {
                if (modoHardcore) {
                    escreverTexto(
                      "Professor Byte: \"Você falhou no modo Hardcore... Tente novamente!\"",
                      () => mostrarOpcoes([
                        { texto: "Recomeçar Modo Hardcore", acao: iniciarModoHardcore },
                        { texto: "Voltar ao Menu", acao: () => location.reload() }
                      ])
                    );
                } else {
                    escreverTexto(
                      "Professor Byte: \"Acabaram suas vidas! Voltando ao início da luta...\"",
                      () => {
                        vidas = 3;
                        atualizarVidasHUD();
                        inimigo.vida = vidaMax;
                        setTimeout(() => combateRodada(inimigo), 1000);
                      }
                    );
                }
                return;
            } else {
                escreverTexto(
                  `Professor Byte: \"Errou! Vidas restantes: ${vidas}\"`,
                  () => setTimeout(() => {
                    escreverTexto(
                      `HP: ${inimigo.vida} ❤️\n\n${perguntaAtual.pergunta}`,
                      () => mostrarCampoDeResposta(tratarResposta, perguntaAtual)
                    );
                  }, 500)
                );
            }
        }
    }

    mostrarCampoDeResposta(tratarResposta, perguntaAtual);
}



function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

window.onload = function () {
    createParticles();
    
    const iniciar = document.getElementById("botao-iniciar");
    iniciar.addEventListener("click", () => {
        iniciarJogo();
    });
    
    document.getElementById("botao-hardcore").addEventListener("click", () => {
        iniciarModoHardcore();
    });
    
    document.getElementById("botao-carregar").addEventListener("click", () => {
        carregarProgresso();
        iniciarJogo();
        escreverTexto("Professor Byte: \"Progresso carregado! Continue de onde parou.\"");
    });
};

function iniciarJogo() {
  const inicio = document.getElementById("inicio");
  const jogo   = document.getElementById("jogo");

  
  inicio.classList.add("exit");

 
  inicio.addEventListener("transitionend", function onEnd() {
    inicio.removeEventListener("transitionend", onEnd);
    inicio.classList.add("hidden");

   
    document.body.className = "";
    document.body.classList.add(`regiao-${temaAtivo}`);

    
    jogo.classList.remove("hidden");
    
    void jogo.offsetWidth;
    jogo.classList.add("enter");

    
    const musica = document.getElementById("musica-fundo");
    if (musica.paused) musica.play().catch(() => {});
    if (!modoHardcore) primeiraCena();
  });
}




function salvarProgresso() {
    const dados = {
        progresso,
        vidas,
        temaAtivo,
        conquistas,
        desempenhoFinal
    };
    localStorage.setItem("baseQuest_save", JSON.stringify(dados));
}

function carregarProgresso() {
  const dados = JSON.parse(localStorage.getItem("baseQuest_save"));
  if (!dados) return;

  
  if (dados.progresso)       Object.assign(progresso,       dados.progresso);
  if (dados.vidas  !== undefined) vidas           = dados.vidas;
  if (dados.temaAtivo)       temaAtivo       = dados.temaAtivo;
  if (dados.conquistas)      Object.assign(conquistas,      dados.conquistas);
  if (dados.desempenhoFinal) Object.assign(desempenhoFinal, dados.desempenhoFinal);
}


let modoHardcore = false;
let tempoRestante;

function iniciarModoHardcore() {
    modoHardcore = true;
    vidas = 1;
    iniciarJogo();
    escreverTexto("Professor Byte: \"Modo Hardcore ativado! Uma vida, sem tutoriais. Boa sorte!\"", () => {
        mostrarOpcoes(Object.entries(temasPorNome).map(([chave, nome]) => ({
            texto: nome,
            acao: () => {
                const perguntas = carregarDesafiosTema(chave);
                const inimigo = {
                    nome: (regioes.find(r => r.tema === chave)?.inimigo || nome),
                    perguntas: perguntas,
                    vida: perguntas.length,
                    aoVencer: () => {
                        escreverTexto("Professor Byte: \"Tema vencido no Modo Hardcore!\"", () => {
                            mostrarOpcoes([
                                { texto: "Escolher outro tema", acao: iniciarModoHardcore },
                                { texto: "Voltar ao menu", acao: () => location.reload() }
                            ]);
                        });
                    }
                };
                combateRodada(inimigo);
            }
        })));
    });
}


function iniciarTemporizador(segundos) {
    clearInterval(tempoRestante);
    const hud = document.getElementById("hud");
    let timerDisplay = document.getElementById("temporizador");
    
    if (!timerDisplay) {
        timerDisplay = document.createElement("div");
        timerDisplay.id = "temporizador";
        hud.appendChild(timerDisplay);
    }
    
    let tempo = segundos;
    timerDisplay.textContent = `⏱️ ${tempo}s`;
    timerDisplay.style.color = "#00ffcc";
    
    tempoRestante = setInterval(() => {
        tempo--;
        timerDisplay.textContent = `⏱️ ${tempo}s`;
        
        if (tempo <= 5) {
            timerDisplay.style.color = "#ff6699";
            timerDisplay.style.animation = "pulsate 0.5s infinite";
        }
        
        if (tempo <= 0) {
            clearInterval(tempoRestante);
            tratarResposta("");
        }
    }, 1000);
}