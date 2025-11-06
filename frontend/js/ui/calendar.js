/**
 * Calendar Component - Vanilla JS Implementation
 * Adaptación del componente Calendar de React (react-day-picker)
 */

/**
 * Nombres de los meses en español
 */
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Nombres de los días de la semana en español
 */
const WEEKDAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Obtiene el primer día de la semana (0 = Domingo)
 */
function getFirstDayOfWeek() {
  return 0; // Domingo
}

/**
 * Obtiene si una fecha es hoy
 */
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

/**
 * Obtiene si dos fechas son iguales
 */
function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

/**
 * Obtiene si una fecha está en un rango
 */
function isInRange(date, start, end) {
  if (!start || !end) return false;
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return dateOnly >= startOnly && dateOnly <= endOnly;
}

/**
 * Formatea una fecha para aria-selected
 */
function formatDateForAria(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Inicializa un calendario
 * @param {HTMLElement} calendarElement - Elemento contenedor del calendario
 */
export function initCalendar(calendarElement) {
  const mode = calendarElement.getAttribute('data-calendar-mode') || 'single';
  const showOutsideDays = calendarElement.getAttribute('data-calendar-show-outside-days') !== 'false';
  let currentDate = new Date();
  
  // Obtener fecha inicial si existe
  const initialDate = calendarElement.getAttribute('data-calendar-initial-date');
  if (initialDate) {
    currentDate = new Date(initialDate);
  }
  
  let selectedDate = null;
  let rangeStart = null;
  let rangeEnd = null;
  
  // Obtener fechas seleccionadas iniciales
  const initialSelected = calendarElement.getAttribute('data-calendar-selected');
  if (initialSelected) {
    selectedDate = new Date(initialSelected);
  }
  
  const initialRangeStart = calendarElement.getAttribute('data-calendar-range-start');
  const initialRangeEnd = calendarElement.getAttribute('data-calendar-range-end');
  if (initialRangeStart && initialRangeEnd) {
    rangeStart = new Date(initialRangeStart);
    rangeEnd = new Date(initialRangeEnd);
  }
  
  // Renderizar calendario
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Primer día a mostrar (puede ser del mes anterior)
    const firstDayOfWeek = getFirstDayOfWeek();
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek - firstDayOfWeek;
    const startCalendar = new Date(startDate);
    startCalendar.setDate(startDate.getDate() - diff);
    
    // Generar días del calendario (6 semanas = 42 días)
    const days = [];
    const current = new Date(startCalendar);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    // Generar HTML
    const calendarHTML = `
      <div class="calendar-months">
        <div class="calendar-month">
          <div class="calendar-caption">
            <button class="calendar-nav-button calendar-nav-button-previous button button-variant-outline button-size-icon" aria-label="Mes anterior">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div class="calendar-caption-label">${MONTH_NAMES[month]} ${year}</div>
            <button class="calendar-nav-button calendar-nav-button-next button button-variant-outline button-size-icon" aria-label="Mes siguiente">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          <table class="calendar-table">
            <thead>
              <tr class="calendar-head-row">
                ${WEEKDAY_NAMES.map(day => `<th class="calendar-head-cell">${day}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 6 }, (_, weekIndex) => {
                const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7);
                return `
                  <tr class="calendar-row">
                    ${weekDays.map(day => {
                      const isCurrentMonth = day.getMonth() === month;
                      const isDayToday = isToday(day);
                      const isDaySelected = mode === 'single' 
                        ? isSameDay(day, selectedDate)
                        : (isSameDay(day, rangeStart) || isSameDay(day, rangeEnd));
                      const isDayInRange = mode === 'range' && rangeStart && rangeEnd && 
                        isInRange(day, rangeStart, rangeEnd) && 
                        !isSameDay(day, rangeStart) && !isSameDay(day, rangeEnd);
                      const isDayDisabled = calendarElement.hasAttribute('data-calendar-disable-past') && 
                        day < new Date(new Date().setHours(0, 0, 0, 0));
                      const isRangeStart = mode === 'range' && isSameDay(day, rangeStart);
                      const isRangeEnd = mode === 'range' && isSameDay(day, rangeEnd);
                      
                      const dayClasses = [
                        'calendar-day',
                        !isCurrentMonth && showOutsideDays ? 'calendar-day-day-outside' : '',
                        !isCurrentMonth && !showOutsideDays ? 'calendar-day-day-hidden' : '',
                        isDayToday && !isDaySelected ? 'calendar-day-day-today' : '',
                        isDaySelected ? 'calendar-day-day-selected' : '',
                        isDayInRange ? 'calendar-day-day-range-middle' : '',
                        isDayDisabled ? 'calendar-day-day-disabled' : '',
                        isRangeStart ? 'calendar-day-day-range-start' : '',
                        isRangeEnd ? 'calendar-day-day-range-end' : ''
                      ].filter(Boolean).join(' ');
                      
                      const ariaSelected = (mode === 'single' && isSameDay(day, selectedDate)) ||
                                         (mode === 'range' && (isRangeStart || isRangeEnd));
                      
                      const cellClasses = [
                        'calendar-cell',
                        isDayInRange ? 'calendar-cell-range-middle' : '',
                        isRangeStart ? 'calendar-cell-range-start' : '',
                        isRangeEnd ? 'calendar-cell-range-end' : ''
                      ].filter(Boolean).join(' ');
                      
                      return `
                        <td class="${cellClasses}">
                          <button
                            class="${dayClasses}"
                            ${ariaSelected ? 'aria-selected="true"' : ''}
                            ${isDayDisabled ? 'disabled' : ''}
                            data-date="${formatDateForAria(day)}"
                            ${!isCurrentMonth && !showOutsideDays ? 'style="display: none;"' : ''}
                          >
                            ${day.getDate()}
                          </button>
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    calendarElement.innerHTML = calendarHTML;
    
    // Event listeners
    const prevButton = calendarElement.querySelector('.calendar-nav-button-previous');
    const nextButton = calendarElement.querySelector('.calendar-nav-button-next');
    const dayButtons = calendarElement.querySelectorAll('.calendar-day:not(.calendar-day-day-disabled)');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
    }
    
    dayButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dateStr = button.getAttribute('data-date');
        const date = new Date(dateStr);
        
        if (mode === 'single') {
          selectedDate = date;
          // Dispatch custom event
          calendarElement.dispatchEvent(new CustomEvent('calendar-select', {
            detail: { date, mode: 'single' }
          }));
        } else if (mode === 'range') {
          if (!rangeStart || (rangeStart && rangeEnd)) {
            rangeStart = date;
            rangeEnd = null;
          } else if (rangeStart && !rangeEnd) {
            if (date < rangeStart) {
              rangeEnd = rangeStart;
              rangeStart = date;
            } else {
              rangeEnd = date;
            }
            // Dispatch custom event
            calendarElement.dispatchEvent(new CustomEvent('calendar-select', {
              detail: { start: rangeStart, end: rangeEnd, mode: 'range' }
            }));
          }
        }
        
        renderCalendar();
      });
    });
  }
  
  // Renderizar inicialmente
  renderCalendar();
}

/**
 * Inicializa todos los calendarios en la página
 */
export function initCalendars() {
  const calendars = document.querySelectorAll('[data-calendar]');
  
  calendars.forEach((calendar) => {
    initCalendar(calendar);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalendars);
} else {
  initCalendars();
}

