// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToString } from '@polkadot/util';
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admeta:PBKY2ZKFhsM7OQlZ@cluster0.x3vab.mongodb.net?retryWrites=true&w=majority";

function formatData(c: any[]) {
  let arr: any[] = []
  c.forEach(item => {
    arr.push(item[1])
  });
  arr.forEach((item) => {
    item = item.toString()
  })

  let a: any[] = JSON.parse(`[${arr.toString()}]`)
  console.log(a)
  a.forEach(item => {
    item.target = hexToString(item.target)
    item.metadata = hexToString(item.metadata)
  });
  let obj = {
    adurl: a[a.length - 1].target,
    adimg: a[a.length - 1].metadata
  }
  
  return obj
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
    dbo.collection("userAndAds").find(whereStr).toArray(async function (err: any, result: any) { // 返回集合中所有数据
      if (err) throw err;

      const wsProvider = new WsProvider('wss://testnet.admeta.network');
      const api = await ApiPromise.create({ provider: wsProvider });

      console.log('sss---->>>', result[result.length - 1].account)

      const SENDER = result[result.length-1].account;

      api?.query.ad
        .impressionAds
        .entries(SENDER)
        .then((c: any[]) => {
          console.log('c---->>>>', formatData(c))
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.status(200).json({ ad: formatData(c) })
        })

      db.close();
    });
  });

}
