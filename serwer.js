//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3002; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

var path = require("path")
app.use(express.static('html'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

let tablica_uzytkownikow = [
    {
        username: 'Anna',
        passwd: '1234',
        age: '18',
        gender: 'k',
        student: 'on',
        id: 1
    },
    {
        username: 'Maria',
        passwd: '1234',
        age: '14',
        gender: 'k',
        student: 'off',
        id: 2
    },
    {
        username: 'Adam',
        passwd: '1234',
        age: '19',
        gender: 'm',
        student: 'off',
        id: 3
    },
    {
        username: 'Jan',
        passwd: '1234',
        age: '15',
        gender: 'm',
        student: 'on',
        id: 4
    },
    {
        username: 'Oliwia',
        passwd: '1234',
        age: '18',
        student: 'on',
        gender: 'k',
        id: 5
    },
    {
        username: 'Marta',
        passwd: '1234',
        age: '17',
        student: 'on',
        gender: 'k',
        id: 6
    },
    {
        username: 'admin',
        passwd: 'admin',
        age: '20',
        student: 'on',
        gender: 'm',
        id: 7
    },
    {
        username: 'Piotr',
        passwd: '1234',
        age: '20',
        student: 'off',
        gender: 'm',
        id: 8
    }
]
let zalogowani = false
let sortowanko = false

// routingi
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/html/main.html"))
})
app.get("/admin", function (req, res) {
    if (zalogowani) {
        res.sendFile(path.join(__dirname + "/html/admin_log.html"))
    }
    else {
        res.sendFile(path.join(__dirname + "/html/admin.html"))
    }
})
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/html/register.html"))
})
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/html/login.html"))
})
app.get("/logout", function (req, res) {
    zalogowani = false
    res.redirect("/")
})
// koniec routingów
// formularze
app.post("/form_register", function (req, res) {
    console.log(req.body)
    if (tablica_uzytkownikow.find(({ username }) => username == req.body.username) == undefined) {
        tablica_uzytkownikow.push(req.body)
        if (tablica_uzytkownikow[tablica_uzytkownikow.length - 1].student == undefined) {
            tablica_uzytkownikow[tablica_uzytkownikow.length - 1].student = "off"
        }
        tablica_uzytkownikow[tablica_uzytkownikow.length - 1].id = tablica_uzytkownikow.length; //id liczę od 1 a to od 0, dlatego odejmuję 1
        console.log(tablica_uzytkownikow)
        res.send("Witaj użytkowniku " + req.body.username)
    }
    else {
        res.send("Użytkownik istnieje")
    }
})
app.post("/form_login", function (req, res) {
    console.log(req.body)
    let user = tablica_uzytkownikow.find(({ username }) => username == req.body.username)
    console.log(user)
    if (tablica_uzytkownikow.find(({ username }) => username == req.body.username) != undefined) {
        if (user.passwd == req.body.passwd) {
            zalogowani = true
            res.redirect("/admin")
        }
        else {
            res.send("Błędny użytkownik/hasło.")
        }
    }
    else {
        res.send("Błędny użytkownik/hasło.")
    }
})
// koniec formularzy
// admin
// obsługa show
app.get('/show', function (req, res) {
    if (zalogowani) {
        tablica_uzytkownikow = tablica_uzytkownikow.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        });;
        let wyglad = "<body style='background-color:#99ccff;width:100vw;height:100vh'><a style='color:black;margin:10px;font-size:30px;' href='/sort'>sort</a><a  style='color:black;margin:10px;font-size:30px;' href='gender'>gender</a><a  style='color:black;margin:10px;font-size:30px;'href='show'>show</a>" + "<table style='margin:0 auto;width:80vw;height:50vh;margin-top:10px;' >"
        for (i = 0; i < tablica_uzytkownikow.length; i++) { // tworzę stringa z tabelą
            wyglad += rzad_show(tablica_uzytkownikow, i)
        }
        wyglad += "</table></body>"
        res.send(wyglad)
    } else
        res.send("Brak dostępu do strony.")
})
//obsługa gender
app.get('/gender', function (req, res) {
    if (zalogowani) {
        let wyglad = "<body style='background-color:#99ccff;width:100vw;height:100vh'><a style='color:black;margin:10px;font-size:30px;' href='/sort'>sort</a><a  style='color:black;margin:10px;font-size:30px;' href='gender'>gender</a><a  style='color:black;margin:10px;font-size:30px;'href='show'>show</a>" + "<table style='margin:0 auto;width:80vw;height:40vh;margin-top:10px;' >"
        let tabelka = "<table style='margin:0 auto;width:80vw;height:40vh;margin-top:10px;' >"
        for (i = 0; i < tablica_uzytkownikow.length; i++) { // tworzę stringa z tabelą
            if (tablica_uzytkownikow[i].gender == "m")
                tabelka += rzad_gender(tablica_uzytkownikow, i)
            else
                wyglad += rzad_gender(tablica_uzytkownikow, i)
        }
        wyglad += "</table>" + tabelka + "</table></body>"
        res.send(wyglad)
    } else
        res.send("Brak dostępu do strony.")
})

//obsługa sort jako strony i formularza 
app.get('/sort', function (req, res) {
    if (zalogowani) {
        tablica_uzytkownikow = tablica_uzytkownikow.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });;
        let wyglad = "<body style='background-color:#99ccff;width:100vw;height:100vh'><a style='color:black;margin:10px;font-size:30px;' href='/sort'>sort</a><a  style='color:black;margin:10px;font-size:30px;' href='gender'>gender</a><a  style='color:black;margin:10px;font-size:30;'href='show'>show</a>"
        if (sortowanko)
            wyglad += "<form  onchange='this.submit()'  method='POST' action='/sort'><input checked type='radio' name='type' id='r1'value='up' ><label style='color:black'for='#r1'>Rosnąco</label> <input type='radio' name='type' id='r2'value='dwn'><label style='color:black' for='#r2'>Malejąco</label></form><table style='margin:0 auto;width:80vw;height:50vh ' >"
        else {
            wyglad += "<form  onchange='this.submit()'  method='POST' action='/sort'><input type='radio' name='type' id='r1'value='up' ><label style='color:black'for='#r1'>Rosnąco</label> <input type='radio' checked name='type' id='r2'value='dwn'><label style='color:black' for='#r2'>Malejąco</label></form><table style='margin:0 auto;width:80vw;height:50vh ' >"
            tablica_uzytkownikow.reverse()
        }
        let tabelka = "<table style='margin:0 auto;width:80vw;height:50vh;margin-top:10px;' >"
        for (i = 0; i < tablica_uzytkownikow.length; i++) { // tworzę stringa z tabelą
            if (sortowanko)
                tabelka += rzad_sort(tablica_uzytkownikow, i)
            else
                wyglad += rzad_sort(tablica_uzytkownikow, i)
        }
        wyglad += "</table>" + tabelka + "</table></body>"
        res.send(wyglad)
    } else
        res.send("Brak dostępu do strony.")
})
app.post('/sort', function (req, res) {
    if (req.body.type == 'dwn')
        sortowanko = false
    else
        sortowanko = true
    res.redirect("/sort")
})
// funkcje
// rząd w tabeli  
function rzad_show(tablica, i) {
    let rzad = ''
    rzad += "<tr style='background-color:#e6ccff;color:black;border:solid 1px black' ><th style='background-color:#e6ccff;color:black;border:solid 1px black'> id:  " + tablica[i].id + "</th><th style='background-color:#e6ccff;color:black; border:solid 1px black'> user:  " + tablica[i].username + " - " + tablica[i].passwd + "</th>"
    if (tablica[i].student == "on")
        rzad += "<th style='background-color:#e6ccff;color:black; border:solid 1px black'>Uczeń: <input type='checkbox' checked disabled></th>"
    else
        rzad += "<th style='background-color:#e6ccff;color:black; border:solid 1px black'>Uczeń: <input type='checkbox' disabled></th>"
    rzad += "<th style='background-color:#e6ccff;color:black; border:solid 1px black'> wiek: " + tablica[i].age + "</th>" + "<th style='background-color:#e6ccff;color:black; border:solid 1px black'> płeć: " + tablica[i].gender + "</th></tr>"
    return rzad
}
// gender
function rzad_gender(tablica, i) {
    let rzad = ''
    rzad += "<tr style='background-color:#e6ccff;color:black;border:solid 1px black' ><th style='background-color:#e6ccff;color:black;border:solid 1px black'> id: " + tablica[i].id + "</th>"
    rzad += "<th style='background-color:#e6ccff;color:black; border:solid 1px black'> płeć: " + tablica[i].gender + "</th></tr>"
    return rzad
}
// sortowanie 
function rzad_sort(tablica, i) {
    let rzad = ''
    rzad += "<tr style='background-color:#e6ccff;color:black;border:solid 1px black' ><th style='background-color:#e6ccff;color:black;border:solid 1px black'> id:  " + tablica[i].id + "</th><th style='background-color:#e6ccff;color:black; border:solid 1px black'> user:  " + tablica[i].username + " - " + tablica[i].passwd + "</th>"
    rzad += "<th style='background-color:#e6ccff;color:black; border:solid 1px black'> wiek: " + tablica[i].age + "</th></tr>"
    return rzad
}

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})


