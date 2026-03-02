/**
 * Script para copiar os ícones dos títulos para o TOC (Table of Contents)
 * Este script é executado após a página carregar e copia os SVGs dos emojis
 * dos títulos para os links correspondentes no índice lateral.
 */

function copyIconsToTOC() {
    console.log('copyIconsToTOC: Iniciando...');
    
    // Seleciona o container do TOC lateral direito
    const tocNav = document.querySelector('.md-sidebar--secondary .md-nav');
    if (!tocNav) {
        console.log('copyIconsToTOC: TOC não encontrado');
        return;
    }
    
    // Seleciona todos os links do TOC
    const tocLinks = tocNav.querySelectorAll('a.md-nav__link');
    console.log('copyIconsToTOC: Encontrados ' + tocLinks.length + ' links no TOC');
    
    let iconsAdded = 0;
    
    tocLinks.forEach(function(tocLink) {
        // Evita adicionar ícone duplicado
        if (tocLink.querySelector('svg')) return;
        
        // Pega o href do link do TOC (ex: #objetivo)
        const href = tocLink.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        // Encontra o elemento de cabeçalho correspondente na página
        const headingId = href.substring(1);
        const heading = document.getElementById(headingId);
        
        if (heading) {
            // Procura por SVGs dentro do heading (os emojis são convertidos para SVG)
            const svg = heading.querySelector('svg');
            
            if (svg) {
                // Clona o SVG
                const svgClone = svg.cloneNode(true);
                
                // Adiciona estilos inline
                svgClone.style.width = '1.2em';
                svgClone.style.height = '1.2em';
                svgClone.style.verticalAlign = 'text-bottom';
                svgClone.style.marginRight = '0.4em';
                svgClone.style.display = 'inline';
                
                // Insere no início do link
                tocLink.insertBefore(svgClone, tocLink.firstChild);
                iconsAdded++;
            }
        }
    });
    
    console.log('copyIconsToTOC: Adicionados ' + iconsAdded + ' ícones');
}

// Função para aguardar elementos estarem prontos
function waitForElements(selector, callback, maxAttempts = 30) {
    let attempts = 0;
    
    function check() {
        attempts++;
        const elements = document.querySelectorAll(selector);
        
        // Verifica se há SVGs nos headings (sinal de que emojis foram renderizados)
        const headingsWithSvg = document.querySelectorAll('h1 svg, h2 svg, h3 svg');
        
        console.log('waitForElements: Tentativa ' + attempts + ' - TOC links: ' + elements.length + ', Headings com SVG: ' + headingsWithSvg.length);
        
        if (elements.length > 0 && headingsWithSvg.length > 0) {
            callback();
        } else if (attempts < maxAttempts) {
            setTimeout(check, 200);
        } else {
            console.log('waitForElements: Timeout - executando mesmo assim');
            callback();
        }
    }
    
    check();
}

// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded disparado');
    waitForElements('.md-sidebar--secondary .md-nav__link', copyIconsToTOC);
});

// Também executa no evento load (após imagens e scripts)
window.addEventListener('load', function() {
    console.log('Window load disparado');
    setTimeout(function() {
        waitForElements('.md-sidebar--secondary .md-nav__link', copyIconsToTOC);
    }, 500);
});

// Para navegação instantânea do MkDocs Material - usa o evento do Material
document.addEventListener('DOMContentLoaded', function() {
    // MkDocs Material dispara eventos personalizados
    const content = document.querySelector('[data-md-component="content"]');
    if (content) {
        const observer = new MutationObserver(function(mutations) {
            console.log('MutationObserver: Conteúdo mudou');
            setTimeout(function() {
                waitForElements('.md-sidebar--secondary .md-nav__link', copyIconsToTOC);
            }, 300);
        });
        
        observer.observe(content, { 
            childList: true, 
            subtree: true 
        });
    }
});
