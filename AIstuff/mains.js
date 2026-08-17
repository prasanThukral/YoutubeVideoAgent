import { ChatAnthropic } from "@langchain/anthropic";
import { createAgent, tool } from "langchain";
import { z } from 'zod'
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
import { Embedding } from "./brightDataScrap.js";


export class Agent {


    static async _createAgent(model) {

        const youtube = tool(async ({ url, query }) => {
            const retrievedDocs = await Embedding(url, query);
            console.log(retrievedDocs)

            return retrievedDocs
        }, {
            name: 'retriever',
            description: `
            Trigger the scraping of a youtube video using the url. 
    The tool start a scraping job, that usually takes around 30 second to 5 mins.
    Retrieve the most relevant chunk from the transcript of a youtube video
            `,
            schema: z.object({ url: z.string().describe('The video URL'),
                query: z.string().describe('String data that you want to search in the video'),
            }),
        })

        
        const checkpointer = new MongoDBSaver({
            client: mongoose.connection.getClient(),
            dbName: mongoose.connection.name,
          });
          
        return createAgent({
            model,
            tools: [youtube],
            checkpointer,
        })
    }

    static async chat(model, thread_id, content) {

        const llm = new ChatAnthropic({
            model
        })
        let createNewAgent = this._createAgent(llm)

        const response = await (await createNewAgent).invoke({
            messages: [{
                'role': 'user',
                content
            }
            ]
        }
            , {
                configurable: { thread_id: thread_id }

            }
        )

        return response.messages[response.messages.length - 1].content

    }

}





