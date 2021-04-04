// BUDGET CONTROLLER
const budgetController = (function () {
    const Expense = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage
    }

    const Income = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    const calculateTotal = function (type) {
        let sum = 0
        data.allItems[type].forEach(function (cur) {
            sum += cur.value
        })
        data.totals[type] = sum
    }

    const data = {
        allItems: {
            expenses: [],
            income: [],
        },
        totals: {
            expenses: 0,
            income: 0,
        },
        budget: 0,
        percentage: -1,
    }

    return {
        addItem: function (type, desc, val) {
            let newItem, ID

            // Create new ID
            if (data.allItems[type].length == 0) {
                ID = 0
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }

            //  Create new item based on 'inc' or 'exp' type
            if (type === 'expenses') {
                newItem = new Expense(ID, desc, val)
            } else if (type === 'income') {
                newItem = new Income(ID, desc, val)
            }

            // Push it into data structure
            data.allItems[type].push(newItem)

            // etur the new item
            return newItem
        },

        deleteItem: function (type, id) {
            let ids, index

            ids = data.allItems[type].map(function (current) {
                return current.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function () {
            // Calculate total income and expenses
            calculateTotal('expenses')
            calculateTotal('income')
            // Calculate the budget: income - expenses
            data.budget = data.totals.income - data.totals.expenses
            // calculate the percentage
            if (data.totals.income > 0) {
                data.percentage = Math.round(
                    (data.totals.expenses / data.totals.income) * 100
                )
            } else {
                data.percentage = -1
            }
        },

        calculatePercentages: function () {
            data.allItems.expenses.forEach(function (cur) {
                cur.calcPercentage(data.totals.income)
            })
        },

        getPercentages: function () {
            const allPercentages = data.allItems.expenses.map(function (cur) {
                return cur.getPercentage()
            })
            return allPercentages
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expenses,
                percentage: data.percentage,
            }
        },

        testingData: function () {
            console.log(data)
        },
    }
})()

// UI CONTROLLER
const UIController = (function () {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }

    const formatNumber = function (number, type) {
        let numberSplit, integer, decimal
        /*
        + or - before number
        exactly 2 decimal points
        comma separating thousands
        */
        number = Math.abs(number)
        number = number.toFixed(2)

        numberSplit = number.split('.')

        integer = numberSplit[0]
        if (integer.length > 3) {
            integer =
                integer.substr(0, integer.length - 3) +
                ',' +
                integer.substr(integer.length - 3, 3)
        }

        decimal = numberSplit[1]

        return (type === 'expenses' ? '-' : '+') + ' ' + integer + '.' + decimal
    }

    const nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
                description: document.querySelector(DOMstrings.inputDescription)
                    .value,
                value: parseFloat(
                    document.querySelector(DOMstrings.inputValue).value
                ),
            }
        },

        addListItem: function (object, type) {
            let html, newHTML, element

            // Create HTML string with placehoder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer
                html = /*html*/ `
                    <div class="item clearfix" id="income-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `
            } else if (type === 'expenses') {
                element = DOMstrings.expensesContainer
                html = /*html*/ `
                    <div class="item clearfix" id="expenses-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `
            }
            // Replace the placeholder text with actual data
            newHTML = html.replace('%id%', object.id)
            newHTML = newHTML.replace('%description%', object.description)
            newHTML = newHTML.replace(
                '%value%',
                formatNumber(object.value, type)
            )

            // Insert the HTML into the DOM
            document
                .querySelector(element)
                .insertAdjacentHTML('beforeend', newHTML)
        },

        deleteListItem: function (selectorID) {
            const el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },

        clearFields: function () {
            let fields, fieldsArray

            fields = document.querySelectorAll(
                DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
            )

            fieldsArray = Array.prototype.slice.call(fields)

            fieldsArray.forEach(function (current, index, array) {
                current.value = ''
            })

            fieldsArray[0].focus()
        },

        displayBudget: function (object) {
            let type
            object.budget > 0 ? (type = 'income') : (type = 'expenses')

            document.querySelector(
                DOMstrings.budgetLabel
            ).textContent = formatNumber(object.budget, type)
            document.querySelector(
                DOMstrings.incomeLabel
            ).textContent = formatNumber(object.totalInc, 'income')
            document.querySelector(
                DOMstrings.expensesLabel
            ).textContent = formatNumber(object.totalExp, 'expenses')

            if (object.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    object.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    '---'
            }
        },

        displayPercentages: function (percentages) {
            const fields = document.querySelectorAll(
                DOMstrings.expensesPercentageLabel
            )

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
            })
        },

        displayMonth: function () {
            let now, year, month

            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ]

            now = new Date()

            month = now.getMonth()

            year = now.getFullYear()

            document.querySelector(DOMstrings.dateLabel).textContent =
                months[month] + ', ' + year
        },

        changedType: function () {
            const fields = document.querySelectorAll(
                DOMstrings.inputType +
                    ',' +
                    DOMstrings.inputDescription +
                    ',' +
                    DOMstrings.inputValue
            )

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus')
            })

            document.querySelector(DOMstrings.addButton).classList.toggle('red')
        },

        getDOMstrings: function () {
            return DOMstrings
        },
    }
})()

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
    const setupEventListeners = function () {
        const DOM = UICtrl.getDOMstrings()

        document
            .querySelector(DOM.addButton)
            .addEventListener('click', ctrlAddItem)

        document.addEventListener('keydown', function (event) {
            if (event.code === 13) {
                ctrlAddItem()
            }
        })

        document
            .querySelector(DOM.lists)
            .addEventListener('click', ctrlDeleteItem)

        document
            .querySelector(DOM.inputType)
            .addEventListener('change', UICtrl.changedType)
    }

    const updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget()
        // 2. Return the budget
        const budget = budgetCtrl.getBudget()
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget)
    }

    const updatePercentages = function () {
        // calculate the percentages
        budgetCtrl.calculatePercentages()

        // read percentages from budget controller
        const percentages = budgetCtrl.getPercentages()

        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages)
    }

    const ctrlAddItem = function () {
        let input, newItem

        // 1. Get the field input data
        input = UICtrl.getInput()

        if (
            input.description !== '' &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(
                input.type,
                input.description,
                input.value
            )

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the fields
            UICtrl.clearFields()

            // 5. Calculate and update budget
            updateBudget()

            // 6. Calculate and update the percentages
            updatePercentages()
        }
    }

    const ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID) {
            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID)

            // 3. Update and display the budget and totals
            updateBudget()

            // 4. Calculate and update the percentages
            updatePercentages()
        }
    }

    return {
        init: function () {
            console.log('app has been initialized')
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            })
            UICtrl.displayMonth()
            setupEventListeners()
        },
    }
})(budgetController, UIController)

controller.init()
