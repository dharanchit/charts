const fs = require('fs');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const companyReportSchema = require('../../models/companyReport/index');

const CompanyReport = mongoose.model('companyReports', companyReportSchema);

const refactorData = (data) => {
    const values = data.map((item) => Object.values(item));
    const filteredValues = values.slice(7,);
    let key = "";
    const resultArr = filteredValues.map((item) => {
        if (item.length === 1) {
            key = item[0];
        } else {
            return { [key]: { [Object.values(item)[0]]: [...item.slice(1,)] } }
        }
    });
    return resultArr.filter((item) => item);
}

const clubValuesWithCommonKeys = (data, companyName) => {
    let dict = {};
    data.forEach((item) => {
        let itemKey = Object.keys(item)[0];
        if (Object.keys(dict).includes(itemKey)) {
            dict[itemKey] = [...dict[itemKey], ...Object.values(item)];
        } else {
            dict[itemKey] = [...Object.values(item)];
        }
    });
    dict["companyName"] = companyName;
    return dict;
}

const pushToDb = async (data) => {
    try {
        await CompanyReport({ ...data }).save();
        return true;
    } catch (err) {
        return false;
    }
}

const uploadStocksResult = async (req, res) => {
    try {
        const { companyName } = req.body;
        const uploadedReport = req.file;
        const wb = xlsx.readFile(uploadedReport.path, { cellDates: true });
        const dataSheet = wb.Sheets['Data Sheet'];
        const sheetDataInJSON = xlsx.utils.sheet_to_json(dataSheet);
        const filteredData = refactorData(sheetDataInJSON);
        const clubbedValuesByKey = clubValuesWithCommonKeys(filteredData, companyName);
        fs.unlinkSync(uploadedReport.path);
        const saveToDB = await pushToDb(clubbedValuesByKey);
        if (!saveToDB) throw "Error while saving data on database";
        console.log("Data pushed to db");
        return res.status(200).send({ companyName, data: clubbedValuesByKey });
    } catch (err) {
        console.error(`Uploading stocks data failed ${err}`);
        return res.status(500).send({ message: "Upload failed" });
    }
};

module.exports = uploadStocksResult;