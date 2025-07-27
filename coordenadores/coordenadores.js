document.addEventListener('DOMContentLoaded', () => {
    const GOOGLE_SHEET_COORDINATORS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVfK7EhDgf6oifgGZ0atK29GTBFj_gliRfQwKwzdu2yEvZwkb-sTB_cE3uNkbE6UtYqcFNeXkmDuXb/pub?gid=1420425972&single=true&output=csv';

    const coordinatorsContainer = document.getElementById('coordinatorsContainer');
    const courseFilter = document.getElementById('courseFilter');
    const noCoordinatorsMessage = document.getElementById('noCoordinatorsMessage');

    let coordinatorsData = [];
    let filterApplied = false; // Nova variável para controlar se o filtro já foi usado

    async function loadCoordinatorsData() {
        try {
            const response = await fetch(GOOGLE_SHEET_COORDINATORS_CSV_URL);
            const csvData = await response.text();

            const lines = csvData.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

            const dataLines = lines.slice(1);

            coordinatorsData = dataLines.map(line => {
                const values = [];
                let inQuote = false;
                let currentValue = '';
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"' && (i === 0 || line[i-1] === ',' || inQuote)) {
                        inQuote = !inQuote;
                        if (char === '"' && line[i+1] === '"') {
                            currentValue += '"';
                            i++;
                        }
                    } else if (char === ',' && !inQuote) {
                        values.push(currentValue.trim());
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                values.push(currentValue.trim());

                const row = {};
                headers.forEach((header, index) => {
                    let value = values[index] !== undefined ? values[index] : '';
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    row[header] = value;
                });
                return row;
            }).filter(row => row.Nome && row.Nome.trim() !== '');

            populateCourseFilter(coordinatorsData);
            // REMOVA OU COMENTE A LINHA ABAIXO, NÃO VAMOS RENDERIZAR NADA AQUI INICIALMENTE
            // renderCoordinatorsCards(); // <-- ESTA LINHA SERÁ REMOVIDA
            
            // Exibe a mensagem inicial para o usuário selecionar um curso
            noCoordinatorsMessage.textContent = 'Por favor, selecione um curso para visualizar o(a) coordenador(a).';
            noCoordinatorsMessage.style.display = 'block';

        } catch (error) {
            console.error('Erro ao carregar os dados dos coordenadores:', error);
            coordinatorsContainer.innerHTML = ''; // Garante que o container esteja vazio
            noCoordinatorsMessage.textContent = 'Erro ao carregar os dados dos coordenadores. Tente novamente mais tarde.';
            noCoordinatorsMessage.style.display = 'block';
        }
    }

    function populateCourseFilter(data) {
        const uniqueCourses = new Set();
        data.forEach(coordinator => {
            if (coordinator.Curso) {
                coordinator.Curso.split(',').map(c => c.trim()).forEach(c => {
                    if (c) uniqueCourses.add(c);
                });
            }
        });

        const sortedCourses = Array.from(uniqueCourses).sort();

        // Altera a opção padrão para "Selecione um Curso" e a define como selecionada e desabilitada
        courseFilter.innerHTML = '<option value="" selected disabled>Selecione um Curso</option>';
        
        // Adiciona a opção "Todos os Cursos" após a opção desabilitada, se desejar.
        // Se você NÃO quiser a opção "Todos os Cursos", remova a linha abaixo.
        //courseFilter.innerHTML += '<option value="">Todos os Cursos</option>';


        sortedCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseFilter.appendChild(option);
        });
    }

    function renderCoordinatorsCards() {
        coordinatorsContainer.innerHTML = '';
        noCoordinatorsMessage.style.display = 'none'; // Esconde a mensagem enquanto tenta renderizar

        const selectedCourse = courseFilter.value;

        // Se a opção padrão "Selecione um Curso" estiver ativa, e não for uma filtragem já aplicada
        if (selectedCourse === '' && !filterApplied) {
            noCoordinatorsMessage.textContent = 'Por favor, selecione um curso para visualizar os coordenadores.';
            noCoordinatorsMessage.style.display = 'block';
            return;
        }

        // Marca que o filtro foi aplicado (mesmo que seja "Todos os Cursos")
        filterApplied = true; 

        const filteredCoordinators = coordinatorsData.filter(coordinator => {
            /*if (selectedCourse === '') {
                return true; // Se "Todos os Cursos" selecionado, mostra todos
            }*/
            if (coordinator.Curso) {
                const coordinatorCourses = coordinator.Curso.split(',').map(c => c.trim());
                return coordinatorCourses.includes(selectedCourse);
            }
            return false;
        });

        if (filteredCoordinators.length === 0) {
            noCoordinatorsMessage.textContent = 'Nenhum coordenador encontrado para o curso selecionado.';
            noCoordinatorsMessage.style.display = 'block';
            return;
        }

        filteredCoordinators.forEach(coordinator => {
            const coordinatorCard = document.createElement('div');
            coordinatorCard.classList.add('coordinator-card');

            const photoUrl = coordinator.Foto_URL && coordinator.Foto_URL.trim() !== '' ? coordinator.Foto_URL : 'https://via.placeholder.com/100/CCCCCC/FFFFFF?text=Foto';
            const whatsappNumber = coordinator.WhatsApp ? coordinator.WhatsApp.replace(/\D/g, '') : '';
            const whatsappLink = whatsappNumber ? `https://wa.me/55${whatsappNumber}` : '#'; // Adicionado 55 para link BR

            let attendanceHtml = '';
            const weekdays = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
            weekdays.forEach(day => {
                if (coordinator[day] && coordinator[day].trim() !== '') {
                    attendanceHtml += `<p><i class="fas fa-calendar-alt"></i> ${day}: ${coordinator[day]}</p>`;
                }
            });
            if (attendanceHtml === '') {
                 attendanceHtml = '<p><i class="fas fa-calendar-alt"></i> Atendimento: Horário não informado</p>';
            }

            coordinatorCard.innerHTML = `
                <img src="${photoUrl}" alt="Foto de ${coordinator.Nome}" class="coordinator-photo">
                <div class="coordinator-info">
                    <h3>${coordinator.Nome}</h3>
                    <p class="coordinator-role">Coordenador(a) de: ${coordinator.Curso || 'N/A'}</p>
                    <div class="contact-details">
                        ${attendanceHtml}
                        ${coordinator.WhatsApp ? `<p><i class="fab fa-whatsapp"></i> WhatsApp: <a href="${whatsappLink}" target="_blank">${coordinator.WhatsApp}</a></p>` : ''}
                        ${coordinator.Email ? `<p><i class="fas fa-envelope"></i> Email: <a href="mailto:${coordinator.Email}">${coordinator.Email}</a></p>` : ''}
                    </div>
                </div>
            `;
            coordinatorsContainer.appendChild(coordinatorCard);
        });
    }

    // Carrega os dados dos coordenadores quando a página é carregada
    loadCoordinatorsData();

    // Adiciona o "ouvinte" de evento para o seletor de curso
    courseFilter.addEventListener('change', renderCoordinatorsCards);
});