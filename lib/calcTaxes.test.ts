import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { EconomyData } from '@/types';
import { computeLoanAmortization } from './amortization';
import { calculateAnnualTaxes } from './calcTaxes';

const housingLoan = {
    description: 'Starter home',
    loanAmount: 320_000,
    interestRate: 3.6,
    termYears: 10,
    termsPerYear: 12,
    monthlyFee: 25,
    startDate: '2024-01-01',
    capital: 50_000,
};

const carLoan = {
    description: 'Car loan',
    loanAmount: 60_000,
    interestRate: 6.5,
    termYears: 5,
    termsPerYear: 12,
    monthlyFee: 0,
    startDate: '2024-01-01',
};

const economy: EconomyData = {
    incomes: [
        { source: 'Salary', amount: 620_000 },
        { source: 'Bonus', amount: 35_000 },
        { source: 'Child support', amount: 24_000, taxFree: true },
    ],
    housingLoans: [housingLoan],
    loans: [carLoan],
    fixedExpenses: [],
    livingCosts: [],
};

describe('calculateAnnualTaxes', () => {
    const result = calculateAnnualTaxes(economy);

    it('computes gross income and deductions from loans', () => {
        assert.equal(result.totalIncome, 655_000);

        const housingInterest = computeLoanAmortization(housingLoan).monthly
            .slice(0, 12)
            .reduce((sum, row) => sum + row.interest, 0);
        const carInterest = computeLoanAmortization(carLoan).monthly
            .slice(0, 12)
            .reduce((sum, row) => sum + row.interest, 0);

        const expectedInterest = housingInterest + carInterest;
        const expectedMinstefradrag = Math.min(result.totalIncome * 0.46, 92_000);
        const expectedTotalDeductions = expectedMinstefradrag + expectedInterest * 0.22;

        assert.ok(Math.abs(result.totalPaidInterest - expectedInterest) < 0.01);
        assert.ok(Math.abs(result.totalDeductions - expectedTotalDeductions) < 0.01);
    });

    it('returns reasonable effective rates and net values', () => {
        assert.ok(result.effectiveTaxRate > 0);
        assert.ok(result.netAnnualIncome > 0);
        assert.ok(result.netMonthlyIncome > 0);
    });
});
