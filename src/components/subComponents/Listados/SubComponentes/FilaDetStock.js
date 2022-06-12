import moment from 'moment'
import React from 'react'
const FilaProducto = ({
    id,
    item
}) => {

    return (
        <tr key={id} className="table-light">
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha, "YYYY-MM-DD").format("DD/MM/YYYY")}
            </td>
            <td style={{ textAlign: "center" }}>
                <span style={item.cant > 0 ? { color: "green" } : { color: "red" }}>{item.cant}</span>
            </td>
            <td style={{ textAlign: "center" }}>
                {item.nro_remito}
            </td>
        </tr>
    )
}

export default FilaProducto