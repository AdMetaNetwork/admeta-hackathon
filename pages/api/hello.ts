// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admeta:PBKY2ZKFhsM7OQlZ@cluster0.x3vab.mongodb.net/userAndAds?retryWrites=true&w=majority";

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const detectedIp = requestIp.getClientIp(req)

  // MongoClient.connect(url, function(err:any, db:any) {
  //   if (err) throw err;
  //   console.log("数据库已创建!");
  //   console.log(db)
  //   db.close();
  // });

  console.log(detectedIp)
  console.log('req--->>>', req.headers['user-agent'])
  const name = req.query.name as string
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({ name })
}
