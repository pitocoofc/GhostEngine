// Troca de abas
function switchTab(lang) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));

    const tabBtn = document.querySelector(`[onclick="switchTab('${lang}')"]`);
    const pane = document.getElementById(`pane-${lang}`);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (pane) pane.classList.add('active');
}

// Função auxiliar para buscar o arquivo do comando
async function fetchCommand(commandName) {
    try {
        const response = await fetch(`/commands/${commandName}.js`);
        if (!response.ok) throw new Error(`Comando ${commandName} não encontrado`);
        
        return await response.text();
    } catch (err) {
        console.error(err);
        return `console.error("Erro ao carregar comando: ${commandName}");`;
    }
}

// Preview atualizado e revisado
async function runCode() {
    const html = document.getElementById('htmlCode').value;
    const css = document.getElementById('cssCode').value;
    let js = document.getElementById('jsCode').value;

    // Regex para capturar @comando()
    const commandRegex = /@(\w+)\(\)/g;
    const matches = [...js.matchAll(commandRegex)];

    // Processa os comandos de trás para frente ou sequencialmente
    // Usamos um loop for...of para lidar corretamente com o await
    for (const match of matches) {
        const [fullMatch, commandName] = match;
        
        const commandCode = await fetchCommand(commandName);
        
        // Usamos replaceAll para garantir que todas as ocorrências do comando sejam trocadas
        // Envolvemos em uma IIFE para isolar o escopo do código importado
        const replacement = `(function() { 
            ${commandCode} 
        })();`;
        
        js = js.replaceAll(fullMatch, replacement);
    }

    const frame = document.getElementById('preview');
    // Injetamos o código garantindo que o srcdoc processe as quebras de linha corretamente
    frame.srcdoc = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>
                    try {
                        ${js}
                    } catch (e) {
                        console.error("Erro na execução do script:", e);
                    }
                <\/script>
            </body>
        </html>`;
    
    document.getElementById('viewport').style.display = 'block';
}

function closePreview() {
    document.getElementById('viewport').style.display = 'none';
}
