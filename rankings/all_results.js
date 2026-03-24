$(document).ready(function () {
  const categories = [
    { category: '3X3', queryText: ['3x3', '3X3'], icon: 'event-333' },
    { category: '2X2', queryText: ['2x2', '2X2'], icon: 'event-222' },
    { category: '4X4', queryText: ['4x4', '4X4', '4X4 LIBRE'], icon: 'event-444' },
    { category: 'Pyraminx', queryText: ['pyraminx', 'Pyraminx', 'PYRAMINX'], icon: 'event-444' },
    { category: 'Rainbow', queryText: ['rainbow', 'Rainbow', 'RAINBOW'], icon: 'event-444' },
    { category: 'Snake Perro', queryText: ['snake perro', 'SNAKE PERRO'], icon: 'event-222' },
    { category: 'Snake Gato', queryText: ['snake gato', 'SNAKE GATO'], icon: 'event-222' },
    { category: 'Snake Cruz', queryText: ['snake cruz', 'SNAKE CRUZ'], icon: 'event-222' },
    { category: 'Snake Ave', queryText: ['snake ave', 'SNAKE AVE'], icon: 'event-222' },
    { category: 'Snake Elefante', queryText: ['snake elefante', 'SNAKE ELEFANTE'], icon: 'event-222' },
    { category: 'Snake Nota Musical', queryText: ['snake nota musical', 'SNAKE NOTA MUSICAL'], icon: 'event-222' },
    { category: 'Snake Pez', queryText: ['snake pez', 'SNAKE PEZ'], icon: 'event-222' },
    { category: 'Snake Metro', queryText: ['snake metro', 'SNAKE METRO'], icon: 'event-222' },
    { category: 'Snake Corazón', queryText: ['snake corazón', 'SNAKE CORAZÓN'], icon: 'event-222' },
    { category: 'Snake Cohete', queryText: ['snake cohete', 'SNAKE COHETE'], icon: 'event-222' },
    { category: 'Snake Esfera', queryText: ['snake esfera', 'SNAKE ESFERA'], icon: 'event-222' },
    { category: 'Snake León', queryText: ['snake león', 'SNAKE LEÓN'], icon: 'event-222' },
    { category: 'Batalla de Fichas', queryText: ['batalla de fichas', 'BATALLA DE FICHAS'], icon: 'event-222' },
    { category: '3X3 Una Mano', queryText: ['3X3 UNA MANO', '3x3 una mano'], icon: 'event-333oh' },
    { category: 'Skewb', queryText: ['Skewb', 'skewb'], icon: 'event-skewb' },
  ];

  // ── Snake helpers ────────────────────────────────────────
  const isSnakeCategory = (cat) => /^snake/i.test(cat.category);
  const snakeCategories = categories.filter(isSnakeCategory);
  // Regex that matches ALL snake figures at once
  const allSnakeRegex = snakeCategories.map(c => c.queryText.join('|')).join('|');

  let activeSnakeFigure = 'TODAS'; // 'TODAS' or a specific snake category name
  let table; // DataTable instance (set after init)

  // ── Helper: set active modality button ───────────────────
  function setActiveBtn(target, selector) {
    document.querySelectorAll(selector).forEach(b => b.classList.remove('selected-button'));
    target.classList.add('selected-button');
  }

  // ── Apply snake figure sub-filter to the DataTable ───────
  function applySnakeSubFilter() {
    if (activeSnakeFigure === 'TODAS') {
      // Show all snake figures
      table.column(2).search(allSnakeRegex, true, false).draw();
    } else {
      const cat = snakeCategories.find(c => c.category === activeSnakeFigure);
      if (cat) {
        const regex = cat.queryText.join('|');
        table.column(2).search(regex, true, false).draw();
      }
    }
  }

  // ── Build snake figure sub-filter buttons ────────────────
  function buildSnakeFilter() {
    const container = document.querySelector('#snake-buttons');
    container.innerHTML = '';
    activeSnakeFigure = 'TODAS';

    // "Todas las figuras" button
    const allBtn = document.createElement('button');
    allBtn.textContent = 'Todas las figuras';
    allBtn.classList.add('snake-btn', 'selected-button');
    allBtn.setAttribute('data-snake', 'TODAS');
    container.appendChild(allBtn);

    snakeCategories.forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat.category;
      btn.classList.add('snake-btn');
      btn.setAttribute('data-snake', cat.category);
      container.appendChild(btn);
    });

    container.querySelectorAll('.snake-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        setActiveBtn(e.target, '.snake-btn');
        activeSnakeFigure = e.target.getAttribute('data-snake');
        applySnakeSubFilter();
      });
    });
  }

  // ── Format time value (returns display string) ───────────
  function formatTime(data) {
    if (data === 36000 || data === 60000) return '<span class="text-slate-400 text-sm">DNF</span>';
    const t = data / 100;
    if (t >= 60) {
      const m = Math.floor(t / 60);
      const s = t % 60;
      return `<span class="time-value">${m}:${s.toFixed(2).padStart(5, '0')}</span>`;
    }
    return `<span class="time-value">${t.toFixed(2)}</span>`;
  }

  // ── Fetch & initialise ───────────────────────────────────
  fetch('https://script.google.com/macros/s/AKfycbx3wvninKWYDrQVNcnJqnLMREPOm2vO8nrHyYrhCzukxgrAdfYnfStkFJkS1vCmURHvAg/exec?apiKey=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&pageSize=5000')
    .then(response => response.json())
    .then(rankings => {
      const container = document.querySelector('#categories-buttons');

      // ── Modalidad: TODAS ──────────────────────────────────
      const allButton = document.createElement('button');
      allButton.textContent = 'TODAS';
      allButton.classList.add('categoria-btn', 'selected-button');
      allButton.addEventListener('click', (e) => {
        setActiveBtn(e.target, '.categoria-btn');
        document.querySelector('#snake-filter-container').classList.add('hidden');
        activeSnakeFigure = 'TODAS';
        table.column(2).search('').draw();
      });
      container.appendChild(allButton);

      // ── Modalidad: individual + Snake group ───────────────
      let snakeGroupAdded = false;
      categories.forEach(cat => {
        if (isSnakeCategory(cat)) {
          if (!snakeGroupAdded) {
            snakeGroupAdded = true;
            const snakeGroupBtn = document.createElement('button');
            snakeGroupBtn.textContent = 'Snake';
            snakeGroupBtn.classList.add('categoria-btn');
            snakeGroupBtn.setAttribute('data-category', 'snake-group');
            snakeGroupBtn.addEventListener('click', (e) => {
              setActiveBtn(e.target, '.categoria-btn');
              buildSnakeFilter();
              document.querySelector('#snake-filter-container').classList.remove('hidden');
              // Show all snake figures by default
              table.column(2).search(allSnakeRegex, true, false).draw();
            });
            container.appendChild(snakeGroupBtn);
          }
          return; // skip individual snake buttons
        }

        const btn = document.createElement('button');
        btn.textContent = cat.category;
        btn.classList.add('categoria-btn');
        btn.setAttribute('data-category', cat.category);
        btn.addEventListener('click', (e) => {
          setActiveBtn(e.target, '.categoria-btn');
          document.querySelector('#snake-filter-container').classList.add('hidden');
          activeSnakeFigure = 'TODAS';
          const regex = cat.queryText.join('|');
          table.column(2).search(regex, true, false).draw();
        });
        container.appendChild(btn);
      });

      // ── DataTable ─────────────────────────────────────────
      table = $('#tablaRankings').DataTable({
        data: rankings.data,
        columns: [
          {
            title: '#',
            render: function (data, type, row, meta) {
              const n = meta.row + 1;
              if (type === 'display') {
                return `<span class="rank-badge rank-badge-other">${n}</span>`;
              }
              return n;
            },
            orderable: false,
            searchable: false,
            data: null,
          },
          { data: 0, title: 'Torneo' },
          { data: 1, title: 'Cubo' },
          { data: 2, title: 'Persona' },
          { data: 3, title: 'Ronda' },
          {
            data: 4,
            title: 'Mejor Tiempo',
            render: function (data, type) {
              if (type === 'display') return formatTime(data);
              return data;
            }
          },
          {
            data: 5,
            title: 'Promedio',
            render: function (data, type) {
              if (type === 'display') return formatTime(data);
              return data;
            }
          },
          { data: 6, title: 'Categoria' },
          { data: 7, title: 'Fechas' }
        ],
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        oLanguage: { sSearch: 'Buscar persona, evento:' },
        pagingType: 'simple_numbers',
        pageLength: 30,
        lengthMenu: [30, 50, 100],
        order: [[5, 'asc']],
        responsive: true,
      });

      $('#main-spinner').addClass('hidden');
    });
});
