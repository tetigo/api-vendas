"use strict";
exports.__esModule = true;
require("reflect-metadata"); //precisa ser o primeiro
var express_1 = require("express");
require("express-async-errors");
var cors_1 = require("cors");
var routes_1 = require("./routes");
var celebrate_1 = require("celebrate");
//esse uso de @ no path foi criado ligacao no tsconfig.json
var AppError_1 = require("@shared/errors/AppError");
require("@shared/typeorm"); // faz conexão com banco automaticamente
var app = express_1["default"]();
app.use(cors_1["default"]());
app.use(express_1["default"].json());
app.use(routes_1["default"]);
app.use(celebrate_1.errors()); //erros lançados pelo Joi na validação com celebrate
app.use(function (error, req, res, next) {
    if (error instanceof AppError_1["default"]) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }
    else {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
});
app.listen(3333, function () {
    console.log('Server started on port 3333');
});
