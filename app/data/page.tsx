'use client';

import { TypographyH1 } from '@/components/typography/typographyH1';
import { TypographyP } from '@/components/typography/typographyP';
import FixedExpenses from '@/views/fixedExpenses';
import HousingLoan from '@/views/housingLoan';
import Incomes from '@/views/incomes';
import LivingExpenses from '@/views/livingExpenses';
import StudentLoan from '@/views/loans';
import Summary from '@/views/summary';

export default function Data() {
    return (
        <>
            <div className='container my-8 min-h-24'>
                <TypographyH1>Grunnlagsdata</TypographyH1>
                <TypographyP>
                    Her legger du inn all din økonomiske data for å få en
                    oversikt over din økonomi på tvers av de ulike sidene som du
                    finner her. Alt av data blir lagret lokalt i din nettleser,
                    og blir ikke delt med noen andre.
                </TypographyP>
            </div>

            <section className='container'>
                <Incomes />
                <HousingLoan />
                <StudentLoan />
                <FixedExpenses />
                <LivingExpenses />
                <Summary />
            </section>
        </>
    );
}
