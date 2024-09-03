import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import auth from "./auth.js";
const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.json());

const dataa = {
  companyname: "Nova",
  numberOfEmployees: 5,
  employeesName: ['ime', 'ime2', 'prezime2', 'prezime3', 'pre4'],
  morningShift: "8AM-4PM",
  afternoonShift: null,
  nightShift: "1PM-9PM"
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.post("/authuser", async (req, res) => {
    let user = req.body;
    try{
      let result = await auth.authencticateUser(user.email, user.password);
      res.json(result);
    }catch(e){
      console.log(e)
       res.status(403).json({error:e.message});
    }
  });

app.post("/createuser", async (req, res) => {
    let user = req.body;
    try{
      let id = await auth.registerUser(user);
      res.json(id)
    }catch(e){
      res.status(500).json({error: e.message});
    }
  });
  
function createWeeklySchedule(data) {
    const { employees } = data;
    const shifts = [1, 2, 3];

    const schedule = {};

    daysOfWeek.forEach(day => {
        schedule[day] = {
            shifts: {},
            offDuty: []
        };

        shifts.forEach(shift => {
            const availableEmployees = employees.filter(employee => {
                if (!employee.unavailableDays || !Array.isArray(employee.unavailableDays)) {
                    return true; 
                }

                return !employee.unavailableDays.some(unavailable => 
                    unavailable.day === day && unavailable.shift === shift
                );
            });

            if (availableEmployees.length > 0) {
                schedule[day].shifts[shift] = availableEmployees[0].name;
                employees.push(employees.shift());
            } else {
                schedule[day].shifts[shift] = "N/A";
            }
        });

        const workingEmployees = Object.values(schedule[day].shifts);
        schedule[day].offDuty = employees
            .map(emp => emp.name)
            .filter(name => !workingEmployees.includes(name));
    });

    return schedule;
}

app.post('/schedule', (req, res) => {
    const data = req.body;

    if (!data.employees || !Array.isArray(data.employees)) {
        return res.status(400).json({ error: 'Invalid input: employees should be an array.' });
    }

    const schedule = createWeeklySchedule(data);
    res.json(schedule);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
