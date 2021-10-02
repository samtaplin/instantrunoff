export {Hare as default};

function Hare() {
  this.name = "Hare's Method"
  this.description = "In a Hare's method election, the candidate with the fewest first place votes is eliminated. Ballots with that candidate as their first choice are reallocated to their second choice candidates. This process continues until one candidate has at least 50% of the first place vote."
  this.link = "https://www2.math.upenn.edu/~deturck/m170/wk10/lecture/vote3.html"
  this.election = null;
  this.step = 0;
  this.done = false;
  this.defeated = new Set();
  }
Hare.prototype.setelection = function(election) {
  this.round = {
    candidates: election.candidates.slice(),
    votes: Array(election.numcands).fill(null),
    shares: Array(election.numcands).fill(null),
    eliminated: Array(election.numcands).fill(null),
  };
  this.election = election;
  this.step = 0;
  this.done = false;
  this.defeated = new Set();
}
Hare.prototype.canforward = function() {
  return this.done === false && this.election !== null;
}
Hare.prototype.forward = function() {
  var votes = getplacevotes(0, this.election, this.defeated);
  var tallies = this.election.candidates.slice().map((candidate, i) =>
  {var votetally = {
        "name":candidate,
        "tally":votes[i],
  };
  return votetally;})
  this.round.candidates = tallies.sort( (a,b) => b.tally - a.tally).map((tal, index) => tal.name);
  this.round.votes = votes.sort( (a, b) => b - a);
  let total = 0;
  for (var j = 0; j < this.round.candidates.length; j++) {
    total += votes[j];
  }
  if (this.round.votes[0] > (total / 2)) {
    for (var j = 0; j < this.round.candidates.length; j++) {
      this.round.shares[j] = (this.round.votes[j] / total) * 100;
      if (j === 0) {
        this.round.eliminated[j] = "Winner";
      } else {
        this.round.eliminated[j] = "Eliminated";
      }
    }
    this.done = true;
  } else {
    for (var j = 0; j < this.round.candidates.length; j++) {
      this.round.shares[j] = (this.round.votes[j] / total) * 100;
      if (j < this.round.candidates.length - 1 - this.step) {
        this.round.eliminated[j] = "Active";
      } else {
        this.round.eliminated[j] = "Eliminated";
      }
    }
    this.defeated.add(this.round.candidates[this.round.candidates.length - 1 - this.step])
  }

  this.step += 1;
  return this.round;
};
Hare.prototype.canbackward = function () {
  return this.step !== 0 && this.election !== null;
}
Hare.prototype.backward = function() {
    if (this.done == true) {
      this.done = false;
    }
    this.step -= 1;
    this.defeated.delete(this.round.candidates[this.round.candidates.length - 1 - this.step]);
    if (this.step == 0) {
      this.round = {
        candidates: this.election.candidates.slice(),
        votes: Array(this.election.numcands).fill(null),
        shares: Array(this.election.numcands).fill(null),
        eliminated: Array(this.election.numcands).fill(null),
      };
    } else {
      this.step -= 1;
      this.defeated.delete(this.round.candidates[this.round.candidates.length - 1 - this.step]);
      this.forward();
    }

    return this.round;
}

function getplacevotes(place, election, defeated) {
  var votes = Array(election.numcands).fill(0);
  var ordering;
  var placed;
  for (var i = 0; i < election.ballots.length; i++) {
    ordering = election.ballots[i];
    placed = ordering.order[place];
    var offset = 0;
    while (defeated.has(placed)) {
      offset += 1;
      placed = ordering.order[place + offset];
    }
    for (var j = 0; j < election.numcands; j++) {
      if (election.candidates[j] === placed) {
        votes[j] += ordering.votes;
      }
    }
  }
  return votes;
}
