const mongoose = require('mongoose');
const { Schema } = mongoose;

const companyReportSchema = new Schema({
    companyName: String,
    "Profit & Loss": [
        {
            "Report Date": [String]
        },
        {
            "Sales": [Number]
        },
        {
            "Raw Material Cost": [Number],
        },
    ],
}, { collection: 'companyReports' });

module.exports = companyReportSchema;