"use server";

import { authenticateAdmin } from "../auth";
import prisma from "../prisma";

export async function getExpenseData(id: string) {
  await authenticateAdmin();

  const expense = await prisma.expense.findFirst({
    where: { id },
  });

  return expense;
}

export async function getExpenseLenghtByCategory(category: string) {
  await authenticateAdmin();

  const count = await prisma.expense.count({
    where: {
      ...(category !== "ALL" ? { category: category as any } : {}),
    },
  });

  return count;
}
