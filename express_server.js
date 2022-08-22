const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
const cookieParser = require('cookie-parser')
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase , username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("partials/_header.ejs", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {  username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});



app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  let newID = generateRandomString()
  urlDatabase[newID] = req.body["longURL"]

  const templateVars = { id: newID, longURL: urlDatabase[newID] };
  res.render("urls_show", templateVars);  
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id] 
  res.redirect("/urls");
  
});

app.post("/urls/:id/update", (req, res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id] ,username: req.cookies["username"] };
  res.render("urls_show", templateVars);
  
});

app.post("/urls/:id/updateData", (req, res) => {
  urlDatabase[req.params.id] = req.body["updatedlongURL"]
  res.redirect("/urls");


});


app.post("/login",(req, res)=>{
  res.cookie("username",req.body.username);
  res.redirect("/urls");
  const templateVars = {
    username: req.cookies["username"],

   
  };
  res.redirect("/urls");
  })


  app.post("/logout",(req, res)=>{
    res.clearCookie("username")
    res.redirect("/urls");
    res.end()
    })
  


 



  





app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
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