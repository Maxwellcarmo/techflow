document.addEventListener('DOMContentLoaded', () => {
    // === IMPORTANTE ===
    // SUBSTITUA ESTA URL PELA URL REAL DA SUA PLANILHA DE SETORES PUBLICADA COMO CSV NO GOOGLE SHEETS
    // Exemplo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR.../pub?gid=0&single=true&output=csv'
    const GOOGLE_SHEET_SECTORS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVfK7EhDgf6oifgGZ0atK29GTBFj_gliRfQwKwzdu2yEvZwkb-sTB_cE3uNkbE6UtYqcFNeXkmDuXb/pub?gid=1048089236&single=true&output=csv'; // <--- ATUALIZE ESTA URL

    const sectorCardsContainer = document.getElementById('sectorCardsContainer');
    const areaFilter = document.getElementById('areaFilter');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let sectorsData = [];
    let filterApplied = false; // Flag para controlar se algum filtro foi aplicado

    async function loadSectorsData() {
        try {
            const response = await fetch(GOOGLE_SHEET_SECTORS_CSV_URL);
            const csvData = await response.text();

            const lines = csvData.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

            const dataLines = lines.slice(1);

            sectorsData = dataLines.map(line => {
                const values = [];
                let inQuote = false;
                let currentValue = '';
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"' && (i === 0 || line[i-1] === ',' || inQuote)) {
                        inQuote = !inQuote;
                        if (char === '"' && line[i+1] === '"') { // Handle escaped double quotes ""
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
                values.push(currentValue.trim()); // Push the last value

                const row = {};
                headers.forEach((header, index) => {
                    let value = values[index] !== undefined ? values[index] : '';
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    row[header] = value;
                });
                return row;
            }).filter(row => row.Nome_Setor && row.Nome_Setor.trim() !== ''); // Filtra linhas vazias

            populateAreaFilter(sectorsData);
            
            // Exibe a mensagem inicial para o usuário selecionar uma área
            noResultsMessage.textContent = 'Por favor, selecione uma área para visualizar os setores.';
            noResultsMessage.style.display = 'block';

        } catch (error) {
            console.error('Erro ao carregar os dados dos setores:', error);
            sectorCardsContainer.innerHTML = '';
            noResultsMessage.textContent = 'Erro ao carregar os dados dos setores. Verifique a URL da planilha e sua conexão.';
            noResultsMessage.style.display = 'block';
        }
    }

    function populateAreaFilter(data) {
        const uniqueAreas = new Set();
        data.forEach(sector => {
            if (sector.Area_Atendimento) {
                sector.Area_Atendimento.split(',').map(a => a.trim()).forEach(a => {
                    if (a) uniqueAreas.add(a);
                });
            }
        });

        const sortedAreas = Array.from(uniqueAreas).sort();

        areaFilter.innerHTML = '<option value="" selected disabled>Selecione uma Área</option>';
        //areaFilter.innerHTML += '<option value="">Todas as Áreas</option>'; // Opção para ver todos os setores

        sortedAreas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            areaFilter.appendChild(option);
        });
    }

    function renderSectorCards() {
        sectorCardsContainer.innerHTML = '';
        noResultsMessage.style.display = 'none';

        const selectedArea = areaFilter.value;

        // Estado inicial sem seleção
        if (selectedArea === '' && !filterApplied) {
            noResultsMessage.textContent = 'Por favor, selecione uma área para visualizar os setores.';
            noResultsMessage.style.display = 'block';
            return;
        }

        filterApplied = true; // Marca que um filtro foi acionado

        const filteredSectors = sectorsData.filter(sector => {
            // Filtro por Área de Atendimento
            return (selectedArea === '' || selectedArea === 'Todas as Áreas' || !sector.Area_Atendimento) ? true : sector.Area_Atendimento.split(',').map(a => a.trim()).includes(selectedArea);
        });

        if (filteredSectors.length === 0) {
            noResultsMessage.textContent = 'Nenhum setor encontrado com os filtros aplicados.';
            noResultsMessage.style.display = 'block';
            return;
        }

        filteredSectors.forEach(sector => {
            const sectorCard = document.createElement('div');
            sectorCard.classList.add('sector-card');

            // Usa Foto_URL do setor ou logo da universidade como fallback
            const photoUrl = sector.Foto_URL && sector.Foto_URL.trim() !== '' ? sector.Foto_URL : '../images/logo.jpg'; 
            
            const whatsappNumber = sector.WhatsApp ? sector.WhatsApp.replace(/\D/g, '') : '';
            const whatsappLink = whatsappNumber ? `https://wa.me/55${whatsappNumber}` : '#';

            let attendanceHtml = '';
            const weekdays = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
            weekdays.forEach(day => {
                if (sector[day] && sector[day].trim() !== '') {
                    attendanceHtml += `<p><i class="fas fa-calendar-alt"></i> ${day}: ${sector[day]}</p>`;
                }
            });
            if (attendanceHtml === '') {
                 attendanceHtml = '<p><i class="fas fa-calendar-alt"></i> Atendimento: Horário não informado</p>';
            }

            sectorCard.innerHTML = `
                <img src="${photoUrl}" alt="Logo de ${sector.Nome_Setor}" class="sector-logo">
                <div class="sector-info">
                    <h3>${sector.Nome_Setor}</h3>
                    ${sector.Area_Atendimento ? `<p><i class="fas fa-tag"></i> Área: ${sector.Area_Atendimento}</p>` : ''}
                    ${sector.Localizacao ? `<p><i class="fas fa-map-marker-alt"></i> Local: ${sector.Localizacao}</p>` : ''}
                    ${sector.Servicos ? `<p class="sector-services"><i class="fas fa-info-circle"></i> Serviços: ${sector.Servicos}</p>` : ''}
                    
                    <h4>Horários de Atendimento:</h4>
                    <div class="contact-details">
                        ${attendanceHtml}
                    </div>
                    
                    <h4>Contatos:</h4>
                    <div class="contact-details">
                        ${sector.Telefone ? `<p><i class="fas fa-phone"></i> Telefone: <a href="tel:${sector.Telefone}">${sector.Telefone}</a></p>` : ''}
                        ${sector.WhatsApp ? `<p><i class="fab fa-whatsapp"></i> WhatsApp: <a href="${whatsappLink}" target="_blank">${sector.WhatsApp}</a></p>` : ''}
                        ${sector.Email ? `<p><i class="fas fa-envelope"></i> Email: <a href="mailto:${sector.Email}">${sector.Email}</a></p>` : ''}
                        ${sector.Responsavel ? `<p><i class="fas fa-user"></i> Responsável: ${sector.Responsavel}</p>` : ''}
                    </div>
                </div>
            `;
            sectorCardsContainer.appendChild(sectorCard);
        });
    }

    loadSectorsData();

    // Adiciona "ouvinte" de evento para o campo de filtro
    areaFilter.addEventListener('change', renderSectorCards);
});