import  React from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

import '../css/home.css'

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage()

  
  const nevigate = useNavigate()

  const messageSend = (type, text) => {
    messageApi.open({
      type: type,
      content: text
    })
  }


  const onFinish = async (values) => {
    if(!values.username || !values.password ){
      return messageSend("error", 'Please fill all fields' )
    }
    try {
      const res = await axios.post("/api/v1/login", values)
      messageSend("success", "Login Successfully")
      localStorage.setItem("user", JSON.stringify(res.data.user.username));
        nevigate('/')
      
    } catch (error) {
      messageSend("error", "Internal error")
    
    }
  };
 
  return (
    <div className='login'>
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
      className="container my-2"
    >
      {contextHolder}
      <Form.Item
        label="Username"
        name="username"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
      >
        <Input.Password />
      </Form.Item>

      <Link to="/sign" >I have no account</Link>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <button className="btn primary-btn"> Log on</button>

      </Form.Item>
    </Form>

    </div>
  )
}

export default Login;