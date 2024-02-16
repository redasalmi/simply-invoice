import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';

import type { Customer } from '~/lib/types';
import { capitalize } from '~/lib/utils';

const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
	},
	flexSection: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 24,
	},
	subtitle: {
		fontSize: 16,
	},
	grayText: {
		fontSize: 12,
		color: 'gray',
	},
	text: {
		fontSize: 12,
		marginVertical: 1,
	},
	billInfo: {
		marginTop: 24,
	},
	billDetail: {
		marginTop: 24,
	},

	table: {
		display: 'flex',
		width: 'auto',
		borderStyle: 'solid',
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	tableRow: {
		margin: 'auto',
		flexDirection: 'row',
	},
	tableCol: {
		width: '25%',
		borderStyle: 'solid',
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableCell: {
		marginHorizontal: 'auto',
		marginVertical: 5,
		fontSize: 12,
	},
	tableCellLeft: {
		marginHorizontal: 8,
	},

	pageNumber: {
		position: 'absolute',
		fontSize: 12,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: 'center',
		color: 'grey',
	},

	w5: {
		width: '5%',
	},
	w15: {
		width: '15%',
	},
	w10: {
		width: '10%',
	},
	w30: {
		width: '30%',
	},
	w40: {
		width: '40%',
	},
	w60: {
		width: '60%',
	},
});

type InvoicePdfProps = {
	data: {
		customer: Customer;
	};
};

export function InvoicePdf({ data }: InvoicePdfProps) {
	const { customer } = data;

	const today = new Date();
	const invoiceDate = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(today);
	const invoiceId = `invoice-${nanoid()}`;

	return (
		<Document>
			<Page style={styles.body}>
				<View style={styles.flexSection}>
					<View style={styles.w60}>
						<Text style={styles.title}>Invoice</Text>
						<Text style={styles.grayText}>{invoiceDate}</Text>
						<Text style={styles.grayText}>{invoiceId}</Text>
					</View>

					<View style={styles.w30}>
						<Text>put company logo here if available</Text>
					</View>
				</View>

				<View style={[styles.flexSection, styles.billInfo]}>
					<View style={styles.w40}>
						<Text style={styles.text}>Billed by</Text>
						<Text style={styles.subtitle}>Reda Codes</Text>
						<Text style={styles.text}>CRN: XXXXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>XXXXXXXXXXXXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>XXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>VAT ID: XXXXXXXXXXXXXXXXXXXXX</Text>
					</View>

					<View style={styles.w40}>
						<Text style={styles.text}>Billed to</Text>
						<Text style={styles.text}>{customer.name}</Text>
						<Text style={styles.text}>{customer.email}</Text>
						{customer.custom.map(({ label, value, showLabel }) => (
							<Text key={nanoid()} style={styles.text}>
								{showLabel ? `${capitalize(label)}: ${value}` : value}
							</Text>
						))}
					</View>
				</View>

				<View style={styles.billDetail}>
					<View style={styles.table}>
						<View style={styles.tableRow}>
							<View style={[styles.tableCol, styles.w5]}>
								<Text style={styles.tableCell}>#</Text>
							</View>
							<View style={[styles.tableCol, styles.w60]}>
								<Text style={[styles.tableCell, styles.tableCellLeft]}>
									Item & Description
								</Text>
							</View>
							<View style={[styles.tableCol, styles.w15]}>
								<Text style={styles.tableCell}>Quantity</Text>
							</View>
							<View style={[styles.tableCol, styles.w10]}>
								<Text style={styles.tableCell}>Rate</Text>
							</View>
							<View style={[styles.tableCol, styles.w10]}>
								<Text style={styles.tableCell}>Amount</Text>
							</View>
						</View>

						<View style={styles.tableRow}>
							<View style={[styles.tableCol, styles.w5]}>
								<Text style={styles.tableCell}>1</Text>
							</View>
							<View style={[styles.tableCol, styles.w60]}>
								<Text style={[styles.tableCell, styles.tableCellLeft]}>
									Programming services related to software development
								</Text>
							</View>
							<View style={[styles.tableCol, styles.w15]}>
								<Text style={styles.tableCell}>1</Text>
							</View>
							<View style={[styles.tableCol, styles.w10]}>
								<Text style={styles.tableCell}>2750</Text>
							</View>
							<View style={[styles.tableCol, styles.w10]}>
								<Text style={styles.tableCell}>2750</Text>
							</View>
						</View>
					</View>
				</View>

				<Text
					fixed
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) =>
						pageNumber > 1 ? `${pageNumber} / ${totalPages}` : null
					}
				/>
			</Page>
		</Document>
	);
}
