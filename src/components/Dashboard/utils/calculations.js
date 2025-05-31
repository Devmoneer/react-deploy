export const calculateTotals = (accountingData) => {
  const revenue = accountingData.reduce(
    (sum, item) => item.type === 'revenue' ? sum + Number(item.amount) : sum, 0
  );
  const expenses = accountingData.reduce(
    (sum, item) => item.type === 'expense' ? sum + Number(item.amount) : sum, 0
  );
  const profit = revenue - expenses;
  return { revenue, expenses, profit };
};