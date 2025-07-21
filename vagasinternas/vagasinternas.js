document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("vagas-container");
  const campoBusca = document.getElementById("busca-vagas");
  const btnCarregarMais = document.getElementById("carregar-mais-btn");

  const apiKey = "AIzaSyBM93phAxuAbZk8LFqM8aAnCJeiwit2yXI";
  const blogId = "6542152951377954792";
  let nextPageToken = "";
  let todasVagas = [];

  function carregarVagas() {
    const baseUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=10&key=${apiKey}`;
    const url = nextPageToken ? `${baseUrl}&pageToken=${nextPageToken}` : baseUrl;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const novasVagas = data.items || [];
        todasVagas = [...todasVagas, ...novasVagas];
        renderizarVagas(todasVagas);
        nextPageToken = data.nextPageToken || "";
        btnCarregarMais.style.display = nextPageToken ? "block" : "none";
      })
      .catch(error => {
        console.error("Erro ao buscar postagens:", error);
        container.innerHTML = "<p>Erro ao carregar postagens.</p>";
      });
  }

  function renderizarVagas(lista) {
    container.innerHTML = "";

    if (lista.length === 0) {
      container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
      return;
    }

    lista.forEach(post => {
      const title = post.title;
      const published = new Date(post.published).toLocaleDateString("pt-BR");

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = post.content;
      const imagem = tempDiv.querySelector("img")?.src || "";

      const card = document.createElement("div");
      card.className = "vaga-card";

      card.innerHTML = `
        <div class="vaga-info">
          <div class="vaga-texto">
            <h3>${title}</h3>
            <p><strong>Publicado em:</strong> ${published}</p>
            <button class="ver-mais" data-id="${post.id}">Ver mais</button>
          </div>
          ${imagem ? `<img src="${imagem}" class="vaga-imagem" alt="Imagem da vaga">` : ""}
        </div>
      `;

      container.appendChild(card);
    });

    document.querySelectorAll('.ver-mais').forEach(botao => {
      botao.addEventListener('click', () => {
        const id = botao.getAttribute('data-id');
        const vaga = todasVagas.find(v => v.id === id);
        abrirModal(vaga);
      });
    });
  }

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase();
    const filtradas = todasVagas.filter(post =>
      post.title.toLowerCase().includes(termo)
    );
    renderizarVagas(filtradas);
    btnCarregarMais.style.display = termo ? "none" : (nextPageToken ? "block" : "none");
  });

  btnCarregarMais.addEventListener("click", () => {
    carregarVagas();
  });

  carregarVagas();

  // Modal
  function abrirModal(post) {
    const modal = document.getElementById("vaga-modal");
    const titulo = document.getElementById("modal-titulo");
    const data = document.getElementById("modal-data");
    const conteudo = document.getElementById("modal-conteudo");

    titulo.textContent = post.title;
    data.textContent = new Date(post.published).toLocaleDateString("pt-BR");
    conteudo.innerHTML = post.content;

    modal.style.display = "block";
  }

  document.querySelector(".fechar").addEventListener("click", () => {
    document.getElementById("vaga-modal").style.display = "none";
  });

  window.addEventListener("click", (e) => {
    const modal = document.getElementById("vaga-modal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
