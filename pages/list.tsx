import type { NextPage } from 'next'
import styles from '../components/index.module.scss';
import { Image, Spin } from 'antd';
import { useState, useEffect } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToString } from '@polkadot/util';

const Home: NextPage = () => {
  const [provider, setProvider] = useState<WsProvider>()
  const [api, setApi] = useState<ApiPromise>()
  const [list, setList] = useState<any[]>([])
  const [spinning, setSpinning] = useState(false)

  const listItem = (item: any, key: number) => (
    <a href={item.target} target="view_window" key={key}>
      <div className={styles.adListItem} >
        <Image
          src={item.metadata}
          alt=""
          width={'100%'}
          preview={false}
        />
        <div className={styles.tip}>approved: {item.approved ? 'true' : 'false'}</div>
      </div>
    </a>

  )

  const connectProvider = async () => {
    try {
      const wsProvider = new WsProvider('ws://168.119.116.180:9944');
      setProvider(wsProvider)
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api)

    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (!provider) {
      connectProvider();
    }


    const getList = async () => {
      const SENDER = localStorage.getItem('_select_account') as string;
      api?.query.ad
        .impressionAds
        .entries(SENDER)
        .then((c: any[]) => {
          let arr: any[] = []
          c.forEach(item => {
            arr.push(item[1])
          });
          arr.forEach((item) => {
            item = item.toString()
          })

          let a:any[] = JSON.parse(`[${arr.toString()}]`)
          a.forEach(item => {
            item.target = hexToString(item.target)
            item.metadata = hexToString(item.metadata)
          });
          setList(a)
          console.log(a)
          setSpinning(false)

        })
    }
    if (!list.length) {
      setSpinning(true)
      getList()

    }



  }, [api, provider, list])

  return (
    <Spin tip="Loading..." spinning={spinning}>
      <div className={styles.adList}>
        {
          list?.map((item, index) => (
            listItem(item, index)
          ))
        }
      </div>
    </Spin>
  )
}


export default Home
