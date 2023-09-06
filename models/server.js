const express = require('express'); // Include ExpressJS
const cors = require('cors');
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });
const csv = require('fast-csv');
var ObjectId = require('mongoose').Types.ObjectId;

function parseCsvData(rows) {
  const dataRows = rows.slice(1, rows.length); //ignore header at 0 and get rest of the rows
  const ballots = [];
  for (let i = 0; i < dataRows.length; i++) {
    ballots.push(dataRows[i].slice(1));
  }
  return ballots;
}

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.mongoose = require("mongoose");
    this.mongoose.connect(
        process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    this.userschema = new this.mongoose.Schema({
        username: String,
        password: String,
        eids: [String]
    });
    this.electionschema = new this.mongoose.Schema({
        name: String,
        description: String,
        numcands: Number,
        candidates: [String],
        ballots: [{votes: Number, order: [String]}]
    });
    this.User = this.mongoose.model('User', this.userschema);
    this.Election = this.mongoose.model('Election', this.electionschema);
    this.posts();
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(
    path.join(__dirname,"../client/build")));
  }
  posts() {
    this.app.post('/login/', (req, res) => {
      // Insert Login Code Here
      this.User.findOne({ username: req.body.username, password: req.body.password}, (err, user) => {
            if (user) {
              res.send(user);
            } else {
              console.log(err);
              res.send('denied')
          }
        })
    });

    this.app.post('/create/', (req, res) => {
      this.User.findOne({ username: req.body.username}, (err, user) => {
            if (user) {
              res.send('Username Already Exists')
            } else {
              var newguy = new this.User({
                  username: req.body.username,
                  password: req.body.password,
                  eids: []
              });
              newguy.save().then(() => console.log("One entry added"));
              res.send(newguy);
          }
        })
    });

    this.app.post('/getelect/', (req, res) => {
      // Insert Login Code Here
      this.Election.findOne({ _id: ObjectId(req.body.eid)}, (err, elec) => {
            if (elec) {
              res.send(elec);
            } else {
              console.log(err);
              res.send('No such election')
          }
        })
    });

  this.app.post('/uploadelect/', upload.single('file'), (req, res) => {
      const fileRows = [];

  // open uploaded file
      csv.parseFile(req.file.path)
        .on("data", function (data) {
          fileRows.push(data); // push each row
        })
        .on("end", function () {
          console.log(fileRows)
          fs.unlinkSync(req.file.path);   // remove temp file
          const ballots = parseCsvData(fileRows);
          var created = new this.Election({
            name: req.body.name,
            description: req.body.description,
            numcands: req.body.numcands,
            candidates: ballots[0],
            ballots: ballots
          });
          this.User.findOne({ username: req.body.username, password: req.body.password}, (err, user) => {
            if (user) {
              created.save().then(saveddoc => {
                res.send(saveddoc._id.toString());
              });
            } else {
              console.log(err);
              res.send('createfailed')
          }
          })
        })
    });
    
    this.app.post('/createelect/', (req, res) => {
      // Insert Login Code Here
      var created = new this.Election({
          name: req.body.name,
          description: req.body.description,
          numcands: req.body.numcands,
          candidates: req.body.candidates,
          ballots: req.body.ballots
      });
      this.User.findOne({ username: req.body.username, password: req.body.password}, (err, user) => {
            if (user) {
              created.save().then(saveddoc => {
                res.send(saveddoc._id.toString());
              });
            } else {
              console.log(err);
              res.send('createfailed')
          }
        })
    });
    this.app.post('/linkelect/', (req, res) => {
      this.User.findOne({ username: req.body.username, password: req.body.password}, (err, user) => {
        if (user) {
          var neweids = user.eids;
          neweids.push(req.body.eid);
          user.eids = neweids;
          user.save().then(() => {res.send(user);});
        } else {
          res.send('createfailed');
        }
      })
    });
    this.app.get("*", (req, res) => {
      res.sendFile(
        path.join(__dirname, "../client/build/index.html")
      );
    });
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server Running on Port:" + this.port);
    });
  }


}

module.exports = Server;
