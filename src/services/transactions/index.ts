import { api } from "libs/api"
import { generateTransaction } from "./transaction.helpers"
import { ITransaction, ITransactionGetFilters, ITransactionResponseGet, ITransactionRequestPost, ITransactionResponsePut, ITransactionRequestBase } from "models/transactions/transaction"

export async function getTransactionsService({ month, year }: ITransactionGetFilters): Promise<ITransaction[]> {
  const { data: transactions } = await api.get<ITransactionResponseGet>("/transactions", {
    params: {
      month,
      year,
    },
  })

  const mappedTransactions: ITransaction[] = transactions.data.map(transaction => {
    const transactionMapped = generateTransaction(transaction)
    return transactionMapped
  })

  return mappedTransactions

  // TODO: tratar o erro criando um obj de erro global
}

export async function getTransactionService() {
  console.log("getTransactionService")
}

export async function createTransactionService(transaction: ITransactionRequestPost): Promise<ITransaction | undefined> {
  const { data } = await api.post<ITransactionResponseGet>("/transactions", transaction)

  const transactionCreated = data.transaction
  if (!transactionCreated) return undefined

  const transactionMapped = generateTransaction(transactionCreated)

  return transactionMapped

  // TODO: tratar o erro criando um obj de erro global
}

export async function editTransactionService(id: string, transaction: ITransactionRequestBase): Promise<ITransaction | undefined> {
  const { data } = await api.put<ITransactionResponsePut>(`/transactions/${id}`, transaction)

  const transactionCreated = data.transaction
  if (!transactionCreated) return undefined

  try {
    const transactionMapped = generateTransaction(transactionCreated)
    return transactionMapped
  } catch (error) {
    return undefined
  }

  // TODO: tratar o erro criando um obj de erro global
}

export async function deleteTransactionService(id: string) {
  console.log("deleteTransactionService")
}
