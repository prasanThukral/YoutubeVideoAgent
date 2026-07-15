import { ChatAnthropic } from "@langchain/anthropic";
import { createAgent, tool } from "langchain";
import { z } from 'zod'
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()



export class Agent{

     static async _createAgent(model){

        const internetConnectivity = tool( async({query})=>{
            return await eval(query)
        },{
            name:'run_javascript',
            description:'Get the weather for a given location',
            schema:z.object({query:z.string().describe('The location for the weathers app')})
        
        })


        const client = mongoose.connection.getClient();

        const checkpointer = new MongoDBSaver(
            {client,
                dbName: "chatData"}
        );
        return createAgent({
            model,
            tools: [],
            checkpointer,
        })
    }

    static async chat(model,thread_id,content){

        const llm = new ChatAnthropic({
            model
        })
        let createNewAgent = this._createAgent(llm)
        
        const response =  await (await createNewAgent).invoke({
            messages: [{
                'role': 'user',
                content
            }
        ]
        }
            , {
                configurable: {thread_id:thread_id}
                
            }
        )
        
        return response.messages[response.messages.length-1].content
    }
   
}





