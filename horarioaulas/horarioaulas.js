document.addEventListener('DOMContentLoaded', () => {
    // === IMPORTANTE ===
    // SUBSTITUA ESTA URL PELA URL REAL DA SUA PLANILHA PUBLICADA COMO CSV NO GOOGLE SHEETS
    // Exemplo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR.../pub?gid=0&single=true&output=csv'
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVfK7EhDgf6oifgGZ0atK29GTBFj_gliRfQwKwzdu2yEvZwkb-sTB_cE3uNkbE6UtYqcFNeXkmDuXb/pub?gid=1418292739&single=true&output=csv'; 

    const API_URL = 'https://flipper-46wf.onrender.com/api/horario';
    
    const classCardsContainer = document.getElementById('classCardsContainer');
    const searchInput = document.getElementById('searchInput');
    const courseFilter = document.getElementById('courseFilter');
    const periodFilter = document.getElementById('periodFilter');
    const dayFilter = document.getElementById('dayFilter');
    const turnoFilter = document.getElementById('turnoFilter');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let classScheduleData = []; // Esta variável agora será preenchida dinamicamente

    // Função para carregar e parsear o CSV da planilha do Google Sheets
    async function loadScheduleFromGoogleSheet() {
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) {
                throw new Error(`Erro ao carregar a planilha: ${response.status} - ${response.statusText}`);
            }
            const csvText = await response.text();
            classScheduleData = parseCSV(csvText); // Transforma o CSV em um array de objetos JavaScript
            applyFilters(); // Aplica os filtros e renderiza os cards após carregar os dados
        } catch (error) {
            console.error("Erro ao carregar dados da planilha do Google Sheets:", error);
            noResultsMessage.textContent = "Erro ao carregar os horários. Verifique a URL da planilha ou sua publicação.";
            noResultsMessage.style.display = 'block';
        }
    }

    async function loadScheduleFromAPI() {
        try {
            const response = await fetch('https://flipper-46wf.onrender.com/api/horarios');
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            classScheduleData = data;
            applyFilters(); // Já renderiza os dados usando filtros existentes
        } catch (error) {
            console.error("Erro ao carregar dados da API:", error);
            noResultsMessage.textContent = "Erro ao carregar os horários. Verifique a API.";
            noResultsMessage.style.display = 'block';
        }
    }


    // Função auxiliar para parsear (analisar) o texto CSV em um array de objetos
    function parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim() !== ''); // Divide por linha e remove vazias
        if (lines.length === 0) return []; // Retorna array vazio se não houver linhas

        // Pega os cabeçalhos da primeira linha e remove espaços em branco extras
        const headers = lines[0].split(',').map(header => header.trim());

        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim()); // Pega os valores e remove espaços extras
            const obj = {};
            
            // Mapeia os valores para um objeto, usando os cabeçalhos como chaves
            // É CRÍTICO que os cabeçalhos na sua planilha correspondam a esta lógica!
            headers.forEach((header, i) => {
                const value = values[i] || ''; // Garante que mesmo campos vazios sejam strings vazias
                switch(header.toLowerCase()) { // Usamos toLowerCase para flexibilidade
                    case 'cód.disciplina': obj.códDisciplina = value; break;
                    case 'disciplina': obj.disciplina = value; break;
                    case 'tipo': obj.tipo = value; break;
                    case 'turno': obj.turno = value; break;
                    case 'desc.dia': obj.diaSemana = value; break;
                    case 'horário início': obj.horario = value; break;
                    case 'docente': obj.professor = value; break;
                    case 'turmas em junção': obj.curso = value; break;
                    // Adicione outros casos se tiver colunas com nomes diferentes na sua planilha
                    default: obj[header.toLowerCase().replace(/ /g, '')] = value; // fallback genérico
                }
            });
            return obj;
        }).filter(obj => obj.disciplina); // Filtra para remover linhas que não tenham nome de disciplina

        // Adiciona um ID único para cada item, o que é útil para React ou depuração
        return data.map((item, index) => ({ ...item, id: index + 1 }));
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO E FILTRO (Permancem as mesmas, com pequenos ajustes) ---

    // Função para renderizar os cards na interface
    function renderClassCards(data) {
        classCardsContainer.innerHTML = ''; // Limpa qualquer card existente
        if (data.length === 0) {
            noResultsMessage.style.display = 'block'; // Exibe a mensagem de "nenhum resultado"
            return;
        }
        noResultsMessage.style.display = 'none'; // Oculta a mensagem de "nenhum resultado"

        data.forEach(aula => {
            const card = document.createElement('div');
            card.classList.add('class-card');
            card.innerHTML = `
                <h3>${aula.disciplina || 'Disciplina'} (${aula.códDisciplina || '---'})</h3>
                <p><i class="fas fa-chalkboard-teacher"></i> ${aula.professor || 'N/A'}</p>
                <p><i class="fas fa-door-open"></i> Sala ${aula.sala || 'N/A'} </p>
                <p><i class="fas fa-tags"></i> Tipo: ${aula.tipo || 'N/A'}</p>
                <p><i class="fas fa-calendar-alt"></i> ${aula.diaSemana || 'N/A'}</p>
                <p><i class="fas fa-clock"></i> ${aula.horario || 'N/A'}</p>
            `;
            classCardsContainer.appendChild(card);
        });
    }

    // Função para aplicar os filtros de busca e as opções de seleção
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCourse = courseFilter.value;
        const selectedPeriod = periodFilter.value;
        const selectedDay = dayFilter.value;
        const selectedTurno = turnoFilter.value;

        const filteredData = classScheduleData.filter(aula => {
            // Verifica se a disciplina, professor, sala, bloco ou dia da semana inclui o termo de busca
            const matchesSearch = 
                (aula.disciplina && aula.disciplina.toLowerCase().includes(searchTerm)) ||
                (aula.professor && aula.professor.toLowerCase().includes(searchTerm)) ||
                (aula.diaSemana && aula.diaSemana.toLowerCase().includes(searchTerm)) ||
                (aula.sala && aula.sala.toLowerCase().includes(searchTerm)) ||
                (aula.bloco && aula.bloco.toLowerCase().includes(searchTerm));

            // Verifica se o curso selecionado corresponde (ou se "Todos os Cursos" está selecionado)
            const matchesCourse = selectedCourse === "" || (aula.curso && aula.curso === selectedCourse);
            // Verifica se o período selecionado corresponde (ou se "Todos os Períodos" está selecionado)
            const matchesPeriod = selectedPeriod === "" || (aula.periodo && aula.periodo === selectedPeriod);
            // Verifica se o dia da semana selecionado corresponde (ou se "Todos os Dias" está selecionado)
            const matchesDay = selectedDay === "" || (aula.diaSemana && aula.diaSemana === selectedDay);

            const matchesTurno = selectedTurno === "" || (aula.turno && aula.turno === selectedTurno);

            const testeTurma = turmaContemCursoEPeriodo(aula.curso, selectedCourse, selectedPeriod);

            // Retorna true se todos os filtros forem satisfeitos
            return matchesSearch && testeTurma && matchesDay && matchesTurno;
        });

        const testePeriodo = calcularAnoSemestreIngresso(selectedPeriod);

        renderClassCards(filteredData);
    }

    function calcularAnoSemestreIngresso(periodoAtual) {
        const anoAtual = new Date().getFullYear();
        const semestreAtual = (new Date().getMonth() < 6) ? 1 : 2;

        // Calcula a diferença total em semestres
        const diferencaSemestres = periodoAtual - 1;

        // Calcula o semestre e ano de ingresso
        let semestreIngresso = semestreAtual - (diferencaSemestres % 2);
        let anosRetroceder = Math.floor(diferencaSemestres / 2);

        if (semestreIngresso <= 0) {
            semestreIngresso = 2;
            anosRetroceder += 1;
        }

        const anoIngresso = anoAtual - anosRetroceder;

        return `${anoIngresso}${semestreIngresso}`;
    }

    function turmaContemCursoEPeriodo(turmasString, cursoIdAlvo, periodoAlvo) {
        const turmas = turmasString.split('-').map(t => t.trim());

        for (let turma of turmas) {
            const match = turma.match(/^(\d{4,5})(\d{4})(\d)([A-Z])$/);
            if (!match) continue;

            const [_, idCurso, ano, semestre] = match;

            // Calcular o período com base no ano e semestre da turma
            const anoAtual = new Date().getFullYear();
            const semestreAtual = (new Date().getMonth() < 6) ? 1 : 2;

            const anosDiferenca = anoAtual - parseInt(ano);
            const diferencaSemestres = (anosDiferenca * 2) + (semestreAtual - parseInt(semestre));
            const periodoAtual = diferencaSemestres + 1;

            if (periodoAtual > 10) {
                return false;
            } else if ((idCurso === cursoIdAlvo || cursoIdAlvo == '') && (periodoAtual === parseInt(periodoAlvo) || periodoAlvo == '')) {
                return true;
            }
        }

        return false;
    }


    // Adiciona "ouvintes" de eventos para os campos de filtro e pesquisa
    searchInput.addEventListener('input', applyFilters); // Quando o usuário digita na busca
    courseFilter.addEventListener('change', applyFilters); // Quando o curso é alterado
    periodFilter.addEventListener('change', applyFilters); // Quando o período é alterado
    dayFilter.addEventListener('change', applyFilters); // Quando o dia é alterado
    turnoFilter.addEventListener('change', applyFilters); // Quando o turno é alterado

    // Inicia o carregamento dos dados da planilha assim que a página é carregada
    loadScheduleFromGoogleSheet();

    //Ajustando a busca para a API backEnd
    //loadScheduleFromAPI();

});