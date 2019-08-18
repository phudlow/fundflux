import React, { Component } from 'react';
import Checkbox from '../Checkbox';
import { capitalize } from 'lodash';

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            whichChecked: this.props.whichChecked
        }

        this.onCheckboxClick = this.onCheckboxClick.bind(this);
    }
    onCheckboxClick(e) {
        const id = e.target.parentNode.getAttribute('data-project-id');

        if (this.props.allowMultipleChecked) {
            this.setState({
                whichChecked: { id: !this.state.whichChecked.id }
            });
        }
        else {
            this.setState({
                whichChecked: id
            });
        }
    }
    render() {
        const fields = this.props.fields || Object.keys(this.props.data[0]);

        // Create table rows
        let tableRows = this.props.data.map(data => {
            let cells = [];

            if (this.props.checkboxes) {
                cells.push((
                    <td key="chkbox">
                        <Checkbox
                            isChecked={data.id == this.state.whichChecked}
                        />
                    </td>
                ));
            }

            cells = [...cells, ...fields.map((fieldName, idx) => {
                return <td key={idx}>{data[fieldName]}</td>;
            })];

            return (
                <tr key={data.id} data-id={data.id} onClick={this.props.onRowClick || this.onCheckboxClick}>
                    {cells}
                </tr>
            );
        });

        // Create cells for header row
        let tableHeadCells = [];
        if (this.props.checkboxes) {
            tableHeadCells.push(<td width="2em" key="chkbox"></td>);
        }
        tableHeadCells = [...tableHeadCells, fields.map((fieldName, idx) => {
            return <td key={idx}>{capitalize(fieldName)}</td>;
        })]

        return (
            <table>
                <thead>
                    <tr>
                        {tableHeadCells}
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        )
    }
}

export default Table;
