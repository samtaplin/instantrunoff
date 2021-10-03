export {Condorcet as default};

function Condorcet() {
  this.name = "Condorcet Method"
  this.description = "In a Condorcet election, candidates are compared head to head. If one candidate wins every head-to-head matchup, he's the Condorcet winner. The votes column counts the number of head-to-head elections won and the share column counts the share of head-to-head elections won. A winner must have a share of 100."
  this.link = "hhttp://web.math.princeton.edu/math_alive/Voting/Lab1/Condorcet.html"
  this.election = null;
  this.step = 0;
  this.i = 0;
  this.j = 1;
  this.done = false;
  }
Condorcet.prototype.setelection = function(election) {
  this.round = {
    candidates: election.candidates.slice(),
    votes: Array(election.numcands).fill(0),
    shares: Array(election.numcands).fill(null),
    eliminated: Array(election.numcands).fill(null),
  };
  this.election = election;
  this.step = 0;
  this.done = false;
  this.i = 0;
  this.j = 1;
}
Condorcet.prototype.canforward = function() {
  return this.done === false && this.election !== null;
}
Condorcet.prototype.forward = function() {
  const candorder = this.election.candidates;
  if (this.i === this.election.numcands) {
    this.done = true;
    var tallies;
    tallies = candorder.slice().map((candidate, i) =>
    {var votetally = {
          "name":candidate,
          "tally":this.round.votes[i],
    };
    return votetally;})
    tallies = tallies.sort( (a,b) => b.tally - a.tally);
    this.round.candidates = tallies.map((tal, index) => tal.name);
    this.round.votes = tallies.map((tal, index) => tal.tally);
    let total = this.election.numcands - 1;
    for (var j = 0; j < this.round.candidates.length; j++) {
      this.round.shares[j] = (this.round.votes[j] / total) * 100;
      if (this.round.votes[j] === total) {
        this.round.eliminated[j] = "Condorcet Winner";
      } else {
        this.round.eliminated[j] = "Non-Winner";
      }
    }
    return this.round;
  }
  var winner;
  var winvotes;
  var losevotes;
  var temp;
  temp = geththwinner(this.election, this.i, this.j);
  winner = temp[0];
  winvotes = temp[1];
  losevotes = temp[2];
  let total = this.election.numcands - 1;
  let status;
  if (winner !== 'tie') {
    this.round.votes[winner] += 1;
    let loser;
    if (this.i === winner) {
      loser = this.j;
    } else {
      loser = this.i;
    }
    status = candorder[winner] + " beats " + candorder[loser] + " by " + winvotes + " votes to " + losevotes + ".";
  } else {
    status = candorder[this.i] + " and " + candorder[this.j] + " tie with " + winvotes + " votes each."
  }
  for (j = 0; j < this.round.candidates.length; j++) {
    this.round.shares[j] = (this.round.votes[j] / total) * 100;
    this.round.eliminated[j] = status;
  }
  this.step += 1;
  do {
    if (this.j < this.election.numcands - 1) {
      this.j += 1;
    } else {
      this.i += 1;
      this.j = 0;
    }
  }
  while (this.i >= this.j && this.i !== this.election.numcands);
  return this.round;
};
Condorcet.prototype.canbackward = function () {
  return this.step !== 0 && this.election !== null;
}

Condorcet.prototype.loopback = function () {
  do {
    if (this.j === 0) {
      this.i -= 1;
      this.j = this.election.numcands - 1;
    } else {
      this.j -= 1;
    }
  }
  while (this.i >= this.j);
}

Condorcet.prototype.swap = function(i, j) {
  this.test = i;
  this.test2 = j;
  let tempc = this.round.candidates[j];
  let tempv = this.round.votes[j];
  this.round.candidates[j] = this.round.candidates[i];
  this.round.votes[j] = this.round.votes[i];
  this.round.candidates[i] = tempc;
  this.round.votes[i] = tempv;
}

Condorcet.prototype.backward = function() {
  if (this.step === 1) {
    this.round = {
      candidates: this.election.candidates.slice(),
      votes: Array(this.election.numcands).fill(0),
      shares: Array(this.election.numcands).fill(null),
      eliminated: Array(this.election.numcands).fill(null),
    };
    this.step = 0;
    this.i = 0;
    this.j = 1;

  } else {
    if (this.done === true) {
      this.done = false;
      const candorder = this.election.candidates;
      for (var i = 0; i < this.election.numcands; i++) {
        if (this.round.candidates[i] !== candorder[i]) {
          for (var j = i + 1; j < this.election.numcands; j++) {
            if (this.round.candidates[j] === candorder[i]) {
              this.swap(i, j);
              break;
            }
          }
        }
      }
      this.step -= 1;
    } else {
      this.step -= 2;
      this.loopback()
      var winner;
      var temp;
      temp = geththwinner(this.election, this.i, this.j);
      winner = temp[0];
      if (winner !== 'tie') {
        this.round.votes[winner] -= 1;
      }
    }
    this.loopback()
    temp = geththwinner(this.election, this.i, this.j);
    winner = temp[0];
    if (winner !== 'tie') {
      this.round.votes[winner] -= 1;
    }
    this.forward()
  }
  return this.round;
}

function geththwinner(election, cand1, cand2) {
  var c1votes = 0;
  var c2votes = 0;
  var ordering;
  for (var i = 0; i < election.ballots.length; i++) {
    ordering = election.ballots[i];
    for (var j = 0; j < election.numcands; j++) {
      if (election.candidates[cand1] === ordering.order[j]) {
        c1votes += ordering.votes;
        break;
      } else if (election.candidates[cand2] === ordering.order[j]) {
        c2votes += ordering.votes;
        break;
      }
    }
  }
  if (c1votes > c2votes) {
    return [cand1, c1votes, c2votes];
  } else if (c2votes > c1votes) {
    return [cand2, c2votes, c1votes];
  } else {
    return ['tie', c1votes, c2votes];
  }
}
