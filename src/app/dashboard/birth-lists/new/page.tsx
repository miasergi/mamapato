import { NewBirthListForm } from '@/components/birth-lists/new-birth-list-form'

export default function NewBirthListPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Lista de Nacimiento</h1>
        <p className="text-sm text-muted-foreground">
          Rellena los datos del bebé y los papás para crear la lista.
        </p>
      </div>
      <NewBirthListForm />
    </div>
  )
}
