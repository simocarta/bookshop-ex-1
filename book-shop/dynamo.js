const { DynamoDBDocumentClient, QueryCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');


const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);


const getCustomers = async () => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_1',
        KeyConditionExpression: "sk = :pk",
        ExpressionAttributeValues: {
            ":pk": "Customer#Detail"
        },
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};


const getBooksStartWith = async (root) => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_1',
        KeyConditionExpression: "sk = :pk",
        FilterExpression: "begins_with(#n, :n)",
        ExpressionAttributeValues: {
            ":pk": "Book#Detail",
            ":n": root
        },
        ExpressionAttributeNames: {
            "#n": "Name"
        },
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};

const getBooksOf = async (auth) => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_2',
        KeyConditionExpression: "pk = :au AND sk = :pk",
        ExpressionAttributeValues: {
            ":pk": "Book#Detail",
            ":au": auth
        },
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};



module.exports = { getCustomers, getBooksStartWith, getBooksOf };