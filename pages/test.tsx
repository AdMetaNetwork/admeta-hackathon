import { message } from 'antd';
import axios from 'axios';
import type { NextPage } from 'next'
import { useState } from 'react';

const data = {
  "dataSource": "Cluster0",
  "database": "database0",
  "collection": "userAndAds",
  "document": {
    "ip": "123",
    "user-agent": "abc",
    "account": "efjow1j2eokfoen",
    "adurl": "abcde.com",
    "adimg": "abcde"
  }
}

const Home: NextPage = () => {
  const postInfo = () => {
    fetch('https://data.mongodb-api.com/app/data-cqvlw/endpoint/data/v1/action/insertOne', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'api-key': '4B9cdAP6rB9mrIQrCYdwCHP2skkoVHyLHDhP4iCW0BaWU8znf24VvYMM6a6AW6DX'
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const [account, setAccount] = useState('')
  const [adurl, setAdurl] = useState('')
  const [adimg, setAdimg] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')

  const up = () => {
    axios({
      method: 'post',
      url: '/api/bind',
      data: {
        account,
        adurl,
        adimg
      },
    }).then((e) => {
      console.log(e.data)
      message.info(`ok: ${e.data.name}`)

    })
  }

  const getmb = () => {
    axios({
      method: 'get',
      url: `/api/getmb`,
    }).then((e) => {
      console.log(e.data)
      message.info(`ok: ${e.data.name}`)

    })
  }

  const testnode = () => {
    axios({
      method: 'get',
      url: `/api/random`,
    }).then((e) => {
      console.log(e.data)
      message.info(`ok: ${e.data.name}`)

    })
  }

  return (
    <>
      <p>
        <input
          type="text"
          value={account}
          style={{ width: 500 }}
          onChange={(e) => {
            console.log(e.target.value)
            setAccount(e.target.value)
          }} placeholder="account" />
      </p>
      <p>
        <input
          type="text"
          value={adurl}
          style={{ width: 500 }}
          onChange={(e) => {
            console.log(e.target.value)
            setAdurl(e.target.value)
          }} placeholder="adurl" />
      </p>
      <p>
        <input
          type="text"
          value={adimg}
          style={{ width: 500 }}
          onChange={(e) => {
            console.log(e.target.value)
            setAdimg(e.target.value)
          }} placeholder="adimg" />
      </p>
      <button onClick={up}>submit</button>
      <div style={{marginBottom: 20}}></div>
      <button onClick={getmb}>getmb</button>
      <button onClick={testnode}>testnode</button>
    </>
  )
}


export default Home
