/**
 * cn.js - Utility for combining CSS classes
 * Adaptación de la función cn (clsx + twMerge) de React/TypeScript
 * Combina clases CSS de forma condicional y resuelve conflictos de Tailwind
 */

/**
 * Convierte un valor a string de clases
 * @param {any} value - Valor a convertir
 * @returns {string} - String de clases
 */
function toVal(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  
  if (Array.isArray(value)) {
    return value.map(toVal).filter(Boolean).join(' ');
  }
  
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .filter(key => value[key])
      .map(key => key)
      .join(' ');
  }
  
  return '';
}

/**
 * Combina clases CSS (equivalente a clsx)
 * @param {...any} inputs - Valores de clases (strings, arrays, objetos)
 * @returns {string} - Clases combinadas
 */
export function clsx(...inputs) {
  return inputs
    .map(toVal)
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ') || '';
}

/**
 * Mapa de clases de Tailwind que entran en conflicto
 * Agrupa clases por su prefijo/base para detectar conflictos
 */
const TW_CONFLICT_PATTERNS = {
  // Spacing (padding, margin)
  padding: /^p-|^px-|^py-|^pt-|^pr-|^pb-|^pl-|^ps-|^pe-/,
  margin: /^m-|^mx-|^my-|^mt-|^mr-|^mb-|^ml-|^ms-|^me-/,
  
  // Size
  width: /^w-|^min-w-|^max-w-/,
  height: /^h-|^min-h-|^max-h-/,
  
  // Flex
  flex: /^flex-|^flex-grow|^flex-shrink|^flex-basis/,
  flexDirection: /^flex-row|^flex-col|^flex-row-reverse|^flex-col-reverse/,
  flexWrap: /^flex-wrap|^flex-nowrap|^flex-wrap-reverse/,
  alignItems: /^items-|^content-|^self-/,
  justifyContent: /^justify-|^justify-items-|^justify-self-/,
  
  // Position
  position: /^static|^fixed|^absolute|^relative|^sticky/,
  top: /^top-/,
  right: /^right-/,
  bottom: /^bottom-/,
  left: /^left-/,
  
  // Display
  display: /^block|^inline-block|^inline|^flex|^inline-flex|^grid|^inline-grid|^hidden/,
  
  // Overflow
  overflow: /^overflow-|^overflow-x-|^overflow-y-/,
  
  // Text
  textAlign: /^text-left|^text-center|^text-right|^text-justify/,
  fontSize: /^text-|^text-xs|^text-sm|^text-base|^text-lg|^text-xl|^text-2xl|^text-3xl|^text-4xl|^text-5xl|^text-6xl/,
  fontWeight: /^font-|^font-thin|^font-extralight|^font-light|^font-normal|^font-medium|^font-semibold|^font-bold|^font-extrabold|^font-black/,
  
  // Colors (background, text, border)
  backgroundColor: /^bg-|^bg-transparent|^bg-current/,
  textColor: /^text-|^text-transparent|^text-current/,
  borderColor: /^border-|^border-transparent|^border-current/,
  
  // Border
  borderWidth: /^border-|^border-x-|^border-y-|^border-t-|^border-r-|^border-b-|^border-l-/,
  borderRadius: /^rounded-|^rounded-none|^rounded-sm|^rounded-md|^rounded-lg|^rounded-xl|^rounded-2xl|^rounded-3xl|^rounded-full/,
  
  // Opacity
  opacity: /^opacity-/,
  
  // Z-index
  zIndex: /^z-/,
  
  // Transform
  transform: /^transform|^scale-|^rotate-|^translate-/,
  
  // Transition
  transition: /^transition-|^duration-|^ease-/,
  
  // Shadow
  boxShadow: /^shadow-|^shadow-none|^shadow-sm|^shadow-md|^shadow-lg|^shadow-xl|^shadow-2xl/,
};

/**
 * Detecta si una clase es de Tailwind y a qué grupo pertenece
 * @param {string} className - Clase a analizar
 * @returns {string|null} - Grupo de conflicto o null
 */
function getConflictGroup(className) {
  for (const [group, pattern] of Object.entries(TW_CONFLICT_PATTERNS)) {
    if (pattern.test(className)) {
      return group;
    }
  }
  return null;
}

/**
 * Resuelve conflictos de clases de Tailwind (equivalente a twMerge)
 * @param {string} classString - String de clases
 * @returns {string} - Clases sin conflictos
 */
function twMerge(classString) {
  if (!classString) return '';
  
  const classes = classString.split(/\s+/).filter(Boolean);
  const conflictMap = new Map();
  const nonConflictClasses = [];
  
  // Agrupar clases por su grupo de conflicto
  classes.forEach(className => {
    const group = getConflictGroup(className);
    
    if (group) {
      if (!conflictMap.has(group)) {
        conflictMap.set(group, []);
      }
      conflictMap.get(group).push(className);
    } else {
      // Clases sin conflicto (custom classes, etc.)
      nonConflictClasses.push(className);
    }
  });
  
  // Para cada grupo de conflicto, tomar solo la última clase
  const resolvedConflicts = [];
  conflictMap.forEach((conflictClasses) => {
    // Tomar la última clase del grupo (la más reciente)
    if (conflictClasses.length > 0) {
      resolvedConflicts.push(conflictClasses[conflictClasses.length - 1]);
    }
  });
  
  // Combinar clases resueltas con las sin conflicto
  return [...nonConflictClasses, ...resolvedConflicts].join(' ');
}

/**
 * Combina clases CSS y resuelve conflictos de Tailwind (equivalente a cn)
 * @param {...any} inputs - Valores de clases (strings, arrays, objetos)
 * @returns {string} - Clases combinadas sin conflictos
 */
export function cn(...inputs) {
  const classString = clsx(...inputs);
  return twMerge(classString);
}

// Exportar como función global si se necesita
if (typeof window !== 'undefined') {
  window.cn = cn;
  window.clsx = clsx;
}

