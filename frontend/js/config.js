// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales de Supabase
export const projectId = 'tu-project-id'; // Reemplaza con tu project ID de Supabase
export const publicAnonKey = 'tu-public-anon-key'; // Reemplaza con tu public anon key de Supabase

export const supabaseUrl = `https://${projectId}.supabase.co`;

// Función para obtener el cliente de Supabase
export function getSupabaseClient() {
  // Nota: Esta función requiere que se cargue la biblioteca de Supabase
  // Asegúrate de incluir el script de Supabase en tu HTML:
  // <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  
  if (typeof supabase === 'undefined') {
    console.error('Supabase no está cargado. Asegúrate de incluir el script de Supabase.');
    return null;
  }
  
  return supabase.createClient(supabaseUrl, publicAnonKey);
}

