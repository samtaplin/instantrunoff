export {Plurality as default};

function Plurality() {
  this.name = "Plurality"
  this.description = "In a Plurality election, the candidate with the most first place votes wins even if she doesn't get a majority."
  this.link = "https://math.libretexts.org/Bookshelves/Applied_Mathematics/Math_in_Society_(Lippman)/02%3A_Voting_Theory/2.03%3A_Plurality"
  this.election = null;
  this.step = 0;
  }
Plurality.prototype.setelection = function(election) {
  this.round = {
    candidates: election.candidates.slice(),
    votes: Array(election.numcands).fill(null),
    shares: Array(election.numcands).fill(null),
    eliminated: Array(election.numcands).fill(null),
  };
  this.election = election;
  this.step=0;
}
Plurality.prototype.canforward = function() {
  return this.step === 0 && this.election !== null;
}
Plurality.prototype.forward = function() {
  var votes = getplacevotes(0, this.election);
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
  for (var j = 0; j < this.round.candidates.length; j++) {
    this.round.shares[j] = (this.round.votes[j] / total) * 100;
    if (j === 0) {
      this.round.eliminated[j] = "Winner";
    } else {
      this.round.eliminated[j] = "Eliminated";
    }
  }
  this.step = 1;
  return this.round;
};
Plurality.prototype.canbackward = function () {
  return this.step === 1 && this.election !== null;
}
Plurality.prototype.backward = function() {
    this.round = {
      candidates: this.election.candidates.slice(),
      votes: Array(this.election.numcands).fill(null),
      shares: Array(this.election.numcands).fill(null),
      eliminated: Array(this.election.numcands).fill(null),
    };
    this.step = 0;
  return this.round;
}

function getplacevotes(place, election) {
  var votes = Array(election.numcands).fill(0);
  var ordering;
  var placed;
  for (var i = 0; i < election.ballots.length; i++) {
    ordering = election.ballots[i];
    placed = ordering.order[place];
    for (var j = 0; j < election.numcands; j++) {
      if (election.candidates[j] === placed) {
        votes[j] += ordering.votes;
      }
    }
  }
  return votes;
}
