import { FC } from "react";
import styles from './index.module.scss';
import { Image } from 'antd'

type Prop = {
  handleAd: () => void
  adIpfs: string
}

const Ad: FC<Prop> = ({handleAd, adIpfs}) => {
  return (
    <div className={styles.ad} onClick={handleAd}>
      <a href="http://127.0.0.1:8000?position=0%2C0&SCENE_DEBUG_PANEL" target="view_window">
        <Image src={adIpfs} alt="ad" width={2241 / 2} height={1260 / 2} preview={false} />
      </a>

    </div>
  )
}

export default Ad;