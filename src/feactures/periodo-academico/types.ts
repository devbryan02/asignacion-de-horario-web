
export interface PeriodoAcademico {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}
// Define the request type for creating a Period
export interface PeriodoRequest {
    nombre: string;
    fechaInicio: string; // Using string to match "yyyy-MM-dd" format
    fechaFin: string;   // Using string to match "yyyy-MM-dd" format
  }
  
  // Define the response type from the API
  export interface RegistroResponse {
    success: boolean;
    message: string;
  }

  
  // Optional: Helper functions to match the Java record's static methods
  export const RegistroResponse = {
    success: (message: string): RegistroResponse => ({
      success: true,
      message
    }),
    failure: (message: string): RegistroResponse => ({
      success: false,
      message
    })
  };