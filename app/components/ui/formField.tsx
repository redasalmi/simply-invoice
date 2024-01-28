import * as React from 'react';
import { Grip, Trash2 } from 'lucide-react';

import {
	Label,
	Input,
	Button,
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	Switch,
} from '~/components/ui';
import { cn } from '~/lib/utils';

import { type Field } from '~/types';

type FormFieldProps = {
	field: Field;
	className?: string;
	onFieldChange: (field: Field) => void;
	removeField: () => void;
};

const hideTitleText = 'Hide title in invoice';
const showTitleText = 'Show title in invoice';
const deleteFieldText = 'Delete field';
const dragFieldText = 'Drag to move field';

export function FormField({
	field,
	className,
	onFieldChange,
	removeField,
}: FormFieldProps) {
	const id = React.useId();
	const { key, name, label, value, showTitle } = field;

	const inputName = `${name.replaceAll(' ', '-')}[]`;
	const switchTooltip = showTitle ? hideTitleText : showTitleText;

	const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
		onFieldChange({
			key,
			name,
			label,
			value: event.currentTarget.value,
			showTitle,
		});
	};

	const handleSwitchChange = (show: boolean) => {
		onFieldChange({
			key,
			name,
			label,
			value,
			showTitle: show,
		});
	};

	return (
		<div className={cn(className)}>
			<Label htmlFor={id} className="mb-1 block">
				{label}
			</Label>
			<div className="flex gap-2">
				<Input
					id={id}
					autoComplete="off"
					name={inputName}
					value={value}
					onChange={handleInputChange}
					className="mr-4"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center">
								<Switch
									name={inputName}
									checked={showTitle}
									aria-label={switchTooltip}
									onCheckedChange={handleSwitchChange}
								/>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>{switchTooltip}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								aria-label={dragFieldText}
								className="px-2"
							>
								<Grip />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{dragFieldText}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								aria-label={deleteFieldText}
								className="p-0"
								onClick={removeField}
							>
								<Trash2 />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{deleteFieldText}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
