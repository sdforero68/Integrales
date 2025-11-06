/**
 * Table Component - Vanilla JS Implementation
 * Adaptación del componente Table de React
 */

/**
 * Inicializa una tabla individual
 * @param {HTMLElement} tableElement - Elemento table
 */
export function initTable(tableElement) {
  // Buscar o crear container
  let container = tableElement.closest('[data-slot="table-container"], .table-container');
  
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('data-slot', 'table-container');
    container.className = 'table-container';
    tableElement.parentElement.insertBefore(container, tableElement);
    container.appendChild(tableElement);
  }
  
  // Aplicar clase si no existe
  if (!tableElement.classList.contains('table')) {
    tableElement.classList.add('table');
  }
  
  // Agregar clase has-checkbox a celdas con checkboxes
  const heads = tableElement.querySelectorAll('[data-slot="table-head"], .table-head, th');
  const cells = tableElement.querySelectorAll('[data-slot="table-cell"], .table-cell, td');
  
  heads.forEach(head => {
    if (head.querySelector('[role="checkbox"]') || head.querySelector('input[type="checkbox"]')) {
      head.classList.add('has-checkbox');
    }
  });
  
  cells.forEach(cell => {
    if (cell.querySelector('[role="checkbox"]') || cell.querySelector('input[type="checkbox"]')) {
      cell.classList.add('has-checkbox');
    }
  });
  
  // Inicializar filas seleccionables si tienen checkboxes
  const rows = tableElement.querySelectorAll('[data-slot="table-row"], .table-row, tbody tr');
  rows.forEach((row, index) => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          row.setAttribute('data-state', 'selected');
        } else {
          row.removeAttribute('data-state');
        }
        
        // Dispatch event
        tableElement.dispatchEvent(new CustomEvent('table-row-select', {
          detail: { row, index, selected: checkbox.checked },
          bubbles: true
        }));
      });
    }
    
    // Click en fila para seleccionar (si tiene checkbox)
    if (checkbox) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        if (e.target !== checkbox && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });
    }
  });
}

/**
 * Inicializa todas las tablas en la página
 */
export function initTables() {
  const tables = document.querySelectorAll('[data-slot="table"], .table, table');
  
  tables.forEach((table) => {
    // Solo inicializar si es un elemento table
    if (table.tagName === 'TABLE') {
      initTable(table);
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTables);
} else {
  initTables();
}

