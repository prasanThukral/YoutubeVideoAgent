import { ChatAnthropic, tools } from "@langchain/anthropic";
import { createAgent, tool } from "langchain";
import { z } from 'zod'
import { MemorySaver } from "@langchain/langgraph";
import dotenv from 'dotenv'
dotenv.config()



export class Agent{

     static async _createAgent(model){
        const checkpointer = new MemorySaver();
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





