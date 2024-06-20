import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
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
  nightShift: "1PM-9PM"// No night shift
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];



app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.post('/schedule', (req, res) => {
    let data = req.body;
    console.log(data);
    function createWeeklySchedule(data) {
        const { employeesName, morningShift, afternoonShift, nightShift } = data;
        const shifts = [];
      
        if (morningShift) shifts.push('morningShift');
        if (afternoonShift) shifts.push('afternoonShift');
        if (nightShift) shifts.push('nightShift');
      
        const schedule = {};
      
        daysOfWeek.forEach(day => {
          schedule[day] = {
            shifts: {},
            offDuty: []
          };
          
          // Distribute employees based on their specified order
          for (let i = 0; i < shifts.length; i++) {
            schedule[day].shifts[shifts[i]] = employeesName[i % employeesName.length];
          }
      
          // Fill in offDuty employees
          const workingEmployees = employeesName.slice(0, shifts.length);
          const offDutyEmployees = employeesName.slice(shifts.length);
          schedule[day].offDuty = offDutyEmployees;
        });
      
        return schedule;
      }


  const schedule = createWeeklySchedule(data);
  console.log("aaa",schedule);
 console.log(data);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
