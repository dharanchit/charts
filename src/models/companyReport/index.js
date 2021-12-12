const mongoose = require('mongoose');
const { Schema } = mongoose;

const PLSchema = new Schema({
    'Report Date': [Date],
    'Sales': [Number],
    'Raw Material Cost': [Number],
    'Change in Inventory': [Number],
    'Power and Fuel': [Number],
    'Other Mfr. Exp': [Number],
    'Employee Cost': [Number],
    'Selling and admin': [Number],
    'Other Expenses': [Number],
    "Other Income": [Number],
    'Depreciation': [Number],
    'Interest': [Number],
    'Profit before tax': [Number],
    'Tax': [Number],
    'Net profit': [Number],
    'Dividend Amount': [Number]
});

const QuatersSchema = new Schema({
    'Report Date': [Date],
    'Sales': [Number],
    'Expenses': [Number],
    'Other Income': [Number],
    'Depreciation': [Number],
    'Interest': [Number],
    'Profit before tax': [Number],
    'Tax': [Number],
    'Net profit': [Number],
    'Operating Profit': [Number]
});

const BalanceSheetSchema = new Schema({
    'Report Date': [Date],
    'Equity Share Capital': [Number],
    'Reserves': [Number],
    'Borrowings': [Number],
    'Other Liabilities': [Number],
    'Total': [Number],
    'Net Block': [Number],
    'Capital Work in Progress': [Number],
    'Investments': [Number],
    'Other Assets': [Number],
    'Receivables': [Number],
    'Inventory': [Number],
    'Cash & Bank': [Number],
    'No. of Equity Shares': [Number],
    'New Bonus Shares': [Number],
    'Face value': [Number],
});

const CashFlowSchema = new Schema({
    'Report Date': [Date],
    'Cash from Operating Activity': [Number],
    'Cash from Investing Activity': [Number],
    'Cash from Financing Activity': [Number],
    'Net Cash Flow': [Number],
    'PRICE:': [Number]
});

const CompanyReportSchema = new Schema({
    companyName: { type: String, required: [true, "Company Name is required"] },
    companyCode: { type: String, required: [true, "Company Code is required"], unique: true },
    'PROFIT & LOSS': PLSchema,
    'Quarters': QuatersSchema,
    'BALANCE SHEET': BalanceSheetSchema,
    'CASH FLOW:': CashFlowSchema,
    'DERIVED:': { "Adjusted Equity Shares in Cr": [Number] }
});

CompanyReportSchema.path('companyCode').validate((companyCode, respond) => {
    CompanyReportModel.findOne({ companyCode }).then((user) => respond(user ? true : false)).catch(() => respond(false), 'Company Code is already defined');
});

const CompanyReportModel = mongoose.model('CompanyReport', CompanyReportSchema);

module.exports = CompanyReportModel;