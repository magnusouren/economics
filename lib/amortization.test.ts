import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { computeLoanAmortization } from './amortization';

const baseLoan = {
    description: 'Standard mortgage',
    loanAmount: 250_000,
    interestRate: 4.5,
    termYears: 5,
    termsPerYear: 12,
    monthlyFee: 30,
    startDate: '2024-01-01',
};

describe('computeLoanAmortization', () => {
    const schedule = computeLoanAmortization(baseLoan);

    it('produces a complete schedule with early months separated', () => {
        const expectedTerms = baseLoan.termYears * baseLoan.termsPerYear;
        assert.equal(schedule.monthly.length, expectedTerms);
        assert.equal(schedule.first12Months.length, Math.min(12, expectedTerms));

        const firstTerms = schedule.first12Months.map((row) => row.term);
        assert.deepEqual(
            firstTerms,
            Array.from({ length: schedule.first12Months.length }, (_, i) => i + 1)
        );
    });

    it('drives the balance to zero with totals matching monthly sums', () => {
        const lastRow = schedule.monthly.at(-1)!;
        assert.ok(Math.abs(lastRow.balance) < 0.01);

        const totals = schedule.monthly.reduce(
            (acc, row) => {
                acc.principal += row.principal;
                acc.interest += row.interest;
                acc.fees += row.fee;
                acc.paid += row.payment;
                return acc;
            },
            { principal: 0, interest: 0, fees: 0, paid: 0 }
        );

        assert.ok(Math.abs(schedule.totals.totalPrincipal - totals.principal) < 0.01);
        assert.ok(Math.abs(schedule.totals.totalInterest - totals.interest) < 0.01);
        assert.ok(Math.abs(schedule.totals.totalFees - totals.fees) < 0.01);
        assert.ok(Math.abs(schedule.totals.totalPaid - totals.paid) < 0.01);
    });

    it('aggregates years in a way that aligns with overall totals', () => {
        const yearly = schedule.yearGroups.reduce(
            (acc, year) => {
                acc.principal += year.totalPrincipal;
                acc.interest += year.totalInterest;
                acc.fees += year.totalFees;
                acc.paid += year.totalPaid;
                return acc;
            },
            { principal: 0, interest: 0, fees: 0, paid: 0 }
        );

        assert.ok(Math.abs(yearly.principal - schedule.totals.totalPrincipal) < 0.01);
        assert.ok(Math.abs(yearly.interest - schedule.totals.totalInterest) < 0.01);
        assert.ok(Math.abs(yearly.fees - schedule.totals.totalFees) < 0.01);
        assert.ok(Math.abs(yearly.paid - schedule.totals.totalPaid) < 0.01);
    });
});
