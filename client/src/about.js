import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Breadcrumb} from 'antd';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import './index.css';

const { Header, Content, Footer } = Layout;


  function about() {
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
          </Nav>
          </Container>
        </Navbar>
        <Layout className="layout">
        <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '58px 0' }}>
        </Breadcrumb>
            <div className="site-layout-content">
            <span>
            <div className="sitetit">
            Social Choice
            </div>
            <div className="sectiontit">
            What is Social Choice?
            </div>
            <div className="aboutbody">
            Social Choice aggregates people's preferences to recommend a collective decision. People need to make social choices in elections,
            when deciding on a restaurant to eat at with a group of friends, and in lots of other situations. Typically, in a social
            choice, there are a fixed number of alternatives to choose from. For instance, when choosing between restaurants, a group might decide
            between thai food, burritos, pizza and burgers. Each person in the group ranks the options in some fixed order. For instance, I might choose
            thai food as my most prefered option, burgers as my second most prefered, burritos as my third and pizza as my least most prefered. Then, to
            arrive at a decision, we apply some preference aggregation rule (or decision rule) to the set of individual preferences to arrive at some collective choice.
            For instance, the plurality rule chooses the option that is the modal first preference. This tool allows users to input their set of preferences
            and apply some decision rule to it. Then, the simulator walks through the decision rule and reaches a final collective decision. The simulator also
            comes with a few pre-loaded elections that demonstrate a few of the interesting quirks of each decision rule.
            </div>
            <div className="sectiontit">
            What decision rules are supported?
            </div>
            <div className="aboutbody">
            While there are an infinite number of possible decision rules, the simulator currently supports four common rules:
            <ul>
            <li> <a href='https://math.libretexts.org/Bookshelves/Applied_Mathematics/Math_in_Society_(Lippman)/02%3A_Voting_Theory/2.03%3A_Plurality' target='_blank'>Pluraility </a> </li>
            <li> <a href='https://www2.math.upenn.edu/~deturck/m170/wk10/lecture/vote2.html' target='_blank'>Hare's Method </a> </li>
            <li> <a href='https://www2.math.upenn.edu/~deturck/m170/wk10/lecture/vote3.html'target='_blank'>Borda Count </a> </li>
            <li> <a href='http://web.math.princeton.edu/math_alive/Voting/Lab1/Condorcet.html'target='_blank'>Condorcet Method </a> </li>
            </ul>
            </div>
            <div className="sectiontit">
            Is there a 'most fair' decision rule to use?
            </div>
            <div className="aboutbody">
            No, there's no agreed upon best rule for making a social choice. It depends on what axioms we care about and what our circumstances and considerations are.
            <a href='https://plato.stanford.edu/entries/arrows-theorem/' target='_blank'> Arrow's Impossibility Theorem </a>
            states that there are no decision rules that <a href='https://plato.stanford.edu/entries/arrows-theorem/#UnrDom' target='_blank'> have an unrestricted domain, </a>
            <a href='https://plato.stanford.edu/entries/arrows-theorem/#SocOrd' target='_blank'>rank the options from best to worst with no cycles,</a> <a href='https://plato.stanford.edu/entries/arrows-theorem/#WeaPar' target='_blank'>
            prefer a first option over a second if every individual prefers the first option over the second,</a> <a href='https://plato.stanford.edu/entries/arrows-theorem/#NonDic' target='_blank'>
            don't require giving dictatorial power to one individual,</a> and <a href='https://plato.stanford.edu/entries/arrows-theorem/#IndIrrAlt' target='_blank'> aren't thrown off by adding irrelevant alternative options. </a>
            These all seem like fairly reasonable and intuitive requirements, so the reality that no decision rule satisfies them suggests that there is no 'perfect' decision rule.
            </div>
            </span>
            </div>
          </Content>
          </Layout>
          <Card fixed="bottom">
          <Card.Body>
          <Card.Title>About</Card.Title>
          <Card.Text> Social Choice was created by Sam Taplin. The source code is avaliable at https://github.com/samtaplin/instantrunoff</Card.Text>
          </Card.Body>
          </Card>
          </div>
      )
  }

export default about;
