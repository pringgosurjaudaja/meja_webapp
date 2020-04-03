import React from 'react';
import { Card, Table, Nav } from 'react-bootstrap';
import 'styles/styles.css';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { axios } from 'utilities/helper';

export class ScheduleTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
        }
    }
    
    componentDidMount() {
        this.setState({ reservation: this.props.data });
        
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ reservation: nextProps.reservation });
        // console.log(this.props.reservation);
        // nextProps.reservation.forEach((item)=>{
        //     console.log(item.table_number);
        // })

        // let res = nextProps.reservation.filter((item)=>{
        //     return item.table_number == this.nextProps.table_num;
        // })
        // console.log(res);
    }

    handleDeleteRow = (row)=>{
        console.log(row);
        for(let index = 0; index < row.length; ++index) {
            axios({
                method: 'delete',
                url: 'http://127.0.0.1:5000/reservation/'+row[index],
            })
        }
    }

    onBeforeSaveCell = (row, cellName, cellValue) => {
        // You can do any validation on here for editing value,
        // return false for reject the editing
        console.log(row);
        console.log(cellName);
        console.log(cellValue);
        console.log(row[cellName]);
        let data = row;
        data[cellName] = cellValue;
        console.log(row.id);
        console.log(this.props.table_number);
        axios({
            method: 'put',
            url: 'http://127.0.0.1:5000/reservation/'+row.id,
            data: {
                "table_number":this.props.table_number,
                "email": data["email"],
                "number_diner": parseInt(data["diner"]),
                "datetime": data["date"]+"T"+data["time"],
                "reservation_notes": data["note"],
            },
            timeout: 1000,
        })
        .then((response)=>{
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
        return true;
      }
    
    render () {
        
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell,
          };
          
        return (
        <Card style={{ width: '100%', margin: '10px' }}>
                <Card.Header>
                    <Card.Title>Table {this.props.table_number}</Card.Title>
                    {/* <Card.Subtitle>#{order._id}</Card.Subtitle> */}
                </Card.Header>
                <Card.Body>
                    <BootstrapTable data={this.state.reservation} version='4'
                    cellEdit={ cellEditProp }
                    deleteRow
                    selectRow={ { mode: 'checkbox' } }
                    options={{ onDeleteRow: this.handleDeleteRow }}>
                        <TableHeaderColumn isKey dataField='id'>#</TableHeaderColumn>
                        <TableHeaderColumn dataField='email'>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='diner'>Diner</TableHeaderColumn>
                        <TableHeaderColumn dataField='date'>Date</TableHeaderColumn>
                        <TableHeaderColumn dataField='time'>Time</TableHeaderColumn>
                        <TableHeaderColumn dataField='note'>Note</TableHeaderColumn>
                    </BootstrapTable>
                        
                    {/* <Card.Title>Total: ${this.getTotal(order)}</Card.Title> */}
                </Card.Body>
            </Card>);
    }
}