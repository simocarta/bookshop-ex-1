const { getCustomers, getBooksStartWith, getBooksOf, getBooksInBasketOf, getBooksSelledBy, getWharehouseInBasketOf, getAuthor, getBook, getCustomer } = require('./dynamo');

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                //message: await getCustomers(),
                message: await getCustomer(event.queryStringParameters.search)
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
