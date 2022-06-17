import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import TopBar from '../components/top-bar'
import ConnectModal from '../components/connect-modal'
import Bg from '../components/bg'
import Tip from '../components/tip'
import SetProfile from '../components/set-profile'
import Ad from '../components/ad'
import Claim from '../components/claim'
import { useEffect, useState } from 'react'
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { FC } from 'react'
import type { Wallet } from '../type'
import { message } from 'antd';
import { PreferencesEnum, GenderEnum } from '../enum'

const Home: FC = () => {
  const [isConnected, setConnect] = useState(false)
  const [isShowConnectModal, setShowConnectModal] = useState(false)
  const [isShowProfile, setShowProfile] = useState(false)
  const [isShowAd, setShowAd] = useState(false)
  const [tipText, setTipText] = useState<string>('Please connect to Polkadot.js Extention first.')
  const [isShowClaimModal, setShowClaimModal] = useState(false)

  const [walletList, setWalletList] = useState<Wallet[]>([])
  const [selectAccount, setSelectAccount] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState(0)
  const [preferences, setPreferences] = useState(0)
  const [adDisplay, setAdDisplay] = useState(false)
  const [provider, setProvider] = useState<WsProvider>()
  const [api, setApi] = useState<ApiPromise>()
  const [adIndex, setAdIndex] = useState<number>()
  const [adIpfs, setAdIpfs] = useState<string>('')
  const [claimAmount, setClaimAmount] = useState<string>('')
  const [rewardAmount, setRewardAmount] = useState<string>('')

  const connectProvider = async () => {
    try {
      // const wsProvider = new WsProvider('ws://testnet.admeta.network:9944');
      const wsProvider = new WsProvider('ws://127.0.0.1:9944');
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

  }, [api, provider])

  const addProfile = async () => {
    if (!selectAccount) {
      message.info('Please choose account')
      return
    }
    const SENDER = selectAccount;
    await web3Enable('AdMeta');
    const injector = await web3FromAddress(SENDER);
    setTipText('Wait will your customized ads are ready...')
    api?.tx.user
      .addProfile(age, PreferencesEnum[preferences])
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {

        setTipText(adDisplay ? 'Wait will your customized ads are ready...' : 'You can set up ad display')
        setShowProfile(false)
        setTimeout(() => {
          queryUserAd()
        }, 3000)
      });

  }

  const queryUserAd = async () => {
    const SENDER = selectAccount;
    api?.query.user
      .users(SENDER)
      .then((c: any) => {
        const adArr = JSON.parse(c.value.matchedAds.toString())
        if (adArr.length) {
          const adIndex = adArr[0] as number
          setAdIndex(adIndex)
          getAdInfo(adIndex)
        }

      })
  }

  const decodeUtf8 = (bytes: string | any[]) => {
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
      encoded += '%' + bytes[i].toString(16);
    }
    return decodeURIComponent(encoded);
  }

  const getAdInfo = async (idx: number) => {
    api?.query.ad
      .impressionAds(idx)
      .then((c: any) => {
        const url: string = decodeUtf8(c.value.metadata)
        const cli: string = (+c.value.cpi / Math.pow(10, 12)) + ''
        const amount: string = (+c.value.amount / Math.pow(10, 12)) + ''

        setAdIpfs(url)
        setShowAd(adDisplay)
        setClaimAmount(cli)
        setRewardAmount(amount)
        setTipText('Your customized ad')
      })
  }

  const handleShowConnectModal = () => {
    setShowConnectModal(true)
  }

  const handleCancelConnectModal = () => {
    setShowConnectModal(false)
  }

  const handleConfirmConnectModal = () => {
    if (!selectAccount) {
      message.info('Please select account!')
      return
    }
    setConnect(true)
    setTipText('You need to set up your profile before using it.')
    setShowProfile(true)
    setShowConnectModal(false)
  }

  const handleSubmitProfile = () => {
    if (!age) {
      message.info('Please input age')
      return
    }
    if (!gender) {
      message.info('Please choose gender')
      return
    }
    if (!preferences) {
      message.info('Please choose preferences')
      return
    }
    addProfile()
  }

  const handleClaimCancelModal = () => {
    setShowClaimModal(false)
  }

  const handleClaimConfirmModal = async () => {
    const SENDER = selectAccount;
    await web3Enable('AdMeta');
    const injector = await web3FromAddress(SENDER);
    setTipText('Wait will your claim reward are ready...')
    api?.tx.user
      .claimReward(adIndex)
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {
        setShowClaimModal(false)
      });

  }

  const handleAd = () => {
    setShowClaimModal(true)
  }

  const handleOpenPlokadot = async () => {
    if (typeof window !== "undefined") {
      await web3Enable('AdMeta');
      const allAccounts = await web3Accounts() as Wallet[];

      console.log(JSON.stringify(allAccounts))
      setWalletList(allAccounts)
      setConnect(true)
      localStorage.setItem('_account', JSON.stringify(allAccounts))
    }
  }

  const handleselectAccount = (account: string) => {
    console.log(account)
    setSelectAccount(account)
    localStorage.setItem('_select_account', account)
  }

  const handleProfileAge = (age: string) => {
    setAge(age)
  }

  const handleProfileGender = (gender: number) => {
    setGender(gender)
  }

  const handleProfilePreferences = (preferences: number) => {
    setPreferences(preferences)
  }

  const handleProfileAdDisplay = async (adDisplay: boolean) => {
    const SENDER = selectAccount;
    await web3Enable('AdMeta');
    const injector = await web3FromAddress(SENDER);
    api?.tx.user
      .setAdDisplay(adDisplay)
      .signAndSend(SENDER, { signer: injector.signer }, (status) => {
        setAdDisplay(adDisplay)
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AdAeta</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bg />

      <main className={styles.main}>
        <TopBar address={selectAccount} isConnected={isConnected} handleShowConnectModal={handleShowConnectModal} />

        <ConnectModal
          isShowModal={isShowConnectModal} handleCancelConnectModal={handleCancelConnectModal} handleConfirmConnectModal={handleConfirmConnectModal}
          isConnectWallet={isConnected}
          handleOpenPlokadot={handleOpenPlokadot}
          walletList={walletList}
          handleselectAccount={handleselectAccount}
          selectAccount={selectAccount}
        />
        <Tip text={tipText} />
        {
          isShowProfile
            ?
            <SetProfile
              handleSubmitProfile={handleSubmitProfile}
              handleProfileAge={handleProfileAge}
              handleProfileGender={handleProfileGender}
              handleProfilePreferences={handleProfilePreferences}
              handleProfileAdDisplay={handleProfileAdDisplay}
            />
            :
            null
        }
        {
          isShowAd
            ?
            <Ad handleAd={handleAd} adIpfs={adIpfs} />
            :
            null
        }
        {
          isShowClaimModal
            ?
            <Claim
              isShowModal={isShowClaimModal}
              handleClaimCancelModal={handleClaimCancelModal}
              handleClaimConfirmModal={handleClaimConfirmModal}
              claimAmount={claimAmount}
              rewardAmount={rewardAmount}
            />
            :
            null
        }
      </main>

      <footer className={styles.footer}>
        Powered by Litentry
      </footer>
    </div>
  )
}


export default Home
