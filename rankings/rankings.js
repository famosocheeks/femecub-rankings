$(document).ready(function () {
  fetch('https://script.google.com/macros/s/AKfycbx3wvninKWYDrQVNcnJqnLMREPOm2vO8nrHyYrhCzukxgrAdfYnfStkFJkS1vCmURHvAg/exec?apiKey=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&pageSize=2000')
    .then(response => response.json())
    .then(rankings => {
      console.log(rankings.data);
      $('#tablaRankings').DataTable({
        data: rankings.data.filter(row => ['3x3', '3X3'].includes(row[1])).filter(row => row[5] > 0),

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
    });
});