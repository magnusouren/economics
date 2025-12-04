import { HousingLoan } from '@/types';

export function loanPaymentPlan(
    loan: HousingLoan,
    priceIncrease: number, // annual %
    yearsToShow: number
) {
    const {
        loanAmount,
        interestRate,
        termYears,
        termsPerYear,
        monthlyFee = 0,
        startDate,
    } = loan;

    const totalPayments = termYears * termsPerYear;
    const maxPaymentsToShow = Math.min(
        yearsToShow * termsPerYear,
        totalPayments
    );

    const ratePerTerm = interestRate / 100 / termsPerYear;

    // --- Annuitetsbeløp (fixed payment per term) ---
    const annuityPayment =
        (loanAmount * ratePerTerm) /
            (1 - Math.pow(1 + ratePerTerm, -totalPayments)) +
        monthlyFee;

    let remainingDebt = loanAmount;

    // Parse start date
    const start = new Date(startDate);
    const entries: {
        monthYear: string;
        remainingDebt: number;
        housingValue: number;
        equity: number;
    }[] = [];

    // Start housing value = loan + kapital
    let housingValue = loan.loanAmount + loan.capital;

    for (let i = 0; i < maxPaymentsToShow; i++) {
        // --- Month-year formatting ---
        const currentDate = new Date(start);
        currentDate.setMonth(start.getMonth() + i);
        const monthYear = currentDate.toLocaleString('no-NO', {
            month: 'short',
            year: 'numeric',
        });

        // --- Calculate interest + principal ---
        const interest = remainingDebt * ratePerTerm;
        const principal = annuityPayment - interest;

        // Stop going negative on last payments
        if (principal >= remainingDebt) {
            remainingDebt = 0;
        } else {
            remainingDebt -= principal;
        }

        // --- Housing price growth (monthly) ---
        const monthlyGrowthRate = Math.pow(1 + priceIncrease / 100, 1 / 12);
        housingValue *= monthlyGrowthRate;

        const equity = housingValue - remainingDebt;

        entries.push({
            monthYear,
            remainingDebt: Math.round(remainingDebt),
            housingValue: Math.round(housingValue),
            equity: Math.round(equity),
        });

        // If the loan is paid off early, we stop
        if (remainingDebt <= 0) break;
    }

    return entries;
}
