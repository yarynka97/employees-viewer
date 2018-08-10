const {query} = require('./helpers');

const fields = 'empID, empName, empActive, dpName';
const joinedTables =
    '(SELECT * FROM tblemployees ' +
    'JOIN tbldepartments ' +
    'WHERE tblemployees.emp_dpID=tbldepartments.dpID) AS totals';

function selectAllEmployees(){
    const expr = `SELECT ${fields} FROM ${joinedTables}`;
    return query(expr);
}

function sellectSingleEmployee(id){
    const expr =
        `SELECT ${fields} `+
        `FROM ${joinedTables} `+
        `WHERE totals.empID=${id}`;
    return query(expr);
}

async function updateEmployee(id, newData){
    const dpID = await getDpIdWithDpName(newData.dpName);
    const expr =
        'UPDATE tblemployees ' +
        `SET empName='${newData.empName}', empActive=${newData.empActive}, emp_dpID=${dpID} ` +
        `WHERE empID=${id}`;

    await query(expr);

    return sellectSingleEmployee(id);
}

function deleteEmployee(id){
    const expr =
        'DELETE FROM tblemployees ' +
        `WHERE empID=${id}`;
    return query(expr);
}

function searchByNameFit(nameFit){
    const expr =
        `SELECT ${fields} FROM ` +
            '(SELECT * FROM tblemployees ' +
            `WHERE tblemployees.empName LIKE '${nameFit}%') AS fitselected ` +
        'JOIN tbldepartments ' +
        'WHERE fitselected.emp_dpID=tbldepartments.dpID';
        

    return query(expr);
}

async function getDpIdWithDpName(name){
    const dpObj = await query(`SELECT dpID FROM tbldepartments WHERE dpName='${name}'`);

    return dpObj[0].dpID;
}

module.exports = {
    selectAllEmployees,
    sellectSingleEmployee,
    updateEmployee,
    deleteEmployee,
    searchByNameFit
};
