const express = require("express");
const app = express();
const PORT = 3000; // default port 3000

const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs");
const Keygrip = require("keygrip");

const {getUserByEmail, generateRandomString, urlsForUser} = require('./helper.js')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: new Keygrip(["MYSECRET1"])
}));


// databases 
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "linglingliu344@hotmail.com",
    password: "123456",
  },
  "aJ48lx": {
    id: "aJ48lx",
    email: "linglingliu@hotmail.com",
    password: "123456",
  },
  "aJ48ly": {
    id: "aJ48ly",
    email: "lingling@hotmail.com",
    password: "1234567",
  },

};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  c6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lx",
  },
  e3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lx",
  }

};



app.get("/urls", (req, res) => {
  const userID = req.session["user_id"]
  const user = users[userID]
  const urls = urlsForUser(userID, urlDatabase)

  if (!user) {
    res.redirect("/login")
    return

  }

  const templateVars = { urls, user };
  res.render("urls_index", templateVars);

});


app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]]
  const templateVars = { user };
  if (!user) {
    res.redirect("/login")
    return
  }
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const userID = req.session["user_id"]
  const user = users[userID]
  const urls = urlsForUser(userID, urlDatabase)


  if (!user) {
    res.send("You are not logged in")
    return
  }
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    res.send("This link doesn't exist")
    return
  }

  if (!Object.keys(urls).includes(req.params.id)) {
    res.send("you don't have permission to access this")
    return
  }

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]["longURL"], user };
  res.render("urls_show", templateVars);
});




app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL
  if (longURL === undefined) {
    res.send("Error: short url not found")
    return
  }
  res.redirect(longURL);

});

app.get("/register", (req, res) => {
  const user = users[req.session["user_id"]]
  const templateVars = { user };
  if (user) {
    res.redirect("/urls")
    return
  }

  res.render("register", templateVars);

});

app.get("/login", (req, res) => {
  const user = users[req.session["user_id"]]
  const templateVars = { user };
  if (user) {
    res.redirect("/urls")
    return
  }
  res.render("login", templateVars);

});

//---------posts ----------------------//

app.post("/urls", (req, res) => {
  const user = users[req.session["user_id"]]
  const databaseID = generateRandomString()
  if (user) {
    urlDatabase[databaseID] = {
      "longURL": req.body["longURL"],
      "userID": user.id
    }
    res.redirect("/urls")
    return
  }
  res.send("error please login first")
});

app.post("/urls/:id/delete", (req, res) => {

  const userID = req.session["user_id"]
  const user = users[userID]
  const urls = urlsForUser(userID, urlDatabase)


  if (!user) {
    res.send("You are not logged in")
    return
  }
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    res.send("This link doesn't exist")
    return
  }
  if (!Object.keys(urls).includes(req.params.id)) {
    res.send("you don't have permission to access this")
    return
  }
  delete urlDatabase[req.params.id]
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  const userID = req.session["user_id"]
  const user = users[userID]
  const urls = urlsForUser(userID, urlDatabase)

  if (!user) {
    res.send("You are not logged in")
    return
  }
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    res.send("This link doesn't exist")
    return
  }

  if (!Object.keys(urls).includes(req.params.id)) {
    res.send("you don't have permission to access this")
    return
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user };
  res.render("urls_show", templateVars);

});



app.post("/urls/:id/updateData", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body["updatedlongURL"]
  res.redirect("/urls");
});

//---------posts login and registers----------------------//

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");
  res.end()
})

app.post("/register", (req, res) => {

  if ((req.body["email"]) === "") {
    res.status(400)
    res.json({ error: "Username cannot be blank" })
    return
  }

  if (req.body["password"] === "") {
    res.status(400)
    res.json({ error: "password cannot be blank" })
    return
  }

  if (users[getUserByEmail(users, req.body["email"])] !== undefined) {
    res.status(400)
    res.json({ error: "Username already exist" })
    return
  }


  let userRandomID = generateRandomString()
  const password = req.body["password"]; // found in the req.body object
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[userRandomID] = {
    "id": userRandomID,
    "email": req.body["email"],
    "password": hashedPassword
  }

  req.session.user_id = userRandomID;
  res.redirect("/urls");

})

app.post("/login", (req, res) => {
  let userID = getUserByEmail(users, req.body["email"])

  if ((req.body["email"]) === "") {
    res.status(403)
    res.json({ error: "Username cannot be blank" })
    return
  }

  if (req.body["password"] === "") {
    res.status(403)
    res.json({ error: "Password cannot be blank" })
    return
  }

  if (userID === "") {
    res.status(403)
    res.json({ error: "Username does not exist" })
    return
  }

  if (bcrypt.compareSync(req.body["password"], users[userID].password)) {

    req.session.user_id = userID;
    res.redirect("/urls");
    return
  }

  res.status(403)
  res.json({ error: "Password is incorrect" })
}

)
// listen // 

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});

