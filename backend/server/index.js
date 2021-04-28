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
    {
    origin: 'http://localhost:3000',
    credentials: true,
  }
  )
);
app.use(morgan('dev'));

// GET
app.get('/api/me', authenticateToken, async (req, res) => {
  const user = await db.User.findById(req.user.id);
  if (user) res.status(200).json(user);
  else res.sendStatus(401);
});

app.get('/api/household/:id', authenticateToken, async (req, res) => {
  try {
    const household = await db.Household.findById(req.params.id).populate('householdOwner').populate('users').exec();
    res.status(200).json(household);
  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
});

app.post('/register', async (req, res) => {
  const {email, password, firstName, lastName} = req.body;

  try {
    const checkIfUserExists = await db.User.findOne({ email: email });

    if (checkIfUserExists !== null) throw new Error('Email has already been used. Please use a different email.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await new db.User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      // birthday: birthday,
      // pictureURL: pictureURL,
      householdId: '',
      isHouseholdOwner: false,
    });

    const saveUser = await newUser.save();
    if (saveUser) res.status(200).json(saveUser);

  } catch (err) {
    console.log(err);
    res.status(400).send({ error: `${err}` });
  }


});

// User creates household
app.post('/api/household', authenticateToken, async (req, res) => {
  const { householdName } = req.body;
  const userId = req.user.id
  try {
    const user = await db.User.findById(userId).exec();
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
    const saveHousehold = await newHousehold.save();
    if (saveHousehold) {
      user.householdId = newHousehold._id;
      user.isHouseholdOwner = true;
      const updateUser = await user.save();
      if (updateUser) res.status(200).json(saveHousehold);
    } else {
      throw new Error('Could not save household');
    }
  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
});

app.post('/api/chore', authenticateToken, async (req, res) => {
  const {name, date, choreHolder, householdId} = req.body;
  try {
    const newChore = new db.Chore({
      name: name,
      date: date,
      choreHolder: choreHolder,
      isComplete: false,
    })

    const addChore = await db.Household.findByIdAndUpdate(
      householdId,
      { $push: { chores: newChore } },
      { new: true}
    );

    if (addChore) res.status(200).json(addChore);

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
});

app.post('/api/expense', authenticateToken, async (req, res) => {
  const {name, amount, expenseType, expenseHolder, householdId} = req.body;
  try {
    const newExpense = new db.Expense({
      name: name,
      amount: amount,
      expenseType: expenseType,
      expenseHolder: expenseHolder
    })

    const addExpense = await db.Household.findByIdAndUpdate(
      householdId,
      { $push:  { expenses: newExpense } },
      {new: true},
    );

    if (addExpense) res.status(200).json(addExpense)

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
});

// POST grocery item
app.post('/api/grocery', authenticateToken, async (req, res) => {
  const {name, quantity, quantityType, householdId} = req.body;

  try {
    const newGrocery = new db.Grocery({
      name: name,
      quantity: quantity,
      quantityType: quantityType,
      isPurchased: false,
    });

    const addGrocery = await db.Household.findByIdAndUpdate(
      householdId,
      { $push: { groceries: newGrocery } },
      {new: true},
    );

    if (addGrocery) res.status(200).json(addGrocery);

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
});

// DELETE grocery item
app.delete('/api/grocery/:id', authenticateToken, async (req, res) => {
  const { householdId } = req.body;
  const itemID = req.params.id;

  try {
    const deleteHousehold = await db.Household.findByIdAndUpdate(
      householdId,
      { $pull: { groceries: { _id: itemID } } },
      { multi: true, new: true },
    );

    if (deleteHousehold) res.status(200).json(deleteHousehold);

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
})

// Toggle grocery item
app.put('/api/grocery/:id', authenticateToken, async (req, res) => {
  const itemID = req.params.id;
  const trueOrFalse = !req.body.trueOrFalse
  const { householdId } = req.body;


  try {
    const toggleGrocery = await db.Household.findOneAndUpdate(
      {_id: householdId, "groceries._id": itemID},
      {
        "$set": {
          "groceries.$.isPurchased": trueOrFalse
        }
      },
      {new: true},
    );

    if (toggleGrocery) res.status(200).json(toggleGrocery);

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
})

// PUT
// add user to household
app.put('/api/addUser/:id', authenticateToken, async (req, res) => {
  const { inviteCode } = req.body;

  try {
    const household = await db.Household.findOne({ inviteCode: inviteCode });
    await db.User.findByIdAndUpdate(
      req.params.id,
      { householdId: household._id}
    );

    const user = await db.User.findById(req.params.id);


    await household.users.push(user);
    await household.save();
    res.status(200).send('successfully added user to household');

  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
})

// remove user from household
app.put('/api/removeUser/:id', authenticateToken, async (req, res) => {
  const userToBeRemovedId = req.params.id;
  const { householdId } = req.body;
  const userId = req.user.id;

  try {
    const household = await db.Household.findById(householdId).populate('users').populate('householdOwner');

    // check if user id matches userToBeRemovedId or if user is owner of household
    if (userId === userToBeRemovedId || userId === household.householdOwner._id.toString()) {

      // household owner cannot be removed from household unless they transfer ownership.
      if (userToBeRemovedId === household.householdOwner._id.toString()) {
        throw new Error('Household owner cannot be removed from household unless they transfer ownership.')
        res.status(400)
      }
      // check that the user exists in household
      let findUser = household.users.filter(user => user._id.toString() === userToBeRemovedId)

      if (findUser.length === 1) {
        // perform update to remove user from household
        await household.users.pull(userToBeRemovedId);
        await household.save();

        // update user to be removed to no longer be in the household
        await db.User.findByIdAndUpdate(
          userToBeRemovedId,
          { householdId: '' }
        );

        res.status(200).send('User successfully removed from household');
      } else {
        throw new Error('User does not exist in this household')
      }

    } else {
      // if not, reject
      res.sendStatus(403);
    }
  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
})

// toggle chore completion
app.put('/api/chore/:choreId', authenticateToken, async (req, res) => {
  const {choreId} = req.params;
  const {chore, householdId } = req.body;
  chore.isComplete = !chore.isComplete;

  try {
    const toggleChore = await db.Household.findOneAndUpdate(
      {'_id': householdId, 'chores._id': choreId},
      {
        '$set': {
          'chores.$': chore
        }
      },
      {new: true},
    );

    if (toggleChore) res.status(200).json(toggleChore);

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
})

// delete chore
app.delete('/api/chore/:choreId', authenticateToken, async (req, res) => {
  const {choreId} = req.params;
  const {householdId} = req.body;


  try {
    const deleteChore = await db.Household.findOneAndUpdate(
      {'_id': householdId, 'chores._id': choreId},
      {
        '$pull': {
          chores: { _id: choreId }
        }
      }
    )

    if (deleteChore) res.status(200).send('Successfully Deleted Chore');

  } catch (err) {
    res.status(400).send({ error: `${err}` });
  }
})

const PORT = 3009;
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));