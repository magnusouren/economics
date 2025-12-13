import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { EconomyData } from '@/types';
import { computeLoanAmortization } from './amortization';
import { generatePaymentPlan } from './monthlyPaymentPlan';

const housingLoan = {
    description: 'Condo loan',
    loanAmount: 400_000,
    interestRate: 3.2,
    termYears: 8,
    termsPerYear: 12,
    monthlyFee: 15,
    startDate: '2024-01-01',
    capital: 80_000,
};

const studentLoan = {
    description: 'Student loan',
    loanAmount: 120_000,
    interestRate: 2.5,
    termYears: 10,
    termsPerYear: 12,
    monthlyFee: 0,
    startDate: '2024-01-01',
};

const economy: EconomyData = {
    incomes: [
        { source: 'Salary', amount: 540_000 },
        { source: 'Freelance', amount: 60_000 },
    ],
    housingLoans: [housingLoan],
    loans: [studentLoan],
    fixedExpenses: [
        { description: 'Utilities', amount: 3_200, category: 'housing' },
        { description: 'Insurance', amount: 1_100, category: 'personal' },
    ],
    livingCosts: [
        { description: 'Groceries', amount: 4_500 },
        { description: 'Transport', amount: 1_000 },
    ],
};

describe('generatePaymentPlan', () => {
    const plan = generatePaymentPlan(economy, 3, '2024-01-01', 1);
    const baseFixedCosts = economy.fixedExpenses.reduce((s, e) => s + e.amount, 0) +
        economy.livingCosts.reduce((s, c) => s + c.amount, 0);

    it('creates a one-year projection with monthly balances', () => {
        assert.equal(plan.length, 12);
        assert.ok(plan[0].month.includes('2024'));
        assert.ok(plan.every((row) => row.expenses >= baseFixedCosts));
    });

    it('applies salary growth and accounts for housing principal', () => {
        const augustIncome = plan[7].income;
        const julyIncome = plan[6].income;
        assert.ok(augustIncome > julyIncome);

        const principalContribution = plan[0].balancePlusPrincipal - plan[0].balance;
        assert.ok(principalContribution >= 0);
    });

    it('keeps balances in a reasonable range compared to income', () => {
        const highestIncome = Math.max(...plan.map((row) => row.income));
        const lowestBalance = Math.min(...plan.map((row) => row.balance));
        assert.ok(lowestBalance > -highestIncome); // avoid runaway debt within the year
    });
});
