import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  // create docClient
  var AWS = require('aws-sdk');
  const docClient = new AWS.DynamoDB.DocumentClient()
  //create new item
  const result = docClient.put({
      TableName: process.env.TODO_TABLE,
      Item: {
          HashKey: newTodo.name,
          dueDate: newTodo.dueDate
      }
  }).promise()
  console.log(result)

  return {
      statusCode: 200,
      body: `newTodo: ${result}`
  }
}
