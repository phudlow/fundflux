const testData = {
    projects: [
        {
            name: "Business",
            description: "For personal accounts",
            accounts: [],
            plans: []
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
                    name: "Long-term",
                    description: "-- Description --",
                    transactions: []
                },
                {
                    name: "Current",
                    description: null,
                    transactions: [
                        {
                            name: "Investments",
                            description: "Income from investments",
                            start_date: "2010-05-15",
                            end_date: "2020-05-15",
                            frequency: "monthly",
                            deltas: []
                        },
                        {
                            name: "Salary",
                            description: "Income from job",
                            start_date: "2000-01-01",
                            end_date: null,
                            frequency: "biweekly",
                            deltas: [
                                {
                                    accountName: "Checking",
                                    value: "2000.00",
                                    name: "Salary to Checking",
                                    description: "to checking desc"
                                },
                                {
                                    accountName: "Savings",
                                    value: "500.00",
                                    name: "Salary to Savings",
                                    description: "Save up"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Describe testUser2's data
const testData2 = {
    projects: [
        {
            name: "Another user's project",
            description: "Another user's project description",
            accounts: [
                {
                    name: "Another user's account",
                    description: "Another user's account description"
                },
            ],
            plans: [
                {
                    name: "Another user's plan",
                    description: "Another user's plan description",
                    transactions: [
                        {
                            name: "Another user's transaction",
                            description: "Another user's transaction description",
                            start_date: "2015-09-07",
                            end_date: null,
                            frequency: "yearly",
                            deltas: [
                                {
                                    accountName: "Another user's account",
                                    value: "70000.00",
                                    name: "Another user's delta",
                                    description: "Another user's delta description"
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
