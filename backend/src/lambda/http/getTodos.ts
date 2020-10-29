import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    console.log('event was', event)
        

    const result = await docClient.scan({
      TableName: process.env.TODO_TABLE 
    }).promise()

    console.log(result)
    
  return {
    statusCode: 200,
    body: JSON.stringify({result})
  }
}
