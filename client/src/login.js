import React from 'react';
import { Form, Input, Button, Checkbox, Layout, Breadcrumb, notification} from 'antd';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import './index.css';

const { Content } = Layout;
const axios = require('axios');

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createbutton() {
    const CreateAccount = () => {
      const onFinish = (values) => {
        const article = {
          password: values.password,
          username: values.username
        }
        axios.post('/create/', article)
        .then(response => {
          this.setState({ createres: response.data });
          if (response.data !== "Username Already Exists") {
            window.localStorage.setObject("user", response.data);
            this.props.history.push("/simulator");
          }
        }
      ).catch(err => {
      console.log(err);
      this.setState({ createres: 'denied' });
      })
      };

      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      return (
        <Form
          name="create"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your new username!',
              },
              { max: 15, message: 'Username must be less 15 or less characters.' },
              {
                        pattern: new RegExp(/^[A-Z@.a-z0-9]*$/i),
                        message: "Username must be alphanumeric."
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
              { max: 25, message: 'Password must be 25 or fewer characters.' },
            ]}
          >
            <Input.Password />
          </Form.Item>


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
      );
    };
    return CreateAccount;
  }

  loginbutton() {
    const UserPass = () => {
      const onFinish = (values) => {
          const article = {
            password: values.password,
            username: values.username
          }
          axios.post('/login/', article)
          .then(response => {
            this.setState({ loginres: response.data });
            if (response.data !== 'denied') {
              window.localStorage.setItem("user", JSON.stringify(response.data));
              this.props.history.push("/simulator");
            }
          }
        ).catch(err => {
        console.log(err);
        this.setState({ loginres: 'denied' });
        })
        console.log('Success:', values);
      };

      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

      return (
        <Form
          name="login"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',

              },
              { max: 15, message: 'Username must be 15 or fewer characters.' },
              {
                        pattern: new RegExp(/^[A-Z@.a-z0-9]*$/i),
                        message: "Username must be alphanumeric."
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

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
      );
    };
    return UserPass;
  }

  render() {
    const UserPass = this.loginbutton();
    const CreateAccount = this.createbutton();
    const head = this.navbar();
    let notif;
    let cnotif;
    if (this.state.loginres === 'denied') {
      notif = notification['error']({message:'Login Failed',
      description:'Please try your username and password again.',
      placement:'bottomright', duration:8});
    } else {
      notif = '';
    }
    if (this.state.createres === 'denied') {
      cnotif = notification['error']({message:'Could not create account!',
      description:'Username already exists',
      placement:'bottomright', duration:8});
    } else {
      cnotif = ''
    }
    return (
      <div>
      {head}
      <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '58px 0' }}>
      </Breadcrumb>
      <div className="site-layout-content">
      <span>
      <div className="sectiontit">
      Log-In:
      </div>
      <UserPass />
      {notif}
      {cnotif}
      <div className="sectiontit">
      Or create an account:
      </div>
      <CreateAccount />
      </span>
      </div>
      </Content>
      </Layout>
    </div>
  );
  }
  navbar() {
    let userwelcome;
    let logout;
    if (this.state.user) {
      userwelcome = "Logged in as " + this.state.user.username;
      logout = <Button className="username" onClick= {() => {window.localStorage.removeObject('user');
      this.props.history.push("/");
    }}>Log Out</Button>;
    } else {
      userwelcome = "";
      logout = "";
    }
    return (
    <Navbar fixed="top" bg="primary" variant="dark">
      <Container>
      <Navbar.Brand href="/instantrunoff/">Social Choice</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/instantrunoff/">About</Nav.Link>
        <Nav.Link href="/instantrunoff/simulator">Run Decision Algorithms</Nav.Link>
        <Nav.Link href="/instantrunoff/login">Log In/Create Account</Nav.Link>
        <Nav.Link href="/instantrunoff/addelection">Create my Own Scenario</Nav.Link>
        <Navbar.Text>{userwelcome}</Navbar.Text>
        {logout}
      </Nav>
      </Container>
    </Navbar>
    )
  }
}




export default Login;
