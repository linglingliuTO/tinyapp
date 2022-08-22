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
  const templateVars = { urls: urlDatabase, username: req.cookies["user_id"], user };
  res.render("urls_index", templateVars);

});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("partials/_header.ejs", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { username: req.cookies["user_id"], user };
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["user_id"], user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
  const user = users[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase, username: req.cookies["user_id"], user };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { username: req.cookies["user_id"], user };
  res.render("register", templateVars);
});


app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console


  const templateVars = { id: newID, longURL: urlDatabase[newID] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");

});

app.post("/urls/:id/update", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["user_id"], user };
  res.render("urls_show", templateVars);

});

app.post("/urls/:id/updateData", (req, res) => {
  urlDatabase[req.params.id] = req.body["updatedlongURL"]
  res.redirect("/urls");


});


app.post("/login", (req, res) => {
  res.cookie("user_id", req.body.username);
  const templateVars = {
    username: req.cookies["user_id"],


  };
  res.redirect("/urls");
})


app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls");
  res.end()
})



app.post("/register", (req, res) => {

  if ((req.body["email"] || req.body["password"]) === "") {
    res.json({ error: "Username or password is blank" }).sendStatus(400)
  }

  if (getUserByEmail(users, req.body["email"] )) {
    res.json({ error: "Username already exist" }).sendStatus(400)
  }


  let userRandomID = generateRandomString()
  users[userRandomID] = {
    "id": userRandomID,
    "email": req.body["email"],
    "password": req.body["password"]
  }

  res.cookie("user_id", userRandomID);
  res.redirect("/urls");

})












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
  result = false
  for (id in object) {
    if (object[id].email === value) {
      result = true
    }
  }
  return result
}