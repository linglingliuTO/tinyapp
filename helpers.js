// functions // 

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


const urlsForUser = (userId, urlDatabase) => {
  const urls = {}
  for (const id in urlDatabase) {
    const url = urlDatabase[id]
    if (url.userID === userId) {
      urls[id] = url
    }
  }

  return urls
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

module.exports = {getUserByEmail, generateRandomString, urlsForUser}