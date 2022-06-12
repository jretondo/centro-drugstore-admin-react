import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import moment from 'moment';
import Chart from 'chart.js';
import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import formatMoney from 'Function/NumberFormat';
import axios from 'axios';
import UrlNodeServer from '../../../../api/NodeServer';

const FiscalVNoFiscal = () => {
    const today = new Date()
    let lastMonth = new Date()
    lastMonth.setDate(today.getDate() - 9)

    const [fromDate, setFromDate] = useState(moment(lastMonth).format("YYYY-MM-DD"))
    const [toDate, setToDate] = useState(moment(today).format("YYYY-MM-DD"))
    const [dataFiscal, setDataFiscal] = useState([])
    const [dataNoFiscal, setDataNoFiscal] = useState([])
    const [labels, setLabels] = useState([])
    const [fiscalRow, setFiscalRow] = useState(<td></td>)
    const [noFiscalRow, setNoFiscalRow] = useState(<td></td>)
    const [rowTotals, setRowTotals] = useState(<td></td>)
    const [finalList, setFinalList] = useState(<><tr></tr><tr></tr></>)
    const [totales, setTotales] = useState({
        noFiscal: 0,
        fiscal: 0,
        total: 0
    })

    const getData = async () => {
        const query = `?fromDate=${fromDate}&toDate=${toDate}`
        await axios.get(UrlNodeServer.reportsDir.sub.fiscal + query, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const data = res.data
            if (data.status === 200) {
                setDataFiscal(data.body.fiscales)
                setDataNoFiscal(data.body.noFiscales)
                setLabels(data.body.labels)
                setTotales({
                    fiscal: data.body.totalFiscal,
                    noFiscal: data.body.totalnoFiscal,
                    total: data.body.totalFiscal + data.body.totalnoFiscal
                })
            }
        }).catch(error => {
            console.error(error);
        })
    }

    const changeLement = () => {
        getData()
    }

    const combine = () => {
        const allArrays = [dataFiscal, dataNoFiscal]
        const totalsArray = allArrays.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);

        setFiscalRow(
            dataFiscal.map((item, key) => {
                return (
                    <td style={{ textAlign: "center" }} key={key}>
                        ${" "}{formatMoney(item)}
                    </td>
                )
            })
        )
        setNoFiscalRow(
            dataNoFiscal.map((item, key) => {
                return (
                    <td style={{ textAlign: "center" }} key={key}>
                        ${" "}{formatMoney(item)}
                    </td>
                )
            })
        )
        setRowTotals(
            totalsArray.map((item, key) => {
                return (
                    <td style={{ textAlign: "center", fontSize: "14px" }} key={key}>
                        ${" "}{formatMoney(item)}
                    </td>
                )
            })
        )
    }

    const generateGrafic = () => {
        let canvasElement = document.createElement("canvas")
        canvasElement.id = "myChart"
        document.getElementById("myChart").remove()
        document.getElementById("container-canvas").appendChild(canvasElement)
        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Fiscal',
                    data: dataFiscal,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'No Fiscal',
                    data: dataNoFiscal,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    useEffect(() => {
        setFinalList(<>
            <tr className="table-light">
                <td>Fiscal</td>
                {fiscalRow}
            </tr>
            <tr className="table-light">
                <td>No Fiscal</td>
                {noFiscalRow}
            </tr>
            <tr className="table-dark" style={{ fontWeight: "bold" }}>
                <td style={{ fontSize: "18px" }}>Totales</td>
                {rowTotals}
            </tr>
        </>)
    }, [fiscalRow, noFiscalRow])

    useEffect(() => {
        if (dataFiscal.length > 0 && dataNoFiscal.length > 0 && labels.length > 0) {
            generateGrafic()
            combine()
        }
    }, [dataFiscal, dataNoFiscal, labels])

    return (
        <Card>
            <CardBody>
                {labels.length > 0 ?
                    <Row style={{ border: "2px solid red", padding: "15px", marginBottom: "20px" }}>
                        <Col md="12" style={{ textAlign: "center" }}>
                            <h1>REPORTE DESDE: {labels[0]} HASTA: {labels[labels.length - 1]}</h1>
                        </Col>
                    </Row> :
                    null}
                <Row>
                    <Col md="3">

                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <Label>
                                Fecha Desde
                            </Label>
                            <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} max={toDate} />
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <Label>
                                Fecha Hasta
                            </Label>
                            <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} max={moment(today).format("YYYY-MM-DD")} min={fromDate} />
                        </FormGroup>
                    </Col>
                    <Col md="3">

                    </Col>
                </Row>
                <Row>
                    <Col md="12" style={{ textAlign: "center" }}>
                        <Button color="danger" onClick={changeLement} >
                            Generar Reporte
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md="12" id="container-canvas" >
                        <canvas id="myChart" style={{ width: "100%" }} ></canvas>
                    </Col>
                </Row>

                <Row>
                    <ListadoTable
                        titulos={["Tipo", ...labels]}
                        listado={finalList}
                    />
                </Row>
                <Row>
                    <Col md="4">
                        <FormGroup style={{ border: "2px solid red", padding: "15px", fontSize: "18px" }}>
                            <Label >
                                TOTAL FISCAL
                            </Label>
                            <Input value={"$ " + formatMoney(totales.fiscal)} disabled />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup style={{ border: "2px solid red", padding: "15px", fontSize: "18px" }}>
                            <Label >
                                TOTAL NO FISCAL
                            </Label>
                            <Input value={"$ " + formatMoney(totales.noFiscal)} disabled />
                        </FormGroup>
                    </Col>
                    <Col md="4">
                        <FormGroup style={{ border: "2px solid red", padding: "15px", fontSize: "22px", fontWeight: "bold" }}>
                            <Label >
                                TOTAL
                            </Label>
                            <Input value={"$ " + formatMoney(totales.total)} disabled />
                        </FormGroup>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default FiscalVNoFiscal