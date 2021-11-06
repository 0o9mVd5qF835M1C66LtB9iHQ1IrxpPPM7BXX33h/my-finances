import { NextApiRequest, NextApiResponse } from "next"
import { transactionRepository } from "../repository/transactionRepository"

function list(req: NextApiRequest, res: NextApiResponse) {
  const transactions = transactionRepository.list()
  return res.status(200).json({ transactions })
}

function get(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  let idTransaction = Array.isArray(id) ? id[0] : id

  const transaction = transactionRepository.get(idTransaction)

  return res.status(200).json({ transaction })
}

function post(req: NextApiRequest, res: NextApiResponse) {

}

function put(req: NextApiRequest, res: NextApiResponse) {

}

function patch(req: NextApiRequest, res: NextApiResponse) {

}

function remove(req: NextApiRequest, res: NextApiResponse) {

}

export const transactionController = {
  list,
  get,
  post,
  put,
  patch,
  remove,
}
