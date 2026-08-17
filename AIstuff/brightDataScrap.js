import axios from "axios";
import dotenv from 'dotenv'
import { videoData, vectorStore } from "./embeddings.js";
dotenv.config();
import { vectorMetaModel } from "../models/UserModel.js";
import { connectDB } from "../db/mongoDB.js";
export async function Embedding(url,query) {

     await connectDB(process.env.MONGO_URI)
    const meta = await vectorMetaModel.findOne({ id: url })
    
    if (meta) {
        
        const vectorResult = await vectorStore.similaritySearch(query, 3, { video_id: url });
        
        console.log(vectorResult.map(a=>a.pageContent).join('\n ')
    )
        return vectorResult.map(a=>a.pageContent)
    }
    const data = JSON.stringify({
        input: [{ url, "country": "", "transcription_language": "" }],
        limit_per_input: null,
    });
    const response = await axios
        .post(`https://api.brightdata.com/datasets/v3/scrape?dataset_id=gd_lk56epmy2i5g7lzu0k&notify=false&include_errors=true`,
            data,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.URL_BRIGHT}`,
                    "Content-Type": "application/json",
                },
            }
        )

    console.log(response.data.snapshot_id)


    let final = { status: 400 }
    function delayedFetch(snap = 'sd_mrxtjte21u42qnvxh7') {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const result = await axios({
                    method: 'get',
                    url: `https://api.brightdata.com/datasets/v3/snapshot/${snap}?format=json`,
                    headers: {
                        'Authorization': `Bearer ${process.env.URL_BRIGHT}`
                    },
                    responseType: 'json'
                })
                resolve(result);
                reject(result)
            }, 5000)
        })
    }

    while (final.status !== 200) {
        // response.data.snapshot_id
        final = await delayedFetch(response.data.snapshot_id)
    }
    

    await videoData({ transcript: final.data[0].transcript, video_id: url })
    await vectorMetaModel.create({ id: url })
    const vectorResult = await vectorStore.similaritySearch(query, 2, { video_id: url });
    
    
    return vectorResult.map(a=>a.pageContent).join('\n ')


}


