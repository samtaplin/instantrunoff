# Welcome to Social Choice

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It was designed with [AntDesign](https://ant.design/), an enterprise-class UI design language and React-based implementation.
Social Choice walks users through the steps of major social decision algorithms, allowing users to understand how the algorithms work and arrive at a collective decision.
## Available Decision Rules

In the simulator, users can walk through:

### Plurality

The simplest decision rule.
In a Plurality election, the candidate with the most first place votes wins even if she doesn't get a majority.

### Hare's Method

Also known as ranked choice. In a Hare's method election, the candidate with the fewest first place votes is eliminated. Ballots with that candidate as their first choice are reallocated to their second choice candidates. This process continues until one candidate has at least 50% of the first place vote.

### Borda Count

In a borda count election with n candidates, each candidate receives n - i points for every ith-place vote they receive. The candidate with the most points wins.

### Condorcet Method

In a Condorcet election, candidates are compared head to head. If one candidate wins every head-to-head matchup, he's the Condorcet winner. The votes column counts the number of head-to-head elections won and the share column counts the share of head-to-head elections won. A winner must have a share of 100.

## Learn More

You can learn more about Social Choice Theory at [Stanford's Encyclopedia of Philosophy](https://plato.stanford.edu/entries/social-choice/).
