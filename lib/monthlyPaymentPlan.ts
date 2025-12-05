import { EconomyData } from '@/types';
import { calculateAnnualTaxes } from './calcTaxes';

export const generatePaymentPlan = (
    data: EconomyData,
    salaryAnnualGrowth: number,
    startDate: string,
    years = 30
) => {
    const incomes = data.incomes;
    const housingLoans = data.housingLoans;
    const loans = [...housingLoans, ...data.loans];
    const fixed = data.fixedExpenses;
    const living = data.livingCosts;

    // Fixed monthly costs
    const baseFixedCosts =
        fixed.reduce((sum, f) => sum + f.amount, 0) +
        living.reduce((sum, l) => sum + l.amount, 0);

    // Start range
    const start = new Date(startDate);
    start.setDate(1);
    const totalMonths = years * 12;

    // Prepare loan amortization trackers
    const loanStates = loans.map((loan) => {
        const startDate = new Date(loan.startDate);
        const totalTerms = loan.termYears * loan.termsPerYear;
        const termRate = loan.interestRate / 100 / loan.termsPerYear;

        const monthlyPayment =
            (loan.loanAmount * termRate) /
                (1 - Math.pow(1 + termRate, -totalTerms)) +
            (loan.monthlyFee ?? 0);

        return {
            loan,
            startDate,
            remaining: loan.loanAmount,
            monthlyPayment,
            termRate,
        };
    });

    // Annual taxable & tax-free income
    let annualTaxableIncome = incomes
        .filter((i) => !i.taxFree)
        .reduce((sum, i) => sum + i.amount, 0);

    const annualTaxFreeIncome = incomes
        .filter((i) => i.taxFree)
        .reduce((sum, i) => sum + i.amount, 0);

    const rows = [];

    for (let i = 0; i < totalMonths; i++) {
        const date = new Date(start);
        date.setMonth(start.getMonth() + i);
        const monthIndex = date.getMonth();

        const monthStr = date.toLocaleDateString('no-NO', {
            year: 'numeric',
            month: 'short',
        });

        // Salary raise in August (monthIndex === 7)
        if (monthIndex === 7 && i !== 0) {
            annualTaxableIncome *= 1 + salaryAnnualGrowth / 100;
        }

        // Compute tax ONLY on taxable income
        const taxResult = calculateAnnualTaxes({
            ...data,
            incomes: [
                {
                    source: 'Taxable Income',
                    amount: annualTaxableIncome,
                },
            ],
        });

        // Net monthly income after tax
        const monthlyTaxedIncome = taxResult.netMonthlyIncome;

        // Add tax-free monthly income
        const monthlyTaxFreeIncome = annualTaxFreeIncome / 12;

        const monthlyIncome = monthlyTaxedIncome + monthlyTaxFreeIncome;

        let totalInterest = 0;
        let totalPrincipal = 0;
        let housingPrincipal = 0;

        loanStates.forEach((ls) => {
            if (date < ls.startDate || ls.remaining <= 0) return;

            const interest = ls.remaining * ls.termRate;
            const principal = Math.min(
                ls.monthlyPayment - interest,
                ls.remaining
            );

            ls.remaining -= principal;

            totalInterest += interest;
            totalPrincipal += principal;

            // Housing principal = equity growth
            if ('capital' in ls.loan) {
                housingPrincipal += principal;
            }
        });

        const loanCosts = totalInterest + totalPrincipal;
        const totalExpenses = baseFixedCosts + loanCosts;
        const balance = monthlyIncome - totalExpenses;

        rows.push({
            month: monthStr,
            income: Math.round(monthlyIncome),
            expenses: Math.round(totalExpenses),
            balance: Math.round(balance),
            totalInterest: Math.round(totalInterest),
            totalPrincipal: Math.round(totalPrincipal),
            balancePlusPrincipal: Math.round(balance + housingPrincipal),
        });
    }

    return rows;
};
