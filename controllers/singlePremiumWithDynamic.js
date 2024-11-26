// Define a function to process single premium records
async function singlePremiumRecord(req, res, next) {
    try {
        const queryParams = req.query;
        // const dynamicFields = [
        //     "age",
        //     "ppt",
        //     "tobacco",
        //     "gender",
        //     "variant_code",
        //     "product_term",
        //     "from_date_str",
        //     "uploadId",
        //     // Add more dynamic fields here
        // ];

        // Create a dynamic filter object
        const filter = {...queryParams};
        // dynamicFields.forEach(field => {
        //     if (queryParams[field]) {
        //         filter[field] = queryParams[field];
        //     }
        // });

        // Handle special case for gender
        if (filter.gender) {
            const regex = new RegExp(`${queryParams.gender}`);
            filter.gender = { $regex: regex };
        }
        if (filter.age) {
            filter['x-axis.age']=Number(filter.age);
        }
        if (filter.ppt) {
            filter['y-axis.ppt'] = Number(filter.ppt);
        }

        // Handle special case for fromDate
        if (filter.fromDate) {
            const fromDate = new Date(filter.fromDate);
            filter.fromDate = { $lte: fromDate };
        }

        // Handle special case for toDate
        if (filter.toDate) {
            const toDate = new Date(filter.fromDate);
            filter.$or = [
                { toDate: { $eq: "" } }, // Check if toDate is blank
                { toDate: { $gte: toDate } },
            ];
        }

        // Query the database using the dynamic filter
        const data = await uploadExcelModel.findOne(filter);

        res.json({ status: "success", data: data });
    } catch (error) {
        res.json({
            error: "Error processing while reading collection",
            message: error.message,
        });
    }
}

// Example usage
const req = {
    query: {
        age: 30,
        ppt: 10,
        tobacco: "no",
        gender: "male",
        variant_code: "A",
        product_term: 20,
        from_date_str: "2023-01-01",
        uploadId: "12345",
        // Add more query parameters here
    },
};

const res = {
    json: (response) => console.log(response),
};

singlePremiumRecord(req, res);
