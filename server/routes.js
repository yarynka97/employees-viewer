const router = require('express').Router();
const queries = require('./db/queries');

router.get('/all', async (req, res) => {
    let employees = {};

    try{
        employees = await queries.selectAllEmployees();
    }catch(err){
        res.send('Some mistake with getting employees list, check if your request was correct');
    }

    res.send(employees);
});

router.get('/all/find/:name', async (req, res) => {
    const employeeNameFit = req.params.name;
    let results = {};

    try{
        results = await queries.searchByNameFit(employeeNameFit);
    }catch(err){
        res.send(`Some mistake with searching for ${employeeNameFit} name fit, check if your request was correct`);
    }

    res.send(results);
});

router.get('/:id', async (req, res) => {
    const employeeId = req.params.id;
    let employee = {};

    try{
        employee = await queries.sellectSingleEmployee(employeeId);
    }catch(err){
        res.send(`Some mistake with getting employee's ${employeeId} data, check if your request was correct`);
    }

    res.send(employee);
});

router.delete('/:id', async (req, res) => {
    const employeeId = req.params.id;

    try{
        await queries.deleteEmployee(employeeId);
    }catch(err){
        res.send(`Some mistake with deleting employee: ${employeeId}, check if your request was correct`);
    }

    res.send(`Employee ${employeeId} successfully deleted`);
});

router.patch('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const newData = req.body;
    let updatedEmployee = {};

    try {
        updatedEmployee = await queries.updateEmployee(employeeId, newData);
    } catch (err) {
        res.send(`Some mistake with updating employee: ${employeeId}, check if your request was correct`);
    }

    res.send(updatedEmployee);
});

module.exports = router;
