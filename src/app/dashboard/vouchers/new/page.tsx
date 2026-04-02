import { IssueVoucherForm } from '@/components/vouchers/issue-voucher-form'

export default function NewVoucherPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Vale Regalo</h1>
        <p className="text-sm text-muted-foreground">
          Genera un código de vale con saldo inicial.
        </p>
      </div>
      <IssueVoucherForm />
    </div>
  )
}
