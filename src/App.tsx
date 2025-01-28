import {useEffect, useState} from "react";
import {Button, Image, Table} from "antd";
import toast from "react-hot-toast";
//@ts-ignore
window.Telegram.WebApp.disableVerticalSwipes();
//@ts-ignore
window.Telegram.WebApp.expand();

function App() {
  const [timeToMidnight, setTimeToMidnight] = useState<any>({
    hours: 0,
    minutes: 0,
  })
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const midnight = new Date(2025, 0, 29, 0, 0, 0)
      setTimeToMidnight({
        times: midnight.getTime() - now.getTime(),
        hours: Math.floor((midnight.getTime() - now.getTime()) / 1000 / 60 / 60),
        minutes: Math.floor(((midnight.getTime() - now.getTime()) / 1000 / 60) % 60),
        seconds: Math.floor(((midnight.getTime() - now.getTime()) / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const [prize, setPrize] = useState<any>(null)
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'key',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Bú',
      dataIndex: 'prize',
    }
  ]
  const [data, setData] = useState<any>([])

  const login = async () => {
    try {
      // @ts-ignore
      const initData = window.Telegram.WebApp.initData
      if (!initData) return
      const loginResp = await fetch('https://lixi-be.fcs.ninja/api/auth/login?' + initData)
      if (!loginResp.ok) return
      const loginData = await loginResp.json()
      const token = loginData.accessToken
      window.localStorage.setItem('token', token)
      console.log(token)

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    login().then()
  }, []);

  const fetchPrizes = async () => {
    try {
      const token = window.localStorage.getItem('token')
      if (!token) return
      const prizesResp = await fetch('https://lixi-be.fcs.ninja/api/auth/prized-users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!prizesResp.ok) return
      const prizesData = await prizesResp.json()
      setData(prizesData.map((user: any, index: number) => ({
        key: user.id,
        stt: index + 1,
        name: user?.telegramUsername ?? (user?.telegramFirstName + " " + user?.telegramLastName),
        prize: user.prize
      })))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPrizes().then()
  }, []);

  return (
    <>
      <div>
        <h1 style={{textAlign: 'center'}}>FCS LÌ XÌ ĐẦU NĂM</h1>
      </div>
      <h4 style={{textAlign: 'center'}}>
        {timeToMidnight.hours}H:{timeToMidnight.minutes}M:{timeToMidnight.seconds}S
      </h4>
      <h4 style={{textAlign: 'center'}}>
        Còn {50 - data.length} bao lì xì không nhanh thì hết nhé các cháu ơi
      </h4>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Button type='primary' size='large' onClick={async () => {
          try {
            if (timeToMidnight.times > 0) {
              toast.error('Chưa đến thời gian nhận lì xì nhé')
              return
            }
            const token = window.localStorage.getItem('token')
            if (!token) return
            const prizeResp = await fetch('https://lixi-be.fcs.ninja/api/auth/random-prize', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            if (!prizeResp.ok) {
              toast.error('Lỗi hoặc là cháu đã nhận lì xì rồi tham vừa thôi nhé')
              return
            }
            const prizeData = await prizeResp.text()
            console.log(prizeData)
            setPrize(prizeData.trim())
          } catch (err) {
            console.log(err)
            toast.error('Lỗi hoặc là  cháu đã nhận lì xì rồi tham vừa thôi nhé')
          } finally {
            await fetchPrizes()
          }
        }}>Nhận lì xì</Button>
      </div>
      {
        prize && (
          <>
            <div>
              <h3 style={{textAlign: 'center'}}>Chúc mừng cháu được: </h3>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Image src={`/${prize}.jpeg`} preview={false}/>
            </div>
          </>
        )
      }
      <h3 style={{textAlign: 'center'}}>Các cháu khác: </h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{y: 500, x: 'max-content'}}
      />


    </>
  )
}

export default App
