document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const sideMenu = document.querySelector('.side-menu');
    const body = document.body; // Referência ao body para controle de scroll

    // Cria o overlay dinamicamente (se ainda não existir)
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);
    }

    /**
     * Abre o menu lateral e ativa o overlay, desabilitando o scroll do body.
     */
    function openMenu() {
        sideMenu.classList.add('open');
        overlay.classList.add('active');
        body.classList.add('no-scroll'); // Adiciona classe para desabilitar o scroll
    }

    /**
     * Fecha o menu lateral e desativa o overlay, reabilitando o scroll do body.
     */
    function closeMenuFn() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll'); // Remove classe para habilitar o scroll
        // Fecha todos os submenus ao fechar o menu principal
        document.querySelectorAll('.has-submenu.open').forEach(submenuItem => {
            submenuItem.classList.remove('open');
        });
    }

    // Adiciona event listeners para abrir e fechar o menu
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    } else {
        console.warn('Elemento .menu-toggle não encontrado.');
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFn);
    } else {
        console.warn('Elemento .close-menu não encontrado.');
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenuFn); // Fecha o menu ao clicar no overlay
    } else {
        console.warn('Elemento .overlay não encontrado.');
    }

    // Funcionalidade para o botão "Carregar Mais Notícias" (exemplo básico)
    const loadMoreButton = document.querySelector('.load-more-button');
    const postGrid = document.querySelector('.post-grid');

    let postCount = 9; // Quantidade inicial de posts visíveis

    // Conteúdo HTML para mais posts (movido para fora do listener para ser reutilizado)
    const morePostsHtml = `
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Aviso Importante">
            <div class="post-content">
                <h4>Aviso: Prazo Final para Entrega de Relatórios</h4>
                <p>Alunos de estágio, fiquem atentos ao prazo final para entrega dos relatórios do estágio supervisionado.</p>
                <span class="post-meta"><i class="fas fa-exclamation-triangle"></i> Aviso | 28/06/2025</span>
                <a href="#" class="read-more">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo</h4>
                <p>Participe do nosso workshop e aprenda sobre as últimas tendências do mercado.</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 25/06/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo - Parte 2</h4>
                <p>Devido ao sucesso, teremos uma segunda parte do workshop. Não perca!</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 01/08/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Aviso Importante">
            <div class="post-content">
                <h4>Aviso: Prazo Final para Entrega de Relatórios</h4>
                <p>Alunos de estágio, fiquem atentos ao prazo final para entrega dos relatórios do estágio supervisionado.</p>
                <span class="post-meta"><i class="fas fa-exclamation-triangle"></i> Aviso | 28/06/2025</span>
                <a href="#" class="read-more">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo</h4>
                <p>Participe do nosso workshop e aprenda sobre as últimas tendências do mercado.</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 25/06/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo - Parte 2</h4>
                <p>Devido ao sucesso, teremos uma segunda parte do workshop. Não perca!</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 01/08/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Aviso Importante">
            <div class="post-content">
                <h4>Aviso: Prazo Final para Entrega de Relatórios</h4>
                <p>Alunos de estágio, fiquem atentos ao prazo final para entrega dos relatórios do estágio supervisionado.</p>
                <span class="post-meta"><i class="fas fa-exclamation-triangle"></i> Aviso | 28/06/2025</span>
                <a href="#" class="read-more">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo</h4>
                <p>Participe do nosso workshop e aprenda sobre as últimas tendências do mercado.</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 25/06/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo - Parte 2</h4>
                <p>Devido ao sucesso, teremos uma segunda parte do workshop. Não perca!</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 01/08/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Aviso Importante">
            <div class="post-content">
                <h4>Aviso: Prazo Final para Entrega de Relatórios</h4>
                <p>Alunos de estágio, fiquem atentos ao prazo final para entrega dos relatórios do estágio supervisionado.</p>
                <span class="post-meta"><i class="fas fa-exclamation-triangle"></i> Aviso | 28/06/2025</span>
                <a href="#" class="read-more">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo</h4>
                <p>Participe do nosso workshop e aprenda sobre as últimas tendências do mercado.</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 25/06/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="post-card">
            <img src="logo.jpg" alt="Imagem de Workshop">
            <div class="post-content">
                <h4>Workshop de Inovação e Empreendedorismo - Parte 2</h4>
                <p>Devido ao sucesso, teremos uma segunda parte do workshop. Não perca!</p>
                <span class="post-meta"><i class="fas fa-lightbulb"></i> Workshop | 01/08/2025</span>
                <a href="#" class="read-more">Inscreva-se <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;

    // --- Carrega mais cards ao abrir a tela ---
    if (postGrid) {
        postGrid.insertAdjacentHTML('beforeend', morePostsHtml);
        postCount += 9; // Incrementa a contagem de posts exibidos
    }
    // --- Fim da alteração para carregar ao abrir a tela ---


    if (loadMoreButton && postGrid) { // Verifica se os elementos existem
        loadMoreButton.addEventListener('click', () => {
            postGrid.insertAdjacentHTML('beforeend', morePostsHtml);
            postCount += 9; // Incrementa a contagem de posts exibidos

            // Re-adiciona event listeners aos novos botões "read-more"
            addReadMoreListeners();

            // Re-filtra os posts caso haja um termo de pesquisa ativo
            filterPosts();

            // Opcional: Esconder o botão "Carregar Mais" quando não houver mais posts
            // if (postCount >= totalPostsDisponiveis) { // Você precisaria saber o total de posts
            //     loadMoreButton.style.display = 'none';
            // }
        });
    }

    // Funcionalidade para os itens do menu
    const menuItems = document.querySelectorAll('.side-menu ul li a:not(.submenu-toggle)'); // Seleciona todos os links exceto os toggles de submenu
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Se o item clicado não for um toggle de submenu, procede com o redirecionamento
            if (!e.currentTarget.classList.contains('submenu-toggle')) {
                e.preventDefault(); // Impede o comportamento padrão do link
                const pageName = e.currentTarget.dataset.page;

                if (pageName === 'contato') {
                    window.location.href = 'contato.html'; // Redireciona para contato.html (no mesmo nível de index.html)
                } else if (pageName === 'horarios') {
                    window.location.href = '../HorarioAula/horarioaula.html'; // Redireciona para horarioaula.html na pasta HorarioAula
                } else {
                    alert(`Você clicou em: ${pageName.replace('-', ' ').toUpperCase()}`);
                }
                closeMenuFn(); // Fecha o menu principal após clicar em um item
            }
        });
    });

    // --- Funcionalidade do Modal ---
    const postDetailModal = document.getElementById('post-detail-modal');
    const closeModalButton = document.querySelector('.close-modal-button');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalMeta = document.getElementById('modal-meta');

    /**
     * Abre o modal com os detalhes do post.
     * @param {string} imageUrl - URL da imagem do post.
     * @param {string} title - Título do post.
     * @param {string} description - Descrição completa do post.
     * @param {string} meta - Metadados do post (categoria | data).
     */
    function openModal(imageUrl, title, description, meta) {
        modalImage.src = imageUrl;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalMeta.innerHTML = meta; // Usar innerHTML para manter os ícones e formatação
        postDetailModal.style.display = 'flex'; // Usa flex para centralizar o modal-content
        body.classList.add('no-scroll'); // Desabilita o scroll do body
    }

    /**
     * Fecha o modal.
     */
    function closeModal() {
        postDetailModal.style.display = 'none';
        body.classList.remove('no-scroll'); // Reabilita o scroll do body
    }

    // Adiciona event listeners aos botões "Ver Detalhes"
    function addReadMoreListeners() {
        const readMoreButtons = document.querySelectorAll('.read-more');
        readMoreButtons.forEach(button => {
            // Remove o listener anterior para evitar duplicação em posts novos
            button.removeEventListener('click', handleReadMoreClick);
            // Adiciona o novo listener
            button.addEventListener('click', handleReadMoreClick);
        });
    }

    /**
     * Lida com o clique no botão "Ver Detalhes" de um card.
     * Extrai as informações do card pai e abre o modal.
     * @param {Event} e - O evento de clique.
     */
    function handleReadMoreClick(e) {
        e.preventDefault(); // Impede o comportamento padrão do link
        const postCard = e.target.closest('.post-card'); // Encontra o elemento .post-card pai

        if (postCard) {
            const imageUrl = postCard.querySelector('img').src;
            const title = postCard.querySelector('h4').textContent;
            const description = postCard.querySelector('p').textContent;
            const meta = postCard.querySelector('.post-meta').innerHTML;

            openModal(imageUrl, title, description, meta);
        }
    }

    // Chama a função para adicionar listeners na carga inicial da página
    addReadMoreListeners();

    // Adiciona event listeners para fechar o modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Fecha o modal ao clicar fora do conteúdo do modal
    if (postDetailModal) {
        postDetailModal.addEventListener('click', (e) => {
            if (e.target === postDetailModal) { // Verifica se o clique foi no overlay do modal
                closeModal();
            }
        });
    }

    // --- Funcionalidade de Pesquisa ---
    const searchInput = document.getElementById('search-input');

    /**
     * Filtra os posts com base no texto da barra de pesquisa.
     */
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase(); // Termo de pesquisa em minúsculas
        const currentPostCards = document.querySelectorAll('.post-card'); // Pega todos os cards atuais

        currentPostCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            // Verifica se o título ou a descrição contêm o termo de pesquisa
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block'; // Mostra o card
            } else {
                card.style.display = 'none'; // Oculta o card
            }
        });
    }

    // Adiciona event listener para o input de pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }

    // --- Lógica para os Submenus ---
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o link de navegar
            const parentLi = e.currentTarget.closest('.has-submenu');

            // Fecha outros submenus abertos (opcional, para ter apenas um submenu aberto por vez)
            document.querySelectorAll('.has-submenu.open').forEach(item => {
                if (item !== parentLi) {
                    item.classList.remove('open');
                }
            });

            parentLi.classList.toggle('open'); // Alterna a classe 'open' no item pai
        });
    });
});