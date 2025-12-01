import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import useStore, { StoreState } from '@/lib/store';
import type { Loan } from '@/types';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { Label } from '@/components/ui/label';

const loanAmounts: Record<string, number> = {
    '2025-2026': 166859,
    '2024-2025': 151960,
    '2023-2024': 137907,
    '2022-2023': 128889,
    '2021-2022': 126357,
    '2020-2021': 123519,
    '2019-2020': 121220,
    '2018-2019': 116369,
    '2017-2018': 111657,
    '2016-2017': 106549,
    '2015-2016': 100902,
    '2014-2015': 97850,
    '2013-2014': 94400,
    '2012-2013': 92500,
    '2011-2012': 90800,
    '2010-2011': 89000,
    '2009-2010': 87600,
    '2008-2009': 85000,
    '2007-2008': 82900,
    '2006-2007': 81400,
    '2005-2006': 80000,
    '2004-2005': 80000,
    '2003-2004': 80000,
    '2002-2003': 80000,
};

export default function StudentLoan() {
    const loans = useStore((s: StoreState) => s.data.loans);
    const addLoan = useStore((s: StoreState) => s.addLoan);
    const updateLoan = useStore((s: StoreState) => s.updateLoan);
    const deleteLoan = useStore((s: StoreState) => s.deleteLoan);

    function handleAdd() {
        addLoan();
    }

    function handleUpdate(index: number, patch: Partial<Loan>) {
        updateLoan(index, patch);
    }

    function handleDelete(index: number) {
        deleteLoan(index);
    }

    const totalLoanAmount = loans.reduce(
        (total, loan) => total + loan.loanAmount,
        0
    );

    const parseStartYear = (range: string) => Number(range.split('-')[0]);

    const sortedRanges = Object.entries(loanAmounts).sort((a, b) => {
        const ay = parseStartYear(a[0]);
        const by = parseStartYear(b[0]);
        return ay - by; // eldste -> nyeste
    });

    function handleAutoFill() {
        const selects = document.getElementsByTagName('select');
        const fromLabel =
            selects[selects.length - 2].selectedOptions[0].textContent!;
        const toLabel =
            selects[selects.length - 1].selectedOptions[0].textContent!;

        const fromYear = parseStartYear(fromLabel);
        const toYear = parseStartYear(toLabel);

        let total = 0;

        for (const [range, amount] of sortedRanges) {
            const year = parseStartYear(range);
            if (year >= fromYear && year <= toYear) {
                total += amount;
            }
        }

        const loanAmount = total * 0.6;

        handleAdd();
        handleUpdate(loans.length, {
            description: `Studielån ${loans.length + 1}`,
            loanAmount: loanAmount,
            interestRate: 4.698,
            termYears: 20,
            termsPerYear: 12,
            monthlyFee: 0,
        });
    }

    return (
        <section className='w-full my-8'>
            <div className='flex items-center justify-between mb-2'>
                <h2 className='text-xl font-semibold'>Studielån</h2>
                <Button variant='outline' size='sm' onClick={handleAdd}>
                    + Legg til lån
                </Button>
            </div>

            <p className='mt-2 mb-4 text-muted-foreground'>
                Legg inn informasjon om ditt studielån her. Du kan legge til
                flere lån dersom du har flere. Du kan også legge til andre typer
                lån her dersom du har det.
            </p>

            <div className='mt-2 mb-4 text-muted-foreground flex gap-2 justify-start align-center'>
                <p className='mt-1.5'>
                    Forhåndsutfyll lånebeløp basert på når du studerte:
                </p>

                <div className='flex justify-start gap-2'>
                    {/* FROM */}
                    <Label htmlFor='from-year' className='mt-2'>
                        Fra
                    </Label>
                    <NativeSelect name='from-year'>
                        {Object.entries(loanAmounts).map(([year, amount]) => (
                            <NativeSelectOption key={year} value={amount}>
                                {year}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>

                    {/* TO */}
                    <Label htmlFor='to-year' className='mt-2'>
                        Til
                    </Label>
                    <NativeSelect name='to-year'>
                        {Object.entries(loanAmounts).map(([year, amount]) => (
                            <NativeSelectOption key={year} value={amount}>
                                {year}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>

                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleAutoFill}
                    >
                        Sett lånebeløp
                    </Button>
                </div>
            </div>

            {loans.length !== 0 && (
                <div className='overflow-auto rounded-md border'>
                    <table className='w-full table-auto text-sm'>
                        <thead>
                            <tr className='text-left bg-muted'>
                                <th className='p-2'>Beskrivelse</th>
                                <th className='p-2'>Lånebeløp (kr)</th>
                                <th className='p-2'>Rente (%)</th>
                                <th className='p-2'>År</th>
                                <th className='p-2'>Betalinger/år</th>
                                <th className='p-2'>Månedsavgift</th>
                                <th className='w-12'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan, idx) => (
                                <tr key={idx} className='align-top'>
                                    <td className='p-2'>
                                        <Input
                                            type='text'
                                            value={loan.description}
                                            onChange={(e) =>
                                                handleUpdate(idx, {
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            value={loan.loanAmount}
                                            onChange={(e) =>
                                                handleUpdate(idx, {
                                                    loanAmount: Number(
                                                        e.target.value || 0
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            step='0.01'
                                            value={loan.interestRate}
                                            onChange={(e) =>
                                                handleUpdate(idx, {
                                                    interestRate: Number(
                                                        e.target.value || 0
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            value={loan.termYears}
                                            onChange={(e) =>
                                                handleUpdate(idx, {
                                                    termYears: Number(
                                                        e.target.value || 0
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            value={loan.termsPerYear}
                                            onChange={(e) =>
                                                handleUpdate(idx, {
                                                    termsPerYear: Number(
                                                        e.target.value || 0
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Input
                                            type='number'
                                            value={loan.monthlyFee ?? 0}
                                            onChange={(e) =>
                                                handleUpdate(idx, {
                                                    monthlyFee: Number(
                                                        e.target.value || 0
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td className='p-2'>
                                        <Button
                                            variant='outline'
                                            size='icon-sm'
                                            onClick={() => handleDelete(idx)}
                                            className='text-destructive border-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive'
                                        >
                                            <Trash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
