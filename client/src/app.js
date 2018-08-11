var app = angular.module("employeesList", []);

app.controller('employeesListCtrl', function($scope, $http) {
    $scope.page = 1;
    $scope.pages = [];
    $scope.url = 'http://localhost:8080/api/all';
    $scope.viewingEmployeeInfo = false;
    $scope.editingEmployeeInfo = false;
    $scope.searchingEmployees = false;
    setPages();

    $http.get('http://localhost:8080/api/all')
        .then(response => {
            $scope.employees = response.data;
        });

    $scope.changePage = function($event){
        $scope.page = angular.element($event.target).text();

        $http.get($scope.url + '?page='+$scope.page)
            .then(response => {
                $scope.employees = response.data;
            });
    };

    $scope.viewEmployee = function($event){
        $scope.changeView('viewing');

        const idCell = angular.element($event.target).next().next();
        const employeeId = idCell[0].textContent;

        $http.get('http://localhost:8080/api/'+employeeId)
            .then(response => {
                $scope.singleEmployee = response.data[0];
            });
    };

    $scope.editEmployee = function ($event){
        $scope.changeView('editing');

        $http.get('http://localhost:8080/api/departments')
            .then(response => {
                $scope.depsList = response.data;
            });

        const idCell = angular.element($event.target).next();
        const employeeId = idCell[0].textContent;

        $http.get('http://localhost:8080/api/'+employeeId)
            .then(response => {
                $scope.singleEmployee = response.data[0];
            });
    };

    $scope.updateEmployee = function(){
        $http.patch('http://localhost:8080/api/'+$scope.singleEmployee.empID, $scope.singleEmployee )
            .then(response => {
                $scope.singleEmployee = response.data[0];
                $scope.employees = $scope.employees.map((employee) => {
                    return employee.empID==$scope.singleEmployee.empID ? $scope.singleEmployee : employee;
                });
            });
    };

    $scope.cancelChanges = function(){
        $scope.editingEmployeeInfo = false;
    };

    $scope.deleteEmployee = function($event){
        const idCell = prev(angular.element($event.target), 4);
        const employeeId = idCell.textContent;

        $http.delete('http://localhost:8080/api/' + employeeId + '?page=' + $scope.page)
            .then(response => {
                $scope.employees = response.data;
            });
    };

    $scope.search = function($event){
        const searchValue = prev(angular.element($event.target), 1).value;
        $scope.url = searchValue==='' ? 'http://localhost:8080/api/all' : 'http://localhost:8080/api/all/find/'+searchValue;
        $http.get($scope.url)
            .then(response => {
                setPages();
                $scope.employees = response.data;
            });
    };

    $scope.changeView = function(view){
        $scope.viewingEmployeeInfo = false;
        $scope.editingEmployeeInfo = false;
        $scope.searchingEmployees = false;

        if(view == 'viewing') $scope.viewingEmployeeInfo = true;
        if(view == 'editing') $scope.editingEmployeeInfo = true;
        if(view == 'searching') $scope.searchingEmployees = true;
    };

    function prev(element, count){
        count--;
        const prevNode = element[0].previousElementSibling;
        const prevElem = angular.element(prevNode);
        if (count == 0) return prevNode;
        return prev(prevElem, count);
    }

    function setPages() {
        $http.get($scope.url+'/number')
            .then(response => {
                $scope.total = response.data[0].totalNumber;
                const pagesNum = Math.ceil($scope.total / 10);
                $scope.pages = Array.from(Array(pagesNum).keys());
            });
    };
});