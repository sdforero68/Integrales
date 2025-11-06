/**
 * Chart Component - Vanilla JS Implementation
 * Adaptación del componente Chart de React (Recharts)
 * 
 * Este componente proporciona la estructura base para integrar
 * bibliotecas de gráficos como Chart.js, Recharts, etc.
 */

/**
 * Configuración de colores del gráfico
 * @typedef {Object} ChartConfig
 * @property {string} [label] - Etiqueta del dataset
 * @property {string} [color] - Color del dataset
 * @property {Object} [theme] - Colores por tema { light: string, dark: string }
 */

/**
 * Inicializa un contenedor de gráfico
 * @param {HTMLElement} chartElement - Elemento contenedor del gráfico
 * @param {ChartConfig} config - Configuración del gráfico
 */
export function initChart(chartElement, config = {}) {
  const chartId = chartElement.getAttribute('data-chart') || `chart-${Date.now()}`;
  chartElement.setAttribute('data-chart', chartId);
  
  // Aplicar variables CSS para colores
  if (config && Object.keys(config).length > 0) {
    const style = document.createElement('style');
    style.setAttribute('data-chart-style', chartId);
    
    const colorConfig = Object.entries(config).filter(
      ([, itemConfig]) => itemConfig.theme || itemConfig.color
    );
    
    if (colorConfig.length > 0) {
      let css = '';
      
      // Tema light (default)
      css += `[data-chart="${chartId}"] {\n`;
      colorConfig.forEach(([key, itemConfig]) => {
        const color = itemConfig.theme?.light || itemConfig.color;
        if (color) {
          css += `  --color-${key}: ${color};\n`;
        }
      });
      css += '}\n\n';
      
      // Tema dark
      css += `.dark [data-chart="${chartId}"], [data-theme="dark"] [data-chart="${chartId}"] {\n`;
      colorConfig.forEach(([key, itemConfig]) => {
        const color = itemConfig.theme?.dark || itemConfig.theme?.light || itemConfig.color;
        if (color) {
          css += `  --color-${key}: ${color};\n`;
        }
      });
      css += '}\n';
      
      style.textContent = css;
      document.head.appendChild(style);
    }
  }
  
  // Preparar canvas o contenedor para el gráfico
  const existingCanvas = chartElement.querySelector('canvas');
  const existingSvg = chartElement.querySelector('svg');
  
  if (!existingCanvas && !existingSvg) {
    // Si no hay canvas ni svg, crear un contenedor
    const container = document.createElement('div');
    container.className = 'chart-container';
    container.style.width = '100%';
    container.style.height = '100%';
    chartElement.appendChild(container);
  }
  
  // Guardar configuración en el elemento
  chartElement._chartConfig = config;
  chartElement._chartId = chartId;
  
  return {
    chartId,
    element: chartElement,
    config,
    updateConfig: (newConfig) => {
      initChart(chartElement, newConfig);
    }
  };
}

/**
 * Obtiene la configuración de un payload del gráfico
 * @param {ChartConfig} config - Configuración del gráfico
 * @param {Object} payload - Payload del item
 * @param {string} key - Clave del item
 * @returns {Object|undefined} Configuración del item
 */
export function getPayloadConfigFromPayload(config, payload, key) {
  if (!config || typeof payload !== 'object' || payload === null) {
    return undefined;
  }
  
  const payloadPayload = payload.payload || {};
  let configLabelKey = key;
  
  if (key in payload && typeof payload[key] === 'string') {
    configLabelKey = payload[key];
  } else if (key in payloadPayload && typeof payloadPayload[key] === 'string') {
    configLabelKey = payloadPayload[key];
  }
  
  return config[configLabelKey] || config[key];
}

/**
 * Crea un tooltip personalizado para el gráfico
 * @param {Object} options - Opciones del tooltip
 * @param {boolean} options.active - Si el tooltip está activo
 * @param {Array} options.payload - Datos del tooltip
 * @param {string} [options.label] - Etiqueta del tooltip
 * @param {Function} [options.labelFormatter] - Formateador de etiqueta
 * @param {Function} [options.formatter] - Formateador personalizado
 * @param {string} [options.indicator] - Tipo de indicador ('dot', 'line', 'dashed')
 * @param {boolean} [options.hideLabel] - Ocultar etiqueta
 * @param {boolean} [options.hideIndicator] - Ocultar indicador
 * @param {ChartConfig} config - Configuración del gráfico
 * @returns {HTMLElement|null} Elemento del tooltip o null
 */
export function createChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  config = {}
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  
  const nestLabel = payload.length === 1 && indicator !== 'dot';
  
  // Label
  if (!nestLabel && !hideLabel) {
    const tooltipLabel = document.createElement('div');
    tooltipLabel.className = 'chart-tooltip-label';
    
    if (labelFormatter && payload.length > 0) {
      tooltipLabel.textContent = labelFormatter(label, payload);
    } else if (label) {
      tooltipLabel.textContent = label;
    }
    
    if (tooltipLabel.textContent) {
      tooltip.appendChild(tooltipLabel);
    }
  }
  
  // Content
  const content = document.createElement('div');
  content.className = 'chart-tooltip-content';
  
  payload.forEach((item, index) => {
    const itemKey = item.name || item.dataKey || 'value';
    const itemConfig = getPayloadConfigFromPayload(config, item, itemKey);
    const indicatorColor = item.color || item.payload?.fill || item.fill || '#3b82f6';
    
    const tooltipItem = document.createElement('div');
    tooltipItem.className = 'chart-tooltip-item';
    if (indicator === 'dot') {
      tooltipItem.style.alignItems = 'center';
    }
    
    if (formatter && item.value !== undefined && item.name) {
      tooltipItem.innerHTML = formatter(item.value, item.name, item, index, item.payload);
    } else {
      // Indicator
      if (!hideIndicator) {
        const indicatorEl = document.createElement('div');
        indicatorEl.className = `chart-tooltip-indicator chart-tooltip-indicator-${indicator}`;
        indicatorEl.style.backgroundColor = indicatorColor;
        indicatorEl.style.borderColor = indicatorColor;
        if (indicator === 'dashed') {
          indicatorEl.style.backgroundColor = 'transparent';
        }
        tooltipItem.appendChild(indicatorEl);
      }
      
      // Content
      const itemContent = document.createElement('div');
      itemContent.className = 'chart-tooltip-item-content';
      if (nestLabel) {
        itemContent.style.alignItems = 'flex-end';
      }
      
      const labelDiv = document.createElement('div');
      labelDiv.style.display = 'grid';
      labelDiv.style.gap = '0.375rem';
      
      if (nestLabel) {
        const labelSpan = document.createElement('span');
        labelSpan.className = 'chart-tooltip-label';
        labelSpan.textContent = label || '';
        labelDiv.appendChild(labelSpan);
      }
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'chart-tooltip-item-label';
      nameSpan.textContent = itemConfig?.label || item.name || '';
      labelDiv.appendChild(nameSpan);
      
      itemContent.appendChild(labelDiv);
      
      if (item.value !== undefined && item.value !== null) {
        const valueSpan = document.createElement('span');
        valueSpan.className = 'chart-tooltip-item-value';
        valueSpan.textContent = typeof item.value === 'number' 
          ? item.value.toLocaleString() 
          : item.value;
        itemContent.appendChild(valueSpan);
      }
      
      tooltipItem.appendChild(itemContent);
    }
    
    content.appendChild(tooltipItem);
  });
  
  tooltip.appendChild(content);
  
  return tooltip;
}

/**
 * Crea una leyenda personalizada para el gráfico
 * @param {Object} options - Opciones de la leyenda
 * @param {Array} options.payload - Datos de la leyenda
 * @param {string} [options.verticalAlign] - Alineación vertical ('top' | 'bottom')
 * @param {boolean} [options.hideIcon] - Ocultar ícono
 * @param {ChartConfig} config - Configuración del gráfico
 * @returns {HTMLElement|null} Elemento de la leyenda o null
 */
export function createChartLegend({
  payload,
  verticalAlign = 'bottom',
  hideIcon = false,
  config = {}
}) {
  if (!payload || payload.length === 0) {
    return null;
  }
  
  const legend = document.createElement('div');
  legend.className = `chart-legend chart-legend-${verticalAlign}`;
  
  payload.forEach((item) => {
    const itemKey = item.dataKey || 'value';
    const itemConfig = getPayloadConfigFromPayload(config, item, itemKey);
    
    const legendItem = document.createElement('div');
    legendItem.className = 'chart-legend-item';
    
    // Indicator
    if (itemConfig?.icon && !hideIcon) {
      // Si hay ícono, crear elemento SVG o usar el ícono
      const iconEl = document.createElement('div');
      iconEl.innerHTML = itemConfig.icon;
      legendItem.appendChild(iconEl);
    } else {
      const indicator = document.createElement('div');
      indicator.className = 'chart-legend-indicator';
      indicator.style.backgroundColor = item.color || '#3b82f6';
      legendItem.appendChild(indicator);
    }
    
    // Label
    const label = document.createElement('span');
    label.className = 'chart-legend-label';
    label.textContent = itemConfig?.label || item.value || '';
    legendItem.appendChild(label);
    
    legend.appendChild(legendItem);
  });
  
  return legend;
}

/**
 * Inicializa todos los gráficos en la página
 */
export function initCharts() {
  const charts = document.querySelectorAll('[data-chart]');
  
  charts.forEach((chart) => {
    // Si ya tiene configuración, inicializarla
    const configData = chart.getAttribute('data-chart-config');
    if (configData) {
      try {
        const config = JSON.parse(configData);
        initChart(chart, config);
      } catch (e) {
        console.warn('Error parsing chart config:', e);
        initChart(chart);
      }
    } else {
      initChart(chart);
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
}

