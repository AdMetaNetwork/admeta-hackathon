// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fleekStorage from '@fleekhq/fleek-storage-js'

type Data = {
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // console.log('req--->>>', req.body)
  const key = req.query.key as string
  const myFile = await fleekStorage.get({
    apiKey: 'p51gQP+qZdCzn/Gr89Kusw==',
    apiSecret: 'DnvCRbYb2gnAwg2V+Uz+LO16O9tD66VoxaNxBFKE4dA=',
    key,
    getOptions: [
      'publicUrl',
      'hash',
      'key'
    ]
  })
  const url = myFile.publicUrl as string
  res.status(200).json({ url })
}
