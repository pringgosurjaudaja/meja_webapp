import 'src/styles/styles.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { Card } from 'react-bootstrap';
import React from 'react';
import { Requests } from 'src/utilities/Requests';

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
        this.setState({ reservation: nextProps.data });
    }


    handleDeleteRow = async (row) =>{
        for(let index = 0; index < row.length; ++index) {
            await Requests.deleteReservation(row[index]);
        }
    }

    onBeforeSaveCell = async (row, cellName, cellValue) => {
        // You can do any validation on here for editing value,
        // return false for reject the editing
        let data = row;
        data[cellName] = cellValue;
        let arg = {
            table_id: this.props.table_id,
            email: data["email"],
            number_diner: parseInt(data["diner"]),
            datetime: data["date"]+"T"+data["time"],
            reservation_notes: data["note"]
        };
        await Requests.updateReservation(row.id, arg);
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
                    <Card.Title>Table {this.props.table_name}</Card.Title>
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