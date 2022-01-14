const { getCustomers, getBooksStartWith, getBooksOf, getBooksInBasketOf, getBooksSelledBy, getWharehouseInBasketOf, getAuthor, getBook, getCustomer, getBooksOfYear, getBookInWharehouses, getBooksAvailable, updateBookAvailable } = require('/opt/nodejs/dynamo');

let response;

function sendResponse(msg){
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: msg
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    return response
}

exports.lambdaHandler = async (event, context) => {
    let cmd = event.pathParameters.cmd
    let uri = event.queryStringParameters;
    let message;

    switch (cmd) {
        case "customers":
            message = await getCustomers();
            break;
        case "bookstartwith":
            message = await getBooksStartWith(uri.title);
            break;
        case "updatebookavailable":
            message = await updateBookAvailable(uri.book, uri.whar, uri.newn);
            break;
    
        //...

        default:
            message = "Error"
            break;
    }

    return sendResponse(message);
};
