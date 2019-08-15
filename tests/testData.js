const testData = {
    projects: [
        {
            name: "Business",
            description: "For business-related accounts",
            accounts: [
                {
                    name: "Payroll",
                    description: "For salary expenses"
                },
                {
                    name: "Main",
                    description: "Accounts payable / recievable (except Payroll)"
                },
                {
                    name: "Investments",
                    description: "Properties / Assets"
                }
            ],
            plans: [
                {
                    name: "Main",
                    description: null,
                    transactions: [
                        {
                            name: "Allocate payroll",
                            description: "Move money to payroll account biweekly",
                            start_date: "2019-06-01",
                            end_date: null,
                            frequency: "biweekly",
                            deltas: [
                                {
                                    name: "Jane\'s salary",
                                    description: "Compensation for IT role",
                                    accountName: "Main",
                                    fromAccountName: "Payroll",
                                    value: "3200.00",
                                    formula: null
                                }, {
                                    name: "John\'s salary",
                                    description: "Compensation for assistant role",
                                    accountName: "Main",
                                    fromAccountName: "Payroll",
                                    value: "2500.00",
                                    formula: null
                                }, {
                                    name: "Jill\'s salary",
                                    description: "Compensation for management role",
                                    accountName: "Main",
                                    fromAccountName: "Payroll",
                                    value: "4000.00",
                                    formula: null
                                }
                            ]
                        },
                        {
                            name: "Distribute payroll",
                            description: "Direct deposit to employees",
                            start_date: "2019-06-08",
                            end_date: null,
                            frequency: "biweekly",
                            deltas: [
                                {
                                    name: null,
                                    description: null,
                                    accountName: "Payroll",
                                    from_account_id: null,
                                    value: null,
                                    formula: "v*0"
                                }
                            ]
                        },
                        {
                            name: "Revenue",
                            description: null,
                            start_date: "2019-05-01",
                            end_date: null,
                            frequency: "monthly",
                            deltas: [
                                {
                                    name: null,
                                    description: null,
                                    accountName: "Main",
                                    from_account_id: null,
                                    value: "60000.00",
                                    formula: null
                                }
                            ]
                        },
                        {
                            name: "Invest revenue",
                            description: null,
                            start_date: "2019-05-15",
                            end_date: null,
                            frequency: "monthly",
                            deltas: [
                                {
                                    name: null,
                                    description: "Revenue to new investments",
                                    accountName: "Investments",
                                    fromAccountName: "Main",
                                    value: "30000.00",
                                    formula: null
                                }
                            ]
                        },
                        {
                            name: "Investment return",
                            description: "Conservative estimate of return on investments",
                            start_date: "2019-05-15",
                            end_date: null,
                            frequency: "monthly",
                            deltas: [
                                {
                                    name: "Return on investments",
                                    description: null,
                                    accountName: "Investments",
                                    fromAccountName: "Main",
                                    value: null,
                                    formula: "placeholder maybe something like (v* 1.15)+1000"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "Personal",
            description: "For personal accounts",
            accounts: [
                {
                    name: "Savings",
                    description: "Lower liquidity savings account."
                },
                {
                    name: "Checking",
                    description: "Personal checking"
                }
            ],
            plans: [
                {
                    name: "Todo",
                    description: null,
                    transactions: []
                },
                {
                    name: "Current",
                    description: null,
                    transactions: [
                        {
                            name: "Expenses",
                            description: "Expenses for the month",
                            start_date: "2017-05-15",
                            end_date: "2020-05-15",
                            frequency: "monthly",
                            deltas: [
                                {
                                    name: null,
                                    description: null,
                                    accountName: "Checking",
                                    from_account_id: null,
                                    value: "-1800.00",
                                    formula: null
                                }
                            ]
                        },
                        {
                            name: "Salary",
                            description: "Income from job",
                            start_date: "2017-01-01",
                            end_date: null,
                            frequency: "biweekly",
                            deltas: [
                                {
                                    name: "Salary to Checking",
                                    description: "to checking desc",
                                    accountName: "Checking",
                                    from_account_id: null,
                                    value: "2200.00",
                                    formula: null
                                },
                                {
                                    name: "Salary to Savings",
                                    description: "Save up",
                                    accountName: "Savings",
                                    from_account_id: null,
                                    value: "2000.00",
                                    formula: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Describe testUser2"s data
const testData2 = {
    projects: [
        {
            name: "Another user\'s project",
            description: "Another user\'s project description",
            accounts: [
                {
                    name: "Another user\'s account",
                    description: "Another user\'s account description"
                },
            ],
            plans: [
                {
                    name: "Another user\'s plan",
                    description: "Another user\'s plan description",
                    transactions: [
                        {
                            name: "Another user\'s transaction",
                            description: "Another user\'s transaction description",
                            start_date: "2015-09-07",
                            end_date: null,
                            frequency: "yearly",
                            deltas: [
                                {
                                    name: "Another user\'s delta",
                                    description: "Another user\'s delta description",
                                    accountName: "Another user\'s account",
                                    from_account_id: null,
                                    value: "70000.00",
                                    formula: null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

module.exports = { testData, testData2 };
