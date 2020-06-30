import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);

    const categoryService = new CategoryService();

    const category_id = await categoryService.execute({ title: category });

    if (!category_id.id) {
      throw new AppError('Error not found category_id');
    }

    try {
      const transaction = await transactionRepository.create({
        title,
        value,
        type,
        category_id: category_id.id,
      });

      await transactionRepository.save(transaction);

      return transaction;
    } catch {
      throw new AppError('Error CreateTransactionService');
    }
  }
}

export default CreateTransactionService;
