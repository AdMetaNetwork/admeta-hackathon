// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fleekStorage from '@fleekhq/fleek-storage-js'
import fs from 'fs'

type Data = {
  name: string
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {


  // 写入文件
  var data = req.body.url.replace(/^data:image\/\w+;base64,/, "");
  var buf = Buffer.from(data, 'base64');
  fs.writeFile(req.body.key, buf, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('写入成功')
    // 读取文件
    fs.readFile(req.body.key, async (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      await fleekStorage.upload({
        apiKey: 'p51gQP+qZdCzn/Gr89Kusw==',
        apiSecret: 'DnvCRbYb2gnAwg2V+Uz+LO16O9tD66VoxaNxBFKE4dA=',
        key: req.body.key,
        data,
        httpUploadProgressCallback: (event) => {
          console.log(Math.round(event.loaded / event.total * 100) + '% done');
          // 删除本地读取文件
          fs.unlinkSync(req.body.key);
          res.status(200).json({ name: 'ok' })
        }
      });
    })

  });
}
