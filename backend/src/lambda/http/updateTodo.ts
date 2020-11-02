import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../../helpers/auth'
import * as AWS from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const authHeader = event.headers['Authorization']
  const userId = getUserId(authHeader)
  
  const itemToUpdate = await docClient.query({
      TableName: process.env.TODO_TABLE,
      IndexName: process.env.TODO_ID_INDEX_NAME,
      KeyConditionExpression: 'userId = :userId, todoId = :todoId',
      ExpressionAttributeValues:{
          ':userId': userId,
          ':todoId': todoId
      }
  }).promise()
  
  if (itemToUpdate.Count != 1){
      return {
          statusCode: 400,
          body: `error getting item for updating, maybe it doesnt exist${itemToUpdate}`
      }
  }
    
  const updateResult = await docClient.update({
      TableName: process.env.TODO_TABLE,
      Key:{
          'userId': userId,
          'createdAt': (itemToUpdate[0] as TodoItem).createdAt
      },
      UpdateExpression: 'set #namefiels = :n, dueDate = :d, done = :do',
      ExpressionAttributeValues: {
          ':n': updatedTodo.name,
          ':d': updatedTodo.dueDate,
          ':do': updatedTodo.done
      },
      ExpressionAttributeNames:{
          "#namefield" : 'name'
      }
  }).promise()
  

  return {
    statusCode: 200,
    body: `newTodo: ${updatedTodo}${todoId}`
  }
}
