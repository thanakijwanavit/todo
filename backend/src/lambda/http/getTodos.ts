import 'source-map-support/register'
import * as AWS from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../helpers/auth'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('event was', event)
      

  const authHeader = event.headers['Authorization']
  const userId = getUserId(authHeader)
  var result = await docClient.query({
      TableName: process.env.TODO_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues:{
          ':userId': userId
      }
  }).promise()

  console.log(result)
    
  return {
    statusCode: 200,
    body: JSON.stringify({result})
  }
}
