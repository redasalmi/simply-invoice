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
				'relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=checked]:bg-black focus:shadow-[0_0_0_2px] focus:shadow-black',
				className,
			)}
			{...props}
		>
			<RadixSwitch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
		</RadixSwitch.Root>
	);
});
