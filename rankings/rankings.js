function redirectRodm() {
  window.location.href = '/femecub-rankings/rodm/index.html'
}

$(document).ready(async function () {
  document.querySelector('#rodm').addEventListener('click', () => {
    redirectRodm();
  });
  let tableInstance;
  let selectedCategory = '3X3';
  let typeIsAverage = false;
  let realCategory = 'TODAS';
  let selectedDataCategory = {};

  const realCategoryFilter = (row) => {
    if (realCategory === 'TODAS') {
      return true;
    }
    return row[9] === realCategory;
  }

  const ocultaColumnas = (ocultar = false, columnasAOcultar = [0, 1, 4, 5, 6, 8]) => {
    [0,1,2,3,4,5,6,7,8].forEach(col => {
      tableInstance.column(col).visible(true);
    });
    columnasAOcultar.forEach(col => {
      tableInstance.column(col).visible(!ocultar);
    });
  }
  const allDataResponse = await fetch('https://script.google.com/macros/s/AKfycbxlLWeDubNS-7g0WhNdlzy9qBRiRDs_J_waPExcIIE5GGnhLcjrd-HxR9DzRkSrAnF85w/exec?apiKey=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&pageSize=2000');
  const allData = await allDataResponse.json();
  const allCategories = allData.data.filter(row => row[9] !== '').reduce((row, item) => {
    row.add(item[9]);
    return row;
  }, new Set(['TODAS']));

  //allCategories.add('TODAS');
  console.log(allData, allCategories);
  let allMapped = [];
  const categories = [
    {
      category: '3X3',
      queryText: ['3x3', '3X3'],
      icon: 'event-333',
      data: [],
      bestAverageData: [],
      onlyHasAverage: true
    },
    {
      category: '2X2',
      queryText: ['2x2', '2X2'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: '4X4',
      queryText: ['4x4', '4X4', '4X4 LIBRE'],
      icon: 'event-444',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Pyraminx',
      queryText: ['pyraminx', 'Pyraminx', 'PYRAMINX'],
      icon: 'event-444',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Rainbow',
      queryText: ['rainbow', 'Rainbow', 'RAINBOW'],
      icon: 'event-444',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Snake Perro',
      queryText: ['snake perro', 'SNAKE PERRO'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Snake Gato',
      queryText: ['snake gato', 'SNAKE GATO'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Snake Cruz',
      queryText: ['snake cruz', 'SNAKE CRUZ'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Snake Ave',
      queryText: ['snake ave', 'SNAKE AVE'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Snake Elefante',
      queryText: ['snake elefante', 'SNAKE ELEFANTE'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Snake Nota Musical',
      queryText: ['snake nota musical', 'SNAKE NOTA MUSICAL'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    },
    {
      category: 'Batalla de Fichas',
      queryText: ['batalla de fichas', 'BATALLA DE FICHAS'],
      icon: 'event-222',
      data: [],
      bestAverageData: [],
    }
  ];

  const filterWithAverage = row => {
    return row[5] >= 0
  }
  const buttonOne = document.querySelector('#bestTime');
  const buttonTwo = document.querySelector('#bestAverage');
  buttonOne.addEventListener('click', (e) => {
    e.target.classList.add('type-selected')
    buttonTwo.classList.remove('type-selected');
    typeIsAverage = false;
    tableInstance.search('').columns().search('').page(0).draw();
    ocultaColumnas(true, [2, 6, 7]);
    const timeData = categories.find(category => category.category === selectedCategory).data;
    tableInstance.clear().rows.add(timeData.filter(realCategoryFilter)).draw();
    tableInstance.order([5, 'asc']).draw();
  });
  
  buttonTwo.addEventListener('click', (e) => {
    typeIsAverage = true;
    e.target.classList.add('type-selected');
    buttonOne.classList.remove('type-selected');
    tableInstance.search('').columns().search('').page(0).draw();
    ocultaColumnas(true, [2, 5, 7]);
    const averageData = categories.find(category => category.category === selectedCategory).bestAverageData;
    tableInstance.clear().rows.add(averageData.filter(realCategoryFilter)).draw();
    tableInstance.order([6, 'asc']).draw();
  });

  allCategories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('categoria-filter-btn');
    button.setAttribute('data-category', category);
    button.classList.add('real-category-btn');
    if (category === 'TODAS') {
      button.classList.add('selected-button');
    }
    const containerOfButtons = document.querySelector('#category-buttons');
    containerOfButtons.appendChild(button);
    button.addEventListener('click', (e) => {
      console.log(category);
      realCategory = category;
      const allButtons = document.querySelectorAll('.categoria-filter-btn');
      tableInstance.search('').columns().search('').page(0).draw();
      allButtons.forEach(btn => {
        if (btn !== e.target) {
          btn.classList.remove('selected-button');
        }
      });
      e.target.classList.add('selected-button')
      const filterData = typeIsAverage ? selectedDataCategory.bestAverageData : selectedDataCategory.data;
      tableInstance.clear().rows.add(filterData.filter(realCategoryFilter)).draw();
      ocultaColumnas(true, typeIsAverage ? [2, 5, 7] : [2, 6, 7]);
      tableInstance.order([typeIsAverage ? 6 : 5, 'asc']).draw();
    });
  });

  categories.forEach((category, index) => {
    const button = document.createElement('button');
    button.textContent = category.category;
    if (index === 0) {
      button.classList.add('selected-button');
    }
    button.classList.add('categoria-btn');
    button.setAttribute('data-category', category.category);
    button.addEventListener('click', (e) => {
      selectedDataCategory = category;
      selectedCategory = category.category;
      const allButtons = document.querySelectorAll('.categoria-btn');
      tableInstance.search('').columns().search('').page(0).draw();
      allButtons.forEach(btn => {
        if (btn !== e.target) {
          btn.classList.remove('selected-button');
        }
      });
      e.target.classList.add('selected-button')
      const filteredData = typeIsAverage ? category.bestAverageData : category.data;
      tableInstance.clear().rows.add(filteredData.filter(realCategoryFilter)).draw();
      ocultaColumnas(true, typeIsAverage ? [2, 5, 7] : [2, 6, 7]);
      tableInstance.order([typeIsAverage ? 6 : 5, 'asc']).draw();
    });
    $('.categorias-grid').append(button);
  });

  allMapped = categories.reduce((acc, category) => {
    const seenIds = new Set(); // Almacena IDs únicos

    const seenAverage = new Set();

    category.data = allData.data.sort((row, compare) => row[4] - compare[4]).filter((row) => {
      // 1. Validación inicial de fila
        const isValid = category.withPoints
          ? row[6] > 0
          : new RegExp(category.queryText.join('|'), 'i').test(row[1]) &&
            (!category.onlyHasAverage || filterWithAverage(row));
        
        // 2. Verificación de unicidad usando Set
        const isUnique = !seenIds.has(row[2]);
        if (category.withPoints) {
          return isValid;
        }
        if (isValid && isUnique) {
          seenIds.add(row[2]);
          return true;
        }
        return false;
    });
    category.bestAverageData = allData.data.sort((row, compare) => row[5] - compare[5]).filter((row) => {
      // 1. Validación inicial de fila
        const isValid = row[5] > 0 && new RegExp(category.queryText.join('|'), 'i').test(row[1]);
        // 2. Verificación de unicidad usando Set
        const isUnique = !seenAverage.has(row[2]);
        if (category.withPoints) {
          return isValid;
        }
        if (isValid && isUnique) {
          seenAverage.add(row[2]);
          return true;
        }
        return false;
    });
    acc.push(category);
    return acc;
  }, []);


  //const filteredData = allData.data.filter(row => ['3x3', '3X3'].includes(row[1]));
  selectedDataCategory = allMapped[0];
  tableInstance = $('#tablaRankings').DataTable({
    data: allMapped[0].data,
    columns: [
      {
        title: '#', // Título de la columna
        render: function (data, type, row, meta) {
          return meta.settings._iDisplayStart + meta.row + 1;
        },
        orderable: false, // Desactiva la capacidad de ordenar esta columna
        searchable: false // Desactiva la búsqueda en esta columna
        , data: null,
      },
      { data: 0, title: 'Torneo', orderable: false },
      { data: 1, title: 'Cubo', orderable: false },
      { data: 2, title: 'Persona', orderable: false },
      { data: 3, title: 'Ronda', orderable: false },
      {
        data: 4, // Valor original
        title: 'Mejor Tiempo',
        orderable: false, // Desactiva la capacidad de ordenar esta columna
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
        orderable: false, // Desactiva la capacidad de ordenar esta columna
        render: function (data, type, row) {
          if (type === 'display') {
            if (data === 60000) {
              return 'DNF'; // Mostrar "DNF" si el valor es 60000
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
      { data: 6, title: 'Puntos RODM', orderable: false },
      { data: 7, title: 'Fechas', orderable: false },
      { data: 9, title: 'Categoria', orderable: false },
      { data: 8, title: 'Estado', orderable: false }
    ],
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    oLanguage: {
      sSearch: 'Buscar persona, evento:'
    },
    pagingType: 'simple_numbers',
    pageLength: 50,
    lengthMenu: [50, 100, 150],
    columnDefs: [{
      target: 2,
      visible: false
    },
    {
      target: 6,
      visible: false
    },{
      target: 7,
      visible: false
    }],
    responsive: true,
  });


  
  $('#tablaRankings').on('init.dt', function() {
    const mainSpinner = document.querySelector('#main-spinner');
    mainSpinner.classList.add('hide');
    const searchFilter = document.querySelector('[type="search"]');
    console.log(searchFilter);
    searchFilter.addEventListener('keyup', function () {
      console.log(tableInstance)
      /*tableInstance.columns(0).nodes().each(function (cell, i) {
        console.log('hace', cell);
        cell.forEach((node, index) => {
          console.log('hace', node);
          node.textContent = index + 1;
        })
      });*/
    });
  });

  tableInstance.on('order.dt', function () {
    tableInstance.columns(0).nodes().each(function (cell, i) {
      cell.forEach((node, index) => {
        node.textContent = index + 1;
      })
    });
  });
});
