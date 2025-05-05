import { Loader2, AlertTriangle, CalendarClock, UserSearch } from 'lucide-react';

interface RestriccionLoadingStateProps {
  message?: string;
}

export function RestriccionLoadingState({ message = "Cargando restricciones..." }: RestriccionLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
      <p className="mt-4 text-base-content/70">{message}</p>
    </div>
  );
}

interface RestriccionErrorStateProps {
  message: string;
}

export function RestriccionErrorState({ message }: RestriccionErrorStateProps) {
  return (
    <div className="alert alert-error shadow-lg">
      <AlertTriangle className="h-6 w-6" />
      <span>{message}</span>
    </div>
  );
}

interface RestriccionEmptyDataStateProps {
  docenteName: string;
}

export function RestriccionEmptyDataState({ docenteName }: RestriccionEmptyDataStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <CalendarClock className="h-12 w-12 text-base-content/30" />
      <p className="mt-4 text-base-content/70">
        No hay restricciones registradas para {docenteName}.
      </p>
    </div>
  );
}

export function RestriccionNoSelectionState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <UserSearch className="h-12 w-12 text-base-content/30" />
      <p className="mt-4 text-base-content/70">
        Seleccione un docente para ver sus restricciones.
      </p>
    </div>
  );
}