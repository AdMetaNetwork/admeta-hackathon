// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'
import { ApiPromise, WsProvider } from '@polkadot/api';


type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const detectedIp = requestIp.getClientIp(req)

  console.log(WsProvider, '---->>>>>WsProvider')
  console.log('req--->>>', req.headers['user-agent'])
  const name = req.query.name as string
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({ name })
}
