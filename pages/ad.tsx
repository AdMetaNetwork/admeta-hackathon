import { FC, useState, useEffect } from "react";
import styles from '../components/index.module.scss';
import { Image, Upload, Input, Select, Button, Spin, message, DatePicker } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import axios from 'axios'
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { CalendarMode } from 'antd/lib/calendar/generateCalendar';
import type { Moment } from 'moment';

const { Option } = Select;

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const Ad: FC = () => {
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const [img, setImg] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [spinning, setSpinning] = useState(false)
  const [ipfs, setIpfs] = useState('')
  const [cpi, setCpi] = useState(0)
  const [amount, setAmount] = useState(0)
  const [endBlock, setEndBlock] = useState(0)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [tag, setTag] = useState('')
  const [provider, setProvider] = useState<WsProvider>()
  const [api, setApi] = useState<ApiPromise>()

  const getFile = (key: string) => {
    axios({
      method: 'get',
      url: window.location.origin + `/api/getIPFS?key=${key}`
    }).then((e) => {
      setIpfs(e.data.url)
    })
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setSpinning(true)
    if (info.file.status === 'uploading') {

      setSpinning(false)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        axios({
          method: 'post',
          url: window.location.origin + '/api/upload',
          data: {
            url,
            key: info.file.name
          },
        }).then((e) => {
          console.log(e.data)
          if (e.data.name === 'ok') {
            setImg(url)
            setSpinning(false)
            getFile(info.file.name)
          }

        })
      });
    }
  };

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
    const getBlock = () => {
      api?.query.system
        .number((v: any) => {
          setCurrentBlock(parseInt(v.toString()))
        })
    }

    getBlock();

  }, [api, provider, currentBlock])

  const proposeAd = async () => {
    if (!ipfs) {
      message.info('Please upload img')
      return
    }
    if (!targetUrl) {
      message.info('Please input targetUrl')
      return
    }
    if (!cpi) {
      message.info('Please input cpi')
      return
    }
    if (!amount) {
      message.info('Please input amount')
      return
    }
    if (!max) {
      message.info('Please input max age')
      return
    }
    if (!min) {
      message.info('Please input min age')
      return
    }
    if (!tag) {
      message.info('Please select tag')
      return
    }

    if (!endBlock) {
      message.info('Please select ad takedown time')
      return
    }

    const SENDER = localStorage.getItem('_select_account') as string;
    const { web3Enable, web3FromAddress } = await import('@polkadot/extension-dapp');
    await web3Enable('AdMeta');

    const injector = await web3FromAddress(SENDER);

    api?.tx.ad
      .proposeAd(ipfs, targetUrl, cpi, amount, endBlock, {
        age: {
          max,
          min
        },
        tags: [tag]
      })
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {
        console.log(status)
        message.info('proposeAd ok')
      });
  }

  return (
    <div className={styles.propose}>
      <div className={styles.title} onClick={() => {
        getFile('ad.jpeg')
      }}>Propose AD</div>
      <div className={styles.formBox}>
        <Spin tip="Loading..." spinning={spinning}>
          <div className={styles.fromItem}>
            <div className={styles.left}>ImgIPFS:</div>
            {
              img
                ?
                <Image
                  alt="AD show"
                  src={img}
                  width={100}
                  height={100}
                />
                :
                // <Upload
                //   listType="picture-card"
                //   accept='image/png,image/jpg'
                //   onChange={handleChange}
                // >
                //   {uploadButton}
                // </Upload>

                <input type="file" onChange={(e) => {
                  // console.log(e)
                  var reader = new FileReader();
                  const file = e.target.files![0];
                  if (file) {

                    reader.readAsDataURL(file);
                    reader.onloadend = function () {
                      //将转换结果赋值给img标签
                      setSpinning(true)
                      const key = file.name
                      const url = reader.result
                      axios({
                        method: 'post',
                        url: window.location.origin + '/api/upload',
                        data: {
                          url,
                          key,
                        },
                      }).then((e) => {
                        console.log(e.data)
                        if (e.data.name === 'ok') {
                          setImg(url as string)
                          setSpinning(false)
                          getFile(key)
                        }

                      })
                    }

                  }
                }} />
            }

          </div>
        </Spin>
        <div className={styles.fromItem}>
          <div className={styles.left}>Target Url:</div>
          <Input
            className={styles.right}
            defaultValue=""
            type="text"
            placeholder="Please input target url"
            onChange={(e) => {
              setTargetUrl(e.target.value)
            }}
          />
        </div>
        <div className={styles.fromItem}>
          <div className={styles.left}>Cpi:</div>
          <Input
            className={styles.right}
            defaultValue=""
            type="number"
            placeholder="Please input cpi"
            onChange={(e) => {
              setCpi(+e.target.value)
            }}
          />
        </div>
        <div className={styles.fromItem}>
          <div className={styles.left}>Amount:</div>
          <Input
            className={styles.right}
            defaultValue=""
            type="number"
            placeholder="Please input amount"
            onChange={(e) => {
              setAmount(+e.target.value)
            }}
          />
        </div>
        <div className={styles.fromItem}>
          <div className={styles.left}>Age Max:</div>
          <Input
            className={styles.right}
            defaultValue=""
            type="number"
            placeholder="Please input age max"
            onChange={(e) => {
              setMax(+e.target.value)
            }}
          />
        </div>
        <div className={styles.fromItem}>
          <div className={styles.left}>Age Min:</div>
          <Input
            className={styles.right}
            defaultValue=""
            type="number"
            placeholder="Please input age min"
            onChange={(e) => {
              setMin(+e.target.value)
            }}
          />
        </div>
        <div className={styles.fromItem}>
          <div className={styles.left}>Tag:</div>
          <Select
            className={styles.right}
            style={{ width: '100%', height: 40, borderRadius: 10 }}
            onChange={(e) => {
              setTag(e)
            }}
          >
            <Option value="DeFi">DeFi</Option>
            <Option value="GameFi">GameFi</Option>
            <Option value="Metaverse">Metaverse</Option>
          </Select>
        </div>
        <div className={styles.fromItem}>
          <div className={styles.left}>Takedown:</div>
          <DatePicker className={styles.right} style={{ width: '70%' }} onChange={(date, dateString) => {
            const s = new Date().getTime() / 1000;
            const startDate = parseInt(s + '');
            const e = new Date(dateString).getTime() / 1000;
            const endDate = parseInt(e + '');

            // 计算 块数量 24秒出一个块
            const block = parseInt(((endDate - startDate) / 24) + '')
            console.log(block)
            console.log(currentBlock)

            setEndBlock(currentBlock + block)


          }} />
        </div>
        <div className={styles.fromItem}>
          <div className={styles.btn}>
            <Button type="primary" shape="round" onClick={proposeAd}>Submit</Button>
          </div>

        </div>
      </div>
    </div >
  )
}

export default Ad;