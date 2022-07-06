// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fleekStorage from '@fleekhq/fleek-storage-js'
import fs from 'fs'
import axios from 'axios'

type Data = {
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  axios.get(`https://storageapi.fleek.co/038f3525-c411-4ef9-86e4-bc833d0c2d7f-bucket/${req.query.key}`).then((e) => {
    // console.log(e.data)
    res.status(200).json({ url: e.data })
  })
  
}
