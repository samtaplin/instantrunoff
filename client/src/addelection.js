import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './index.css';

import { Form, Input, Button, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const axios = require('axios');

class AddElection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      election: null
      }
    }
    componentDidMount() {
      var userstore = window.localStorage.getObject('user');
      this.setState({user: userstore});
      if (!userstore) {
        this.props.history.push("/login");
      }
    }
    render() {
      const formItemLayout = {
        labelCol: {
          xs: { span: 32 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };

      const DynamicFieldSet = () => {
        const onFinish = values => {
          this.setState({election: values});
          console.log('Received values of form:', values);
      };

        return (
          <Form size='large'
            name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish}>
            <Form.Item name="name" label="Decision Name">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Decision Description">
              <Input.TextArea style={{width:"200px"}}/>
            </Form.Item>
            <Form.List
              name="candidates"
              rules={[
                {
                  validator: async (_, candidates) => {
                    if (!candidates || candidates.length < 2) {
                      return Promise.reject(new Error('Add at least 2 choices'));
                    }
                    for (var i = 0; i < candidates.length; i++) {
                      for (var j = 0; j < candidates.length; j++) {
                        if ((i !== j) && (candidates[i] === candidates[j])) {
                          return Promise.reject(new Error('Choices must have different names'));
                        }
                      }
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Choices:' : ''}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input choice's name or delete this field.",
                          },
                        ]}
                        noStyle
                      >
                        <Input placeholder="Choice name" style={{ width: '60%' }} />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '60%' }}
                      icon={<PlusOutlined />}
                    >
                      Add choice
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            </Form>
          );
          };
    if (this.state.election === null) {
    return (
      <div>
      {this.navbar()}
      <div className='game'>
      <span>
      <div className="sectiontit">
      First name your decision and identify your options:
      </div>
      <DynamicFieldSet />
      </span>
      </div>
      </div>
      );
    } else {
      const smallmap = (j) => {
          return this.state.election.candidates.map((cand, i) => {
            let k = String(j) + String(i);
            return (
              <Option key={k} value={cand} >{cand}</Option>
            );
      });}




      const DynamicFieldSet2 = () => {
        const onFinish = values => {
          var numcands = this.state.election.candidates.length;
          var ballots = values.ballots.map((ballot, i) => {
            var jkey;
            var jvalue;
            var corder = [];
            for (var j = 1; j <= numcands; j++) {
                jkey = "preference" + String(j);
                console.log(jkey);
                jvalue = ballot.order[jkey];
                corder.push(jvalue);
            }
            return {
              order: corder,
              votes: ballot.votes,
            }
          });
          var election = this.state.election;
          election['ballots'] = ballots;
          election['numcands'] = numcands;
          election['username'] = this.state.user.username;
          election['password'] = this.state.user.password;
          axios.post('/createelect', election)
          .then(response => {
            this.setState({ createret: response.data });
            if (response.data !== "createfailed") {
              window.localStorage.setObject("user", response.data);
              this.props.history.push("/simulator");
            }
          }
        ).catch(err => {
        console.log(err);
        this.setState({ election: null });
        })
          console.log('Received values of form:', values);
          console.log('Received Ballots of form:', ballots);
          console.log('Received Election of form:', election);
      };

        return (
          <Form size='large'
            name="dynamic_form_nest_item" onFinish={onFinish}>
            <Form.List
              name="ballots"
              rules={[
                {
                  validator: async (_, ballots) => {

                    if (!ballots || ballots.length < 1) {
                      return Promise.reject(new Error('Add at least 1 preference set'));
                    } else {
                      var dupcheck;
                      for (var ballot in ballots) {

                        dupcheck = new Set();
                        if (ballots[ballot]) {
                          let cnames = Object.values(ballots[ballot].order);
                          for (var cand in cnames) {
                            if (dupcheck.has(cnames[cand])) {
                              return Promise.reject(new Error('Each choice must be listed exactly once in each preference ordering'));
                            }
                            dupcheck.add(cnames[cand]);
                          }
                        }
                      }
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({key, name, fieldkey, ...restField}) => (
                        <Space key={key} style={{display: 'flex', marginbottom: 8}} align="baseline">

                        {this.state.election.candidates.map((cand, i) => {
                              let plchold = "#" + (i + 1) + " choice:"
                              let nameplc = "preference" + (i + 1);
                              let smmap = smallmap(i);
                              return (
                                [<Form.Item

                                  name={[name, "order", nameplc]}
                                  fieldkey={[fieldkey, "order", nameplc]}
                                  rules={[{ required: true, message: 'Preference choice is required' }]}
                                  >
                                <Select key={i} label={plchold} placeholder={plchold} >
                                {smmap}
                                </Select>
                                </Form.Item>
                              ]);
                        })}
                        <Form.Item
                        {...restField}
                        name={[name, 'votes']}
                        fieldkey={[fieldkey, 'votes']}
                        rules={[{ required: true, message: 'Must input votes' }]} >
                        <Input label='votes' style={{ width: '50%' }} placeholder="Votes" />
                        </Form.Item>



                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(name)}
                        />
                      </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '60%' }}
                      icon={<PlusOutlined />}
                    >
                      Add Preference Order
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            </Form>
          );
          };
      return (
        <div>
        {this.navbar()}
        <div className='game'>
        <span>
        <div className="sectiontit">
        Now input the preference profile for this decision:
        </div>
        <DynamicFieldSet2 />
        </span>
        </div>
        </div>
      )
    }
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

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

export default AddElection;
