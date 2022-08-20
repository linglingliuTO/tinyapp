const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  let newID = generateRandomString()
  urlDatabase[newID] = req.body["longURL"]

  const templateVars = { id: newID, longURL: urlDatabase[newID] };
  res.render("urls_show", templateVars);


  
});


app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});


function generateRandomString() {
  let result = ""
  let alphabet = {1:"a", 2:"b", 3:"c", 4:"d", 5:"e", 6:"f", 7:"g", 8:"g", 9:"h"}
  randNum = () => Math.round((Math.random() * (9 - 1) + 1), 0)
  for (var i = 0; i<3; i++ ) {
    j = randNum()
    result+=(j)
    result+=(alphabet[j])
  }
  return result
}