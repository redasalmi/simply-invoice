import * as React from 'react';

import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover';

import { useClickAway } from '~/hooks/useClickAway';
import { useKeyPress } from '~/hooks/useKeyPress';

import { cn, dateFormatter } from '~/lib/utils';

type DatePickerProps = {
	inputName?: string;
};

export function DatePicker({ inputName }: DatePickerProps) {
	const datePickerRef = React.useRef<HTMLDivElement>(null);

	const [open, setIsOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date>();

	useClickAway(datePickerRef, () => setIsOpen(false));
	useKeyPress('Escape', () => setIsOpen(false));

	const updateDate = (newDate?: Date) => {
		if (newDate) {
			setDate(newDate);
			setIsOpen(false);
		}
	};

	return (
		<div ref={datePickerRef}>
			<Popover open={open}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						onClick={() => setIsOpen(true)}
						variant={'outline'}
						className={cn(
							'w-[280px] justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}
					>
						{date ? (
							<input
								type="date"
								hidden
								readOnly
								name={inputName}
								value={dateFormatter('en-US', {
									month: '2-digit',
									day: '2-digit',
									year: 'numeric',
								}).format(date)}
							/>
						) : null}
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? (
							dateFormatter('en-US').format(date)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={updateDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
