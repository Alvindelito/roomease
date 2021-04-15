require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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
app.get('/api/me', authenticateToken, async (req, res) => {
  console.log('req.user:', req.user);
  const user = await db.User.findById(req.user.id);
  if (user) res.status(200).json(user);
  else res.sendStatus(401);
});

app.get('/api/household/:id', authenticateToken, async (req, res) => {
  try {
    const household = await db.Household.findById(req.params.id).populate('householdOwner').populate('users').exec();
    // console.log(await household.populate('householdOwner'))
    res.status(200).json(household);
  } catch (err) {
    res.status(400).send(err);
  }
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
app.post('/api/household', authenticateToken, async (req, res) => {
  const { householdName } = req.body;
  const userId = req.user.id
  const user = await db.User.findOne({ _id: userId }).exec();
  const newHousehold = new db.Household({
    householdName: householdName,
    householdOwner: user,
    chores: [],
    expenses: [],
    groceries: [],
    users: [user],
    inviteCode: uuidv4()
  });

  // creates new household and updates user as owner of household.
  newHousehold.save((err, result) => {
    if (err) res.status(400).send(err);
    else {
      db.User.updateOne(
        { _id: userId },
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

app.post('/api/chore', authenticateToken, (req, res) => {
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
      else res.status(200).json(newChore);
    }
  )
});

app.post('/api/expense', authenticateToken, (req, res) => {
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
app.post('/api/grocery', authenticateToken, (req, res) => {
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
app.delete('/api/grocery/:id', authenticateToken, (req, res) => {
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
app.put('/api/grocery/:id', authenticateToken, (req, res) => {
  const itemID = req.params.id;
  const trueOrFalse = !req.body.trueOrFalse

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
app.put('/api/user/:id', authenticateToken, async (req, res) => {
  const { inviteCode } = req.body;

  try {
    const household = await db.Household.findOne({ inviteCode: inviteCode });
    await db.User.updateOne(
      { _id: req.params.id },
      { householdID: household._id}
    );

    const user = await db.User.findById(req.params.id);

    await db.Household.updateOne(
      { _id: household._id},
      { $push: { users: user } }
    )
    res.status(200).send('successfully added user to household');

  } catch (err) {
    res.status(400).send(err);
  }
})

// toggle chore completion
app.put('/api/chore/:choreId', authenticateToken, (req, res) => {
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
app.delete('/api/chore/:choreId', authenticateToken, (req, res) => {
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
      else res.status(200).send('Successfully Deleted Chore');
    }
  )
})

const PORT = 3009;
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));