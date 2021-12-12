const fs = require('fs');
const xlsx = require('xlsx');
const CompanyReportModel = require('../../models/companyReport/index');

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

const clubValuesWithCommonKeys = (data, companyName, companyCode) => {
    let dict = {};
    data.forEach((item) => {
        let itemKey = Object.keys(item)[0];
        if (Object.keys(dict).includes(itemKey)) {
            dict[itemKey] = [...dict[itemKey], ...Object.values(item)];
        } else {
            dict[itemKey] = Object.values(item);
        }
    });
    dict["companyName"] = companyName;
    dict["companyCode"] = companyCode;
    // Merging array of objects into one object --> [{},{}] => {}
    dict["PROFIT & LOSS"] = Object.assign({}, ...dict["PROFIT & LOSS"]);
    dict["Quarters"] = Object.assign({}, ...dict["Quarters"]);
    dict["BALANCE SHEET"] = Object.assign({}, ...dict["BALANCE SHEET"]);
    dict["CASH FLOW:"] = Object.assign({}, ...dict["CASH FLOW:"]);
    dict["DERIVED:"] = Object.assign({}, ...dict["DERIVED:"]);
    return dict;
}

const pushToDb = async (data) => {
    try {
        await CompanyReportModel.create(data);
        return { savedToDB: true, msg: "" }
    } catch (err) {
        return { savedToDB: false, msg: err.errors.companyCode };
    }
}

const uploadStocksResult = async (req, res) => {
    const uploadedReport = req.file;
    try {
        const { companyName, companyCode } = req.body;
        // File validations to be added
        if (Object.keys(req.file).length === 0) throw "No file uploaded"
        const wb = xlsx.readFile(uploadedReport.path, { cellDates: true });
        const dataSheet = wb.Sheets['Data Sheet'];
        const sheetDataInJSON = xlsx.utils.sheet_to_json(dataSheet);
        const filteredData = refactorData(sheetDataInJSON);
        const clubbedValuesByKey = clubValuesWithCommonKeys(filteredData, companyName, companyCode);
        const { savedToDB, msg } = await pushToDb(clubbedValuesByKey);
        if (!savedToDB) throw `Error while saving data on database ${msg}`;
        console.log("Data pushed to db");
        return res.status(200).send({ clubbedValuesByKey });
    } catch (err) {
        console.error(`Uploading data failed ${err}`);
        return res.status(500).send({ message: `Upload failed: ${err}` });
    } finally {
        fs.unlinkSync(uploadedReport.path);
    }
};

module.exports = uploadStocksResult;