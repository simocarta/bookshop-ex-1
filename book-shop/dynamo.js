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
        KeyConditionExpression: "#ex = :au AND sk = :pk",
        ExpressionAttributeValues: {
            ":pk": "Book#Detail",
            ":au": auth
        },
        ExpressionAttributeNames: {
            "#ex": "External_ID"
        }
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};

const getBooksInBasketOf = async (cust) => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_2',
        KeyConditionExpression: "#ex = :cu AND begins_with(sk, :pk)",
        ExpressionAttributeValues: {
            ":pk": "Item",
            ":cu": cust
        },
        ExpressionAttributeNames: {
            "#ex": "External_ID"
        }
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};

const getBooksSelledBy = async (publ) => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_1',
        KeyConditionExpression: "sk = :pk",
        FilterExpression: "#pi = :pu",
        ExpressionAttributeValues: {
            ":pk": "Book#Detail",
            ":pu": publ
        },
        ExpressionAttributeNames: {
            "#pi": "Publisher_ID"
        }
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};

const getWharehouseInBasketOf = async (cust) => {
    const params = {
        TableName: process.env.DB,
        IndexName: 'GSI_2',
        ProjectionExpression: "Wharehouse_ID",
        ScanIndexForward: true,
        KeyConditionExpression: "#ex = :cu AND begins_with(sk, :pk)",
        ExpressionAttributeValues: {
            ":pk": "Item",
            ":cu": cust
        },
        ExpressionAttributeNames: {
            "#ex": "External_ID"
        }
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    // Fa una sorta di GROUP BY
    let out = [];
    result.Items.forEach(item => {
        if(!out.some(o => o.Wharehouse_ID == item.Wharehouse_ID))
            out.push(item);
    });
    return out;
};

const getAuthor = async (auth) => {
    const params = {
        TableName: process.env.DB,
        Key: {
            pk: 'CURRENT',
            sk: 'CURRENT',
        },
        KeyConditionExpression: "pk = :pk AND sk = :sk",
        ExpressionAttributeValues: {
            ":pk": auth,
            ":sk": "Author#Detail"
        },
    };
  
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items;
};



module.exports = { getCustomers, getBooksStartWith, getBooksOf, getBooksInBasketOf, getBooksSelledBy, getWharehouseInBasketOf, getAuthor };