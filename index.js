const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const readEmployees = (call) => {
    fs.readFile('employee.json', 'utf8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        call(err, null);
      } else {
        const employees = data ? JSON.parse(data) : [];
        call(null, employees);
      }
    });
  };

  const writeEmployees = (employees, call) => {
    fs.writeFile('employee.json', JSON.stringify(employees, null, 2), 'utf8', (err) => {
      call(err);
    });
  };

  app.get('/', (req, res) => {
    res.render("empFirst.ejs");
  });

  app.post("/", (req, res) => {
    readEmployees((err, employees) => {
      if (err) {
        res.status(500).send('Error reading file');
        return;
      }
      const newEmployee = {
        id: (employees.length + 1).toString(),
        name: req.body.name,
        dob: req.body.dob,
        userID: req.body.userId,
        password: req.body.pass,
      };
      employees.push(newEmployee);
      writeEmployees(employees, (err) => {
        if (err) {
          res.status(500).send('Error writing file');
          return;
        }
        console.log('user register successfully',JSON.stringify(newEmployee));
      });
      res.render("login");
    });
  }); 

app.post('/login',(req,res)=>{
    readEmployees((err, employees) => {
        if (err) {
          res.status(500).send('Error reading file');
          return;
        }
    const reqUserId = req.body.userid;
    const reqPass = req.body.pass;
    console.log('Requested for login from : ',reqUserId,reqPass);
    const index=employees.findIndex(
        emp=>emp.userID === reqUserId && emp.password === reqPass
    );
    console.log('login successfull.');
    if(index !== -1){
        res.render("empDetials", {
            data: employees,
          });
    }
    });
})

app.listen(3000, () => {
    console.log("App is running on port 3000");
  });






