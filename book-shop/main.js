const { getCustomers } = require('./dynamo');

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                //message: await getCustomers(),
                message: await getBooksOf(event.queryStringParameters.search)
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
