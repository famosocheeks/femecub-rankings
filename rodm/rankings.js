function redirectRankings() {
  window.location.href = '/femecub-rankings/rankings/index.html'
}

$(document).ready(async function () {
  document.querySelector('#rodm').addEventListener('click', () => {
    redirectRankings();
  });
  let tableInstance;
  const allDataResponse = await fetch('https://script.google.com/macros/s/AKfycbz3VRt7QdyxcA2_d8TAPyrS3yVpYK8mGD2vLTH26AnQXNDDCMwKdZgoPXMep46s5Udh/exec?apiKey=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&pageSize=5000');
  const allData = await allDataResponse.json();

  let processedData = {};
  allData.data.filter((row) => row[6] > 0).forEach(function (row) {
    let name = row[2];
    let value = parseFloat(row[6]) || 0;

    if (!processedData[name]) {
      processedData[name] = {
        name: name,
        totalPoints: 0,
        events: []
      };
    }

    processedData[name].totalPoints += value;
    processedData[name].events.push({
      serie: row[0],
      category: row[1],
      stage: row[3],
      points: value,
      date: row[7],
      categoryRow: row[9]
    });
  });

  const finalData = Object.values(processedData);
  tableInstance = $('#tablaRankings').DataTable({
    data: finalData,
    columns: [
      {
        className: 'details-control',
        orderable: false,
        data: null,
        defaultContent: ''
      },
      { data: 'name', title: "Nombre" },
      {
        data: 'totalPoints',
        title: "Puntos Totales",
        render: function (data, type, row) {
          if (type === 'display' || type === 'filter') {
            return parseFloat(data).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
          return data;
        }
      },
      {
        data: 'events',
        title: "Número de modalidades",
        render: function (data) {
          return data.length;
        }
      }
    ],
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
    },
    pagingType: 'simple_numbers',
    pageLength: 50,
    lengthMenu: [50, 100, 150],
    responsive: true,
    order: [[2, 'desc']]
  });


  function formatEvents(d) {
    let html = '<table cellpadding="5" cellspacing="0" border="0" style="width:100%;">';
    html += '<tr><th>Serie</th><th>Modalidad</th><th>Etapa</th><th>Puntos</th><th>Fecha</th><th>Categoría</th></tr>';

    d.events.forEach(function (event) {
      html += '<tr>' +
        '<td>' + event.serie + '</td>' +
        '<td>' + event.category + '</td>' +
        '<td>' + event.stage + '</td>' +
        '<td>' + event.points.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td>' +
        '<td>' + event.date + '</td>' +
        '<td>' + event.categoryRow + '</td>' +
        '</tr>';
    });

    html += '</table>';
    return html;
  }

  // Evento para mostrar/ocultar detalles
  $('#tablaRankings tbody').on('click', 'td.details-control', function () {
    let tr = $(this).closest('tr');
    let row = tableInstance.row(tr);

    if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass('shown');
    }
    else {
      row.child(formatEvents(row.data())).show();
      tr.addClass('shown');
    }
  });



  $('#tablaRankings').on('init.dt', function () {
    const mainSpinner = document.querySelector('#main-spinner');
    mainSpinner.classList.add('hide');

  });

  tableInstance.on('order.dt', function () {

  });
});
