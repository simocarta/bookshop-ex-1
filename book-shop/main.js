const { getCustomers } = require('./dynamo');

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: getCustomers(),
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
