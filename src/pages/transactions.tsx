import { useState } from "react"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { SimpleGrid, Stack, Button, Select, HStack, useToast, useDisclosure } from "@chakra-ui/react"

import { CardTransaction } from "../components/CardTransaction"
import { TableTransaction } from "../components/TableTransaction"
import { ModalTransaction } from "../components/ModalTransaction"
import { TransactionProps, useTransactions } from "../hooks/useTransactions"
import { getObjYearMonthDay } from "../utils/dateUtil"

export default function Transactions() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { transactions, summary, create, remove } = useTransactions()

  const [filters, setFilters] = useState(() => {
    const { month, year } = getObjYearMonthDay()
    return { month, year }
  })

  const handleEdit = (transaction: TransactionProps) => {
    console.log(transaction)
  }

  const handleDelete = async (idTransaction: string) => {
    const status = await remove(idTransaction)
    if (status) {
      toast({
        title: "Transação removida.",
        status: "success",
        position: "top",
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Stack paddingY={10} spacing={10}>
      <SimpleGrid columns={3} spacing={10}>
        <CardTransaction
          description="Entradas"
          title={summary.deposit}
          icon="arrowUp"
        />

        <CardTransaction
          description="Saídas"
          title={summary.withdraw}
          icon="arrowDown"
        />

        <CardTransaction
          description="Total"
          title={summary.total}
          icon="dollarSign"
        />
      </SimpleGrid>

      <Stack spacing={4} >
        <HStack align="center" justify="space-between" spacing={4}>
          <HStack spacing={4}>
            <Select
              name="month"
              placeholder="Selecione o mês"
              value={filters.month}
              onChange={({ target: { name, value } }) => setFilters(old => ({ ...old, [name]: value }))}
            >
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </Select>

            <Select
              name="year"
              placeholder="Selecione o ano"
              value={filters.year}
              onChange={({ target: { name, value } }) => setFilters(old => ({ ...old, [name]: value }))}
            >
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </Select>
          </HStack>

          <Button
            onClick={onOpen}
            borderRadius="md"
            colorScheme="blue"
            paddingX={10}
          >
            Nova Transação
          </Button>
        </HStack>

        <TableTransaction data={transactions} onEdit={handleEdit} onDelete={handleDelete} />
      </Stack>

      <ModalTransaction
        isOpen={isOpen}
        onClose={onClose}
        onSave={create}
      />
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
