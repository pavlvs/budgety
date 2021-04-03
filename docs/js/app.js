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
        const sum = 0
        data.allItems[type].forEach(function (cur) {
            sum += cur.value
        })
        data.totals[type] = sum
    }

    const data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    }

    return {
        addItem: function (type, desc, val) {
            const newItem, ID

            // Create new ID
            if (data.allItems[type].length == 0) {
                ID = 0
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }

            //  Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val)
            }

            // Push it into data structure
            data.allItems[type].push(newItem)

            // etur the new item
            return newItem
        },

        deleteItem: function (type, id) {
            const ids, index

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
            calculateTotal('exp')
            calculateTotal('inc')
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp
            // calculate the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round(
                    (data.totals.exp / data.totals.inc) * 100
                )
            } else {
                data.percentage = -1
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function () {
            const allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage()
            })
            return allPerc
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
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
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        addButton: '.add-btn',
        incomeContainer: '.income-list',
        expensesContainer: '.expenses-list',
        budgetLabel: '.budget-value',
        incomeLabel: '.budget-income-value',
        expensesLabel: '.budget-expenses-value',
        percentageLabel: '.budget-expenses-percentage',
        lists: '.lists',
        expensesPercLabel: '.item-percentage',
        dateLabel: '.budget-title-month',
    }

    const formatNumber = function (num, type) {
        const numSplit, int, dec, type
        /*
        + or - before number
        exactly 2 decimal points
        comma separating thousands
        */
        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]
        if (int.length > 3) {
            int =
                int.substr(0, int.length - 3) +
                ',' +
                int.substr(int.length - 3, 3)
        }

        dec = numSplit[1]

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec
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

        addListItem: function (obj, type) {
            const html, newHTML, element

            // Create HTML string with placehoder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html =
                    '<div class="item row" id="inc-%id%"><div class="col-md-6 item-description">%description%</div><div class="col-md-6"><div class="item-value">%value%</div>        <div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html =
                    '<div class="item row" id="exp-%id%"><div class="col-md-6 item-description">%description%</div><div class="col-md-6"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // Replace the placehoder text with ctual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type))

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
            const fields, fieldsArr

            fields = document.querySelectorAll(
                DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
            )

            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(function (current, index, array) {
                current.value = ''
            })

            fieldsArr[0].focus()
        },

        displayBudget: function (obj) {
            const type
            obj.budget > 0 ? (type = 'inc') : (type = 'exp')

            document.querySelector(
                DOMstrings.budgetLabel
            ).textContent = formatNumber(obj.budget, type)
            document.querySelector(
                DOMstrings.incomeLabel
            ).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(
                DOMstrings.expensesLabel
            ).textContent = formatNumber(obj.totalExp, 'exp')

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    '---'
            }
        },

        displayPercentages: function (percentages) {
            const fields = document.querySelectorAll(
                DOMstrings.expensesPercLabel
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
            const now, year, month, months

            months = [
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

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
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
        const input, newItem

        // 1. Get the field input data
        const input = UICtrl.getInput()

        if (
            input.description !== '' &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Add the item to the budget controller
            const newItem = budgetCtrl.addItem(
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
        const itemID, splitID, type, ID
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
