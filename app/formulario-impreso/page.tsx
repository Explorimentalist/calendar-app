import Component from '@/components/formulario-impreso'

export default function FormularioImpresoPage() {
  return (
    <div className="custom:px-[5%] flex flex-col min-h-screen">
      <Component />
      <footer className="text-center py-4 text-sm text-gray-600">
        Elanjiminyya © 2024. Designed by the Explorimentalist.
      </footer>
    </div>
  )
}