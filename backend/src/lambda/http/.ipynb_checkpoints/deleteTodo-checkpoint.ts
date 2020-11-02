import 'source-map-support/register'

import { TodoItem } from '../../models/TodoItem'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../helpers/auth'
import * as AWS from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  
  const authHeader = event.headers['Authorization']
  const userId = getUserId(authHeader)
  
  var itemToDelete = await docClient.query({
      TableName: process.env.TODO_TABLE,
      IndexName: process.env.TODO_ID_INDEX_NAME,
      KeyConditionExpression: 'userId = :userId, todoId = :todoId',
      ExpressionAttributeValues:{
          ':userId': userId,
          ':todoId': todoId
      }
  }).promise()
  if (itemToDelete.Count == 1){
      var deleteResult = await docClient.delete({
          TableName: process.env.TODO_TABLE,
          Key: {
              "userId": userId,
              "createdAt": (itemToDelete[0] as TodoItem).createdAt
          }
      }).promise()
  } else {
      return {
          statusCode: 400,
          body: 'error loading item'
      }
  }

  // TODO: Remove a TODO item by id
  return {
      statusCode: 200,
      body: `newTodo: ${deleteResult}`
  }
}
