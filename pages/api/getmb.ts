// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admeta:PBKY2ZKFhsM7OQlZ@cluster0.x3vab.mongodb.net?retryWrites=true&w=majority";

type Data = {
  v: any
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const detectedIp = requestIp.getClientIp(req)

  MongoClient.connect(url, function (err: any, db: any) {
    if (err) throw err;
    var dbo = db.db("database0");
    const ua = req.headers['user-agent'];
    var whereStr = { ip: detectedIp, 'user-agent': ua };  // 查询条件
    dbo.collection("userAndAds").find(whereStr).toArray(function (err: any, result: any) { // 返回集合中所有数据
      if (err) throw err;
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json({ ad: result })
      db.close();
    });
  });

}
