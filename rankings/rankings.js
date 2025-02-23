$(document).ready(async function () {
  const allDataResponse = await fetch('https://script.google.com/macros/s/AKfycbx3wvninKWYDrQVNcnJqnLMREPOm2vO8nrHyYrhCzukxgrAdfYnfStkFJkS1vCmURHvAg/exec?apiKey=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&pageSize=2000');
  const allData = await allDataResponse.json();
  let allMapped = [];
  let tableInstance;
  const categories = [
    {
      category: '3X3',
      queryText: ['3x3', '3X3'],
      icon: 'event-333',
      data: []
    },
    {
      category: '2X2',
      queryText: ['2x2', '2X2'],
      icon: 'event-222',
      data: []
    },
    {
      category: 'SNAKE',
      queryText: ['snake', 'SNAKE'],
      icon: 'event-222',
      data: []
    }
  ];
 
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.category;
    button.classList.add('categoria-btn');
    button.setAttribute('data-category', category.category);
    button.addEventListener('click', (e) => {
      const allButtons = document.querySelectorAll('.categoria-btn');
      tableInstance.search('').columns().search('').page(0).draw();
      allButtons.forEach(btn => {
        if (btn !== e.target) {
          btn.classList.remove('selected-button');
        }
      });
      e.target.classList.add('selected-button')
      tableInstance.clear().rows.add(category.data).draw();
    });
    $('.categorias-grid').append(button);
  });

  allMapped = categories.reduce((acc, category) => {
    category.data = allData.data.filter(row => {
      const regex = new RegExp(category.queryText.join('|'), 'i');
      return regex.test(row[1].toUpperCase());
    });
    acc.push(category);
    return acc;
  }, []);


  //const filteredData = allData.data.filter(row => ['3x3', '3X3'].includes(row[1]));

  tableInstance = $('#tablaRankings').DataTable({
    data: allMapped[0].data,

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
    responsive: true,
    columnDefs: [
      {
        target: 7,
        visible: false,
        searchable: false,
      }
    ]
  });



});