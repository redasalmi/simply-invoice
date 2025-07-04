import type {
	Address,
	AddressCreateFlatErrors,
	AddressUpdateFlatErrors,
} from "~/types";
import { FormField } from "./ui/form-field";

interface AddressFormProps {
	address?: Address;
	errors?: AddressUpdateFlatErrors | AddressCreateFlatErrors;
}

export function AddressForm({ address, errors }: AddressFormProps) {
	return (
		<>
			<input
				name="address.addressId"
				type="hidden"
				value={address?.addressId}
			/>

			<FormField errors={errors?.nested?.address1}>
				<FormField.Label>Address 1</FormField.Label>
				<FormField.Input
					defaultValue={address?.address1}
					name="address.address1"
					type="text"
				/>
				<FormField.ErrorMessage />
			</FormField>

			<FormField errors={errors?.nested?.address2}>
				<FormField.Label>Address 2</FormField.Label>
				<FormField.Input
					defaultValue={address?.address2 ?? ""}
					name="address.address2"
					type="text"
				/>
				<FormField.ErrorMessage />
			</FormField>

			<FormField errors={errors?.nested?.city}>
				<FormField.Label>City</FormField.Label>
				<FormField.Input
					defaultValue={address?.city}
					name="address.city"
					type="text"
				/>
				<FormField.ErrorMessage />
			</FormField>

			<FormField errors={errors?.nested?.country}>
				<FormField.Label>Country</FormField.Label>
				<FormField.Input
					defaultValue={address?.country}
					name="address.country"
					type="text"
				/>
				<FormField.ErrorMessage />
			</FormField>

			<FormField errors={errors?.nested?.province}>
				<FormField.Label>Province</FormField.Label>
				<FormField.Input
					defaultValue={address?.province ?? ""}
					name="address.province"
					type="text"
				/>
				<FormField.ErrorMessage />
			</FormField>

			<FormField errors={errors?.nested?.zip}>
				<FormField.Label>Zip</FormField.Label>
				<FormField.Input
					defaultValue={address?.zip}
					name="address.zip"
					type="text"
				/>
				<FormField.ErrorMessage />
			</FormField>
		</>
	);
}
