import { useState, useEffect } from "react"
import { DatePicker, Form, Input, Table, Modal, Select, message} from "antd"
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Header from './header'
import moment from "moment"

import "../css/home.css"

import Analytics from "./analytics"


const { RangePicker } = DatePicker

const Home = () => {

  const [messageApi, contextHolder] = message.useMessage()

  const messageSend = (type, text) => {
    messageApi.open({
      type: type,
      content: text
    })
  }

  const [data, setData] = useState("")
  const [model, setModel] = useState(false)
  const [token, setToken] = useState("")
  const [frequency, setFrequency] = useState("7")
  const [selectDate, setSelectDate] = useState([])
  const [type, setType] = useState("all")
  const [viewData, setViewData] = useState("table")
  const [editable, setEditable] = useState(null)
  const [change, setChange] = useState(1);



  const nevigate = useNavigate()

  const deleteData = async (record) => {
    try {
      await axios.post(`/api/v1/${token}/deleteTrans`, { id: record._id })
      setChange(change + 1)
    } catch (error) {
      
    }
  }

  const columns = [
    {
      "title": "Date",
      "dataIndex": "date",
      "render": (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
    },
    {
      "title": "Amount",
      "dataIndex": "amount",
    },
    {
      "title": "Type",
      "dataIndex": "type",
    },
    {
      "title": "Category",
      "dataIndex": "category",
      "key": "category"
    },
    {
      "title": "Description",
      "dataIndex": "description",
      "key": "description"
    },
    {
      "title": "Actions",
      "render": (text, record) => (
        <div>
          <EditOutlined style={{'marginRight': '5px'}} onClick={() => {
            record.date = moment(record.date).format("YYYY-MM-DD");
            setEditable(record)
            setModel(true)
          }} />
          <DeleteOutlined onClick={() => {
            deleteData(record)
          }} />
        </div>
      )
    }
  ]

  const onFinish = async (values) => {
    if(!values.amount || !values.type || !values.description || !values.category || !values.date){
      return messageSend("error", "Please fill the all fields")
    }
    try {
      if (editable) {
       await axios.post(`/api/v1/${token}/updateTrans`, { id: editable._id, values })
        setChange(change + 1)
        
        setEditable(null)
      }
      else {
        await axios.post(`/api/v1/${token}/addTrans`, values)
        setChange(change + 1)
      }
    } catch (error) {
      
    }
    setModel(false)
  }

  useEffect(() => {
    const dat = async () => {
      let toko = JSON.parse(localStorage.getItem('user'))
      if (!toko) {
        return nevigate('/login')
      }
      
      setToken(toko)
      try {
        const res = await axios.post(`/api/v1/${toko}/getTrans`, { frequency, selectDate, type })
        res.data.data.map((data) => data.key = data._id)
        setData(res.data.data)
      } catch (error) {
        
      }
    }
    dat()
    
    
  }, [frequency, selectDate, nevigate, type, change])

  return (
    <>
      <Header />
      {contextHolder}
      <Modal title="add transaction" open={model} onCancel={() => { setModel(false) }} footer={false}>
        <Form initialValues={editable} onFinish={onFinish}>
          <Form.Item label="Amount" name="amount" >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Type" name="type" >
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" >
            <Select>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="College">College</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date" >
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description" >
            <Input />
          </Form.Item>
          <button className="btn " onClick={() => setModel(false)}>Cancel</button>
          <button type="submit" className="btn primary-btn">Add</button>
        </Form>
      </Modal>
      <div className="box my-2">
        <div className="filters my-3">
          <div className="frequency">
            <Select className='select-opt m-2' value={frequency} onChange={(value) => setFrequency(value)}>
              <Select.Option value="7">Last 5 days</Select.Option>
              <Select.Option value="30">Last 30 days</Select.Option>
              <Select.Option value="365">Last 365 days</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <RangePicker className='my-2' value={selectDate} onChange={(value) => setSelectDate(value)} />
            )}
          </div>
          <div className='type'>
            <Select className="select-opt" value={type} onChange={(value) => setType(value)}>
              <Select.Option value='all'>All</Select.Option>
              <Select.Option value='income'>Income</Select.Option>
              <Select.Option value='expense'>Expensive</Select.Option>
            </Select>
          </div>
          <div className='change-icon'>
            <UnorderedListOutlined className={`${viewData === 'table' ? 'active-icon' : 'inactive-icon'} btn`} onClick={() => setViewData('table')} />
            <AreaChartOutlined className={`${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'} btn`} onClick={() => setViewData('analytics')} />
          </div>
          <button className="btn btn-primary" onClick={() => { setModel(!model) }}>Add</button>
          </div>
        </div>
          <div className='content'>
            {viewData === 'table' ? (
              <Table dataSource={data} columns={columns} />
            ) : (
              <Analytics data={data} />
            )}
          </div>
        
        
      </>
    )
}

export default Home;