const express = require('express')
const fs = require('fs')
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.use('/', express.static('public'));
app.use('/lib', express.static('lib'));

app.get('/', (req, res) => {
    if (Object.keys(Product.byCode).length == 0) {
        Product.initialise().then(() => {
            res.sendfile('./public/main.html');
        });
    } else {
        res.sendfile('./public/main.html');
    }
});
app.post('/get-products', (req, res) => {
    res.json(Product.byCode);
});
app.post('/add-product', jsonParser, (req, res) => {
    console.log("add");
    Product.add(req.body.brand, req.body.name).then((respond) => {
        res.json(Product.byCode[respond]);
    }).catch((err) => {
        console.error(err);
        res.json(err);
    });
});
app.post('/update-product', jsonParser, (req, res) => {
    Product.byCode[req.body.oldCode].edit(req.body.newCode, req.body.brand, req.body.name).then((respond) => {
        res.json(Product.byCode);
    }).catch((err) => {
        res.json(err);
    });
});

app.listen(80);
console.log('Listening at http://localhost:80');

const Product = class {
    constructor(aux) {
        this.code = parseInt(aux.code);
        this.brand = aux.brand;
        this.name = aux.name;
    };

    static initialise() {
        return new Promise((resolve, reject) => {
            fs.readFile("db.json", 'utf-8', (err, data) => {
                const json = JSON.parse(data);
                for (const p in json) Product.byCode[p] = new Product(json[p]);

                resolve(Product.byCode);
            });
        });
    }
    static add(brand, name) {
        return new Promise((resolve, reject) => {
            if (typeof brand !== "string") reject("brand must be a non-empty string");
            if (typeof name !== "string") reject("name must be a non-empty string");

            let code = Product.generateCode(12);
            while (Product.byCode[code]) {
                code = Product.generateCode(12);
            }
            Product.byCode[code] = new Product({
                code: code,
                brand: brand,
                name: name
            });

            console.log(Product.byCode);
            fs.writeFile('db.json', JSON.stringify(Product.byCode), (err) => {
                if (err) reject(err);

                resolve(code);
            });
        });
    }
    static generateCode(n) {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

        if (n > max)
            return Product.generateCode(max) + Product.generateCode(n - max);

        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;

        return ("" + number).substring(add);
    }

    edit(newCode, brand, name) {
        return new Promise((resolve, reject) => {
            if (typeof brand !== "string") reject("brand must be a non-empty string");
            if (typeof name !== "string") reject("name must be a non-empty string");
            if (Product.byCode[newCode] && this.code !== newCode) reject("newCode cannot be same");

            delete Product.byCode[this.code];

            Product.byCode[newCode] = new Product({
                code: newCode,
                brand: brand,
                name: name
            });

            fs.writeFile('db.json', JSON.stringify(Product.byCode), (err) => {
                if (err) reject(err);

                resolve(newCode);
            });
        });
    }

    delete() {
        return new Promise((resolve, reject) => {
            delete Product.byCode[this.code];

            fs.writeFile('db.json', JSON.stringify(Product.byCode), (err) => {
                if (err) reject(err);

                resolve(code);
            });
        })
    }
};
Product.byCode = {};