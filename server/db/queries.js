const {query} = require('./helpers');

module.exports = {
    selectAllEmployees,
    selectSingleEmployee,
    updateEmployee,
    deleteEmployee,
    searchByNameFit,
    getRowsTotalNumber
};

function selectAllEmployees(page, itemsPerPage){
    const startWith = page * itemsPerPage;
    const fitSelectedExpr =
        `(SELECT * FROM tblemployees ORDER BY empName ` +
        `LIMIT ${startWith},${itemsPerPage}) AS fitselected `;
    const expr = joinDpTable(fitSelectedExpr);

    return query(expr);
}

function selectSingleEmployee(id){
    const fitSelectedExpr =
        `(SELECT * FROM tblemployees ` +
        `WHERE empID=${id}) AS fitselected`;
    const expr = joinDpTable(fitSelectedExpr);

    return query(expr);
}

async function updateEmployee(id, newData){
    const dpID = await getDpIdWithDpName(newData.dpName);
    const expr =
        'UPDATE tblemployees ' +
        `SET empName='${newData.empName}', empActive=${newData.empActive}, emp_dpID=${dpID} ` +
        `WHERE empID=${id}`;

    try{
        await query(expr);
    }catch(err){
        throw err;
    }

    return selectSingleEmployee(id);
}

function deleteEmployee(id){
    const expr =
        'DELETE FROM tblemployees ' +
        `WHERE empID=${id}`;
    return query(expr);
}

function searchByNameFit(nameFit, page, itemsPerPage){
    const startWith = page * itemsPerPage;
    const fitSelectedExpr =
        '(SELECT * FROM ' +
            '(SELECT * FROM tblemployees ' +
            `WHERE tblemployees.empName LIKE '${nameFit}%' ) AS allfits ` +
        `ORDER BY allfits.empName LIMIT ${startWith},${itemsPerPage}) AS fitselected `;

    const expr = joinDpTable(fitSelectedExpr);

    return query(expr);
}

function getRowsTotalNumber(){
    const expr = 'SELECT COUNT(empID) AS totalNumber FROM tblemployees';

    return query(expr);
}

async function getDpIdWithDpName(name){
    try{
        const dpObj = await query(`SELECT dpID FROM tbldepartments WHERE dpName='${name}'`);
        return dpObj[0].dpID;
    }catch(err){
        throw err;
    }
}

function joinDpTable (fitSelected){
    const fields = 'empID, empName, empActive, dpName';

    return `SELECT ${fields} FROM ${fitSelected} ` +
        'JOIN tbldepartments ' +
        'WHERE fitselected.emp_dpID=tbldepartments.dpID';
}
