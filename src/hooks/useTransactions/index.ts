import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useToast } from "@chakra-ui/react"
import { summaryDefault, generateResumeSummary } from "./transaction.util"
import { api } from "libs/api"
import { getTransactionsService } from "services/transactions"
import { formatCurrency } from "utils/maskUtil"
import { dateNowYearMonthDay, getObjYearMonthDay } from "utils/dateUtil"
import {
  TransactionModelProps,
  ITransactionEditRequest,
  ITransactionGetFilters,
  ITransactionRequestGet
} from "models/transactions/transaction"

export function useTransactions() {
  const toast = useToast()
  const queryClient = useQueryClient()

  const [summary, setSummary] = useState(summaryDefault)

  const [filters, setFilters] = useState<ITransactionGetFilters>(() => {
    const dateYearMonthDay = dateNowYearMonthDay()
    const { month, year } = getObjYearMonthDay(dateYearMonthDay)
    return { month, year }
  })

  const { data: transactions, isLoading, refetch, isFetching } = useQuery(
    '/transactions',
    async () => {
      try {
        const { month, year } = filters

        const mappedTransactions = await getTransactionsService({ month, year })

        return mappedTransactions
      } catch (error) {
        toast({
          title: "Erro ao listar as transações!",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        })
      }
    },
    {
      refetchInterval: false
    }
  )

  useEffect(() => {
    if (filters.month && filters.year) refetch()
  }, [filters.month, filters.year])

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const { deposit, withdraw, total } = generateResumeSummary(transactions)

      setSummary({
        deposit: formatCurrency(deposit),
        withdraw: formatCurrency(withdraw),
        total: formatCurrency(total),
      })
    } else {
      setSummary(summaryDefault)
    }
  }, [transactions])

  const createTransaction = useMutation(async (transaction: TransactionModelProps) => {
    try {
      const { data } = await api.post<ITransactionRequestGet>("/transactions", transaction)
      if (!data.transaction) return

      toast({
        title: "Transação criada com sucesso!",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Erro ao criar a transação!",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('/transactions')
    },
  })

  const editTransaction = useMutation(async ({ id, transaction, action }: ITransactionEditRequest) => {
    try {
      const { data } = await api.put<ITransactionRequestGet>(`/transactions/${id}`, transaction)
      if (!data.transaction) return

      toast({
        title: "Transação editada com sucesso!",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Erro ao editar a transação!",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('/transactions')
    },
  })

  const deleteTransaction = useMutation(async (idTransaction: string) => {
    try {
      const { status } = await api.delete<{ ok?: true }>(`/transactions/${idTransaction}`)

      if (status === 200) {
        toast({
          title: "Transação removida com sucesso!",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao remover a transação!",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      })
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('/transactions')
    },
  })

  return {
    transactions: {
      data: transactions,
      isLoading,
      isFetching,
      refetch,
    },
    filters,
    setFilters,
    summary,
    create: createTransaction,
    edit: editTransaction,
    remove: deleteTransaction,
  }
}
