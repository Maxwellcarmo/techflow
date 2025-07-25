function obterSemestreAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const semestre = hoje.getMonth() < 6 ? 1 : 2;
  return { ano, semestre };
}

const eventos = {
  2: [
    { diaInicio: 1, diaFim: 1, titulo: "Início do Período Letivo", tipo: "aula" },
    { diaInicio: 3, diaFim: 5, titulo: "Carnaval", tipo: "feriado" },
    { diaInicio: 7, diaFim: 7, titulo: "Avaliação Oficial - 1º Bimestre", tipo: "prova" },
    { diaInicio: 10, diaFim: 10, titulo: "Início das Aulas", tipo: "aula" },
    { diaInicio: 18, diaFim: 18, titulo: "Paixão de Cristo", tipo: "feriado" }
  ],
  3: [
    { diaInicio: 3, diaFim: 7, titulo: "Semana Acadêmica", tipo: "evento" },
    { diaInicio: 17, diaFim: 17, titulo: "Data Limite de Notas - 1º Bimestre", tipo: "aula" }
  ],
  4: [
    { diaInicio: 21, diaFim: 21, titulo: "Feriado - Tiradentes", tipo: "feriado" }
  ],
  5: [
    { diaInicio: 1, diaFim: 1, titulo: "Feriado - Dia do Trabalho", tipo: "feriado" },
    { diaInicio: 2, diaFim: 6, titulo: "Avaliação Oficial - 2º Bimestre", tipo: "prova" },
    { diaInicio: 13, diaFim: 13, titulo: "Data Limite de Notas - 2º Bimestre", tipo: "aula" },
    { diaInicio: 19, diaFim: 19, titulo: "Corpus Christi", tipo: "feriado" },
    { diaInicio: 21, diaFim: 21, titulo: "Término das Aulas", tipo: "aula" }
  ],
  6: [
    { diaInicio: 23, diaFim: 25, titulo: "Exame Final", tipo: "exame" },
    { diaInicio: 26, diaFim: 26, titulo: "Lançamento de Notas do Exame Final", tipo: "exame" },
    { diaInicio: 30, diaFim: 30, titulo: "Encerramento do Período Letivo", tipo: "aula" }
  ]
};

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function gerarCalendario(mes, ano) {
  const container = document.getElementById("calendario-container");
  container.innerHTML = "";

  const titulo = document.createElement("h3");
  titulo.innerHTML = `${ano}/${mes < 7 ? 1 : 2} - ${nomesMeses[mes - 1]}`;
  titulo.classList.add("section-title");
  container.appendChild(titulo);

  const grid = document.createElement("div");
  grid.className = "calendario-grid";

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  diasSemana.forEach(dia => {
    const div = document.createElement("div");
    div.className = "dia-cabecalho";
    div.textContent = dia;
    grid.appendChild(div);
  });

  const primeiroDia = new Date(ano, mes - 1, 1).getDay();
  const diasNoMes = new Date(ano, mes, 0).getDate();

  const eventosMes = eventos[mes] || [];
  const mapaEventos = {};
  eventosMes.forEach(ev => {
    for (let d = ev.diaInicio; d <= ev.diaFim; d++) {
      mapaEventos[d] = mapaEventos[d] || [];
      mapaEventos[d].push(ev);
    }
  });

  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.className = "dia";
    grid.appendChild(vazio);
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const div = document.createElement("div");
    div.className = "dia";
    if (mapaEventos[dia]) {
      const tipos = mapaEventos[dia].map(e => e.tipo);
      if (tipos.length > 0) {
        div.classList.add(`evento-${tipos[0]}`);
      }
    }
    div.textContent = dia;
    grid.appendChild(div);
  }

  container.appendChild(grid);
}

function gerarListaEventos(mes) {
  const container = document.getElementById("lista-eventos-container");
  container.innerHTML = "";

  const eventosMes = eventos[mes];
  if (!eventosMes || eventosMes.length === 0) return;

  const bloco = document.createElement("div");
  bloco.className = "eventos-mes";

  const titulo = document.createElement("h3");
  titulo.textContent = `📌 Eventos de ${nomesMeses[mes - 1]}`;
  bloco.appendChild(titulo);

  const lista = document.createElement("ul");
  eventosMes.forEach(ev => {
    const fim = ev.diaFim !== ev.diaInicio ? ` a ${ev.diaFim}` : "";
    const corIcone = ev.tipo === "feriado" ? "🔴" :
                     ev.tipo === "aula"    ? "🟢" :
                     ev.tipo === "prova"   ? "🟡" :
                     ev.tipo === "exame"   ? "🟠" :
                     "🔵";

    const item = document.createElement("li");
    item.innerHTML = `<span>${corIcone}</span> <strong>${ev.diaInicio}/${mes}${fim}:</strong> ${ev.titulo}`;
    lista.appendChild(item);
  });

  bloco.appendChild(lista);
  container.appendChild(bloco);
}

// Interação nos botões de mês
document.querySelectorAll(".mes-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mes-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const mesSelecionado = parseInt(btn.getAttribute("data-mes"));
    const { ano } = obterSemestreAtual();
    gerarCalendario(mesSelecionado, ano);
    gerarListaEventos(mesSelecionado);
  });
});

// Inicializa com o mês atual ou fevereiro
const { ano } = obterSemestreAtual();
const mesAtual = new Date().getMonth() + 1;
const mesPadrao = mesAtual < 2 || mesAtual > 6 ? 2 : mesAtual;
document.querySelector(`.mes-btn[data-mes='${mesPadrao}']`)?.click();
