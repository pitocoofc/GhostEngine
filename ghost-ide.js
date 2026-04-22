// Troca de abas
function switchTab(lang) {
document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));

document.querySelector(`[onclick="switchTab('${lang}')"]`).classList.add('active');  
document.getElementById(`pane-${lang}`).classList.add('active');

}

// Preview
// Função auxiliar para buscar e traduzir (ou carregar) o comando
async function fetchCommand(commandName) {
    try {
        // Exemplo: busca o arquivo na pasta /commands/
        const response = await fetch(`/commands/${commandName}.js`);
        if (!response.ok) throw new Error("Comando não encontrado");
        
        const code = await response.text();
        
        // Aqui você pode adicionar uma camada de tradução, 
        // se o seu "idioma" for uma linguagem customizada.
        // Se for já JS, ele apenas retorna o conteúdo.
        return code; 
    } catch (err) {
        console.error(err);
        return `// Erro ao carregar comando ${commandName}`;
    }
}

// Preview atualizado
async function runCode() {
    const html = document.getElementById('htmlCode').value;
    const css = document.getElementById('cssCode').value;
    let js = document.getElementById('jsCode').value;

    // Regex simples para procurar comandos personalizados, ex: @comando()
    const commandRegex = /@(\w+)\(\)/g;
    const matches = [...js.matchAll(commandRegex)];

    for (const match of matches) {
        const fullMatch = match[0];
        const commandName = match[1];
        
        // Busca o código do comando
        const commandCode = await fetchCommand(commandName);
        
        // Substitui a chamada do comando pelo código traduzido/carregado
        js = js.replace(fullMatch, `(function() { ${commandCode} })()`);
    }

    const frame = document.getElementById('preview');
    frame.srcdoc = `<html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;  
    document.getElementById('viewport').style.display = 'block';
}


function closePreview() {
document.getElementById('viewport').style.display = 'none';
}
