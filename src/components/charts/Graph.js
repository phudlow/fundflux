import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fluxesByAcct: this.calculatePoints()
        }

        this.createChart = this.createChart.bind(this);
    }
    componentDidMount() {
        this.createChart();
    }
    componentDidUpdate() {
        this.createChart();
    }
    createChart() {
        const fluxesByAcct = this.state.fluxesByAcct;

        const svg = d3.select('svg');
        const height = +svg.attr("height");
        const width = +svg.attr("width");

        const padding = { top: 10, right: 10, bottom: 10, left: 10 };
        const innerHeight = height - padding.top - padding.bottom;
        const innerWidth = width - padding.left - padding.right;

        const xValue = d => d.date;
        const yValue = d => d.balance;

        const xDomain = d3.extent(Array.prototype.concat(Object.values(fluxesByAcct).map(accVals => accVals.map(d => d.date)), xValue));
        const xScale = d3.scaleTime()
            .domain([this.props.minDate, this.props.maxDate])
            .range([0, height]);

        const yDomain = d3.extent(Object.values(fluxesByAcct).flat(), yValue);
        const yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([0, width]);

        svg.selectAll('circle').data(Object.values(fluxesByAcct)[0])
            .enter().append('circle')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.balance))
            .attr('fill', 'black')
            .attr('r', 2)
    }
    calculatePoints(transactions, ) {
        const fluxesByAcct = {};

        const timeIncrementers = {
            daily: date => new Date(date.setDate(date.getDate() + 1)),
            weekly: date => new Date(date.setDate(date.getDate() + 7)),
            biweekly: date => new Date(date.setDate(date.getDate() + 14)),
            monthly: date => new Date(date.setMonth(date.getMonth() + 1)),
            quarterly: date => new Date(date.setMonth(date.getMonth() + 3)),
            semiannual: date => new Date(date.setMonth(date.getMonth() + 6)),
            annual: date => new Date(date.setFullYear(date.getFullYear() + 1)),
        }

        this.props.transactions.forEach(transaction => {
            const timeIncrementer = timeIncrementers[transaction.frequency];
            let currentDate = transaction.start_date;

            // While the date is not past maxDate, keep pushing transactions
            while (currentDate < this.props.maxDate) {
                transaction.deltas.forEach(delta => {
                    fluxesByAcct[delta.account_id] = fluxesByAcct[delta.account_id] || [];

                    // Create a flux for from_account, if it exists
                    fluxesByAcct[delta.account_id].push({
                        date: currentDate,
                        value: delta.value && +delta.value,
                        formula: delta.formula
                    });

                    // Create a flux for from_account, if it exists
                    if (fluxesByAcct[delta.from_account_id]) {
                        fluxesByAcct[delta.from_account_id] = fluxesByAcct[delta.from_account_id] || [];

                        fluxesByAcct[delta.account_id].push({
                            date: currentDate,
                            value: delta.value && -delta.value,
                            formula: delta.formula && `-(${delta.formula})`
                        });
                    }
                });

                currentDate = timeIncrementer(currentDate);
            }
        });

        // Sort by date then calculate balance at each date
        for (const acctId in fluxesByAcct) {
            fluxesByAcct[acctId].sort((a, b) => a.date - b.date );

            let balance = 0;
            fluxesByAcct[acctId] = fluxesByAcct[acctId].map(flux => {
                balance += flux.value   ? flux.value :
                           flux.balance ? eval(flux.formula.replace('v', balance)) :
                           0;

                return { date: flux.date, balance };
            });
        }

        return fluxesByAcct;
    }
    render() {
        return (
            <div>
                A GRAPH!
                <svg height="300" width="500"></svg>
            </div>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const plan = state.plans.byId[ownProps.planId];
    const transactions = plan.transactions.map(transaction => {
        return state.transactions.byId[transaction];
    });

    // Replace delta ids within transaction with actual delta data
    transactions.forEach(transaction => {
        transaction.deltas = transaction.deltas.map(delta => state.deltas.byId[delta]);
    });

    // Sort by start_date
    transactions.sort((a, b) => {
        return a.start_date.getTime() - b.start_date.getTime();
    });

    return {
        plan,
        transactions,
        minDate: ownProps.minDate || d3.max(transactions, transaction => transaction.start_date.getTime()),
        maxDate: ownProps.maxDate || new Date(),
    }
}

export default connect(mapStateToProps, null)(Graph);
