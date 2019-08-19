import React, { Component } from 'react';
import Checkbox from '../Checkbox';
import { capitalize } from 'lodash';

/**
 * @param {Object[]}           data
 * Array of objects containing data to be displayed
 * @param {(String\|Number)[]} [fields]
 * Array of fields from data to use in the table. If typeof string, the capitalized key is used as the label.
 * @param {String|null}        [fields[].label]
 * The custom header label to be used for this row.
 * @param {Function}           [fields[].content]
 * Takes row data as a param and returns the JSX content for the cell.
 * @param {Object}             [fields[].style]
 * Style object to be passed to the <td>
 * @param {Boolean}            [checkboxes]
 * True to include checkboxes as the first column on all rows
 * @param {Number|Number[]}    [whichChecked]
 * The id, or when allowMultipleChecked=true, the ids of the rows with checked checkboxes
 * @param {Boolean}            [allowMultipleChecked]
 * If true, multiple row may be checked.  If false, only one.
 * @param {Function}           [onRowClick] Called when a row is clicked
 * @param {Function}           [onCheckboxClick] Called when a row is clicked
 */
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

            cells = [...cells, ...fields.map((field, idx) => {
                let content, cellStyle;
                if (typeof field === 'string') {
                    content = data[field];
                }
                else {
                    content = field.content(data);
                    cellStyle = field.cellStyle;
                }
                return <td key={idx} style={cellStyle}>{content}</td>;
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
        tableHeadCells = [...tableHeadCells, fields.map((field, idx) => {
            let label = typeof field === 'string' ? field : field.label;
            return <td key={idx}>{capitalize(label)}</td>;
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
