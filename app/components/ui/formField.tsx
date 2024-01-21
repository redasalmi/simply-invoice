import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

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
	fieldIndex: number;
	className?: string;
	moveField: (dragIndex: number, hoverIndex: number) => void;
	onFieldChange: (field: Field) => void;
	removeField: () => void;
};

const hideTitleText = 'Hide title in invoice';
const showTitleText = 'Show title in invoice';
const deleteFieldText = 'Delete field';

export function FormField({
	field,
	fieldIndex,
	className,
	moveField,
	onFieldChange,
	removeField,
}: FormFieldProps) {
	const id = React.useId();
	const containerRef = React.useRef<HTMLDivElement>(null);
	const { key, name, label, value, showTitle } = field;

	const inputName = `${name.replaceAll(' ', '-')}[]`;
	const switchTooltip = showTitle ? hideTitleText : showTitleText;

	const [{ handlerId }, drop] = useDrop<
		{ fieldIndex: number },
		void,
		{ handlerId: string | symbol | null }
	>({
		accept: 'FormField',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		hover(item, monitor) {
			if (!containerRef.current) {
				return;
			}

			const dragIndex = item.fieldIndex;
			const hoverIndex = fieldIndex;

			if (dragIndex === hoverIndex) {
				return;
			}

			const hoverBoundingRect = containerRef.current?.getBoundingClientRect();

			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			const clientOffset = monitor.getClientOffset();
			const hoverClientY = clientOffset?.y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			moveField(dragIndex, hoverIndex);
			item.fieldIndex = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: 'FormField',
		item: () => {
			return {
				fieldIndex,
			};
		},
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	drag(drop(containerRef));

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
		<div
			ref={containerRef}
			className={cn(className, isDragging ? 'opacity-0' : 'opacity-100')}
			data-handler-id={handlerId}
		>
			<Label htmlFor={id} className="mb-1 block">
				{label}
			</Label>
			<div className="flex gap-2">
				<Input
					id={id}
					autoComplete="off"
					name={inputName}
					value={value}
					onChange={(event) => handleInputChange(event)}
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="ml-6 flex items-center justify-center">
								<Switch
									name={inputName}
									checked={showTitle}
									aria-label={switchTooltip}
									onCheckedChange={(show) => handleSwitchChange(show)}
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
								aria-label={deleteFieldText}
								className="px-4 py-2"
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
