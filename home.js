<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  // --- MENU LATERAL ---
  const menuToggle = document.querySelector('.menu-toggle');
  const closeMenu = document.querySelector('.close-menu');
  const sideMenu = document.querySelector('.side-menu');
  const body = document.body;

  // Overlay para o menu lateral
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
  }

  function openMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('active');
    body.classList.add('no-scroll');
  }

  function closeMenuFn() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
    body.classList.remove('no-scroll');
    document.querySelectorAll('.has-submenu.open').forEach(sub => sub.classList.remove('open'));
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
  if (overlay) overlay.addEventListener('click', closeMenuFn);

  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = e.currentTarget.closest('.has-submenu');
      document.querySelectorAll('.has-submenu.open').forEach(item => {
        if (item !== parentLi) item.classList.remove('open');
      });
      parentLi.classList.toggle('open');
    });
  });

  // --- VARIÁVEIS GLOBAIS DO BLOG ---
  const blogId = '6542152951377954792';
  const apiKey = 'AIzaSyBM93phAxuAbZk8LFqM8aAnCJeiwit2yXI';
  const postGrid = document.querySelector('.post-grid');
  const searchInput = document.getElementById('search-input');
  const loadMoreButton = document.getElementById('load-more-button');
  const categoryBar = document.querySelector('.category-bar');

  let allPosts = [];
  let currentPageToken = null;
  let activeCategory = null;
  let isLoading = false;

  // --- MODAL DE DETALHE ---
  const postDetailModal = document.getElementById('post-detail-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalMeta = document.getElementById('modal-meta');
  const closeModalButton = document.querySelector('.close-modal-button');

  function openModal(imageUrl, title, description, meta) {
    modalImage.src = imageUrl;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalMeta.innerHTML = meta;
    postDetailModal.style.display = 'flex';
    body.classList.add('no-scroll');
  }

  function closeModal() {
    postDetailModal.style.display = 'none';
    body.classList.remove('no-scroll');
  }

  if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
  if (postDetailModal) {
    postDetailModal.addEventListener('click', (e) => {
      if (e.target === postDetailModal) closeModal();
    });
  }

  // --- BUSCA E CATEGORIAS ---
  function extractCategories() {
    const categorias = new Set();
    allPosts.forEach(post => {
      (post.labels || []).forEach(cat => categorias.add(cat));
    });

    categoryBar.innerHTML = '';
    categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-filter';
      btn.textContent = cat;
      btn.dataset.cat = cat;
      if (cat === activeCategory) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = cat;
        renderPosts();
      });
      categoryBar.appendChild(btn);
    });
  }

  searchInput.addEventListener('input', () => {
    renderPosts();
  });

  // --- CARREGAMENTO DE POSTS ---
  async function fetchPosts() {
    if (isLoading) return;
    isLoading = true;

    let url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=30`;
    if (currentPageToken) url += `&pageToken=${currentPageToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      currentPageToken = data.nextPageToken || null;

      const newPosts = data.items || [];
      allPosts.push(...newPosts);

      extractCategories();
      renderPosts();

      loadMoreButton.style.display = currentPageToken ? 'block' : 'none';
    } catch (e) {
      console.error('Erro ao buscar posts:', e);
    }

    isLoading = false;
  }

  loadMoreButton.addEventListener('click', fetchPosts);

  // --- RENDERIZAÇÃO DOS POSTS ---
  function renderPosts() {
    const search = searchInput.value.toLowerCase();
    postGrid.innerHTML = '';

    const filtered = allPosts.filter(post => {
      const title = post.title.toLowerCase();
      const content = (post.content || '').toLowerCase();
      const matchSearch = title.includes(search) || content.includes(search);
      const matchCategory = !activeCategory || (post.labels || []).includes(activeCategory);
      return matchSearch && matchCategory;
    });

    filtered.forEach(post => {
      const div = document.createElement('article');
      div.className = 'post-card';

      const imageMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      const imageUrl = imageMatch ? imageMatch[1] : 'logo.jpg';

      const plainText = post.content.replace(/<[^>]*>/g, '');
      const resumo = plainText.substring(0, 150) + '...';
      const dataFormatada = new Date(post.published).toLocaleDateString('pt-BR');

      div.innerHTML = `
        <img src="${imageUrl}" alt="Imagem">
        <div class="post-content">
          <h4>${post.title}</h4>
          <p>${resumo}</p>
          <span class="post-meta"><i class="fas fa-calendar-alt"></i> ${dataFormatada} | ${(post.labels || []).join(', ')}</span>
          <a href="#" class="read-more">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
        </div>
      `;

      // Evento para abrir modal
      div.querySelector('.read-more').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(imageUrl, post.title, plainText, div.querySelector('.post-meta').innerHTML);
      });

      postGrid.appendChild(div);
    });
  }

  // --- INÍCIO ---
  fetchPosts();
});
=======
document.addEventListener('DOMContentLoaded', () => {
  // --- MENU LATERAL ---
  const menuToggle = document.querySelector('.menu-toggle');
  const closeMenu = document.querySelector('.close-menu');
  const sideMenu = document.querySelector('.side-menu');
  const body = document.body;

  // Overlay para o menu lateral
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
  }

  function openMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('active');
    body.classList.add('no-scroll');
  }

  function closeMenuFn() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
    body.classList.remove('no-scroll');
    document.querySelectorAll('.has-submenu.open').forEach(sub => sub.classList.remove('open'));
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
  if (overlay) overlay.addEventListener('click', closeMenuFn);

  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = e.currentTarget.closest('.has-submenu');
      document.querySelectorAll('.has-submenu.open').forEach(item => {
        if (item !== parentLi) item.classList.remove('open');
      });
      parentLi.classList.toggle('open');
    });
  });

  // --- VARIÁVEIS GLOBAIS DO BLOG ---
  const blogId = '6542152951377954792';
  const apiKey = 'AIzaSyBM93phAxuAbZk8LFqM8aAnCJeiwit2yXI';
  const postGrid = document.querySelector('.post-grid');
  const searchInput = document.getElementById('search-input');
  const loadMoreButton = document.getElementById('load-more-button');
  const categoryBar = document.querySelector('.category-bar');

  let allPosts = [];
  let currentPageToken = null;
  let activeCategory = null;
  let isLoading = false;

  // --- MODAL DE DETALHE ---
  const postDetailModal = document.getElementById('post-detail-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalMeta = document.getElementById('modal-meta');
  const closeModalButton = document.querySelector('.close-modal-button');

  function openModal(imageUrl, title, description, meta) {
    modalImage.src = imageUrl;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalMeta.innerHTML = meta;
    postDetailModal.style.display = 'flex';
    body.classList.add('no-scroll');
  }

  function closeModal() {
    postDetailModal.style.display = 'none';
    body.classList.remove('no-scroll');
  }

  if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
  if (postDetailModal) {
    postDetailModal.addEventListener('click', (e) => {
      if (e.target === postDetailModal) closeModal();
    });
  }

  // --- BUSCA E CATEGORIAS ---
  function extractCategories() {
    const categorias = new Set();
    allPosts.forEach(post => {
      (post.labels || []).forEach(cat => categorias.add(cat));
    });

    categoryBar.innerHTML = '';
    categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-filter';
      btn.textContent = cat;
      btn.dataset.cat = cat;
      if (cat === activeCategory) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = cat;
        renderPosts();
      });
      categoryBar.appendChild(btn);
    });
  }

  searchInput.addEventListener('input', () => {
    renderPosts();
  });

  // --- CARREGAMENTO DE POSTS ---
  async function fetchPosts() {
    if (isLoading) return;
    isLoading = true;

    let url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=30`;
    if (currentPageToken) url += `&pageToken=${currentPageToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      currentPageToken = data.nextPageToken || null;

      const newPosts = data.items || [];
      allPosts.push(...newPosts);

      extractCategories();
      renderPosts();

      loadMoreButton.style.display = currentPageToken ? 'block' : 'none';
    } catch (e) {
      console.error('Erro ao buscar posts:', e);
    }

    isLoading = false;
  }

  loadMoreButton.addEventListener('click', fetchPosts);

  // --- RENDERIZAÇÃO DOS POSTS ---
  function renderPosts() {
    const search = searchInput.value.toLowerCase();
    postGrid.innerHTML = '';

    const filtered = allPosts.filter(post => {
      const title = post.title.toLowerCase();
      const content = (post.content || '').toLowerCase();
      const matchSearch = title.includes(search) || content.includes(search);
      const matchCategory = !activeCategory || (post.labels || []).includes(activeCategory);
      return matchSearch && matchCategory;
    });

    filtered.forEach(post => {
      const div = document.createElement('article');
      div.className = 'post-card';

      const imageMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
      const imageUrl = imageMatch ? imageMatch[1] : 'logo.jpg';

      const plainText = post.content.replace(/<[^>]*>/g, '');
      const resumo = plainText.substring(0, 150) + '...';
      const dataFormatada = new Date(post.published).toLocaleDateString('pt-BR');

      div.innerHTML = `
        <img src="${imageUrl}" alt="Imagem">
        <div class="post-content">
          <h4>${post.title}</h4>
          <p>${resumo}</p>
          <span class="post-meta"><i class="fas fa-calendar-alt"></i> ${dataFormatada} | ${(post.labels || []).join(', ')}</span>
          <a href="#" class="read-more">Ver Detalhes <i class="fas fa-arrow-right"></i></a>
        </div>
      `;

      // Evento para abrir modal
      div.querySelector('.read-more').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(imageUrl, post.title, plainText, div.querySelector('.post-meta').innerHTML);
      });

      postGrid.appendChild(div);
    });
  }

  // --- INÍCIO ---
  fetchPosts();
});
>>>>>>> fe04437f35e3609f89c02d6421c11db604cf9d31
