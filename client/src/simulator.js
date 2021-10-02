import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { Table, Button, Select } from 'antd';
import Plurality from './plurality.js';
import Hare from './hare.js';
import Borda from './borda.js';
import Condorcet from './condorcet.js';
const { Option } = Select;
const axios = require('axios');

const ELECTIONS = [require('./elections/berkeleymayor.json'), require('./elections/galacticsenate.json')];
const METHODS = [new Plurality(), new Hare(), new Borda(), new Condorcet()]
class ScoreBoard extends React.Component {

  rendercandidate(i) {
    var num = i + 1;
    const rank = num.toString();
    const round = this.props.round;
    var datapoint = {
      key: rank,
      rank: rank,
      name: round.candidates[i],
      votes: round.votes[i],
      share: round.shares[i],
      elim: round.eliminated[i],
    };
    return datapoint;
  }

  render() {
    const data = this.props.round.candidates.map((cand, ind) => {
      return (this.rendercandidate(ind));
    })
    const columns = [
      {
        title: '#',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
      title: 'Choice Name',
      dataIndex: 'name',
      key: 'name',
      },
      {
      title: 'Votes',
      dataIndex: 'votes',
      key: 'votes',
      },
      {
      title: 'Share',
      dataIndex: 'share',
      key: 'share',
      },
      {
      title: 'Result',
      dataIndex: 'elim',
      key: 'elim',
      },
    ];
    return (
      <Table dataSource={data} columns={columns} />
    );
  }
}
class BallotProfile extends React.Component {
  renderballot(i, n) {
    var datapoint = {};
    datapoint['ballots'] = this.props.election.ballots[i].votes;
    for (var j = 0; j < n; j++) {
      datapoint['#' + (j + 1)] = this.props.election.ballots[i].order[j];
    }
    return datapoint;
  }
  render() {
    var sorted = this.props.election.ballots.sort((a,b) => b.votes - a.votes);
    const data = sorted.map((ballot, ind) => {
      return (this.renderballot(ind, this.props.election.numcands));
    })
    var columns = [];
    columns.push({
      title: '# of Ballots',
      dataIndex: 'ballots',
      key: 'ballots',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.ballots - b.ballots,
    });
    for (var j = 0; j < this.props.election.numcands; j++) {
      columns.push({
        title: '#' + (j + 1) + ' Preference',
        dataIndex: '#' + (j + 1),
        key: '#' + (j + 1),
      });
    }
    return (
      <Table dataSource={data} columns={columns} />
    );
  }
}

class Simulator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        candidates: Array(4).fill(null),
        votes: Array(4).fill(null),
        shares: Array(4).fill(null),
        eliminated: Array(4).fill(null),
      }],
      methods: METHODS,
      elections: ELECTIONS,
      elnind: null,
      methind: null,
      turn: 0,
    };
    this.loaduserelections = this.loaduserelections.bind(this);
  }

  changemeth(ind) {
    if (ind.value !== this.state.methind) {
    this.setState({
      methind: ind.value,
      turn: 0,
    });
      if(this.state.elnind != null) {
        const election = this.state.elections[this.state.elnind];
        this.setState({
          history: [{
            candidates: election.candidates.slice(),
            votes: Array(election.numcands).fill(null),
            shares: Array(election.numcands).fill(null),
            eliminated: Array(election.numcands).fill(null),
          }],
        });
        this.state.methods[ind.value].setelection(election);
      }
    }
  }

  changeeln(ind) {
    if (ind.value !== this.state.elnind) {
      const election = this.state.elections[ind.value];
    this.setState({
      elnind: ind.value,
      history: [{
        candidates: election.candidates.slice(),
        votes: Array(election.numcands).fill(null),
        shares: Array(election.numcands).fill(null),
        eliminated: Array(election.numcands).fill(null),
      }],
      turn: 0,
    });
      if (this.state.methind != null) {
        this.state.methods[this.state.methind].setelection(election);
      }
    }
  }

  ddmethod() {
    const moves = this.state.methods.map((method, i) => {
        const desc = method.name;
          return (
            <Option value={i} >{desc}</Option>
          );
    });
    return (
      <Select
    labelInValue
    placeholder="Select a Decision Rule"
    style={{ width: 240 }}
    size='large'
    onChange={this.changemeth.bind(this)}
    >
    {moves}
    </Select>
    );
  }

  ddelection() {
    const moves = this.state.elections.map((election, i) => {
        const desc = election.name;
          return (
            <Option value={i} >{desc}</Option>
          );
    });
    return (
      <Select
    labelInValue
    placeholder="Select a Decision"
    style={{ width: 240 }}
    size='large'
    onChange={this.changeeln.bind(this)}
    >
    {moves}
    </Select>
    );
  }
  handleforward() {
    if (this.state.elnind != null && this.state.methind != null && this.state.methods[this.state.methind].canforward()) {
      const round = this.state.methods[this.state.methind].forward();
      const history = this.state.history.slice();
      const turn = this.state.turn + 1;

      this.setState({
        history: history.concat([{
          candidates: round.candidates,
          votes: round.votes,
          shares: round.shares,
          eliminated: round.eliminated,
        }]),
        turn: turn,
      });
    }
  }
    handlebackward() {
      if (this.state.elnind !== null && this.state.methind !== null && this.state.methods[this.state.methind].canbackward()) {
        const round = this.state.methods[this.state.methind].backward();
        const history = this.state.history.slice();
        const turn = this.state.turn + 1;
        this.setState({
          history: history.concat([{
            candidates: round.candidates,
            votes: round.votes,
            shares: round.shares,
            eliminated: round.eliminated,
          }]),
          turn: turn,
        });
      }
    }

  loaduserelections() {
    var userstore = window.localStorage.getObject('user');
    this.setState({user: userstore});
    console.log(userstore);
    if (userstore && userstore.eids) {

      var newelections = this.state.elections;
      for (var eid of userstore.eids) {
        axios.post('/getelect', {eid: eid})
        .then(response => {
          newelections.push(response.data);
          this.setState({elections: newelections, user: userstore});
        }
        ).catch(err => {
        console.log(err);
        })
      }
    }
  }
  componentDidMount() {
    this.loaduserelections();
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.turn];
    const ddmeth = this.ddmethod();
    const ddelect = this.ddelection();
    const forward = <Button onClick={() => this.handleforward()} block>Move Forward a Step</Button>;
    const backward = <Button onClick={() => this.handlebackward()} block>Move Backwards a Step</Button>;
    let scenario;
    let mscenario;
    let ballotprof;
    let userwelcome;
    let logout;
    if (this.state.elnind !== null) {
      scenario = this.state.elections[this.state.elnind].description;
      ballotprof = <BallotProfile election={this.state.elections[this.state.elnind]} />
    } else {
      scenario = "Please select a decision.";
      var nelec = {
        "ballots":[],
        "numcands":4,
      };
      ballotprof = <BallotProfile election={nelec} />
    }
    if (this.state.methind !== null) {
      mscenario = this.state.methods[this.state.methind].description;
    } else {
      mscenario = "Please select a decision algorithm.";
    }
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
      <div>
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
      <div className="game">
        <span>
        <div className="scenario">{mscenario}</div>
        <div className="scenario">{scenario}</div>
        </span>
        <div className="game-scoreboard">
          <span>
          <div className="sectiontit">Results</div>
          <div id="forward">
          {forward}
          </div>
          <div id="forward">
          {backward}
          </div>
          <ScoreBoard
            round={current}
          />
          <div className="sectiontit">Preference Profile</div>
          {ballotprof}
          </span>
        </div>
        <div className="choicedd">
        <span>
        <div className="sectiontit">Decision:</div>
        <div id="controls">{ddelect}</div>

        </span>
        </div>
        <div className="choicedd">
          <span>
          <div className="sectiontit">Decision Rule:</div>
          <div>{ddmeth}</div>
          </span>
        </div>
      </div>
      <Card fixed="bottom">
      <Card.Body>
      <Card.Title>Outcome look wrong? </Card.Title>
      <Card.Text> This tool is a work in progress. If you're getting an incorrect result
      submit an issue at https://github.com/samtaplin/instantrunoff/issues. </Card.Text>
      </Card.Body>
      </Card>
      </div>
    );
  }
}
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

Storage.prototype.removeObject = function(key, value) {
    this.removeItem(key, JSON.stringify(value));
}


export default Simulator;
