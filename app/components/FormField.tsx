import * as React from 'react';

import { Grip, Trash2 } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip';

import type { CustomField, Field } from '~/lib/types';
import { cn } from '~/lib/utils';

type UncontrolledFormField = {
	formField: Field;
	className?: string;
};

export function UncontrolledFormField({
	formField,
	className,
}: UncontrolledFormField) {
	const id = React.useId();
	const { name, label, error } = formField;
	const inputName = `${name.replaceAll(' ', '-')}`;

	return (
		<div className={cn(className)}>
			<Label htmlFor={id} className="mb-1 block">
				{label} {error ? <span className="text-red-500">({error})</span> : null}
			</Label>
			<div>
				<Input
					id={id}
					autoComplete="off"
					name={inputName}
					variant={error ? 'error' : 'default'}
					{...formField.input}
				/>
			</div>
		</div>
	);
}

type FormFieldProps = {
	formField: CustomField;
	className?: string;
	onFormFieldChange: (field: CustomField) => void;
	removeFormField: () => void;
};

const hideLabelText = 'Hide label in invoice';
const showLabelText = 'Show label in invoice';
const deleteFieldText = 'Delete field';
const dragFieldText = 'Drag to move field';

export function FormField({
	formField,
	className,
	onFormFieldChange,
	removeFormField,
}: FormFieldProps) {
	const labelId = React.useId();
	const contentId = React.useId();
	const { id, label, content, showLabel } = formField;

	const switchTooltip = showLabel ? hideLabelText : showLabelText;

	const handleLabelChange = (event: React.FormEvent<HTMLInputElement>) => {
		onFormFieldChange({
			id,
			label: event.currentTarget.value,
			content,
			showLabel,
		});
	};

	const handleContentChange = (event: React.FormEvent<HTMLInputElement>) => {
		onFormFieldChange({
			id,
			label,
			content: event.currentTarget.value,
			showLabel,
		});
	};

	const handleSwitchChange = (show: boolean) => {
		onFormFieldChange({
			id,
			label,
			content,
			showLabel: show,
		});
	};

	return (
		<div className={cn(className, 'flex items-center gap-2')}>
			<div className="flex-1">
				<Label htmlFor={labelId} className="mb-1 block">
					Label *{' '}
					{formField.labelError ? (
						<span className="text-red-500">({formField.labelError})</span>
					) : null}
				</Label>
				<Input
					required
					id={labelId}
					autoComplete="off"
					name={`custom-label-${id}`}
					value={label}
					onChange={handleLabelChange}
					variant={formField.labelError ? 'error' : 'default'}
				/>
			</div>

			<div className="flex-1">
				<Label htmlFor={contentId} className="mb-1 block">
					Content *{' '}
					{formField.contentError ? (
						<span className="text-red-500">({formField.contentError})</span>
					) : null}
				</Label>
				<Input
					required
					id={contentId}
					autoComplete="off"
					name={`custom-content-${id}`}
					value={content}
					onChange={handleContentChange}
					className="mr-4"
					variant={formField.contentError ? 'error' : 'default'}
				/>
			</div>

			<div className="mt-auto flex">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center">
								<Switch
									name={`custom-show-label-${id}`}
									checked={showLabel}
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
								onClick={removeFormField}
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
