import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate} from 'react-router-dom'
import axios from "axios"
import '../css/home.css'




const Sign = () => {

  const [messageApi, contextHolder] = message.useMessage()
  const nevigate = useNavigate()

  const messageSend = (type, text) => {
    messageApi.open({
      type: type,
      content: text
    })
  }

  const onFinish = async (values) => {
    if(!values.username || !values.password || !values.email || !values.name){
      return messageSend("error", 'Please fill all fields' )
    }
    try {
      const res = await axios.post("https://expensive-api.sciencetechnolo.repl.co/api/v1/sign", values)
      messageSend("success", "Sign- in successfully")
      localStorage.setItem("user", JSON.stringify(res.data.user.username));
      nevigate(`/`)
      
    } catch (error) {
      messageSend("error", error.message)
      
    }
  };
  return (
    <div className="login">
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
        label="Name"
        name="name"
      >
        <Input />
      </Form.Item>


      <Form.Item
        label="Email"
        name="email"
      >
        <Input type="email" />
      </Form.Item>

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

      <Link to="/login" >I have account</Link>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
};
export default Sign;