import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsAndCategory {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    if (transactions) {
      const { income, outcome } = transactions.reduce(
        (accumulator, transaction) => {
          switch (transaction.type) {
            case 'income':
              accumulator.income += Number(transaction.value);
              break;

            case 'outcome':
              accumulator.outcome += Number(transaction.value);
              break;

            default:
              break;
          }

          return accumulator;
        },
        {
          income: 0,
          outcome: 0,
        },
      );
      return { income, outcome, total: income - outcome };
    }

    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    return balance;
  }

  public async getAllTransactions(): Promise<TransactionsAndCategory[]> {
    const transactions = await this.find();

    const categoryRepository = getRepository(Category);
    const categories = await categoryRepository.find();
    console.log('categories');
    console.log(categories);

    const transactionsAndCategory = await transactions.map(
      ({ id, title, type, value, category_id, created_at, updated_at }) => {
        const category = categories.find(x => x.id === category_id);
        const result = {
          id,
          title,
          type,
          value,
          category: { ...category } as Category,
          created_at,
          updated_at,
        };

        return result;
      },
    );

    return transactionsAndCategory;
  }
}

export default TransactionsRepository;
