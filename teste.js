const async = require('async');
const buttonsMessage = require('../../../../../status/tools/messageOptions/buttonMessage')
const checkErrorOrContinue = require('../../../../tools/checkErrorOrContinue');
const MaltaApi = require('../../../malta/api')
const metrics = require('../../../../metrics/metrics');
const { exit } = require('process');
const convertToNumber = (value) => Number(value.replace(/\D/g, '')) / 100;
const convertToNumber2 = (value) => Number(value.replace(/\D/g, '')) / 100;
module.exports = function (data, stages, message, cb) {
    data.toSet = []
    let _proposta = data.chat._proposta || {}
    let printMode = 1;
    let frase = "second";
    if (stages[3] === 'secondPrint') {
        printMode = 0
        data.chat._contract = data.chat._contract[0]
        // data.chat._contract.NumContrato = _proposta.Contrato
        data.chat._contract.CodCredor = data.chat.CodCredor
    } else if (stages[3] === 'antecipacaoParcela') {
        printMode = 2
    }
    async.waterfall([
        (callback) => {
            data.sendMessage(data.getPhrase('confirmation.firstPrint.MessageList.first', {
                returnAsArray: true
            }).map(text => ({
                text,
                type: 'sendText'
            })), callback)
        },
        (callback) => {
            _request = {
                urlApi: data.bot.urlApi,
                proposta: _proposta,
                idProposta: _proposta.Id,
                credor: data.chat._contract.CodCredor,
                contrato: data.chat._contract.NumContrato,
                cpf: data.chat.userData.CpfCnpj,
                channel: data.bot.channel,
                printMode,
            }
            data.valorAcordo = _proposta.ValorParcela && _proposta.ValorParcela != "0,00" ? _proposta.ValorParcela : _proposta.ValorPago;
            _proposta.QtdeParcelas = parseInt(_proposta.QtdeParcelas);
            _proposta.valorEntrada = convertToNumber(_proposta.valorEntrada);
            _proposta.ValorParcela = convertToNumber(_proposta.ValorParcela);
            // let valor1 = null
            // valor1 = _proposta.valorEntrada.split('.')[1].length === 1 ? _proposta.valorEntrada + '0' : _proposta.valorEntrada;
            // _proposta.valorEntrada = data.chat.antecipando === "OK" ? convertToNumber2(valor1) : convertToNumber(_proposta.valorEntrada);
            // valor1 = _proposta.ValorParcela.split('.')[1].length === 1 ? _proposta.ValorParcela + '0' : _proposta.ValorParcela;
            // _proposta.ValorParcela = data.chat.antecipando === "OK" ? convertToNumber2(valor1) : convertToNumber(_proposta.ValorParcela);
            if (_proposta.QtdeParcelas > 0) {
                data.valorAcordo = `${_proposta.valorEntrada + _proposta.ValorParcela * _proposta.QtdeParcelas}`.replace('.', ',');
            }
            data.opcaoPagamento = _proposta.Tipo || `AV`;
            data.valorCorrigidoDivida = _proposta.ValorCorrigido || `0,00`;
            data.valorPrimeira = _proposta.valorEntrada || `0,00`;
            data.numeroParcelas = _proposta.QtdeParcelas || 0;
            data.valorParcelas = _proposta.ValorParcela || 0;
            _metricUpdate = {
                proposta: _proposta,
                vencimentoPrimeira: data.chat.vencimento,
                desistenciaFluxo: false,
                valorAcordo: data.valorAcordo,
                opcaoPagamento: data.opcaoPagamento,
                valorPrimeira: data.valorPrimeira,
                numeroParcelas: data.numeroParcelas,
                valorParcelas: data.valorParcelas,
                valorCorrigidoDivida: data.valorCorrigidoDivida,
            }
            MaltaApi.GerarBoleto(_request, data.chat._id, (err, apiReturn, body) => {
                checkErrorOrContinue(err || body, data).then(() => {
                    if (body.Retorno === 96) {
                        data.clearMessageWait();
                        data.ignoreGoodbyeMessage = true;
                        data.setProperty([{
                            property: 'metricaTransbordo',
                            value: 'Envio mesmo canal - 08 - Informação não encontrada'
                        }], () => {
                            return require('../transfer')(data, `${data.bot.prefixTree}:transfer:firstPrint`.split(':'), message, cb)
                        })
                    } else {
                        data.responseGerar = body;
                        callback();
                    }
                }).catch((result) => {
                    if (body && body.Retorno === 99 && body.ExceptionService.includes('Seu acordo foi agendado')) {
                        const [,text] = body.ExceptionService.match(/System\.Exception\: (.*)/);
                        data.sendPreMessage({
                            text,
                            type: 'sendText'
                        });
                        return require('../../finalizacao/finalizeByFlow')(data, `${data.bot.prefixTree}:finalizacao:finalizeByFlow`.split(':'), message, cb);
                    }
                    return cb(null, result)
                });
            });
        },
        (callback) => {
            metrics.updateMetric(data.chat._doc.currentMetric, _metricUpdate, err => {
                checkErrorOrContinue(err, data).then(callback).catch((result) => {
                    return cb(null, result)
                });
            });
        },
        (callback) => {
            data.Linhadigitavel = data.responseGerar.Linhadigitavel;
            _request = {
                urlApi: data.bot.urlApi,
                proposta: _proposta,
                idProposta: _proposta.Id,
                credor: data.chat._contract.CodCredor,
                contrato: data.chat._contract.NumContrato,
                cpf: data.chat.userData.CpfCnpj,
                channel: data.bot.channel,
                printMode,
                nossoNumero: data.Linhadigitavel,
                tipo: 'both'
            }
            MaltaApi.EmitirBoleto(_request, data.chat._id, function (err, apiReturn, body) {
                checkErrorOrContinue(err || body, data).then(() => {
                    const responseEmitir = body;
                    const boleto = body.DadosBoleto;
                    data.boleto = boleto;
                    let valorBoleto = boleto.Valpago;
                    _metricUpdate = {
                        linhaDigitavelBoleto: boleto.Linhadigitavel,
                        valorBoleto: valorBoleto,
                        vencimentoBoleto: boleto.Datvenci,
                        codigoAcordo: body.CodigoAcordo,
                        enderecoDevedor: boleto.Desender,
                        numeroDevedor: boleto.Desnumer,
                        municipioDevedor: boleto.Descidad,
                        bairroDevedor: boleto.Desbairr,
                        cepDevedor: boleto.Descep,
                        agenciaBoleto: boleto.Agenciaconta,
                        nomeDevedor: boleto.Nomclien,
                        urlBoleto: responseEmitir.ArquivoDownload || responseEmitir.URL,
                        responseBoleto: responseEmitir,
                        proposta: responseEmitir.Propostas[0] || _proposta,
                        vencimentoPrimeira: data.chat.vencimento,
                        nossoNumeroBoleto: data.responseGerar.Linhadigitavel,
                        tipoEnvio: 10,
                    }
                    data.responseEmitir = responseEmitir;
                    data.setProperty([{
                        property: 'urlBoleto',
                        value: _metricUpdate.urlBoleto
                    }, {
                        property: '_dadosBoleto',
                        value: {
                            Valpago: (body.Propostas[0] || _proposta).ValorPago,
                            Datvenci: _metricUpdate.vencimentoBoleto,
                            linhaDigitavelBoleto: _metricUpdate.linhaDigitavelBoleto,
                            urlBoleto: _metricUpdate.urlBoleto,
                        }
                    },{
                        property:'modoNegocicao',
                        value:'acordo'
                    },{
                        property: 'responseEmitirBoleto',
                        value: data.responseEmitir
                    }
                ], callback)
                }).catch((result) => {
                    return cb(null, result)
                });
            });
        },
        (callback) => {
            metrics.updateMetric(data.chat._doc.currentMetric, _metricUpdate, err => {
                checkErrorOrContinue(err, data).then(callback).catch((result) => {
                    return cb(null, result)
                });
            }); //
        },
        (callback) => {
            if(data.chat._proposta.Tipo === "AP"){
                frase = "secondAP";
            }
            data.sendPreMessage(data.getPhrase(`confirmation.firstPrint.MessageList.${frase}`, {
                returnAsArray: true,
                _proposta
            }).map(text => ({
                text,
                type: 'sendText'
            })))

            data.buttons = data.getButtons('confirmation.firstPrint.buttonList')
            buttonsMessage(data.bot.source, data.buttons, data.bot.source === "facebook", ' para', true).then(obj => {
                if (!Array.isArray(obj.result)) obj.result = [obj.result];
                data.result = obj.result;
                data.options = obj.options;
                data.result[0].askAgainMessage = [data.getPhrase('confirmation.firstPrint.askAgainMessages.first', {
                    returnAsArray: true
                }).map(text => ({
                    text,
                    type: 'sendText'
                }))]
                data.result[0].attempt = true
                data.result[0].errorAttempsTransferToFile = `${data.bot.prefixTree}:finalizacao:finalizeByUser:invalidOptionSelected`;
                data.toSet.push({
                    property: 'options',
                    value: data.options
                }, {
                    property: 'repeatOptions',
                    value: data.result
                }, {
                    property: 'currentStatus',
                    value: `${data.bot.prefixTree}:optionsSelect`
                }, {
                    property: 'realizarTransbordo',
                    value: data.bot.configs.transbordoEmTentativasErradas
                }, {
                    property: 'transferMessage',
                    value: data.getPhrase('confirmation.firstPrint.askAgainMessages.transfer', {
                        returnAsArray: true
                    }).map(text => ({
                        text,
                        type: 'sendText'
                    }))
                });
                callback();
            }).catch(err => {
                checkErrorOrContinue(err, data).then(callback).catch((result) => {
                    return cb(null, result)
                });
            });
        },
        (callback) => {
            data.setProperty(data.toSet, (err) => {
                checkErrorOrContinue(err, data).then(callback).catch((result) => {
                    return cb(null, result)
                });
            })
        },
        (callback) => {
            data.setInactivityMessages([{
                    repeatMessages: [...data.getPhrase('confirmation.linhaDigitalvel.first', {
                        returnAsArray: true,
                        default: 'inactivityMessages.default.first'
                    }).map(text => ({
                        text,
                        type: 'sendText'
                    })), ...data.result],
                    nextTick: data.bot.initialWaitingTimeForResponse,
                },
                {
                    repeatMessages: data.getPhrase('formsDelivery.email.inactivityMessage.second', {
                        returnAsArray: true,
                        default: 'inactivityMessages.default.second'
                    }).map(text => ({
                        text,
                        type: 'sendText'
                    })),
                    nextTick: data.bot.endTimeOfResponse,
                }
            ], callback)
        }
    ], () => {
        return cb(null, data.result)
    })
}