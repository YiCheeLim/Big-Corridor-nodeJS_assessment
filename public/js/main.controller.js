var app = angular.module('mainApp', ['ngRoute']);

app.config(['$routeProvider', function config($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '../html/product-list.html'
        }).
        when('/add-product', {
            templateUrl: '../html/product-add-edit.html'
        }).
        when('/edit-product', {
            templateUrl: '../html/product-add-edit.html'
        });
}
]);

app.controller('mainController', function ($scope, $location) {
    $scope.originalList = [];
    $scope.productlist = [];
    $scope.info = {
        newCode: "",
        brand: "",
        code: "",
        name: "",
        edit: false,
        searchForm: ""
    }
    $scope.sortInfo = {
        nextName: "asc",
        nextBrand: "asc"
    }

    this.$onInit = function () {
        const xmlhr = new XMLHttpRequest();
        xmlhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                $scope.productlist = Object.values(JSON.parse(xmlhr.responseText));
                $scope.originalList = $scope.productlist;
            }
        };

        xmlhr.open("POST", "/get-products");
        xmlhr.setRequestHeader("Content-Type", "application/json");
        xmlhr.send();
    }

    $scope.addProduct = function () {
        $location.url('/add-product');
    }
    $scope.setProduct = function (product) {
        $scope.info.brand = product.brand;
        $scope.info.code = product.code;
        $scope.info.newCode = product.code;
        $scope.info.name = product.name;
        $scope.info.edit = true;

        $location.url('/edit-product');
    }

    $scope.add = function () {
        console.log("add");
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("add return");
                $scope.productlist.push(Object.values(JSON.parse(xhr.responseText)));
                window.location.href = "/"
            }
        };

        xhr.open("POST", "/add-product");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            brand: $scope.info.brand,
            name: $scope.info.name
        }));
    }

    $scope.edit = function () {
        if (!(typeof $scope.info.brand === "string" && $scope.info.brand.trim())) {
            alert("brand must be a non-empty string");
            return;
        }
        if (!(typeof $scope.info.name === "string" && $scope.info.name.trim())) {
            alert("name must be a non-empty string");
            return;
        }
        if (typeof $scope.info.newCode !== "number") {
            alert("code must be a number");
            return;
        }

        const xmlhr = new XMLHttpRequest();
        console.log("edit");

        xmlhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("edit return");
                $scope.info.edit = false;
                $scope.productlist = Object.values(JSON.parse(xmlhr.responseText));
                $scope.originalList = $scope.productlist;
                $location.url('/');
            }
        };

        xmlhr.open("POST", "/update-product");
        xmlhr.setRequestHeader("Content-Type", "application/json");
        xmlhr.send(JSON.stringify({
            brand: $scope.info.brand,
            name: $scope.info.name,
            newCode: $scope.info.newCode,
            oldCode: $scope.info.code
        }));
    }
    $scope.cancel = function () {
        $location.url('/');
    }
    $scope.delete = function () {
        const xhr = new XMLHttpRequest();
        console.log("delete");

        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("delete return");
                $scope.info.edit = false;
                $scope.productlist = Object.values(JSON.parse(xhr.responseText));
                $scope.originalList = $scope.productlist;
                $location.url('/');
            }
        };

        xhr.open("POST", "/delete-product");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            code: $scope.info.code
        }));
    }

    $scope.sort = function (type) {
        console.log(type)
        switch (type) {
            case 'name':
                if ($scope.sortInfo.nextName === "asc") {
                    $scope.productlist.sort($scope.sortNameAsc);
                    $scope.sortInfo.nextName = "des";
                } else {
                    $scope.productlist.sort($scope.sortNameDes);
                    $scope.sortInfo.nextName = "asc";
                }
                break;
            case 'brand':
                if ($scope.sortInfo.nextBrand === "asc") {
                    $scope.productlist.sort($scope.sortBrandAsc);
                    $scope.sortInfo.nextBrand = "des";
                } else {
                    $scope.productlist.sort($scope.sortBrandDes);
                    $scope.sortInfo.nextBrand = "asc";
                }
                break;
            default:
                console.log("unhandled type : ", type);
        }
    }
    $scope.sortNameAsc = function (a, b) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    }
    $scope.sortNameDes = function (a, b) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison * -1;
    }
    $scope.sortBrandAsc = function (a, b) {
        const brandA = a.brand.toLowerCase();
        const brandB = b.brand.toLowerCase();

        let comparison = 0;
        if (brandA > brandB) {
            comparison = 1;
        } else if (brandA < brandB) {
            comparison = -1;
        }
        return comparison;
    }
    $scope.sortBrandDes = function (a, b) {
        const brandA = a.brand.toLowerCase();
        const brandB = b.brand.toLowerCase();

        let comparison = 0;
        if (brandA > brandB) {
            comparison = 1;
        } else if (brandA < brandB) {
            comparison = -1;
        }
        return comparison * -1;
    }

    $scope.checkNumber = function () {
        if (typeof $scope.info.newCode !== "number") {
            alert("code must be a number");
        }
    }
    $scope.search = function () {
        let tempArray = [];
        if ( $scope.info.searchForm ) {
            for (const p of $scope.originalList) {
                if ( p.brand.includes($scope.info.searchForm) ) {
                    tempArray.push(p);
                } else if (p.name.includes($scope.info.searchForm)) {
                    tempArray.push(p);
                } else if (p.code.toString().includes($scope.info.searchForm)) {
                    tempArray.push(p);
                }
            }
            $scope.productlist = tempArray;
        } else {
            // alert ("please at least key in something to search");
            $scope.productlist = $scope.originalList;
        }
    }
});