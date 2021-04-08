require('dotenv').config()
const mongoose = require('mongoose');
const CONNECTION = process.env.MONGODB_CONNECTION || mongoose.connect('mongodb://localhost:27017/roomease', {useNewUrlParser: true, useUnifiedTopology: true});

// cloud connection or local
mongoose.connect(CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  // birthday: Date,
  pictureURL: String,
  householdID: String,
  isHouseholdOwner: Boolean,
  firebaseAuthID: String,
});

// subdocument
const choreSchema = new mongoose.Schema({
  name: String,
  date: Date,
  choreHolder: String,
  isComplete: Boolean,
});

// subdocument
const expenseSchema = new mongoose.Schema({
  name: String,
  amount: mongoose.Types.Decimal128,
  expenseType: String,
  expenseHolder: String,
});

// subdocument
const grocerySchema = new mongoose.Schema({
  name: String,
  quantity: String,
  quantityType: String,
  isPurchased: Boolean,
})

const householdSchema = new mongoose.Schema({
  name: String,
  householdOwner: String, // reference the user
  chores: [choreSchema],
  expenses: [expenseSchema],
  groceries: [grocerySchema],
  users: [userSchema],
});

const User = mongoose.model('User', userSchema);
const Chore = mongoose.model('Chore', choreSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Grocery = mongoose.model('Grocery', grocerySchema);
const Household = mongoose.model('Household', householdSchema);

module.exports = {
  User,
  Chore,
  Expense,
  Grocery,
  Household,
  db,
}