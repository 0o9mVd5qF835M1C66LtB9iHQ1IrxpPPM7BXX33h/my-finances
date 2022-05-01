import { parseDateBrUTC, parseYearMonthDayUTC } from "utils/dateUtil"
import { formatCurrency } from "utils/maskUtil"
import { ITransaction, ITransactionRequest } from "models/transactions/transaction"

const statusDisplayObj: any = {
  deposit: "À receber",
  withdraw: "À pagar",
  overdue: "Vencido",
  paid: "Pago",
}

export function getStatusDisplay(status: string) {
  const statusDisplay = statusDisplayObj[status]
  return statusDisplay
}

export function generateTransaction(transaction: ITransactionRequest): ITransaction {
  const dateUTC = transaction.date
  const statusDisplay = transaction.status ? getStatusDisplay(transaction.status) : ""

  const transactionMapped: ITransaction = {
    ...transaction,
    date: parseYearMonthDayUTC(dateUTC),
    dateDisplay: parseDateBrUTC(dateUTC),
    amountDisplay: formatCurrency(transaction.amount),
    statusDisplay,
  }

  return transactionMapped
}
