import * as React from 'react';
import { Trash2 } from 'lucide-react';

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

type FormFieldProps = {
	label: string;
	name: string;
	defaultValue?: string | number | readonly string[];
	type?: React.HTMLInputTypeAttribute;
	className?: string;
};

const hideTitleText = 'Hide title in invoice';
const showTitleText = 'Show title in invoice';
const deleteFieldText = 'Delete field';

export function FormField({
	label,
	name,
	defaultValue,
	type,
	className,
}: FormFieldProps) {
	const id = React.useId();
	const fieldRef = React.useRef<HTMLDivElement>(null!);
	const [showTitle, setShowTitle] = React.useState(false);

	const inputName = `${name.replaceAll(' ', '-')}[]`;
	const switchTooltip = showTitle ? hideTitleText : showTitleText;

	return (
		<div ref={fieldRef} className={className}>
			<Label htmlFor={id} className="mb-1 block">
				{label}
			</Label>
			<div className="flex gap-2">
				<Input
					id={id}
					type={type}
					autoComplete="off"
					name={inputName}
					defaultValue={defaultValue}
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="ml-6 flex items-center justify-center">
								<Switch
									name={inputName}
									defaultChecked={showTitle}
									aria-label={switchTooltip}
									onCheckedChange={(show) => setShowTitle(show)}
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
								onClick={() => fieldRef.current.remove()}
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
