$(document).ready(function () {
  const categories = [
    {
      category: '3X3',
      queryText: ['3x3', '3X3'],
      icon: 'event-333'
    },
    {
      category: '2X2',
      queryText: ['2x2', '2X2'],
      icon: 'event-222'
    },
    {
      category: '4X4',
      queryText: ['4x4', '4X4', '4X4 LIBRE'],
      icon: 'event-444'
    },
    {
      category: 'Pyraminx',
      queryText: ['pyraminx', 'Pyraminx', 'PYRAMINX'],
      icon: 'event-444'
    },
    {
      category: 'Rainbow',
      queryText: ['rainbow', 'Rainbow', 'RAINBOW'],
      icon: 'event-444'
    },
    {
      category: 'Snake Perro',
      queryText: ['snake perro', 'SNAKE PERRO'],
      icon: 'event-222'
    },
    {
      category: 'Snake Gato',
      queryText: ['snake gato', 'SNAKE GATO'],
      icon: 'event-222'
    },
    {
      category: 'Snake Cruz',
      queryText: ['snake cruz', 'SNAKE CRUZ'],
      icon: 'event-222'
    },
    {
      category: 'Snake Ave',
      queryText: ['snake ave', 'SNAKE AVE'],
      icon: 'event-222'
    },
    {
      category: 'Snake Elefante',
      queryText: ['snake elefante', 'SNAKE ELEFANTE'],
      icon: 'event-222'
    },
    {
      category: 'Snake Nota Musical',
      queryText: ['snake nota musical', 'SNAKE NOTA MUSICAL'],
      icon: 'event-222'
    },
    {
      category: 'Snake Pez',
      queryText: ['snake pez', 'SNAKE PEZ'],
      icon: 'event-222'
    },
    {
      category: 'Batalla de Fichas',
      queryText: ['batalla de fichas', 'BATALLA DE FICHAS'],
      icon: 'event-222'
    },
    {
      category: '3X3 Una Mano',
      queryText: ['3X3 UNA MANO', '3x3 una mano'],
      icon: 'event-333oh'
    },
    {
      category: 'Skewb',
      queryText: ['Skewb', 'skewb'],
      icon: 'event-skewb'
    }
  ];

  fetch('https://script.google.com/macros/s/AKfycbx3wvninKWYDrQVNcnJqnLMREPOm2vO8nrHyYrhCzukxgrAdfYnfStkFJkS1vCmURHvAg/exec?apiKey=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&pageSize=5000')
    .then(response => response.json())
    .then(rankings => {
      console.log(rankings.data);

      // Render Modalidad Buttons
      const container = document.querySelector('#categories-buttons');

      // "TODAS" Button
      const allButton = document.createElement('button');
      allButton.textContent = 'TODAS';
      allButton.classList.add('categoria-btn', 'selected-button');
      allButton.addEventListener('click', (e) => {
        updateActiveButton(e.target);
        table.column(2).search('').draw();
      });
      container.appendChild(allButton);

      // Category Buttons
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.category;
        btn.classList.add('categoria-btn');
        btn.setAttribute('data-category', cat.category);
        btn.addEventListener('click', (e) => {
          updateActiveButton(e.target);
          const regex = cat.queryText.join('|');
          table.column(2).search(regex, true, false).draw();
        });
        container.appendChild(btn);
      });

      function updateActiveButton(target) {
        document.querySelectorAll('.categoria-btn').forEach(btn => {
          btn.classList.remove('selected-button');
        });
        target.classList.add('selected-button');
      }

      const table = $('#tablaRankings').DataTable({
        data: rankings.data,
        columns: [
          {
            title: '#', // Título de la columna
            render: function (data, type, row, meta) {
              return meta.row + 1; // Calcula el número de fila dinámicamente
            },
            orderable: false, // Desactiva la capacidad de ordenar esta columna
            searchable: false // Desactiva la búsqueda en esta columna
          },
          { data: 0, title: 'Torneo' },
          { data: 1, title: 'Cubo' },
          { data: 2, title: 'Persona' },
          { data: 3, title: 'Ronda' },
          {
            data: 4, // Valor original
            title: 'Mejor Tiempo',
            render: function (data, type, row) {
              if (type === 'display') {
                if (data === 36000) {
                  return 'DNF'; // Mostrar "DNF" si el valor es "d"
                }

                const tiempo = data / 100; // Convertir milisegundos a segundos

                if (tiempo >= 60) {
                  // Si el tiempo es mayor o igual a 60 segundos, mostrar en formato mm:ss.00
                  const minutos = Math.floor(tiempo / 60);
                  const segundos = tiempo % 60;
                  return `${minutos}:${segundos.toFixed(2).padStart(5, '0')}`; // Formato "mm:ss.00"
                }

                // Si el tiempo es menor a 60 segundos, mostrar en formato ss.00
                return `${tiempo.toFixed(2)}`; // Formato "ss.00"
              }
              return data; // Para ordenación y búsquedas, usa el valor original
            }
          },
          {
            data: 5, title: 'Promedio',
            render: function (data, type, row) {
              if (type === 'display') {
                if (data === 36000) {
                  return 'DNF'; // Mostrar "DNF" si el valor es "d"
                }

                const tiempo = data / 100; // Convertir milisegundos a segundos

                if (tiempo >= 60) {
                  // Si el tiempo es mayor o igual a 60 segundos, mostrar en formato mm:ss.00
                  const minutos = Math.floor(tiempo / 60);
                  const segundos = tiempo % 60;
                  return `${minutos}:${segundos.toFixed(2).padStart(5, '0')}`; // Formato "mm:ss.00"
                }

                // Si el tiempo es menor a 60 segundos, mostrar en formato ss.00
                return `${tiempo.toFixed(2)}`; // Formato "ss.00"
              }
              return data; // Para ordenación y búsquedas, usa el valor original
            }
          },
          { data: 6, title: 'Puntos RODM' },
          { data: 7, title: 'Fechas' }
        ],
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        pagingType: 'simple_numbers',
        pageLength: 30,
        lengthMenu: [30, 50, 100],
        order: [[5, 'asc']],
        responsive: true
      });
      $('#main-spinner').addClass('hide');
    });
});
