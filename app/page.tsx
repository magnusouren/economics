'use client';

import { Separator } from '@/components/ui/separator';
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
            <div className='w-full m-auto justify-center mt-4'>
                <h1 className='text-2xl font-bold'>Om siden:</h1>
                <p className='text-pretty mt-2 mb-4 '>
                    En økonomikalkulator for å få oversikt over din personlige
                    økonomi. Den hjelper deg å beregne inntekter, utgifter, lån
                    og skatter for å få en bedre forståelse av din økonomiske
                    situasjon og muligheter. Begynn med å legge inn dine
                    inntekter og utgifter i seksjonene under. Ved å legge til
                    boliglån og studielån kan du få en mer nøyaktig oversikt
                    over din totale økonomi. Skatteberegningene tar utgangspunkt
                    i skattesatsene høsten 2025 og kan avvike noe fra faktiske
                    tall. Dette er kun ment som en veiledning.
                </p>
                <p className='text-pretty mb-4 bg-accent p-4 rounded-md border border-accent/50'>
                    <strong>NB:</strong> Siden er for tiden under utvikling og
                    det kan forekomme feil og mangler.
                </p>
            </div>
            <section className='mt-24'>
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
