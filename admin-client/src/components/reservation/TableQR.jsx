import React from 'react';

export class TableQR extends React.Component {
    render() {
        const qrApiUrl = 'http://api.qrserver.com/v1/create-qr-code/?';
        const size = 'size=' + this.props.size + 'x' + this.props.size
        const data = 'data=http://localhost:3000/home?table_id=' + this.props.tableId;
        const imgUrl = [qrApiUrl, size, data].join('&');

        return (<img src={imgUrl} alt="tableqr"/>);
    }
}