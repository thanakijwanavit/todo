import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    console.log('event was', event)
    var AWS = require('aws-sdk');
    const docClient = new AWS.DynamoDB.DocumentClient()

    const result = await docClient.scan({
      TableName: process.env.TODO_TABLE 
    }).promise()

    const items = result.Items
    
  return {
    statusCode: 200,
    body: JSON.stringify({items})
  }
}
