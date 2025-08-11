export const userProfileData = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  demographics: '35 years old, married, 2 dependents',
  income: '$120,000 per year',
  currentSavings: 250000,
  retirementGoal: 1500000,
  riskTolerance: 'Moderate',
};

export const transactionHistoryData = JSON.stringify([
  { id: '1', date: '2023-10-01', description: 'Salary Deposit', amount: 5000, type: 'credit' },
  { id: '2', date: '2023-10-02', description: 'Grocery Shopping', amount: -150, type: 'debit' },
  { id: '3', date: '2023-10-05', description: 'Vanguard ETF Purchase', amount: -1000, type: 'debit' },
  { id: '4', date: '2023-10-15', description: 'Salary Deposit', amount: 5000, type: 'credit' },
  { id: '5', date: '2023-10-18', description: 'Restaurant', amount: -75, type: 'debit' },
  { id: '6', date: '2023-10-20', description: 'Utility Bill', amount: -200, type: 'debit' },
]);

export const recentTransactionsForAnomalyCheck = [
  {
    id: 't1',
    description: "Standard stock purchase",
    data: {
      transactionHistory: transactionHistoryData,
      recentTransaction: JSON.stringify({ date: '2024-07-16', amount: -2000, description: 'Purchase of 10 shares of VOO' }),
      userProfile: JSON.stringify(userProfileData)
    },
  },
  {
    id: 't2',
    description: "Large, unusual withdrawal",
    data: {
      transactionHistory: transactionHistoryData,
      recentTransaction: JSON.stringify({ date: '2024-07-15', amount: -25000, description: 'Wire Transfer to "Exotic Ventures Inc."' }),
      userProfile: JSON.stringify(userProfileData)
    }
  },
  {
    id: 't3',
    description: "Small, everyday expense",
    data: {
      transactionHistory: transactionHistoryData,
      recentTransaction: JSON.stringify({ date: '2024-07-16', amount: -5.50, description: 'Coffee Shop' }),
      userProfile: JSON.stringify(userProfileData)
    }
  }
];


export const portfolioData = {
  totalValue: 250000,
  holdings: [
    { symbol: 'VOO', name: 'US Stocks', value: 100000, allocation: 40 },
    { symbol: 'BND', name: 'Bonds', value: 50000, allocation: 20 },
    { symbol: 'VXUS', name: 'Intl Stocks', value: 75000, allocation: 30 },
    { symbol: 'VNQ', name: 'Real Estate', value: 25000, allocation: 10 },
    { symbol: 'CASH', name: 'Cash', value: 0, allocation: 0 },
  ],
  recommendedAllocation: [
    { name: 'US Stocks', value: 45 },
    { name: 'Intl Stocks', value: 25 },
    { name: 'Bonds', value: 20 },
    { name: 'Real Estate', value: 5 },
    { name: 'Cash', value: 5 },
  ],
  performance: [
    { month: 'Jan', value: 220000 },
    { month: 'Feb', value: 225000 },
    { month: 'Mar', value: 235000 },
    { month: 'Apr', value: 230000 },
    { month: 'May', value: 245000 },
    { month: 'Jun', value: 250000 },
  ],
};
