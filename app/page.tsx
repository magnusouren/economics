'use client';

// top-level page — views import UI components themselves and read the store
import FixedExpenses from '@/views/fixedExpensen';
import HousingLoan from '@/views/housingLoan';
import Incomes from '@/views/incomes';
import LivingExpenses from '@/views/livingExpenses';
import StudentLoan from '@/views/studentLoan';
import Summary from '@/views/summary';
import Taxes from '@/views/taxes';

export default function Home() {
    return (
        <>
            <div className='flex flex-col w-full m-auto justify-center mt-2'>
                <p className='max-w-3xl'>
                    En enkel økonomikalkulator for å få oversikt over din
                    personlige økonomi. Den hjelper deg å beregne inntekter,
                    utgifter, lån og skatter for å få en bedre forståelse av din
                    økonomiske situasjon og muligheter.
                </p>
            </div>
            <section className='mt-8'>
                <Incomes />
                <HousingLoan />
                <StudentLoan />
                <FixedExpenses />
                <LivingExpenses />
                <Taxes />
                <Summary />
            </section>
        </>
    );
}
