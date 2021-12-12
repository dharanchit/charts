const CompanyReportModel = require('../../models/companyReport/index');

const fetchStockData = async (req, res) => {
    try {
        const { companyCode } = req.query;
        const searchOption = await CompanyReportModel.findOne({ companyCode });
        return res.status(200).send({ data: searchOption });
    } catch (err) {
        return res.status(500).send({ message: `Something went wrong ${err}` })
    }
}

module.exports = fetchStockData;