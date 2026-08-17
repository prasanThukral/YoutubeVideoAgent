import dotenv from "dotenv";
dotenv.config();
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

import { OllamaEmbeddings } from '@langchain/ollama'
import { PGVectorStore } from "@langchain/pgvector";


const embeddings = new OllamaEmbeddings({
    model: "qwen3-embedding:4b",
    baseUrl: "http://localhost:11434",
})


const config = {
    postgresConnectionOptions: {
        connectionString: process.env.DB_URL,
    },
    tableName: "testlangchainjs",
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    // supported distance strategies: cosine (default), innerProduct, or euclidean
    distanceStrategy: "cosine",
};

export  const vectorStore = await PGVectorStore.initialize(
    embeddings,
    config
  );
  

export const videoData = async({transcript,video_id})=>{
    const docs = [new Document({ pageContent: transcript, metadata: { video_id } })];
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 900,
        chunkOverlap: 250
    })
    const chunks = await splitter.splitDocuments(docs)
   const response =  await vectorStore.addDocuments(chunks)
   console.log(response)
}

