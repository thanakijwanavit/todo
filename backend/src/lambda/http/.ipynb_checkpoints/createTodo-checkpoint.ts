import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { getUserId } from '../../helpers/auth'
import { TodoItem } from '../../models/TodoItem'

// create docClient
var AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient()
const uuid = require('uuid/v4')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //get auth
  const authHeader = event.headers['Authorization']
  const userId = getUserId(authHeader)
  console.log(`user id is ${userId}`)
    
    
  const todoRequest: CreateTodoRequest = JSON.parse(event.body)
  const newTodoItem: TodoItem = {
      userId: userId,
      todoId: uuid(),
      createdAt: new Date().toISOString(),
      name: todoRequest.name,
      dueDate: todoRequest.dueDate,
      done: false
  }
  const result = await docClient.put({
      TableName: process.env.TODO_TABLE,
      Item: newTodoItem
  }).promise()
  

  
  console.log(result)

  return {
      statusCode: 200,
      body: `newTodo: ${JSON.stringify(result)}`
  }
}
