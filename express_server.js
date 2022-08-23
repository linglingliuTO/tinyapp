const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
const cookieParser = require('cookie-parser')
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = {  user };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id],  user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
  const user = users[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase,  user };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = {  user };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { user };
  res.render("login", templateVars);

});


app.post("/urls", (req, res) => {
  const templateVars = { id: newID, longURL: urlDatabase[newID] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");

});

app.post("/urls/:id/update", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id],  user };
  res.render("urls_show", templateVars);

});

app.post("/urls/:id/updateData", (req, res) => {
  urlDatabase[req.params.id] = req.body["updatedlongURL"]
  res.redirect("/urls");


});



app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls");
  res.end()
})

app.post("/register", (req, res) => {

  if ((req.body["email"]) === "") {
    res.status(400)
    res.json({ error: "Username cannot be blank" })
  } else if (req.body["password"] === "") {
    res.status(400)
    res.json({ error: "password cannot be blank" })
  } else if (users [getUserByEmail(users, req.body["email"])] !== undefined) {
    res.status(400)
    res.json({ error: "Username already exist" })
  } else {


  let userRandomID = generateRandomString()
  users[userRandomID] = {
    "id": userRandomID,
    "email": req.body["email"],
    "password": req.body["password"]
  }

  res.cookie("user_id", userRandomID);
  res.redirect("/urls");
  }
})

app.post("/login", (req, res) => {
let userID = getUserByEmail(users, req.body["email"])
console.log(userID)
  if ((req.body["email"]) === "") {
    res.status(403)
    res.json({ error: "Username cannot be blank" })
  } else if (req.body["password"] === "") {
    console.log(userID)
    res.status(403)
    res.json({ error: "Password cannot be blank" })
  }  else if (userID === "") {
    res.status(403)
    res.json({ error: "Username does not exist" })
  }  else if  (users[userID].password !== req.body["password"]) {
    console.log(users[userID].password)
    res.status(403)
    res.json({ error: "Password is incorrect" })

  } else {

  res.cookie("user_id", userID);
  res.redirect("/urls");

  }

  }

)












app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});


const generateRandomString = () => {
  let result = ""
  let alphabet = { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "g", 9: "h" }
  randNum = () => Math.round((Math.random() * (9 - 1) + 1), 0)
  for (var i = 0; i < 3; i++) {
    j = randNum()
    result += (j)
    result += (alphabet[j])
  }
  return result
}

const getUserByEmail = (object, value) => {
  let result = ""
  for (id in object) {
    if (object[id].email === value) {
      result = id
    }
  }
  return result
}