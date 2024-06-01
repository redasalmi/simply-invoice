import * as React from 'react';
import { cn } from '~/utils/shared.utils';

type Ref = HTMLButtonElement;
type Props = Omit<React.ComponentPropsWithRef<'button'>, 'name'> & {
	name: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
};

export const Switch = React.forwardRef<Ref, Props>(function Switch(
	{ className, name, checked, onCheckedChange, ...props },
	ref,
) {
	const inputRef = React.useRef<HTMLInputElement>(null!);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const element = event.currentTarget;
		const isChecked = element.getAttribute('aria-checked') === 'true';

		if (isChecked) {
			element.removeAttribute('aria-checked');
			inputRef.current.checked = false;
		} else {
			element.setAttribute('aria-checked', 'true');
			inputRef.current.checked = true;
		}

		if (onCheckedChange) {
			onCheckedChange(!isChecked);
		}
	};

	React.useEffect(() => {
		inputRef.current.checked = Boolean(checked);
	}, [checked]);

	return (
		<button
			ref={ref}
			role="switch"
			type="button"
			aria-checked={checked}
			className={cn(
				'group relative h-6 w-11 rounded-3xl bg-input outline-offset-2 aria-checked:bg-black',
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			<span className="absolute inset-[2px] h-5 w-5 rounded-3xl bg-white transition-all group-aria-checked:inset-x-[22px]" />
			<input
				ref={inputRef}
				name={name}
				type="checkbox"
				tabIndex={-1}
				aria-hidden
				defaultChecked={checked}
				className="hidden"
			/>
		</button>
	);
});
