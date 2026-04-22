// Troca de abas
function switchTab(lang) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`[onclick="switchTab('${lang}')"]`).classList.add('active');
    document.getElementById(`pane-${lang}`).classList.add('active');
}

// Preview
async function runCode() {
    await loadCommands();

    let html = document.getElementById('htmlCode').value;
    const css = document.getElementById('cssCode').value;
    const js = document.getElementById('jsCode').value;

    html = parseGhostHTML(html);

    const frame = document.getElementById('preview');

    frame.srcdoc = `
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;

    document.getElementById('viewport').style.display = 'block';
}
function closePreview() {
    document.getElementById('viewport').style.display = 'none';
}
