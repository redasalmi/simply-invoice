import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { v4 as uuidv4 } from 'uuid';

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
	w30: {
		width: '30%',
	},
	w40: {
		width: '40%',
	},
	w60: {
		width: '60%',
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
	pageNumber: {
		position: 'absolute',
		fontSize: 12,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: 'center',
		color: 'grey',
	},
});

export function PdfDocument() {
	const today = new Date();
	const invoiceDate = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(today);
	const invoiceId = `invoice-${uuidv4()}`;

	return (
		<Document>
			<Page style={styles.body}>
				<View style={styles.flexSection}>
					<View style={styles.w60}>
						<Text style={styles.title}>Invoice</Text>
						<Text style={styles.grayText}>{invoiceDate}</Text>
						<Text style={styles.grayText}>{invoiceId}</Text>
					</View>

					<View style={styles.w30}>// put logo or invoices dates here</View>
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
						<Text style={styles.subtitle}>Some Company</Text>
						<Text style={styles.text}>CRN: XXXXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>XXXXXXXXXXXXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>XXXXXXXXXXXXXX</Text>
						<Text style={styles.text}>VAT ID: XXXXXXXXXXXXXXXXXXXXX</Text>
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
