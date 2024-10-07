import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '~/utils/shared.utils';

export const Switch = React.forwardRef<
	HTMLButtonElement,
	RadixSwitch.SwitchProps
>(function Switch({ className, ...props }, ref) {
	return (
		<RadixSwitch.Root
			ref={ref}
			className={cn(
				'bg-blackA6 shadow-blackA4 relative h-[25px] w-[42px] cursor-pointer rounded-full shadow-[0_2px_10px] outline-none focus:ring-4 focus:ring-blue-300 focus:outline-none data-[state=checked]:bg-blue-700',
				className,
			)}
			{...props}
		>
			<RadixSwitch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
		</RadixSwitch.Root>
	);
});
