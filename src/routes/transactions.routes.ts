import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionRepository from '../repositories/TransactionsRepository';

import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import AppError from '../errors/AppError';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionRepository);

  const transaction = await transactionsRepository.getAllTransactions();

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions: transaction, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionsRepository = getCustomRepository(TransactionRepository);
  if (type === 'outcome') {
    const balance = await transactionsRepository.getBalance();
    if (balance.total - value < 0) throw new AppError('Value not avaliable');
  }

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();
  deleteTransactionService.execute(id);

  response.status(400).json({ message: 'Delete' });
});

transactionsRouter.post('/import', async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();
  const importData = await importTransactionsService.execute();

  return response.json(importData);
});

export default transactionsRouter;
