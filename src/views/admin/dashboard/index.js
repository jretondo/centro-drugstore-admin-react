import React, { useState, useEffect } from "react";
import { useToken } from '../../../Hooks/UseFetchToken'
import UrlNodeServer from '../../../api/NodeServer'
import Header from "components/Headers/Header.js";
import {
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    Container,
    Row,
    Spinner
} from "reactstrap";
import { Redirect } from "react-router-dom";
import ButtonOpenCollapse from "components/buttonOpen";
import { useWindowSize } from '../../../Hooks/UseWindowSize';
import FiscalVNoFiscal from './components/fiscalvnofiscal';

const Index = () => {
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [cookie, setCookie] = useState("")
    const [moduleActive, setModuleActive] = useState(0)
    const { dataT, loadingT, errorT } = useToken(
        url,
        call,
        cookie
    )
    const width = useWindowSize()
    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl(UrlNodeServer.Veriflog)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loadingT) {
            if (!errorT) {
                if (dataT.nombre) {
                    localStorage.setItem("Nombre", dataT.nombre)
                    localStorage.setItem("Apellido", dataT.apellido)
                }
            }
        }
        // eslint-disable-next-line
    }, [loadingT])

    if (loadingT) {
        return (
            <div style={{ textAlign: "center" }}>
                <Spinner type="grow" color="light" /> </div>
        )
    } else if (errorT) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else {
        return (
            <>
                <Header />
                <Container className="mt--7" fluid>
                    <div style={{ width: "100%" }}>
                        <Card style={{ marginTop: "5px", marginBottom: "10px" }}>
                            <CardBody style={{ textAlign: "center" }}>
                                <ButtonGroup vertical={width > 1030 ? false : true}>
                                    <ButtonOpenCollapse
                                        action={() => setModuleActive(0)}
                                        tittle={"Fiscal vs No Fiscal"}
                                        active={moduleActive === 0 ? true : false}
                                    />
                                    <ButtonOpenCollapse
                                        action={() => setModuleActive(1)}
                                        tittle={"Ventas por Categorías"}
                                        active={moduleActive === 1 ? true : false}
                                    />
                                    <ButtonOpenCollapse
                                        action={() => setModuleActive(2)}
                                        tittle={"Formas de Pago"}
                                        active={moduleActive === 2 ? true : false}
                                    />
                                </ButtonGroup>
                            </CardBody>
                        </Card>

                        <Collapse isOpen={moduleActive === 0 ? true : false} >
                            <FiscalVNoFiscal />
                        </Collapse>

                        <Collapse isOpen={moduleActive === 2 ? true : false} >

                        </Collapse>

                        <Collapse isOpen={moduleActive === 1 ? true : false} >

                        </Collapse>
                    </div>
                </Container>
            </>
        )
    }
}

export default Index;
