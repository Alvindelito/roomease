require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/index');
const app = express();
const authenticateToken = require('./middleware/authenticateToken');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors(
  //   {
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // }
  )
);
app.use(morgan('dev'));

// GET
app.get('/me', authenticateToken, async (req, res) => {
  console.log('req.user:', req.user);
  const user = await db.User.findOne({ _id: req.user.id });
  if (user) res.status(200).json(user);
  else res.sendStatus(401);
});

app.get('/api/household/:id', (req, res) => {
  db.Household.findOne({ _id: req.params.id }, (err, result) => {
    if (err) res.status(400).send(err);
    else res.status(200).json(result);
  })
});

app.post('/register', async (req, res) => {
  const {email, plainPassword, firstName, lastName} = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    const newUser = await new db.User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      // birthday: birthday,
      // pictureURL: pictureURL,
      householdID: '',
      isHouseholdOwner: false,
    });

    newUser.save((err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    })
  } catch (err) {
    res.status(400).send(err);
  }


});

// User creates household
app.post('/api/household', (req, res) => {
  const { name, householdOwner, firstName, userID } = req.body;
  const newHousehold = new db.Household({
    name: name,
    householdOwner: householdOwner,
    chores: [],
    expenses: [],
    groceries: [],
    users: [householdOwner],
  });

  // creates new household and updates user as owner of household.
  newHousehold.save((err, result) => {
    if (err) res.status(400).send(err);
    else {
      db.User.updateOne(
        { _id: userID },
        { householdID: result._id,
          isHouseholdOwner: true },
        (err, result) => {
          if (err) res.status(400).send(err);
          res.status(200).json(result);
        }
      )
    }
  })
});

app.post('/api/chore', (req, res) => {
  const {name, date, choreHolder, householdID} = req.body;
  const newChore = new db.Chore({
    name: name,
    date: date,
    choreHolder: choreHolder,
    isComplete: false,
  })

  db.Household.updateOne(
    { _id: householdID },
    { $push: { chores: newChore } },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  )
});

app.post('/api/expense', (req, res) => {
  const {name, amount, expenseType, expenseHolder, householdID} = req.body;
  const newExpense = new db.Expense({
    name: name,
    amount: amount,
    expenseType: expenseType,
    expenseHolder: expenseHolder
  })

  db.Household.updateOne(
    { _id: householdID },
    { $push:  { expenses: newExpense } },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  )
});

// POST grocery item
app.post('/api/grocery', (req, res) => {
  const {name, quantity, quantityType, householdID} = req.body;

  const newGrocery = new db.Grocery({
    name: name,
    quantity: quantity,
    quantityType: quantityType,
    isPurchased: false,
  });

  db.Household.updateOne(
    { _id: householdID },
    { $push: { groceries: newGrocery } },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  );
});

// DELETE grocery item
app.delete('/api/grocery/:id', (req, res) => {
  const itemID = req.params.id;
  db.Household.updateOne({},
    { $pull: { groceries: { _id: itemID } } },
    { multi: true },
    (err, result) => {
      if (err) res.status(400).send(err);
      else {
        res.status(200).json(result);
      }
    }
  )
})

// PUT mark grocery item as bought
app.put('/api/grocery/:id', (req, res) => {
  const itemID = req.params.id;
  const trueOrFalse = req.body.trueOrFalse
  db.Household.updateOne(
    { "groceries._id": itemID },
    {
      "$set": {
        "groceries.$.isPurchased": trueOrFalse
      }
    },
    (err, result) => {
      if (err) res.status(400).send(err);
      else {
        res.status(200).json(result);
      }
    }
  );
})

// PUT
// add user to household
app.put('/api/user/:id', (req, res) => {
  const { householdID, firstName } = req.body;
  db.User.updateOne(
    { _id: req.params.id },
    { householdID: householdID },
    (err, result) => {
      if (err) res.status(400).send(err);
      else {
        db.Household.updateOne(
          { _id: householdID },
          { $push: { users: firstName } },
          (err, result) => {
            if (err) res.status(400).send(err);
            else res.status(200).json(result);
          }
        )
      }
    }
  )
})

// toggle chore completion
app.put('/api/chore/:choreId', (req, res) => {
  const {choreId} = req.params;
  const {chore, householdID } = req.body;

  chore.isComplete = !chore.isComplete;

  db.Household.findOneAndUpdate(
    {'_id': householdID, 'chores._id': choreId},
    {
      '$set': {
        'chores.$': chore
      }
    },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  )
})

// delete chore
app.delete('/api/chore/:choreId', (req, res) => {
  const {choreId} = req.params;
  const {householdID} = req.body;

  console.log(`choreId: ${choreId}`);
  console.log(`householdID: ${householdID}`);

  db.Household.findOneAndUpdate(
    {'_id': householdID, 'chores._id': choreId},
    {
      '$pull': {
        chores: { _id: choreId }
      }
    },
    (err, result) => {
      if (err) res.status(400).send(err);
      else res.status(200).json(result);
    }
  )
})

const PORT = 3009;
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));