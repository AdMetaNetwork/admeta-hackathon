import { FC } from "react";
import styles from './index.module.scss';
import { Image } from 'antd'

type Prop = {
  handleAd: () => void
}

const Ad: FC<Prop> = ({handleAd}) => {
  return (
    <div className={styles.ad} onClick={handleAd}>
      <a href="https://www.baidu.com" target="view_window">
        <Image src='https://ipfs.io/ipfs/QmNonVZ78wUKQ9kq76oM9Yra7rTiivHLq7KESCphbbMVZp' alt="ad" width={2241 / 2} height={1260 / 2} preview={false} />
      </a>

    </div>
  )
}

export default Ad;