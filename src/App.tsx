import {useEffect, useState} from "react";
import {Button, Image, Table} from "antd";


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
        hours: Math.floor((midnight.getTime() - now.getTime()) / 1000 / 60 / 60),
        minutes: Math.floor(((midnight.getTime() - now.getTime()) / 1000 / 60) % 60),
        seconds: Math.floor(((midnight.getTime() - now.getTime()) / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lì xì',
      dataIndex: 'prize',
    }
  ]
  const data: any = []

  return (
    <>
      <div>
        <h1 style={{textAlign: 'center'}}>FCS LÌ XÌ ĐẦU NĂM</h1>
      </div>
      <h4 style={{textAlign: 'center'}}>
        {timeToMidnight.hours}H:{timeToMidnight.minutes}M:{timeToMidnight.seconds}S
      </h4>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Button type='primary' size='large'>Nhận lì xì</Button>
      </div>
      <div>
        <h3 style={{textAlign: 'center'}}>Cháu được: </h3>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Image src='/1k.jpeg' preview={false}/>
      </div>
      <h3 style={{textAlign: 'center'}}>Các cháu khác: </h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />


    </>
  )
}

export default App
