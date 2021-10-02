export {Borda as default};

function Borda() {
  this.name = "Borda Count"
  this.description = "In a borda count election with n candidates, each candidate receives n - i points for every ith-place vote they receive. The candidate with the most points wins."
  this.link = "https://www2.math.upenn.edu/~deturck/m170/wk10/lecture/vote2.html"
  this.election = null;
  this.step = 0;
  this.done = false;
  }
Borda.prototype.setelection = function(election) {
  this.round = {
    candidates: election.candidates.slice(),
    votes: Array(election.numcands).fill(null),
    shares: Array(election.numcands).fill(null),
    eliminated: Array(election.numcands).fill(null),
  };
  this.election = election;
  this.step = 0;
  this.done = false;
}
Borda.prototype.canforward = function() {
  return this.done === false && this.election !== null;
}
Borda.prototype.forward = function() {
  const template = this.round.candidates;
  var votes = getplacevotes(this.step, this.election, template);
  var thisround = votes.slice();
  votes = votes.map((numv, i) => numv * (this.election.numcands - 1 - this.step) );
  var tallies;
  if (this.step == 0) {
    tallies = this.round.candidates.slice().map((candidate, i) =>
    {var votetally = {
          "name":candidate,
          "tally":votes[i],
          "currnd":thisround[i],
    };
    return votetally;})
  } else {
    tallies = this.round.candidates.slice().map((candidate, i) =>
    {var votetally = {
          "name":candidate,
          "tally":votes[i] + this.round.votes[i],
          "currnd":thisround[i],
    };
    return votetally;})
  }
  tallies = tallies.sort( (a,b) => b.tally - a.tally);
  this.round.candidates = tallies.map((tal, index) => tal.name);
  this.round.votes = tallies.map((tal, index) => tal.tally);
  thisround = tallies.map((tal, index) => tal.currnd);

  let total = 0;
  for (var j = 0; j < this.round.candidates.length; j++) {
    total += this.round.votes[j];
  }
  for (var j = 0; j < this.round.candidates.length; j++) {
    this.round.shares[j] = (this.round.votes[j] / total) * 100;
    this.round.eliminated[j] = thisround[j] + " #" + (this.step + 1) + " votes counted.";
  }
  this.step += 1;
  if (this.step == this.election.numcands - 1) {
    this.done = true;
  }
  return this.round;
};
Borda.prototype.canbackward = function () {
  return this.step !== 0 && this.election !== null;
}
Borda.prototype.backward = function() {
  if (this.step == 1) {
    this.round = {
      candidates: this.election.candidates.slice(),
      votes: Array(this.election.numcands).fill(null),
      shares: Array(this.election.numcands).fill(null),
      eliminated: Array(this.election.numcands).fill(null),
    };
    this.step = 0;
  } else {
    if (this.step == this.election.numcands - 1) {
      this.done = false;
    }
    this.step -= 1;
    const template = this.round.candidates;
    var votes = getplacevotes(this.step, this.election, template);
    votes = votes.map((numv, i) => numv * (this.election.numcands - 1 - this.step) );
    var tallies = this.round.candidates.slice().map((candidate, i) =>
    {var votetally = {
          "name":candidate,
          "tally":this.round.votes[i] - votes[i],
    };
    return votetally;})
    tallies = tallies.sort( (a,b) => b.tally - a.tally);
    this.round.candidates = tallies.map((tal, index) => tal.name);
    this.round.votes = tallies.map((tal, index) => tal.tally);
    let total = 0;
    for (var j = 0; j < this.round.candidates.length; j++) {
      total += this.round.votes[j];
    }
    for (var j = 0; j < this.round.candidates.length; j++) {
      this.round.shares[j] = (this.round.votes[j] / total) * 100;
      this.round.eliminated[j] = "#" + this.step + " votes included.";
    }
  }
  return this.round;
}

function getplacevotes(place, election, template) {
  var votes = Array(election.numcands).fill(0);
  var ordering;
  var placed;
  for (var i = 0; i < election.ballots.length; i++) {
    ordering = election.ballots[i];
    placed = ordering.order[place];
    for (var j = 0; j < election.numcands; j++) {
      if (template[j] === placed) {
        votes[j] += ordering.votes;
      }
    }
  }
  return votes;
}
