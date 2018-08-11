const router = require('express').Router();
const queries = require('./db/queries');

router.get('/all', async (req, res) => {
    const page = req.query.page || 1;

    try{
        const employees = await queries.selectAllEmployees(page, 10);
        res.send(employees);
    }catch(err){
        res.status(500).send('Some mistake with getting employees list, check if your request was correct');
    }
});

router.get('/all/find/:name', async (req, res) => {
    const employeeNameFit = req.params.name;
    const page = req.query.page || 1;

    try{
        const results = await queries.searchByNameFit(employeeNameFit, page, 10);
        res.send(results);
    }catch(err) {
        res.status(500).send(`Some mistake with searching for ${employeeNameFit} name fit, check if your request was correct`);
    }
});

router.get('/all/number', async (req, res) => {
    try{
        const total = await queries.getRowsTotalNumber();
        res.send(total);
    }catch(err){
        res.status(500).send(`Couldn't get total number`);
    }
});

router.get('/all/find/:name/number', async (req, res) => {
    const employeeNameFit = req.params.name;

    try{
        const total = await queries.getSearchRowsTotalNumber(employeeNameFit);
        res.send(total);
    }catch(err){
        console.log(err);
        res.status(500).send(`Couldn't get total number`);
    }
});

router.get('/departments', async (req, res) => {
    try{
        const departments = await queries.getdepartmentsList();
        res.send(departments);
    }catch(err){
        res.status(500).send(`Some mistake with getting departments list`);
    }
});

router.get('/:id', async (req, res) => {
    const employeeId = req.params.id;

    try{
        const employee = await queries.selectSingleEmployee(employeeId);
        res.send(employee);
    }catch(err){
        res.status(500).send(`Some mistake with getting employee's ${employeeId} data, check if your request was correct`);
    }
});

router.delete('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const page = req.query.page || 1;

    try{
        const updatesEmployees = await queries.deleteEmployee(employeeId, page, 10);
        res.send(updatesEmployees);
    }catch(err){
        res.status(500).send(`Some mistake with deleting employee: ${employeeId}, check if your request was correct`);
    }
});

router.patch('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const newData = req.body;

    try {
        const updatedEmployee = await queries.updateEmployee(employeeId, newData);
        res.send(updatedEmployee);
    } catch (err) {
        console.log(err);
        res.status(500).send(`Some mistake with updating employee: ${employeeId}, check if your request was correct`);
    }
});

module.exports = router;
