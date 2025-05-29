import { Metadata } from 'next';
import { PeriodoAcademicoContent } from '@/feactures/periodo-academico/components/Content';

export const metadata: Metadata = {
  title: 'Periodos Académicos',
  description: 'Gestión de periodos académicos en la aplicación de horarios'
};

export default function PeriodoAcademicoPage() {
  return (

    <PeriodoAcademicoContent />

  );
}