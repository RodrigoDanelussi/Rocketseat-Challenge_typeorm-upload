import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    try {
      const categoryRepository = getRepository(Category);

      const category = await categoryRepository.findOne({
        where: { title },
      });

      if (category) {
        return category;
      }

      const newCategory = categoryRepository.create({
        title,
      });

      await categoryRepository.save(newCategory);

      return newCategory;
    } catch {
      throw new AppError('Error CreateCategoryService');
    }
  }
}

export default CreateCategoryService;
