'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface DatepickerProps {
    label?: string;
    dateValue?: Date;
    setDateValue: (date: Date) => void;
}

export function Datepicker({
    label,
    dateValue,
    setDateValue,
}: DatepickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className='grid w-full gap-1.5'>
            {label && (
                <Label htmlFor='date' className='px-1'>
                    {label}
                </Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        id='date'
                        className='justify-between font-normal'
                    >
                        {dateValue
                            ? dateValue.toLocaleDateString()
                            : 'Select date'}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className='w-auto overflow-hidden p-0'
                    align='start'
                >
                    {/* TODO - Fix bug with date off by one day and timezones */}
                    <Calendar
                        mode='single'
                        selected={dateValue}
                        defaultMonth={dateValue}
                        captionLayout='dropdown'
                        endMonth={new Date('2099/12')}
                        onSelect={(date) => {
                            if (date) {
                                const adjustedDate = new Date(date);
                                adjustedDate.setDate(
                                    adjustedDate.getDate() + 1
                                );
                                setDateValue(adjustedDate);
                            }
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
