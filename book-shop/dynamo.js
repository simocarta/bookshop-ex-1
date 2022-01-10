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
    return result.Items ?? 0;
};


const getBooksStartWith = async (root) => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_1',
        KeyConditionExpression: "sk = :pk",
        FilterExpression: "begins_with(#n, :n)",
        ExpressionAttributeValues: {
            ":pk": "Book#Detail",
            ":n": "Name"
        },
        ExpressionAttributeNames: {
            "#n": root
        },
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items ?? 0;
};




module.exports = { getCustomers };